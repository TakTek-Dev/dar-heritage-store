/* DAR content pages (about, corporate): the journey thread, piece picking and the quote request. Needs site.js */
(function () {
  const { reduce } = Site;
  const $ = s => document.getElementById(s);

  /* ---------- Journey: the thread between the stops is stitched as the list scrolls past ---------- */
  const journeys = [...document.querySelectorAll(".journey")];
  if (journeys.length && !reduce) {
    Site.onScroll((y, vh) => {
      journeys.forEach(j => {
        const r = j.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * .75 - r.top) / Math.max(1, r.height)));
        j.style.setProperty("--p", p.toFixed(3));
      });
    });
    Site.refresh();
  }

  /* ---------- Corporate: catalogue pieces, picked into the request ---------- */
  const showcase = $("showcase");
  if (!showcase) { Dar.mount(); Site.observe(); return; }

  // From "Dar Katalog 1.2", corporate pages. Codes and sizes as printed there.
  const PIECES = [
    { id: "plaque-map", name: "درع محفور يدويا بخريطة فلسطين", meta: "35×35 سم، كود 16027", img: "plaque-box" },
    { id: "plaque-isra", name: "درع محفور يدويا، سبحان الذي أسرى", meta: "45×45 سم، كود 16028", img: "plaque-isra" },
    { id: "frame-30", name: "إطار مطرز يدويا", meta: "30×40 سم، كود 16046", img: "frame-map-silver", pos: "50% 45%" },
    { id: "frame-40", name: "إطار مطرز يدويا، كبير", meta: "40×60 سم، كود 16047", img: "frame-calligraphy", pos: "50% 45%" },
    { id: "map-hanging", name: "خريطة فلسطين مطرزة للجدار", meta: "65 سم، كود 16021", img: "map-hanging", pos: "50% 45%" },
    { id: "key-return", name: "مفتاح العودة، دار", meta: "كود 16022", img: "key-return", pos: "60% 50%" },
    { id: "cups-vip", name: "طقم فناجين في علبة هدية", meta: "صنع يدوي", img: "cups-vip" },
    { id: "puzzle-map", name: "بازل خشبي لخريطة فلسطين بالمدن", meta: "كود 16018", img: "puzzle-map", pos: "50% 40%" }
  ];
  const byId = Object.fromEntries(PIECES.map(p => [p.id, p]));
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("dar-quote") || "[]").filter(id => byId[id]); } catch (e) { return []; } },
    set(v) { try { localStorage.setItem("dar-quote", JSON.stringify(v)); } catch (e) {} }
  };
  let picked = store.get();

  showcase.innerHTML = PIECES.map((p, i) => `
    <article class="piece up" style="--i:${i % 4}">
      <div class="piece__media" data-veil><img src="${Site.SM(p.img)}" srcset="${Site.SM(p.img)} 480w, ${Site.IMG(p.img)} 960w" sizes="(max-width: 1100px) 50vw, 24vw" alt="" loading="lazy" width="480" height="600" style="--pos:${p.pos || "50% 50%"}"></div>
      <div><h3>${p.name}</h3><p class="meta num">${p.meta}</p></div>
      <button class="btn btn--quiet piece__pick" type="button" data-pick="${p.id}" aria-pressed="${picked.includes(p.id)}" aria-label="أضف ${p.name} إلى الطلب">${picked.includes(p.id) ? "في الطلب" : "أضف إلى الطلب"}</button>
    </article>`).join("");

  const list = $("picked"), empty = $("picked-empty");
  function renderPicked() {
    list.innerHTML = picked.map(id => `<li>${byId[id].name}<button type="button" data-unpick="${id}" aria-label="أزل ${byId[id].name} من الطلب"><span data-motif="i-close"></span></button></li>`).join("");
    empty.hidden = picked.length > 0;
    Dar.mount(list);
    showcase.querySelectorAll("[data-pick]").forEach(b => {
      const on = picked.includes(b.dataset.pick);
      b.setAttribute("aria-pressed", on);
      b.textContent = on ? "في الطلب" : "أضف إلى الطلب";
    });
    store.set(picked);
  }
  showcase.addEventListener("click", e => {
    const b = e.target.closest("[data-pick]"); if (!b) return;
    const id = b.dataset.pick;
    picked = picked.includes(id) ? picked.filter(x => x !== id) : [...picked, id];
    renderPicked();
    if (picked.includes(id)) Site.showToast(`أضيف ${byId[id].name} إلى الطلب.`, "انتقل إلى الطلب", "#quote");
  });
  list.addEventListener("click", e => {
    const b = e.target.closest("[data-unpick]"); if (!b) return;
    const i = picked.indexOf(b.dataset.unpick);
    picked = picked.filter(x => x !== b.dataset.unpick);
    renderPicked();
    // Focus stays in the list, or moves to the send button once it is empty
    (list.querySelectorAll("[data-unpick]")[Math.min(i, picked.length - 1)] || $("quote-send")).focus();
  });
  renderPicked();

  /* ---------- Quote request becomes a ready WhatsApp message ---------- */
  const form = $("quote-form"), err = $("quote-error");
  const messages = {
    "q-name": "اكتب اسمك.",
    "q-org": "اكتب اسم المؤسسة أو الجهة.",
    "q-phone": "اكتب رقم واتساب مع رمز الدولة، مثل ⁦+90 5xx xxx xx xx⁩.",
    "q-occasion": "اختر نوع المناسبة."
  };
  const phoneOk = v => /^\+?\d{9,15}$/.test(v.replace(/[\s()-]/g, ""));
  function check(input) {
    const field = input.closest(".field"); if (!field) return true;
    let ok = !input.required || input.value.trim().length > 1;
    if (ok && input.id === "q-phone") ok = phoneOk(input.value);
    if (ok && input.type === "email" && input.value) ok = input.checkValidity();
    const hint = field.querySelector("[data-hint]");
    if (hint && hint.dataset.base === undefined) hint.dataset.base = hint.textContent;
    field.classList.toggle("is-error", !ok);
    input.setAttribute("aria-invalid", !ok);
    if (hint) hint.textContent = ok ? hint.dataset.base : (messages[input.id] || "أكمل البريد الإلكتروني، مثل name@company.com.");
    return ok;
  }
  form.addEventListener("blur", e => { if (e.target.matches("input, select") && e.target.value) check(e.target); }, true);
  form.addEventListener("input", e => { if (e.target.closest(".is-error")) check(e.target); });
  form.addEventListener("change", e => { if (e.target.closest(".is-error")) check(e.target); });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const inputs = ["q-name", "q-org", "q-phone", "q-email", "q-occasion"].map($);
    const bad = inputs.filter(i => !check(i));
    if (bad.length) {
      err.hidden = false;
      err.textContent = `${bad.length === 1 ? "حقل واحد يحتاج" : `${bad.length} حقول تحتاج`} تصحيحا. الملاحظة مكتوبة تحت كل حقل.`;
      bad[0].focus();
      return;
    }
    err.hidden = true;
    const val = id => $(id).value.trim();
    const services = [...form.querySelectorAll('[name="svc"]:checked')].map(c => c.value);
    const lines = [
      "مرحبا دار، نود طلب عرض سعر لهدايا مؤسسة.",
      `الاسم: ${val("q-name")}`,
      `المؤسسة: ${val("q-org")}`,
      `المناسبة: ${val("q-occasion")}`,
      val("q-qty") && `الكمية: ${val("q-qty")}`,
      val("q-date") && `الموعد: ${val("q-date")}`,
      picked.length ? `القطع: ${picked.map(id => byId[id].name).join("، ")}` : "القطع: نرجو اقتراحكم",
      services.length && `الخدمات: ${services.join("، ")}`,
      val("q-email") && `البريد: ${val("q-email")}`,
      val("q-notes") && `تفاصيل: ${val("q-notes")}`
    ].filter(Boolean);
    const url = `${Site.WA}?text=${encodeURIComponent(lines.join("\n"))}`;
    $("quote-link").href = url;
    $("quote-done").hidden = false;
    $("quote-done").focus();
    window.open(url, "_blank", "noopener");
  });

  Dar.mount();
  Site.observe();
})();
