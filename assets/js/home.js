/* DAR homepage: intro, hero windows, reels, story star, weekly question. Needs site.js */
(function () {
  const { reduce } = Site;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Dashboard content overrides the defaults written in the page
  const C = window.DAR_CONTENT || {};
  if (C.hero1 || C.hero2) {
    const h = document.getElementById("hero-h");
    h.innerHTML = `${(C.hero1 || "").replace(/[<>]/g, "")}<br><em>${(C.hero2 || "").replace(/[<>]/g, "")}</em>`;
    Site.splitWords(h);
  }
  if (C.heroSub) document.querySelector(".hero__sub").textContent = C.heroSub;
  if (C.quiz && C.quiz.q) {
    const qh = document.getElementById("quiz-h");
    qh.textContent = C.quiz.q; Site.splitWords(qh);
    document.querySelector(".quiz__hint").textContent = C.quiz.hint ? `تلميح: ${C.quiz.hint}` : "";
    document.querySelectorAll(".quiz__opt").forEach((b, i) => {
      b.dataset.answer = i === C.quiz.right ? "1" : "0";
      b.firstElementChild.textContent = C.quiz.opts[i] || "";
    });
  }

  // Featured products come from the catalogue data
  const grid = document.querySelector("[data-featured]");
  if (C.featured && C.featured.length) grid.dataset.featured = C.featured.join(",");
  const byId = Object.fromEntries(DAR_PRODUCTS.map(p => [p.id, p]));
  grid.innerHTML = grid.dataset.featured.split(",").filter(id => byId[id]).map((id, i) => Site.card(byId[id], i)).join("");
  Dar.mount(grid);

  // Woven ground behind the hero
  const woven = Dar.tile("star", { R: "#B25426", G: "#364639" }, 2, 96);
  document.querySelectorAll(".woven").forEach(el => {
    el.style.setProperty("--woven", woven.url);
    el.style.setProperty("--woven-size", `${woven.w}px ${woven.h}px`);
  });

  /* ---------- Intro: once per visit ---------- */
  const intro = document.getElementById("intro");
  if (!document.documentElement.classList.contains("no-intro")) {
    document.body.style.overflow = "hidden";
    // While the intro covers the page, nothing behind it can take focus
    Site.modal(intro, true);
    const star = document.getElementById("intro-star");
    const ease = "cubic-bezier(0.23, 1, 0.32, 1)";
    star.classList.add("stitch-go");                       // stitches radiate from the center
    // The stitched star hands over to the real logo in the same spot
    star.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, delay: 1250, easing: ease, fill: "forwards" });
    document.getElementById("intro-word").animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 1250, easing: ease, fill: "forwards" });
    document.getElementById("intro-line").animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 1350, easing: ease, fill: "forwards" });
    const lift = intro.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }],
      { duration: 700, delay: 2100, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" });
    lift.onfinish = () => {
      intro.hidden = true; document.body.style.overflow = "";
      Site.modal(intro, false);
      removeEventListener("keydown", skip);
      try { sessionStorage.setItem("dar-intro", "1"); } catch (e) {}
      Site.observe();
    };
    // Tap, click or any key skips it
    const skip = () => lift.finish();
    intro.addEventListener("click", skip, { once: true });
    addEventListener("keydown", skip);
  } else {
    intro.hidden = true;
    Site.observe();
  }

  /* ---------- Scroll-linked: hero windows, reels, story star ---------- */
  const windows = [...document.querySelectorAll("#windows .window")];
  const pin = document.getElementById("reels-pin");
  const track = document.getElementById("reels-track");
  const star = document.getElementById("scroll-star");
  const storyText = document.getElementById("story-text");
  const starCells = [...star.querySelectorAll(".c")];
  if (!reduce) star.classList.add("scroll-stitch");
  let shown = -1;
  const wide = matchMedia("(min-width: 901px)");

  function sizeReels() {
    if (!wide.matches || reduce) { pin.style.height = ""; track.style.transform = ""; return; }
    pin.style.height = `${innerHeight + Math.max(0, track.scrollWidth - innerWidth)}px`;
  }

  Site.onScroll((y, vh) => {
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
    const r = storyText.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height * .75)));
    const n = Math.round(p * starCells.length);
    if (n !== shown) { starCells.forEach((c, i) => c.classList.toggle("on", i < n)); shown = n; }
  });
  addEventListener("resize", sizeReels);

  // Keyboard users move through the reels by focus; scroll the page so the focused reel is on screen
  track.addEventListener("focusin", e => {
    if (!wide.matches || reduce) return;
    const reels = [...track.querySelectorAll(".reel")];
    const i = reels.indexOf(e.target.closest(".reel"));
    if (i < 0) return;
    const top = pin.getBoundingClientRect().top + scrollY;
    const room = pin.offsetHeight - innerHeight;
    scrollTo({ top: top + room * (i / Math.max(1, reels.length - 1)), behavior: "auto" });
  });

  /* ---------- Ribbon pause ---------- */
  const ribbon = document.querySelector(".ribbon");
  const pauseBtn = ribbon.querySelector(".ribbon__pause");
  pauseBtn.addEventListener("click", () => {
    const paused = ribbon.classList.toggle("is-paused");
    pauseBtn.setAttribute("aria-pressed", paused);
    pauseBtn.innerHTML = `<span data-motif="${paused ? "i-play" : "i-pause"}" data-mono="1"></span>`;
    Dar.mount(pauseBtn);
  });
  if (reduce) pauseBtn.hidden = true;
  addEventListener("load", () => { sizeReels(); Site.refresh(); });
  sizeReels(); Site.refresh();

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
    const more = '<a class="thread" href="https://www.instagram.com/filistinmirasmerkezi_dar/" target="_blank" rel="noopener">سؤال جديد كل أسبوع</a>';
    const answer = right.firstElementChild.textContent;
    const custom = C.quiz && C.quiz.q;
    result.innerHTML = pick === right
      ? `صحيح. ${custom ? answer : "نابلس مدينة الكنافة والصابون النابلسي"}. ${more}`
      : `الجواب ${custom ? answer : "نابلس، مدينة الكنافة والصابون النابلسي"}. ${more}`;
    // The options are now disabled, so focus moves to the answer instead of falling to the page
    result.focus();
  });

  /* ---------- Newsletter ---------- */
  document.getElementById("join-form").addEventListener("submit", e => {
    e.preventDefault();
    Site.showToast("سجلنا بريدك، نراك مع القطع الجديدة.");
    e.target.reset();
  });

  // Hover drift inside the hero windows is decorative, so it needs a fine pointer
  if (finePointer && !reduce) {
    windows.forEach(w => {
      const img = w.querySelector("img");
      img.style.transition = "transform 600ms cubic-bezier(0.23, 1, 0.32, 1)";
      w.addEventListener("pointermove", e => {
        const r = w.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
        img.style.transform = `scale(1.06) translate(${(-dx * 10).toFixed(1)}px, ${(-dy * 10).toFixed(1)}px)`;
      });
      w.addEventListener("pointerleave", () => { img.style.transform = ""; });
    });
  }
})();
