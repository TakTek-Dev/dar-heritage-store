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
  const craftName = k => L(DAR_CRAFT[k], DAR_CRAFT_EN[k]);
  const colorName = k => L(DAR_COLORS[k].name, DAR_COLORS[k].name_en);
  const name = L(p.name, p.name_en), catLabel = L(cat.name, cat.name_en);
  const vName = v => L(v.name, v.name_en);
  document.title = L(`${p.name}، دار`, `${name}, DAR`);
  document.querySelector('meta[name="description"]').content = L(p.desc, p.desc_en);
  $("crumbs").insertAdjacentHTML("beforeend", `<span aria-hidden="true">/</span><a href="shop.html?cat=${cat.id}">${catLabel}</a><span aria-hidden="true">/</span><span aria-current="page">${name}</span>`);
  $("pdp").hidden = false;

  $("p-cat").lastElementChild.textContent = catLabel;
  $("p-cat").href = `shop.html?cat=${cat.id}`;
  $("p-name").textContent = name;
  $("p-code").innerHTML = [
    p.code ? `<span class="num">${L("كود", "Code")} ${p.code}</span>` : "",
    p.craft ? `<span class="tag${p.craft === "hand" ? " tag--henna" : ""}"><span data-motif="amulet"></span>${craftName(p.craft)}</span>` : ""
  ].join("");
  $("p-desc").textContent = L(p.desc, p.desc_en);
  if (p.story || p.motif || p.origin) {
    $("p-desc").insertAdjacentHTML("afterend", `<p style="margin-block-start:var(--s2)"><b style="color:var(--zaytoun)">${L("حكاية النقشة", "The story of the motif")}${p.motif ? `${L("، ", ": ")}${L(p.motif, p.motif_en)}` : ""}</b>${p.origin ? ` ${L("من", "from")} ${L(p.origin, p.origin_en)}` : ""}<br>${(L(p.story, p.story_en) || "").replace(/[<>]/g, "")}</p>`);
  }
  if (+p.price > 0) {
    document.querySelector(".info__price").innerHTML = `<span class="num">${Site.money(p.price)}</span>`;
    $("bb-name").nextElementSibling.textContent = Site.money(p.price);
  }

  const ask = encodeURIComponent(L(`مرحبا دار، أود السؤال عن: ${p.name}${p.code ? ` (كود ${p.code})` : ""}`, `Hello DAR, I would like to ask about: ${name}${p.code ? ` (code ${p.code})` : ""}`));
  $("p-ask").href = `${Site.WA}?text=${ask}`;
  const askPrice = $("p-ask-price");
  if (askPrice) askPrice.href = $("p-ask").href;

  const colors = (p.colors || []).map(c => `<i style="--c:${DAR_COLORS[c].hex}" title="${colorName(c)}"></i>`).join("");
  $("p-details").innerHTML = [
    p.code ? `<dt>${L("الكود", "Code")}</dt><dd class="num">${p.code}</dd>` : "",
    `<dt>${L("المجموعة", "Collection")}</dt><dd>${catLabel}</dd>`,
    p.craft ? `<dt>${L("الصنعة", "Craft")}</dt><dd>${craftName(p.craft)}</dd>` : "",
    colors ? `<dt>${L("الألوان", "Colours")}</dt><dd><span class="dots">${colors}</span> ${p.colors.map(colorName).join(L("، ", ", "))}</dd>` : "",
    `<dt>${L("المصدر", "Source")}</dt><dd>${L("كتالوج دار 2026", "DAR 2026 catalogue")}</dd>`
  ].join("");

  /* ---------- Gallery ---------- */
  const main = $("main-img"), photo = $("main-photo"), thumbs = $("thumbs");
  main.classList.toggle("is-dark", !!p.dark);
  main.style.setProperty("--pos", p.pos || "50% 50%");
  const shots = [...new Set([p.img, ...(p.gallery || []), ...(p.variants || []).map(v => v.img)])];
  if (shots.length < 2) document.querySelector(".gallery").classList.add("gallery--single");
  const fav = $("p-fav");
  fav.dataset.fav = p.id;
  fav.setAttribute("aria-label", L(`حفظ ${p.name} في المفضلة`, `Save ${name} to favourites`));
  fav.setAttribute("aria-pressed", Site.favs.has(p.id));
  function show(img, alt) {
    if (photo.getAttribute("src") === IMG(img)) return;
    const swap = () => { photo.src = IMG(img); photo.alt = alt; photo.style.opacity = 1; };
    if (reduce || !photo.getAttribute("src")) return swap();
    photo.style.opacity = 0;
    setTimeout(swap, 180);
    thumbs.querySelectorAll("button").forEach(b => b.setAttribute("aria-current", b.dataset.img === img));
  }
  thumbs.innerHTML = shots.length > 1 ? shots.map((s, i) =>
    `<button type="button" data-img="${s}" aria-current="${i === 0}" aria-label="${L(`الصورة ${i + 1} من ${shots.length}`, `Picture ${i + 1} of ${shots.length}`)}"><img src="${Site.SM(s)}" alt="" width="84" height="105"></button>`).join("") : "";
  thumbs.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    show(b.dataset.img, name);
    thumbs.querySelectorAll("button").forEach(x => x.setAttribute("aria-current", x === b));
  });
  show(p.img, name);

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
  add.dataset.id = p.id; add.dataset.add = name; add.dataset.variant = "";
  if (p.variants) {
    $("p-variants").hidden = false;
    const label = $("p-variant-name");
    $("variants").innerHTML = p.variants.map((v, i) =>
      `<button type="button" data-i="${i}" aria-pressed="${i === 0}" aria-label="${vName(v)}" style="--c:${DAR_COLORS[v.color].hex}"><img src="${Site.SM(v.img)}" alt="" width="64" height="64"></button>`).join("");
    const pick = i => {
      const v = p.variants[i];
      label.textContent = vName(v);
      add.dataset.variant = v.color; add.dataset.add = `${name}${L("، ", ", ")}${vName(v)}`;
      $("variants").querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.i === i));
      show(v.img, `${name}${L("، ", ", ")}${vName(v)}`);
    };
    $("variants").addEventListener("click", e => { const b = e.target.closest("button"); if (b) pick(+b.dataset.i); });
    pick(0);
  }

  /* ---------- Quantity ---------- */
  const qty = $("qty");
  const [minus, plus] = document.querySelectorAll(".buy .qty button");
  document.querySelector(".buy .qty").addEventListener("click", e => {
    const b = e.target.closest("[data-step]"); if (!b) return;
    qty.value = Math.min(9, Math.max(1, +qty.value + +b.dataset.step));
    add.dataset.qty = qty.value;
    minus.disabled = +qty.value === 1; plus.disabled = +qty.value === 9;
    // A button that just became disabled cannot keep focus; hand it to its partner
    if (b.disabled) (b === minus ? plus : minus).focus();
  });

  /* ---------- Mobile buy bar appears once the main button scrolls away ---------- */
  const bar = $("buybar");
  $("bb-img").src = Site.SM(p.img); $("bb-name").textContent = name;
  $("bb-add").addEventListener("click", () => add.click());
  new IntersectionObserver(([e]) => {
    const on = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle("is-on", on);
    bar.inert = !on;
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
