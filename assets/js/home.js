/* DAR homepage behaviour and motion */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const LINEN = "#F4EEE4", HENNA = "#B25426";

  // Motifs must exist before anything below reads their stitches
  document.querySelectorAll(".ribbon__track").forEach(t => t.append(t.firstElementChild.cloneNode(true)));
  Dar.mount();

  // Woven ground and thread progress use stitch tiles
  const woven = Dar.tile("star", { R: "#B25426", G: "#364639" }, 2, 96);
  document.querySelectorAll(".woven").forEach(el => { el.style.setProperty("--woven", woven.url); el.style.setProperty("--woven-size", `${woven.w}px ${woven.h}px`); });
  const thread = document.getElementById("thread");
  const chain = Dar.tile("chain", {}, 2);
  thread.style.backgroundImage = chain.url;
  thread.style.backgroundSize = `${chain.w}px ${chain.h}px`;

  /* ---------- Word rise: split headings into words, keep <em> and <br> ---------- */
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
    if (!r.width || !r.height) return;
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
    const start = performance.now();
    const X = (x, y) => {
      const a = size * .22, b = size * .78;
      ctx.beginPath();
      ctx.moveTo(x * size + a, y * size + a); ctx.lineTo(x * size + b, y * size + b);
      ctx.moveTo(x * size + b, y * size + a); ctx.lineTo(x * size + a, y * size + b);
      ctx.stroke();
    };
    ctx.strokeStyle = HENNA; ctx.lineWidth = Math.max(1.5, size * .16); ctx.lineCap = "square";
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
    const el = e.target;
    if (el.hasAttribute("data-veil")) veil(el); else el.classList.add("is-in");
    io.unobserve(el);
  }), { threshold: .2, rootMargin: "0px 0px -6% 0px" });

  function startReveals() {
    if (reduce) {
      document.querySelectorAll(".rise, .up").forEach(el => el.classList.add("is-in"));
      return;
    }
    document.querySelectorAll(".rise, .up, [data-veil]").forEach(el => io.observe(el));
  }

  /* ---------- Intro: once per visit ---------- */
  const intro = document.getElementById("intro");
  const playIntro = !document.documentElement.classList.contains("no-intro");
  if (playIntro) {
    document.body.style.overflow = "hidden";
    const star = document.getElementById("intro-star");
    const word = document.getElementById("intro-word");
    const line = document.getElementById("intro-line");
    star.classList.add("stitch-go");                       // stitches radiate from the center
    const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
    // The stitched star hands over to the real logo in the same spot
    star.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 1250, easing: ease, fill: "forwards" });
    word.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 1250, easing: ease, fill: "forwards" });
    line.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 1350, easing: ease, fill: "forwards" });
    const lift = intro.animate(
      [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }],
      { duration: 700, delay: 2100, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" }
    );
    const done = () => {
      intro.hidden = true; document.body.style.overflow = "";
      try { sessionStorage.setItem("dar-intro", "1"); } catch (e) {}
      startReveals();
    };
    lift.onfinish = done;
    intro.addEventListener("click", () => { lift.finish(); }, { once: true });   // tap to skip
  } else {
    intro.hidden = true;
    startReveals();
  }

  /* ---------- Scroll-linked: header, thread, parallax, reels, story star, WhatsApp ---------- */
  const head = document.querySelector(".site-head");
  const wa = document.getElementById("wa");
  const windows = [...document.querySelectorAll("#windows .window")];
  const pin = document.getElementById("reels-pin");
  const track = document.getElementById("reels-track");
  const star = document.getElementById("scroll-star");
  const storyText = document.getElementById("story-text");
  const starCells = star ? [...star.querySelectorAll(".c")] : [];
  if (star && !reduce) star.classList.add("scroll-stitch");
  let shown = -1;

  const wide = matchMedia("(min-width: 901px)");
  function sizeReels() {
    if (!wide.matches || reduce) { pin.style.height = ""; track.style.transform = ""; return; }
    const travel = Math.max(0, track.scrollWidth - innerWidth);
    pin.style.height = `${innerHeight + travel}px`;
  }

  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    head.classList.toggle("is-scrolled", y > 8);
    const max = document.documentElement.scrollHeight - vh;
    thread.style.setProperty("--p", `${Math.min(100, (y / max) * 100)}%`);
    wa.classList.toggle("is-on", y > vh * .8);
    if (reduce) return;

    // Hero windows drift at different speeds
    windows.forEach(w => { w.style.transform = `translateY(${(y * +w.dataset.speed).toFixed(1)}px)`; });

    // Reels: vertical scroll becomes sideways travel (RTL, so the strip moves right)
    if (wide.matches) {
      const r = pin.getBoundingClientRect();
      const travel = Math.max(0, track.scrollWidth - innerWidth);
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      track.style.transform = `translateX(${(p * travel).toFixed(1)}px)`;
    }

    // Story star: one stitch per step of reading
    if (starCells.length) {
      const r = storyText.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height * .75)));
      const n = Math.round(p * starCells.length);
      if (n !== shown) { starCells.forEach((c, i) => c.classList.toggle("on", i < n)); shown = n; }
    }
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", () => { sizeReels(); onScroll(); });
  addEventListener("load", () => { sizeReels(); onScroll(); });
  sizeReels(); onScroll();

  /* ---------- Drawer ---------- */
  const drawer = document.getElementById("drawer");
  const menuBtn = document.querySelector(".menu-btn");
  const setDrawer = open => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", !open);
    menuBtn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) drawer.querySelector("a").focus(); else menuBtn.focus({ preventScroll: true });
  };
  menuBtn.addEventListener("click", () => setDrawer(true));
  drawer.addEventListener("click", e => { if (e.target.closest("[data-close-drawer], nav a")) setDrawer(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("is-open")) setDrawer(false); });

  /* ---------- Toast ---------- */
  const slot = document.getElementById("toast-slot");
  let toastTimer;
  function showToast(text, link) {
    slot.innerHTML = `<div class="toast"><span data-motif="starlet" data-mode="cross"></span><span>${text}</span>${link ? ` <a class="thread" href="#">${link}</a>` : ""}</div>`;
    Dar.mount(slot);
    slot.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => slot.classList.remove("is-on"), 4000);
  }

  /* ---------- Cart and favourites (front end only until the backend exists) ---------- */
  const count = document.getElementById("cart-count");
  const cartBtn = document.getElementById("cart-btn");
  let items = 0;
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add && add.getAttribute("aria-disabled") !== "true") {
      e.preventDefault();
      add.classList.add("is-loading");
      setTimeout(() => {
        add.classList.remove("is-loading");
        count.hidden = false; count.textContent = ++items;
        cartBtn.setAttribute("aria-label", `السلة، ${items} قطع`);
        if (!reduce) cartBtn.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
        showToast(`أضيف ${add.dataset.add} إلى سلتك.`, "عرض السلة");
      }, 450);
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

  document.querySelectorAll('[role="tablist"]').forEach(list => list.addEventListener("click", e => {
    const tab = e.target.closest('[role="tab"]'); if (!tab) return;
    list.querySelectorAll('[role="tab"]').forEach(t => t.setAttribute("aria-selected", t === tab));
  }));

  /* ---------- Weekly question ---------- */
  const quiz = document.getElementById("quiz");
  const result = document.getElementById("quiz-result");
  quiz.addEventListener("click", e => {
    const pick = e.target.closest(".quiz__opt"); if (!pick) return;
    const opts = [...quiz.querySelectorAll(".quiz__opt")];
    const right = opts.find(o => o.dataset.answer === "1");
    opts.forEach(o => { o.disabled = true; if (o !== right) o.classList.add("is-wrong"); });
    right.classList.add("is-right");
    right.querySelector(".key").outerHTML = '<span class="mark" data-motif="starlet" data-mode="cross" data-order="radial" data-stitch></span>';
    Dar.mount(right);
    result.innerHTML = pick === right
      ? 'صحيح. نابلس مدينة الكنافة والصابون النابلسي. <a class="thread" href="https://www.instagram.com/filistinmirasmerkezi_dar/" target="_blank" rel="noopener">سؤال جديد كل أسبوع</a>'
      : 'الجواب نابلس، مدينة الكنافة والصابون النابلسي. <a class="thread" href="https://www.instagram.com/filistinmirasmerkezi_dar/" target="_blank" rel="noopener">سؤال جديد كل أسبوع</a>';
  });

  /* ---------- Newsletter ---------- */
  document.getElementById("join-form").addEventListener("submit", e => {
    e.preventDefault();
    showToast("سجلنا بريدك، نراك مع القطع الجديدة.");
    e.target.reset();
  });

  // Hover tilt on hero windows is decorative, so it only runs with a fine pointer
  if (finePointer && !reduce) {
    windows.forEach(w => {
      const img = w.querySelector("img");
      w.addEventListener("pointermove", e => {
        const r = w.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
        img.style.transform = `scale(1.06) translate(${(-dx * 10).toFixed(1)}px, ${(-dy * 10).toFixed(1)}px)`;
      });
      w.addEventListener("pointerleave", () => { img.style.transform = ""; });
      img.style.transition = "transform 600ms cubic-bezier(0.23, 1, 0.32, 1)";
    });
  }
})();
