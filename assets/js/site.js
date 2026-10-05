/* DAR shared layout and behaviour: header, drawer, footer, cart, toast, reveals.
   Each page sets <body data-page="..."> and loads a page script after this file. */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page || "";
  const WA = "https://wa.me/905538286235";
  const IG = "https://www.instagram.com/filistinmirasmerkezi_dar/";
  const CATALOG = "https://drive.google.com/file/d/1CPTnajm8ko4JPwHOATp-Y_DdwfKiee4I/view";
  const LINEN = "#F4EEE4", HENNA = "#B25426";

  /* ---------- Layout ---------- */
  const nav = [
    ["shop.html", "المتجر", "shop"],
    ["index.html#cats", "المجموعات"],
    ["index.html#corp", "هدايا المؤسسات"],
    ["index.html#story", "من نحن"],
    ["index.html#visit", "زورونا"]
  ];
  const navLinks = nav.map(([href, label, key]) => `<a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`).join("");

  const header = `
<a class="btn skip" href="#main">تخطى إلى المحتوى</a>
<div class="thread-progress" id="thread" aria-hidden="true"></div>
<div class="band hem-top" data-band="chain" data-cell="2" aria-hidden="true"></div>
<header class="site-head">
  <div class="wrap">
    <nav class="main-nav" aria-label="القائمة الرئيسية">${navLinks}</nav>
    <button class="icon-btn menu-btn" type="button" aria-label="فتح القائمة" aria-expanded="false" aria-controls="drawer"><span data-motif="i-menu"></span></button>
    <a class="brand" href="index.html" aria-label="دار، مركز التراث الفلسطيني، الرئيسية"><img src="assets/brand/dar-logo-mark.svg" alt="دار" width="219" height="292"></a>
    <div class="head-tools">
      <div class="lang" aria-label="اللغة"><a href="#" aria-current="true" lang="ar">ع</a><a href="#" lang="tr">TR</a><a href="#" lang="en">EN</a></div>
      <a class="icon-btn" href="shop.html" aria-label="البحث في المتجر"><span data-motif="i-search"></span></a>
      <button class="icon-btn" type="button" aria-label="المفضلة"><span data-motif="i-heart"></span></button>
      <a class="icon-btn" href="cart.html" aria-label="السلة" id="cart-btn"${page === "cart" ? ' aria-current="page"' : ""}><span data-motif="i-bag"></span><span class="count num" id="cart-count" hidden>0</span></a>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" aria-hidden="true">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <img src="assets/brand/dar-logo-mark.svg" alt="دار">
    <button class="icon-btn" type="button" aria-label="إغلاق القائمة" data-close-drawer><span data-motif="i-close"></span></button>
  </div>
  <nav aria-label="القائمة">${navLinks}</nav>
  <div class="lang" style="display:flex"><a href="#" aria-current="true">العربية</a><a href="#">Türkçe</a><a href="#">English</a></div>
</div>`;

  const cats = (window.DAR_CATS || []).map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join("");
  const footer = `
<footer class="site-foot">
  <div class="band" data-band="saw" data-cell="4" data-night="1" aria-hidden="true" style="transform:scaleY(-1)"></div>
  <div class="wrap foot-grid">
    <div><img src="assets/brand/dar-logo-full.svg" alt="دار، مركز التراث الفلسطيني" width="140"><p>القلب النابض للتراث الفلسطيني. عائد كل قطعة يدعم مشاريع في غزة، خاصة لتمكين النساء والأطفال.</p></div>
    <div><h3>المتجر</h3><ul>${cats}</ul></div>
    <div><h3>دار</h3><ul><li><a href="index.html#story">من نحن</a></li><li><a href="index.html#corp">هدايا المؤسسات</a></li><li><a href="${CATALOG}" target="_blank" rel="noopener">الكتالوج</a></li><li><a href="index.html#visit">زورونا</a></li></ul></div>
    <div><h3>تواصل</h3><ul><li><a href="${WA}" target="_blank" rel="noopener">واتساب</a></li><li><a href="${IG}" target="_blank" rel="noopener">إنستغرام</a></li><li><a href="https://www.facebook.com/share/16cFGdWppS/" target="_blank" rel="noopener">فيسبوك</a></li></ul></div>
  </div>
  <div class="wrap foot-base"><span>© 2026 دار، مركز التراث الفلسطيني</span><span>الصور من كتالوج دار 2026</span></div>
</footer>
<a class="wa" id="wa" href="${WA}" target="_blank" rel="noopener" aria-label="راسل دار على واتساب"><span data-motif="i-chat"></span><span class="wa__label">راسل دار</span></a>
<div class="toast-slot" id="toast-slot" role="status" aria-live="polite"></div>`;

  document.querySelector('[data-site="header"]')?.insertAdjacentHTML("afterend", header);
  document.querySelector('[data-site="header"]')?.remove();
  document.querySelector('[data-site="footer"]')?.insertAdjacentHTML("afterend", footer);
  document.querySelector('[data-site="footer"]')?.remove();

  document.querySelectorAll(".ribbon__track").forEach(t => t.append(t.firstElementChild.cloneNode(true)));
  Dar.mount();

  const thread = document.getElementById("thread");
  const chain = Dar.tile("chain", {}, 2);
  thread.style.backgroundImage = chain.url;
  thread.style.backgroundSize = `${chain.w}px ${chain.h}px`;

  /* ---------- Word rise: split into words, keep <em> and <br> ---------- */
  function splitWords(el) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "w";
            const inner = document.createElement("span"); inner.textContent = part; inner.style.setProperty("--i", i++);
            w.append(inner); frag.append(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== "BR") walk(child);
      });
    };
    walk(el);
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  }
  document.querySelectorAll(".rise").forEach(splitWords);

  /* ---------- Stitch veil: the image is unpicked stitch by stitch ---------- */
  function veil(host) {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height || reduce) return;
    host.querySelector(".stitch-veil")?.remove();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const c = document.createElement("canvas");
    c.className = "stitch-veil";
    c.width = Math.ceil(r.width * dpr); c.height = Math.ceil(r.height * dpr);
    host.append(c);
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    const size = r.width < 260 ? 10 : 14;
    const cols = Math.ceil(r.width / size), rows = Math.ceil(r.height / size);
    ctx.fillStyle = LINEN; ctx.fillRect(0, 0, r.width, r.height);
    // Unpick from the bottom inline-start corner, with jitter so it reads as handwork
    const cells = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const d = ((cols - 1 - x) / cols + (rows - 1 - y) / rows) / 2;
      cells.push({ x, y, t: d * 620 + Math.random() * 380, s: 0 });
    }
    ctx.strokeStyle = HENNA; ctx.lineWidth = Math.max(1.5, size * .16); ctx.lineCap = "square";
    const X = (x, y) => {
      const a = size * .22, b = size * .78;
      ctx.beginPath();
      ctx.moveTo(x * size + a, y * size + a); ctx.lineTo(x * size + b, y * size + b);
      ctx.moveTo(x * size + b, y * size + a); ctx.lineTo(x * size + a, y * size + b);
      ctx.stroke();
    };
    const start = performance.now();
    let left = cells.length;
    const frame = now => {
      const t = now - start;
      for (const cell of cells) {
        if (cell.s === 2) continue;
        if (cell.s === 0 && t >= cell.t) { cell.s = 1; X(cell.x, cell.y); }
        if (cell.s === 1 && t >= cell.t + 110) { cell.s = 2; left--; ctx.clearRect(cell.x * size - .5, cell.y * size - .5, size + 1, size + 1); }
      }
      if (left > 0) requestAnimationFrame(frame); else c.remove();
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Reveal on enter ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.hasAttribute("data-veil")) veil(e.target); else e.target.classList.add("is-in");
    io.unobserve(e.target);
  }), { threshold: .2, rootMargin: "0px 0px -6% 0px" });

  function observe(root = document) {
    root.querySelectorAll(".rise:not(.is-in), .up:not(.is-in), [data-veil]").forEach(el => {
      if (reduce) el.classList.add("is-in"); else io.observe(el);
    });
  }

  /* ---------- Scroll state shared by all pages ---------- */
  const head = document.querySelector(".site-head");
  const wa = document.getElementById("wa");
  const scrollHooks = [];
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    head.classList.toggle("is-scrolled", y > 8);
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    thread.style.setProperty("--p", `${Math.min(100, (y / max) * 100)}%`);
    wa.classList.toggle("is-on", y > vh * .8);
    scrollHooks.forEach(fn => fn(y, vh));
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Drawer ---------- */
  const drawer = document.getElementById("drawer");
  const menuBtn = document.querySelector(".menu-btn");
  const setDrawer = open => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", !open);
    menuBtn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) drawer.querySelector("nav a").focus(); else menuBtn.focus({ preventScroll: true });
  };
  menuBtn.addEventListener("click", () => setDrawer(true));
  drawer.addEventListener("click", e => { if (e.target.closest("[data-close-drawer], nav a")) setDrawer(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false); });

  /* ---------- Toast ---------- */
  const slot = document.getElementById("toast-slot");
  let toastTimer;
  function showToast(text, link, href = "cart.html") {
    slot.innerHTML = `<div class="toast"><span data-motif="starlet" data-mode="cross"></span><span>${text}</span>${link ? ` <a class="thread" href="${href}">${link}</a>` : ""}</div>`;
    Dar.mount(slot);
    slot.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => slot.classList.remove("is-on"), 4000);
  }

  /* ---------- Cart: kept in this browser until the backend exists ---------- */
  const count = document.getElementById("cart-count");
  const cartBtn = document.getElementById("cart-btn");
  // Items are { pid, variant, qty }. Stored per browser; the backend takes over later.
  const store = {
    get() {
      try {
        return JSON.parse(localStorage.getItem("dar-cart") || "[]")
          .filter(i => i.pid && (window.DAR_PRODUCTS || []).some(p => p.id === i.pid));
      } catch (e) { return []; }
    },
    set(v) { try { localStorage.setItem("dar-cart", JSON.stringify(v)); } catch (e) {} renderCount(); }
  };
  function renderCount() {
    const n = store.get().reduce((s, i) => s + i.qty, 0);
    count.hidden = !n; count.textContent = n;
    cartBtn.setAttribute("aria-label", n ? `السلة، ${n} قطع` : "السلة");
  }
  function addToCart(pid, variant, name, qty = 1, btn) {
    const items = store.get();
    const hit = items.find(i => i.pid === pid && i.variant === variant);
    hit ? hit.qty = Math.min(9, hit.qty + qty) : items.push({ pid, variant, qty });
    btn?.classList.add("is-loading");
    setTimeout(() => {
      btn?.classList.remove("is-loading");
      store.set(items);
      if (!reduce) cartBtn.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
      showToast(`أضيف ${name} إلى سلتك.`, "عرض السلة");
    }, 450);
  }
  renderCount();

  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add && add.getAttribute("aria-disabled") !== "true") {
      e.preventDefault();
      addToCart(add.dataset.id, add.dataset.variant || "", add.dataset.add, +(add.dataset.qty || 1), add);
    }
    const fav = e.target.closest(".product__fav");
    if (fav) {
      e.preventDefault();
      const on = fav.getAttribute("aria-pressed") !== "true";
      fav.setAttribute("aria-pressed", on);
      fav.setAttribute("aria-label", on ? "أزل من المفضلة" : "أضف للمفضلة");
      if (on && !reduce) fav.animate([{ transform: "scale(.9)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 300, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
    }
  });

  /* ---------- Prices: the catalogue has none yet, so the preview uses labelled demo prices ---------- */
  const DEMO = { wear: 2400, bags: 850, kufiya: 450, wall: 650, jewel: 350, home: 550 };
  const price = p => +p.price || DEMO[p.cat];
  const money = n => `${Math.round(n).toLocaleString("en-US")} ₺`;

  /* ---------- Product card markup shared by home, shop and related lists ---------- */
  const IMG = id => `assets/img/dar/${id}.webp`;
  function card(p, i = 0) {
    const tag = p.craft === "hand" ? '<span class="tag tag--henna">تطريز يدوي</span>' : "";
    const meta = p.code ? `<p class="product__code num">كود ${p.code}</p>` : `<p class="product__origin">${(window.DAR_CATS.find(c => c.id === p.cat) || {}).name || ""}</p>`;
    return `<article class="product up" style="--i:${i % 4}">
      <div class="product__frame">
        <a class="product__media${p.dark ? " product__media--dark" : ""}" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true" data-veil><img src="${IMG(p.img)}" alt="" loading="lazy" style="--pos:${p.pos || "50% 50%"}">${tag}</a>
        <button class="icon-btn product__fav" type="button" aria-label="أضف ${p.name} للمفضلة" aria-pressed="false"><span data-motif="i-heart"></span></button>
        <button class="btn product__add" type="button" data-id="${p.id}" data-add="${p.name}">أضف إلى السلة</button>
      </div>
      <div class="product__meta"><div><h3 class="product__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>${meta}</div>${p.price ? `<p class="product__price num">${money(p.price)}</p>` : '<p class="product__price--soon">السعر قريبا</p>'}</div>
    </article>`;
  }

  window.Site = { reduce, observe, veil, splitWords, showToast, addToCart, card, IMG, onScroll: fn => scrollHooks.push(fn), refresh: onScroll, WA, cart: store, price, money };

  // Pages that do not run an intro start revealing right away
  if (!document.body.hasAttribute("data-wait-intro")) observe();
  onScroll();
})();
