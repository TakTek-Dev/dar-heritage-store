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
    { id: "plaque-map", name: L("درع محفور يدويا بخريطة فلسطين", "Hand-carved plaque, map of Palestine", "El oyması plaket, Filistin haritası"), meta: L("35×35 سم، كود 16027", "35×35 cm, code 16027", "35×35 cm, kod 16027"), img: "plaque-box" },
    { id: "plaque-isra", name: L("درع محفور يدويا، سبحان الذي أسرى", "Hand-carved plaque, Al-Isra verse", "El oyması plaket, İsra ayeti"), meta: L("45×45 سم، كود 16028", "45×45 cm, code 16028", "45×45 cm, kod 16028"), img: "plaque-isra" },
    { id: "frame-30", name: L("إطار مطرز يدويا", "Hand-embroidered frame", "El nakışı çerçeve"), meta: L("30×40 سم، كود 16046", "30×40 cm, code 16046", "30×40 cm, kod 16046"), img: "frame-map-silver", pos: "50% 45%" },
    { id: "frame-40", name: L("إطار مطرز يدويا، كبير", "Hand-embroidered frame, large", "El nakışı çerçeve, büyük"), meta: L("40×60 سم، كود 16047", "40×60 cm, code 16047", "40×60 cm, kod 16047"), img: "frame-calligraphy", pos: "50% 45%" },
    { id: "map-hanging", name: L("خريطة فلسطين مطرزة للجدار", "Embroidered wall map of Palestine", "Nakışlı duvar haritası, Filistin"), meta: L("65 سم، كود 16021", "65 cm, code 16021", "65 cm, kod 16021"), img: "map-hanging", pos: "50% 45%" },
    { id: "key-return", name: L("مفتاح العودة، دار", "DAR Key of Return", "DAR Dönüş Anahtarı"), meta: L("كود 16022", "Code 16022", "Kod 16022"), img: "key-return", pos: "60% 50%" },
    { id: "cups-vip", name: L("طقم فناجين في علبة هدية", "Coffee cup set in a gift box", "Hediye kutusunda kahve fincanı takımı"), meta: L("صنع يدوي", "Handmade", "El yapımı"), img: "cups-vip" },
    { id: "puzzle-map", name: L("بازل خشبي لخريطة فلسطين بالمدن", "Wooden puzzle map of Palestine's cities", "Ahşap yapboz, şehirleriyle Filistin haritası"), meta: L("كود 16018", "Code 16018", "Kod 16018"), img: "puzzle-map", pos: "50% 40%" }
  ];
  // Own image paths, so they resolve from /en/ as well
  const IMG = id => `${DAR_ROOT}assets/img/dar/${id}.webp`;
  const SM = id => `${DAR_ROOT}assets/img/dar/${id}-480.webp`;
  const IN = L("في الطلب", "In your request", "Talebinizde"), ADD = L("أضف إلى الطلب", "Add to request", "Talebe ekleyin");
  const byId = Object.fromEntries(PIECES.map(p => [p.id, p]));
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("dar-quote") || "[]").filter(id => byId[id]); } catch (e) { return []; } },
    set(v) { try { localStorage.setItem("dar-quote", JSON.stringify(v)); } catch (e) {} }
  };
  let picked = store.get();

  showcase.innerHTML = PIECES.map((p, i) => `
    <article class="piece up" style="--i:${i % 4}">
      <div class="piece__media" data-veil><img src="${SM(p.img)}" srcset="${SM(p.img)} 480w, ${IMG(p.img)} 960w" sizes="(max-width: 1100px) 50vw, 24vw" alt="" loading="lazy" width="480" height="600" style="--pos:${p.pos || "50% 50%"}"></div>
      <div><h3>${p.name}</h3><p class="meta num">${p.meta}</p></div>
      <button class="btn btn--quiet piece__pick" type="button" data-pick="${p.id}" aria-pressed="${picked.includes(p.id)}" aria-label="${L(`أضف ${p.name} إلى الطلب`, `Add ${p.name} to the request`, `${p.name}: talebe ekleyin`)}">${picked.includes(p.id) ? IN : ADD}</button>
    </article>`).join("");

  const list = $("picked"), empty = $("picked-empty");
  function renderPicked() {
    list.innerHTML = picked.map(id => `<li>${byId[id].name}<button type="button" data-unpick="${id}" aria-label="${L(`أزل ${byId[id].name} من الطلب`, `Remove ${byId[id].name} from the request`, `${byId[id].name}: talepten çıkarın`)}"><span data-motif="i-close"></span></button></li>`).join("");
    empty.hidden = picked.length > 0;
    Dar.mount(list);
    showcase.querySelectorAll("[data-pick]").forEach(b => {
      const on = picked.includes(b.dataset.pick);
      b.setAttribute("aria-pressed", on);
      b.textContent = on ? IN : ADD;
    });
    store.set(picked);
  }
  showcase.addEventListener("click", e => {
    const b = e.target.closest("[data-pick]"); if (!b) return;
    const id = b.dataset.pick;
    picked = picked.includes(id) ? picked.filter(x => x !== id) : [...picked, id];
    renderPicked();
    if (picked.includes(id)) Site.showToast(L(`أضيف ${byId[id].name} إلى الطلب.`, `${byId[id].name} added to the request.`, `${byId[id].name} talebe eklendi.`), L("انتقل إلى الطلب", "Go to request", "Talebe gidin"), "#quote");
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
    "q-name": L("اكتب اسمك.", "Enter your name.", "Adınızı yazın."),
    "q-org": L("اكتب اسم المؤسسة أو الجهة.", "Enter the name of your organisation.", "Kurumunuzun adını yazın."),
    "q-phone": L("اكتب رقم واتساب مع رمز الدولة، مثل ⁦+90 5xx xxx xx xx⁩.", "Enter a WhatsApp number with the country code, like +90 5xx xxx xx xx.", "Ülke koduyla birlikte bir WhatsApp numarası yazın, örneğin +90 5xx xxx xx xx."),
    "q-occasion": L("اختر نوع المناسبة.", "Choose the type of occasion.", "Etkinlik türünü seçin.")
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
    if (hint) hint.textContent = ok ? hint.dataset.base : (messages[input.id] || L("أكمل البريد الإلكتروني، مثل name@company.com.", "Complete the email address, like name@company.com.", "E-posta adresini tamamlayın, örneğin ad@sirket.com."));
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
      err.textContent = L(`${bad.length === 1 ? "حقل واحد يحتاج" : `${bad.length} حقول تحتاج`} تصحيحا. الملاحظة مكتوبة تحت كل حقل.`,
        `${bad.length === 1 ? "One field needs" : `${bad.length} fields need`} a fix. The note is under each field.`,
        `${bad.length === 1 ? "Bir alanın" : `${bad.length} alanın`} düzeltilmesi gerekiyor. Açıklama her alanın altında.`);
      bad[0].focus();
      return;
    }
    err.hidden = true;
    const val = id => $(id).value.trim();
    const services = [...form.querySelectorAll('[name="svc"]:checked')].map(c => c.value);
    const sep = L("، ", ", ", ", ");
    const lines = [
      L("مرحبا دار، نود طلب عرض سعر لهدايا مؤسسة.", "Hello DAR, we would like a quote for corporate gifts.", "Merhaba DAR, kurumsal hediyeler için fiyat teklifi almak istiyoruz."),
      `${L("الاسم", "Name", "Ad soyad")}: ${val("q-name")}`,
      `${L("المؤسسة", "Organisation", "Kurum")}: ${val("q-org")}`,
      `${L("المناسبة", "Occasion", "Etkinlik")}: ${val("q-occasion")}`,
      val("q-qty") && `${L("الكمية", "Quantity", "Adet")}: ${val("q-qty")}`,
      val("q-date") && `${L("الموعد", "Date", "Tarih")}: ${val("q-date")}`,
      picked.length ? `${L("القطع", "Pieces", "Parçalar")}: ${picked.map(id => byId[id].name).join(sep)}` : L("القطع: نرجو اقتراحكم", "Pieces: please suggest some", "Parçalar: önerilerinizi bekliyoruz"),
      services.length && `${L("الخدمات", "Services", "Hizmetler")}: ${services.join(sep)}`,
      val("q-email") && `${L("البريد", "Email", "E-posta")}: ${val("q-email")}`,
      val("q-notes") && `${L("تفاصيل", "Details", "Ayrıntılar")}: ${val("q-notes")}`
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
