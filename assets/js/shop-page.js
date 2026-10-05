/* DAR shop listing: collections, search, filters, sort. Needs site.js */
(function () {
  const { reduce } = Site;
  const params = new URLSearchParams(location.search);
  const catName = id => (DAR_CATS.find(c => c.id === id) || {}).name;
  const state = {
    cat: catName(params.get("cat")) ? params.get("cat") : "",
    q: params.get("q") || "",
    sort: "",
    craft: new Set(),
    color: new Set()
  };

  const grid = document.getElementById("grid");
  const empty = document.getElementById("empty");
  const countEl = document.getElementById("count");
  const title = document.getElementById("shop-title");
  const sub = document.getElementById("shop-sub");
  const q = document.getElementById("q");
  const sort = document.getElementById("sort");
  q.value = state.q;

  /* ---------- Collection loom ---------- */
  const covers = { wear: "thob-red", bags: "minibag-red", kufiya: "rug-kufiya", wall: "hoop-hand", jewel: "earrings-map", home: "cups-olive" };
  const loom = document.getElementById("loom");
  loom.innerHTML =
    `<button type="button" data-cat="" aria-pressed="${!state.cat}"><span class="loom__img loom__img--all"><span data-motif="star" data-mono="1" style="color:#F4EEE4"></span></span><b>الكل</b><small class="num">${DAR_PRODUCTS.length} قطعة</small></button>` +
    DAR_CATS.map(c => {
      const n = DAR_PRODUCTS.filter(p => p.cat === c.id).length;
      return `<button type="button" data-cat="${c.id}" aria-pressed="${state.cat === c.id}"><span class="loom__img"><img src="${Site.IMG(covers[c.id])}" alt="" loading="lazy"></span><b>${c.name}</b><small class="num">${n} قطع</small></button>`;
    }).join("");
  Dar.mount(loom);

  /* ---------- Filters built from the data, so they never offer an empty option ---------- */
  const craftBox = document.getElementById("f-craft");
  const crafts = Object.keys(DAR_CRAFT).filter(k => DAR_PRODUCTS.some(p => p.craft === k));
  craftBox.insertAdjacentHTML("beforeend", crafts.map(k =>
    `<label class="check"><input type="checkbox" value="${k}"><span>${DAR_CRAFT[k]}</span><span class="n num">${DAR_PRODUCTS.filter(p => p.craft === k).length}</span></label>`).join(""));
  const colorBox = document.getElementById("f-color");
  colorBox.innerHTML = Object.entries(DAR_COLORS).map(([k, c]) =>
    `<button class="swatch" type="button" data-color="${k}" style="--c:${c.hex}" aria-pressed="false" aria-label="${c.name}" title="${c.name}"></button>`).join("");

  /* ---------- Filtering ---------- */
  const norm = s => s.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").toLowerCase();
  function results() {
    const term = norm(state.q.trim());
    let list = DAR_PRODUCTS.filter(p =>
      (!state.cat || p.cat === state.cat) &&
      (!term || norm(p.name + " " + (p.code || "") + " " + catName(p.cat)).includes(term)) &&
      (!state.craft.size || state.craft.has(p.craft)) &&
      (!state.color.size || (p.colors || []).some(c => state.color.has(c))));
    if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ar"));
    if (state.sort === "code") list = [...list].sort((a, b) => (a.code || "99999").localeCompare(b.code || "99999"));
    return list;
  }

  const note = `<a class="shop-note up" href="https://www.instagram.com/filistinmirasmerkezi_dar/reel/DcyQEX1M7gn/" target="_blank" rel="noopener">
      <span data-motif="cypress" data-mono="1" style="color:#fff;width:40px"></span>
      <span><b>هل تعرف نقشة السرو؟</b><br><small>مقطع قصير من دار عن معنى النقشة</small></span>
      <span class="thread" style="justify-self:start">شاهد على إنستغرام</span></a>`;

  function render() {
    const list = results();
    const plain = !state.q && !state.craft.size && !state.color.size && !state.sort;
    const cards = list.map((p, i) => Site.card(p, i));
    if (plain && cards.length > 6) cards.splice(5, 0, note);
    grid.innerHTML = cards.join("");
    empty.hidden = list.length > 0;
    grid.hidden = !list.length;
    countEl.textContent = `${list.length} من ${DAR_PRODUCTS.length} قطعة`;
    title.textContent = state.cat ? catName(state.cat) : "كل القطع";
    title.removeAttribute("aria-label");
    sub.textContent = state.cat ? "من كتالوج دار 2026. الأسعار تضاف من لوحة التحكم." : "أزياء وحقائب وكوفيات وتطريز وإكسسوارات من كتالوج دار 2026.";
    loom.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b.dataset.cat === state.cat));
    const active = state.craft.size + state.color.size;
    document.getElementById("filter-n").textContent = active ? `(${active})` : "";
    Dar.mount(grid);
    Site.observe(grid);
    // Keep the address shareable
    const u = new URLSearchParams();
    if (state.cat) u.set("cat", state.cat);
    if (state.q) u.set("q", state.q);
    history.replaceState(null, "", u.toString() ? `?${u}` : location.pathname);
  }
  const update = () => (!reduce && document.startViewTransition) ? document.startViewTransition(render) : render();

  loom.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    state.cat = b.dataset.cat; update();
  });
  let qTimer;
  q.addEventListener("input", () => { clearTimeout(qTimer); qTimer = setTimeout(() => { state.q = q.value; render(); }, 180); });
  sort.addEventListener("change", () => { state.sort = sort.value; update(); });
  craftBox.addEventListener("change", e => {
    e.target.checked ? state.craft.add(e.target.value) : state.craft.delete(e.target.value); update();
  });
  colorBox.addEventListener("click", e => {
    const s = e.target.closest(".swatch"); if (!s) return;
    const on = s.getAttribute("aria-pressed") !== "true";
    s.setAttribute("aria-pressed", on);
    on ? state.color.add(s.dataset.color) : state.color.delete(s.dataset.color); update();
  });
  function reset() {
    Object.assign(state, { q: "", sort: "" }); state.craft.clear(); state.color.clear();
    q.value = ""; sort.value = "";
    craftBox.querySelectorAll("input").forEach(i => i.checked = false);
    colorBox.querySelectorAll(".swatch").forEach(s => s.setAttribute("aria-pressed", "false"));
    update();
  }
  document.getElementById("reset").addEventListener("click", reset);
  empty.querySelector("[data-reset]").addEventListener("click", () => { state.cat = ""; reset(); });

  /* ---------- Filter sheet on small screens ---------- */
  const filters = document.getElementById("filters");
  const fBtn = document.getElementById("filter-btn");
  const backdrop = document.getElementById("backdrop");
  const setSheet = open => {
    filters.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-on", open);
    fBtn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) filters.querySelector("input, button").focus(); else fBtn.focus({ preventScroll: true });
  };
  fBtn.addEventListener("click", () => setSheet(true));
  document.addEventListener("click", e => { if (e.target.closest("[data-close-filters]") && filters.classList.contains("is-open")) setSheet(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && filters.classList.contains("is-open")) setSheet(false); });

  render();
})();
