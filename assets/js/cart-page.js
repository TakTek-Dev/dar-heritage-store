/* DAR cart page. Needs site.js */
(function () {
  const { cart, price, money, IMG, reduce } = Site;
  const $ = s => document.getElementById(s);
  const byId = Object.fromEntries(DAR_PRODUCTS.map(p => [p.id, p]));
  const extras = {
    get() { try { return JSON.parse(localStorage.getItem("dar-cart-extras") || "{}"); } catch (e) { return {}; } },
    set(v) { try { localStorage.setItem("dar-cart-extras", JSON.stringify(v)); } catch (e) {} }
  };

  // Resolve a stored line into what the page shows
  function view(item) {
    const p = byId[item.pid];
    const v = (p.variants || []).find(x => x.color === item.variant);
    return { p, v, img: v ? v.img : p.img, unit: price(p) };
  }

  function render() {
    const items = cart.get();
    const n = items.reduce((s, i) => s + i.qty, 0);
    $("cart").hidden = !items.length;
    $("cart-empty").hidden = !!items.length;
    $("cart-sub").textContent = items.length ? `${n} ${n === 1 ? "قطعة" : "قطع"} في سلتك` : "";
    if (!items.length) { Dar.mount($("cart-empty")); return; }

    $("lines").innerHTML = items.map((item, i) => {
      const { p, v, img, unit } = view(item);
      return `<li class="line" data-i="${i}">
        <a class="line__img${p.dark ? " is-dark" : ""}" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true"><img src="${IMG(img)}" alt="" style="--pos:${p.pos || "50% 50%"}"></a>
        <div class="line__body">
          <a class="line__name" href="product.html?id=${p.id}">${p.name}</a>
          <p class="line__meta">${v ? `<span><i class="dot" style="--c:${DAR_COLORS[v.color].hex}"></i>${v.name}</span>` : ""}${p.code ? `<span class="num">كود ${p.code}</span>` : ""}</p>
          <div class="line__actions">
            <div class="qty"><button type="button" data-step="-1" aria-label="إنقاص ${p.name}"${item.qty === 1 ? " disabled" : ""}><span data-motif="i-minus"></span></button><output class="num" aria-label="الكمية">${item.qty}</output><button type="button" data-step="1" aria-label="زيادة ${p.name}"${item.qty === 9 ? " disabled" : ""}><span data-motif="i-plus"></span></button></div>
            <button class="line__remove" type="button" data-remove>إزالة</button>
          </div>
        </div>
        <p class="line__price num">${money(unit * item.qty)}${item.qty > 1 ? `<small>${money(unit)} للقطعة</small>` : ""}</p>
      </li>`;
    }).join("");
    Dar.mount($("lines"));

    const subtotal = items.reduce((s, i) => s + view(i).unit * i.qty, 0);
    $("subtotal").textContent = money(subtotal);
    $("total").textContent = money(subtotal);

    // WhatsApp order: the same list DAR would get from the checkout
    const ex = extras.get();
    const lines = items.map(i => { const { p, v } = view(i); return `- ${p.name}${v ? `، ${v.name}` : ""}${p.code ? ` (كود ${p.code})` : ""} × ${i.qty}`; });
    const msg = ["مرحبا دار، أود طلب:", ...lines, ex.gift ? `تغليف هدية${ex.note ? `: ${ex.note}` : ""}` : ""].filter(Boolean).join("\n");
    $("wa-order").href = `${Site.WA}?text=${encodeURIComponent(msg)}`;
  }

  $("lines").addEventListener("click", e => {
    const li = e.target.closest(".line"); if (!li) return;
    const items = cart.get();
    const i = +li.dataset.i;
    const step = e.target.closest("[data-step]");
    if (step) {
      items[i].qty = Math.min(9, Math.max(1, items[i].qty + +step.dataset.step));
      cart.set(items); render();
      $("lines").querySelector(`[data-i="${i}"] [data-step="${step.dataset.step}"]`)?.focus();
    }
    if (e.target.closest("[data-remove]")) {
      const [gone] = items.splice(i, 1);
      const finish = () => {
        cart.set(items); render();
        Site.showToast(`أزيلت ${byId[gone.pid].name} من السلة.`, "تراجع", "#undo");
        document.querySelector('#toast-slot a[href="#undo"]')?.addEventListener("click", ev => {
          ev.preventDefault();
          const now = cart.get(); now.splice(i, 0, gone); cart.set(now); render();
          document.getElementById("toast-slot").classList.remove("is-on");
        }, { once: true });
      };
      if (reduce) return finish();
      li.classList.add("is-leaving");
      setTimeout(finish, 220);
    }
  });

  // Gift wrap and note
  const ex = extras.get();
  const gift = $("gift"), note = $("gift-note");
  gift.checked = !!ex.gift; note.hidden = !ex.gift; note.value = ex.note || "";
  gift.addEventListener("change", () => { note.hidden = !gift.checked; extras.set({ ...extras.get(), gift: gift.checked }); render(); if (gift.checked) note.focus(); });
  note.addEventListener("input", () => { extras.set({ ...extras.get(), note: note.value }); render(); });

  // Suggestions: pieces not already in the cart
  const inCart = new Set(cart.get().map(i => i.pid));
  $("suggest").innerHTML = DAR_PRODUCTS.filter(p => !inCart.has(p.id)).filter((_, i) => i % 5 === 1).slice(0, 4).map((p, i) => Site.card(p, i)).join("");
  Dar.mount($("suggest"));

  // Adding from the suggestions refreshes the list once the shared handler has saved it
  $("suggest").addEventListener("click", e => { if (e.target.closest("[data-add]")) setTimeout(render, 500); });

  render();
  Site.observe();
})();
