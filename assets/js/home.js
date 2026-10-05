/* DAR homepage behaviour */
(function () {
  Dar.mount();
  const head = document.querySelector(".site-head");
  addEventListener("scroll", () => head.classList.toggle("is-scrolled", scrollY > 8), { passive: true });

  // Ribbon: duplicate the run so the loop is seamless
  document.querySelectorAll(".ribbon__track").forEach(track => {
    track.append(track.firstElementChild.cloneNode(true));
    Dar.mount(track);
  });

  // Mobile drawer
  const drawer = document.getElementById("drawer");
  const menuBtn = document.querySelector(".menu-btn");
  const setDrawer = open => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", !open);
    menuBtn.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  menuBtn.addEventListener("click", () => setDrawer(true));
  drawer.addEventListener("click", e => { if (e.target.closest("[data-close-drawer], a")) setDrawer(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") setDrawer(false); });

  // Toast
  const slot = document.getElementById("toast-slot");
  let toastTimer;
  window.showToast = (text, link) => {
    slot.innerHTML = `<div class="toast"><span data-motif="starlet" data-mode="cross"></span><span>${text}</span>${link ? ` <a class="thread" href="#">${link}</a>` : ""}</div>`;
    Dar.mount(slot);
    slot.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => slot.classList.remove("is-on"), 4000);
  };

  // Cart (front-end only until the backend exists)
  const count = document.getElementById("cart-count");
  let items = 0;
  document.addEventListener("click", e => {
    const add = e.target.closest("[data-add]");
    if (add && add.getAttribute("aria-disabled") !== "true") {
      e.preventDefault();
      add.classList.add("is-loading");
      setTimeout(() => {
        add.classList.remove("is-loading");
        count.hidden = false; count.textContent = ++items;
        document.getElementById("cart-btn").setAttribute("aria-label", `السلة، ${items} قطع`);
        showToast(`أضيف ${add.dataset.add} إلى سلتك.`, "عرض السلة");
      }, 450);
    }
    const fav = e.target.closest(".product__fav");
    if (fav) {
      e.preventDefault();
      const on = fav.getAttribute("aria-pressed") !== "true";
      fav.setAttribute("aria-pressed", on);
      fav.setAttribute("aria-label", on ? "أزل من المفضلة" : "أضف للمفضلة");
    }
  });

  // Filter tabs (visual only for now)
  document.querySelectorAll('[role="tablist"]').forEach(list => list.addEventListener("click", e => {
    const tab = e.target.closest('[role="tab"]'); if (!tab) return;
    list.querySelectorAll('[role="tab"]').forEach(t => t.setAttribute("aria-selected", t === tab));
  }));

  // Film dialog: placeholder until DAR sends the vertical videos
  const film = document.getElementById("film");
  document.querySelectorAll("[data-film]").forEach(btn => btn.addEventListener("click", () => {
    document.getElementById("film-title").textContent = btn.dataset.film;
    film.showModal();
  }));
  film.addEventListener("click", e => { if (e.target === film || e.target.closest("[data-close-film]")) film.close(); });

  // Story: the star is embroidered stitch by stitch as the text scrolls past
  const star = document.getElementById("scroll-star");
  const text = document.getElementById("story-text");
  if (star && text && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    star.classList.add("scroll-stitch");
    const cells = [...star.querySelectorAll(".c")];
    let shown = -1, ticking = false;
    const update = () => {
      ticking = false;
      const r = text.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height * .8)));
      const n = Math.round(p * cells.length);
      if (n === shown) return;
      cells.forEach((c, i) => c.classList.toggle("on", i < n));
      shown = n;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
})();
