/* DAR shared layout and behaviour: header, drawer, footer, cart, favourites, toast, reveals.
   Each page sets <body data-page="..."> and loads a page script after this file. */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page || "";
  const WA = "https://wa.me/905538286235";
  const IG = "https://www.instagram.com/filistinmirasmerkezi_dar/";
  const CATALOG = "https://drive.google.com/file/d/1CPTnajm8ko4JPwHOATp-Y_DdwfKiee4I/view";

  /* ---------- Layout ---------- */
  const nav = [
    ["shop.html", "المتجر", "shop"],
    ["index.html#cats", "المجموعات"],
    ["motifs.html", "النقوش", "motifs"],
    ["corporate.html", "هدايا المؤسسات", "corporate"],
    ["about.html", "من نحن", "about"],
    ["contact.html", "تواصل", "contact"]
  ];
  const navLinks = nav.map(([href, label, key]) => `<a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`).join("");

  // Turkish and English are planned; until they exist the switch says so instead of linking nowhere
  const header = `
<a class="btn skip" href="#main">انتقل إلى المحتوى</a>
<div class="thread-progress" id="thread" aria-hidden="true"></div>
<div class="band hem-top" data-band="chain" data-cell="2" aria-hidden="true"></div>
<header class="site-head">
  <div class="wrap">
    <nav class="main-nav" aria-label="القائمة الرئيسية">${navLinks}</nav>
    <button class="icon-btn menu-btn" type="button" aria-label="فتح القائمة" aria-expanded="false" aria-controls="drawer"><span data-motif="i-menu"></span></button>
    <a class="brand" href="index.html" aria-label="دار، مركز التراث الفلسطيني، الرئيسية"><img src="assets/brand/dar-logo-mark.svg" alt="دار" width="219" height="292"></a>
    <div class="head-tools">
      <div class="lang" role="group" aria-label="اللغة"><span class="lang__on" aria-current="true" title="العربية">ع</span><button type="button" data-soon="tr" aria-label="النسخة التركية قريبا">TR</button><button type="button" data-soon="en" aria-label="النسخة الإنجليزية قريبا">EN</button></div>
      <a class="icon-btn" href="shop.html" aria-label="البحث في المتجر"><span data-motif="i-search"></span></a>
      <a class="icon-btn" href="account.html" aria-label="حسابي" id="acct-btn"${page === "account" || page === "login" ? ' aria-current="page"' : ""}><span data-motif="i-user"></span></a>
      <a class="icon-btn" href="shop.html?fav=1" aria-label="المفضلة" id="fav-btn"><span data-motif="i-heart"></span><span class="count num" id="fav-count" hidden>0</span></a>
      <a class="icon-btn" href="cart.html" aria-label="السلة" id="cart-btn"${page === "cart" ? ' aria-current="page"' : ""}><span data-motif="i-bag"></span><span class="count num" id="cart-count" hidden>0</span></a>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="القائمة" aria-hidden="true">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <img src="assets/brand/dar-logo-mark.svg" alt="دار" width="33" height="44">
    <button class="icon-btn" type="button" aria-label="إغلاق القائمة" data-close-drawer><span data-motif="i-close"></span></button>
  </div>
  <nav aria-label="أقسام الموقع">${navLinks}</nav>
  <div class="lang" role="group" aria-label="اللغة" style="display:flex"><span class="lang__on" aria-current="true">العربية</span><button type="button" data-soon="tr"><span lang="tr">Türkçe</span><span class="sr-only">، قريبا</span></button><button type="button" data-soon="en"><span lang="en">English</span><span class="sr-only">، قريبا</span></button></div>
</div>`;

  const cats = (window.DAR_CATS || []).map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join("");
  const footer = `
<footer class="site-foot">
  <div class="band" data-band="saw" data-cell="4" data-night="1" aria-hidden="true" style="transform:scaleY(-1)"></div>
  <div class="wrap foot-grid">
    <div><img src="assets/brand/dar-logo-full.svg" alt="دار، مركز التراث الفلسطيني" width="140" height="137"><p>القلب النابض للتراث الفلسطيني. عائد كل قطعة يدعم مشاريع في غزة، خاصة لتمكين النساء والأطفال.</p></div>
    <div><h2>المتجر</h2><ul>${cats}</ul></div>
    <div><h2>دار</h2><ul><li><a href="about.html">من نحن</a></li><li><a href="motifs.html">النقوش</a></li><li><a href="corporate.html">هدايا المؤسسات</a></li><li><a href="${CATALOG}" target="_blank" rel="noopener">الكتالوج</a></li><li><a href="about.html#visit">زورونا</a></li></ul></div>
    <div><h2>المساعدة</h2><ul><li><a href="account.html">حسابي</a></li><li><a href="track.html">تتبع طلبك</a></li><li><a href="help.html#shipping">الشحن والتوصيل</a></li><li><a href="help.html#returns">الإرجاع والاستبدال</a></li><li><a href="help.html">الأسئلة المتكررة</a></li><li><a href="policies.html">السياسات</a></li></ul></div>
    <div><h2>تواصل</h2><ul><li><a href="contact.html">راسلنا</a></li><li><a href="${WA}" target="_blank" rel="noopener">واتساب</a></li><li><a href="${IG}" target="_blank" rel="noopener">إنستغرام</a></li><li><a href="https://www.facebook.com/share/16cFGdWppS/" target="_blank" rel="noopener">فيسبوك</a></li></ul></div>
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

  /* ---------- Word rise: split into words, keep <em> and <br>. Spaces stay real, so screen readers read it whole ---------- */
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
        } else if (child.nodeType === 1 && child.tagName === "BR") {
          child.before(" ");
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
  }
  document.querySelectorAll(".rise").forEach(splitWords);

  /* ---------- Image reveal: a henna running stitch crosses the picture in reading direction,
     and the picture settles behind it. It waits for the file, so it never sews in an empty frame ---------- */
  const veilImg = host => host.querySelector(":scope > img") || host.querySelector("img");
  function prepVeil(host) {
    if (host.dataset.veiled || !veilImg(host)) return false;
    host.dataset.veiled = "1";
    host.classList.add("veil");
    host.insertAdjacentHTML("beforeend", '<span class="veil__thread" aria-hidden="true"></span>');
    return true;
  }
  function veil(host) {
    const img = veilImg(host);
    let started = false, ended = false;
    // Back to the element's own styles (hover zoom, gallery zoom) once the picture has settled
    const finish = () => {
      if (ended) return; ended = true;
      host.classList.remove("veil", "is-shown");
      host.querySelector(".veil__thread")?.remove();
    };
    const go = () => {
      if (started) return; started = true;
      requestAnimationFrame(() => host.classList.add("is-shown"));
      img.addEventListener("transitionend", e => { if (e.target === img && e.propertyName === "transform") finish(); });
      setTimeout(finish, 3200);
    };
    if (!img || (img.complete && img.naturalWidth)) go();
    else { img.addEventListener("load", go, { once: true }); img.addEventListener("error", go, { once: true }); setTimeout(go, 2500); }
  }

  /* ---------- Reveal on enter ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.hasAttribute("data-veil")) veil(e.target); else e.target.classList.add("is-in");
    io.unobserve(e.target);
  }), { threshold: .2, rootMargin: "0px 0px -6% 0px" });

  function observe(root = document) {
    root.querySelectorAll(".rise:not(.is-in), .up:not(.is-in), [data-veil]").forEach(el => {
      if (el.hasAttribute("data-veil")) { if (!reduce && prepVeil(el)) io.observe(el); return; }
      if (reduce) el.classList.add("is-in"); else io.observe(el);
    });
  }

  /* ---------- Modal overlays: everything outside becomes inert while one is open ---------- */
  function modal(el, open, keep = []) {
    for (let n = el; n.parentElement && n !== document.body; n = n.parentElement) {
      [...n.parentElement.children].forEach(s => {
        if (s === n || keep.includes(s) || s.tagName === "SCRIPT") return;
        if (open && !s.inert) { s.inert = true; s.dataset.inertBy = "modal"; }
        if (!open && s.dataset.inertBy === "modal") { s.inert = false; delete s.dataset.inertBy; }
      });
    }
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
    // The floating WhatsApp button is out of reach (and out of the tab order) until it slides in
    const waOn = y > vh * .8;
    wa.classList.toggle("is-on", waOn);
    wa.inert = !waOn;
    scrollHooks.forEach(fn => fn(y, vh));
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);

  /* ---------- Toast ---------- */
  const slot = document.getElementById("toast-slot");
  let toastTimer;
  function hideToast() {
    clearTimeout(toastTimer);
    slot.classList.remove("is-on");
    slot.inert = true;
    setTimeout(() => { if (!slot.classList.contains("is-on")) slot.innerHTML = ""; }, 400);
  }
  const armToast = ms => { clearTimeout(toastTimer); toastTimer = setTimeout(hideToast, ms); };
  // A toast with an action stays 10 s, and never leaves while it is hovered or focused
  function showToast(text, link, href = "cart.html") {
    slot.inert = false;
    slot.innerHTML = `<div class="toast"><span data-motif="starlet" data-mode="cross"></span><span>${text}${link ? ` <a class="thread" href="${href}">${link}</a>` : ""}</span><button class="icon-btn toast__close" type="button" aria-label="إغلاق الإشعار"><span data-motif="i-close"></span></button></div>`;
    Dar.mount(slot);
    slot.classList.add("is-on");
    armToast(link ? 10000 : 4500);
    return slot.querySelector("a");
  }
  slot.inert = true;
  slot.addEventListener("click", e => { if (e.target.closest(".toast__close")) hideToast(); });
  slot.addEventListener("pointerenter", () => clearTimeout(toastTimer));
  slot.addEventListener("focusin", () => clearTimeout(toastTimer));
  slot.addEventListener("pointerleave", () => { if (slot.classList.contains("is-on") && !slot.contains(document.activeElement)) armToast(4000); });
  slot.addEventListener("focusout", e => { if (!slot.contains(e.relatedTarget) && slot.classList.contains("is-on")) armToast(4000); });

  /* ---------- Drawer ---------- */
  const drawer = document.getElementById("drawer");
  const menuBtn = document.querySelector(".menu-btn");
  const setDrawer = open => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", !open);
    menuBtn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) hideToast();   // a stale toast must not sit on top of the dialog
    modal(drawer, open, [slot]);
    if (open) drawer.querySelector("nav a").focus(); else menuBtn.focus({ preventScroll: true });
  };
  menuBtn.addEventListener("click", () => setDrawer(true));
  drawer.addEventListener("click", e => { if (e.target.closest("[data-close-drawer], nav a")) setDrawer(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false); });

  /* ---------- Customer account: kept in this browser until the backend exists.
     Accounts are keyed by the national part of the phone number, the session holds that key ---------- */
  const phoneKey = v => String(v || "").replace(/\D/g, "").slice(-10);
  const account = {
    key: phoneKey,
    all() { try { return JSON.parse(localStorage.getItem("dar-accounts") || "{}"); } catch (e) { return {}; } },
    find(phone) { return account.all()[phoneKey(phone)] || null; },
    current() { let k = null; try { k = localStorage.getItem("dar-session"); } catch (e) {} return k ? account.all()[k] || null : null; },
    save(user) { const all = account.all(); all[phoneKey(user.phone)] = user; try { localStorage.setItem("dar-accounts", JSON.stringify(all)); } catch (e) {} return user; },
    remove(user) { const all = account.all(); delete all[phoneKey(user.phone)]; try { localStorage.setItem("dar-accounts", JSON.stringify(all)); } catch (e) {} account.signOut(); },
    signIn(user) { try { localStorage.setItem("dar-session", phoneKey(user.phone)); } catch (e) {} },
    signOut() { try { localStorage.removeItem("dar-session"); } catch (e) {} }
  };
  const me = account.current();
  if (me) document.getElementById("acct-btn").setAttribute("aria-label", `حسابي، ${me.name}`);

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

  /* ---------- Favourites: saved in this browser, counted in the header ---------- */
  const favCount = document.getElementById("fav-count");
  const favs = {
    get() { try { return JSON.parse(localStorage.getItem("dar-favs") || "[]"); } catch (e) { return []; } },
    set(v) { try { localStorage.setItem("dar-favs", JSON.stringify(v)); } catch (e) {} renderFavs(); },
    has(id) { return favs.get().includes(id); }
  };
  function renderFavs() {
    const n = favs.get().length;
    favCount.hidden = !n; favCount.textContent = n;
    document.getElementById("fav-btn").setAttribute("aria-label", n ? `المفضلة، ${n} قطع` : "المفضلة");
  }
  renderFavs();

  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add && add.getAttribute("aria-disabled") !== "true") {
      e.preventDefault();
      addToCart(add.dataset.id, add.dataset.variant || "", add.dataset.add, +(add.dataset.qty || 1), add);
    }
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      e.preventDefault();
      const id = fav.dataset.fav;
      const on = !favs.has(id);
      favs.set(on ? [...favs.get(), id] : favs.get().filter(x => x !== id));
      // Every button for this piece follows; the label stays, aria-pressed carries the state
      document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => b.setAttribute("aria-pressed", on));
      if (on && !reduce) fav.animate([{ transform: "scale(.9)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 300, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
      if (on) showToast("حفظت القطعة في المفضلة.", "عرض المفضلة", "shop.html?fav=1");
    }
    const soon = e.target.closest("[data-soon]");
    if (soon) showToast(soon.dataset.soon === "tr" ? "النسخة التركية من الموقع قريبا." : "النسخة الإنجليزية من الموقع قريبا.");
  });

  /* ---------- Prices: the catalogue has none yet, so the preview uses labelled demo prices ---------- */
  const DEMO = { wear: 2400, bags: 850, kufiya: 450, wall: 650, jewel: 350, home: 550 };
  const price = p => +p.price || DEMO[p.cat];
  const money = n => `${Math.round(n).toLocaleString("en-US")} ₺`;

  /* ---------- Product card markup shared by home, shop and related lists ---------- */
  const IMG = id => `assets/img/dar/${id}.webp`;
  const SM = id => `assets/img/dar/${id}-480.webp`;
  const SRCSET = id => `${SM(id)} 480w, ${IMG(id)} 960w`;
  function card(p, i = 0, eager = false) {
    const tag = p.craft === "hand" ? '<span class="tag tag--henna">تطريز يدوي</span>' : "";
    const meta = p.code ? `<p class="product__code num">كود ${p.code}</p>` : `<p class="product__origin">${(window.DAR_CATS.find(c => c.id === p.cat) || {}).name || ""}</p>`;
    return `<article class="product up" style="--i:${i % 4}">
      <div class="product__frame">
        <a class="product__media${p.dark ? " product__media--dark" : ""}" href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true" data-veil><img src="${SM(p.img)}" srcset="${SRCSET(p.img)}" sizes="(max-width: 520px) 50vw, (max-width: 1100px) 33vw, 22vw" alt="" loading="${eager ? "eager" : "lazy"}" style="--pos:${p.pos || "50% 50%"}">${tag}</a>
        <button class="icon-btn product__fav" type="button" data-fav="${p.id}" aria-label="حفظ ${p.name} في المفضلة" aria-pressed="${favs.has(p.id)}"><span data-motif="i-heart"></span></button>
        <button class="btn product__add" type="button" data-id="${p.id}" data-add="${p.name}" aria-label="أضف ${p.name} إلى السلة">أضف إلى السلة</button>
      </div>
      <div class="product__meta"><div><h3 class="product__name"><a href="product.html?id=${p.id}">${p.name}</a></h3>${meta}</div>${p.price ? `<p class="product__price num">${money(p.price)}</p>` : '<p class="product__price--soon">السعر قريبا</p>'}</div>
    </article>`;
  }

  window.Site = { reduce, observe, veil, splitWords, showToast, hideToast, addToCart, card, IMG, SM, modal, onScroll: fn => scrollHooks.push(fn), refresh: onScroll, WA, cart: store, favs, price, money, account };

  // Pages that do not run an intro start revealing right away
  if (!document.body.hasAttribute("data-wait-intro")) observe();
  onScroll();
})();
