/* DAR product page: gallery, variants, quantity, related pieces. Needs site.js */
(function () {
  const { reduce, IMG } = Site;
  const id = new URLSearchParams(location.search).get("id");
  const p = DAR_PRODUCTS.find(x => x.id === id);
  const $ = s => document.getElementById(s);

  if (!p) {
    $("not-found").hidden = false;
    Dar.mount($("not-found"));
    return;
  }

  const cat = DAR_CATS.find(c => c.id === p.cat);
  document.title = `${p.name}، دار`;
  document.querySelector('meta[name="description"]').content = p.desc;
  $("crumbs").insertAdjacentHTML("beforeend", `<span aria-hidden="true">/</span><a href="shop.html?cat=${cat.id}">${cat.name}</a><span aria-hidden="true">/</span><span aria-current="page">${p.name}</span>`);
  $("pdp").hidden = false;

  $("p-cat").lastElementChild.textContent = cat.name;
  $("p-cat").href = `shop.html?cat=${cat.id}`;
  $("p-name").textContent = p.name;
  $("p-code").innerHTML = [
    p.code ? `<span class="num">كود ${p.code}</span>` : "",
    p.craft ? `<span class="tag${p.craft === "hand" ? " tag--henna" : ""}"><span data-motif="amulet"></span>${DAR_CRAFT[p.craft]}</span>` : ""
  ].join("");
  $("p-desc").textContent = p.desc;

  const ask = encodeURIComponent(`مرحبا دار، أود السؤال عن: ${p.name}${p.code ? ` (كود ${p.code})` : ""}`);
  $("p-ask").href = $("p-ask-price").href = `${Site.WA}?text=${ask}`;

  const colors = (p.colors || []).map(c => `<i style="--c:${DAR_COLORS[c].hex}" title="${DAR_COLORS[c].name}"></i>`).join("");
  $("p-details").innerHTML = [
    p.code ? `<dt>الكود</dt><dd class="num">${p.code}</dd>` : "",
    `<dt>المجموعة</dt><dd>${cat.name}</dd>`,
    p.craft ? `<dt>الصنعة</dt><dd>${DAR_CRAFT[p.craft]}</dd>` : "",
    colors ? `<dt>الألوان</dt><dd><span class="dots">${colors}</span> ${p.colors.map(c => DAR_COLORS[c].name).join("، ")}</dd>` : "",
    `<dt>المصدر</dt><dd>كتالوج دار 2026</dd>`
  ].join("");

  /* ---------- Gallery ---------- */
  const main = $("main-img"), photo = $("main-photo"), thumbs = $("thumbs");
  main.classList.toggle("is-dark", !!p.dark);
  main.style.setProperty("--pos", p.pos || "50% 50%");
  const shots = [...new Set([p.img, ...(p.gallery || []), ...(p.variants || []).map(v => v.img)])];
  function show(img, alt) {
    if (photo.getAttribute("src") === IMG(img)) return;
    const swap = () => { photo.src = IMG(img); photo.alt = alt; photo.style.opacity = 1; };
    if (reduce || !photo.getAttribute("src")) return swap();
    photo.style.opacity = 0;
    setTimeout(swap, 180);
    thumbs.querySelectorAll("button").forEach(b => b.setAttribute("aria-current", b.dataset.img === img));
  }
  thumbs.innerHTML = shots.length > 1 ? shots.map((s, i) =>
    `<button type="button" data-img="${s}" aria-current="${i === 0}" aria-label="الصورة ${i + 1}"><img src="${IMG(s)}" alt="" loading="lazy"></button>`).join("") : "";
  thumbs.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    show(b.dataset.img, p.name);
    thumbs.querySelectorAll("button").forEach(x => x.setAttribute("aria-current", x === b));
  });
  show(p.img, p.name);

  // Zoom follows the pointer; only for a mouse, never on touch
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    main.addEventListener("pointermove", e => {
      const r = main.getBoundingClientRect();
      photo.style.transformOrigin = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% ${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`;
    });
    main.addEventListener("pointerenter", () => main.classList.add("is-zoom"));
    main.addEventListener("pointerleave", () => main.classList.remove("is-zoom"));
  }

  /* ---------- Variants ---------- */
  const add = $("add");
  add.dataset.id = p.id; add.dataset.add = p.name;
  if (p.variants) {
    $("p-variants").hidden = false;
    const label = $("p-variant-name");
    $("variants").innerHTML = p.variants.map((v, i) =>
      `<button type="button" data-i="${i}" aria-pressed="${i === 0}" aria-label="${v.name}" style="--c:${DAR_COLORS[v.color].hex}"><img src="${IMG(v.img)}" alt=""></button>`).join("");
    const pick = i => {
      const v = p.variants[i];
      label.textContent = v.name;
      add.dataset.id = `${p.id}-${v.color}`; add.dataset.add = `${p.name}، ${v.name}`;
      $("variants").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.i === i));
      show(v.img, `${p.name}، ${v.name}`);
    };
    $("variants").addEventListener("click", e => { const b = e.target.closest("button"); if (b) pick(+b.dataset.i); });
    pick(0);
  }

  /* ---------- Quantity ---------- */
  const qty = $("qty");
  document.querySelector(".buy .qty").addEventListener("click", e => {
    const b = e.target.closest("[data-step]"); if (!b) return;
    qty.value = Math.min(9, Math.max(1, +qty.value + +b.dataset.step));
    add.dataset.qty = qty.value;
  });

  /* ---------- Mobile buy bar appears once the main button scrolls away ---------- */
  const bar = $("buybar");
  $("bb-img").src = IMG(p.img); $("bb-name").textContent = p.name;
  $("bb-add").addEventListener("click", () => add.click());
  new IntersectionObserver(([e]) => {
    const on = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle("is-on", on);
    bar.setAttribute("aria-hidden", !on);
    $("bb-add").tabIndex = on ? 0 : -1;
  }).observe(add);

  /* ---------- Related pieces from the same collection ---------- */
  const related = DAR_PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  if (related.length) {
    $("related-sec").hidden = false;
    $("related-all").href = `shop.html?cat=${cat.id}`;
    $("related").innerHTML = related.map((x, i) => Site.card(x, i)).join("");
  }

  Dar.mount();
  Site.observe();
})();
