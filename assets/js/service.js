/* DAR service pages: contact message, help search, policies index, order tracking, 404. Needs site.js */
(function () {
  const { reduce, WA } = Site;
  const $ = s => document.getElementById(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const digits = s => String(s || "").replace(/\D/g, "");
  const phoneOk = v => /^\+?\d{9,15}$/.test(String(v).replace(/[\s()-]/g, ""));

  // Marks a field wrong or right, and swaps its hint for the reason
  function mark(input, ok, message) {
    const field = input.closest(".field");
    const hint = field && field.querySelector("[data-hint]");
    if (hint && hint.dataset.base === undefined) hint.dataset.base = hint.textContent;
    field?.classList.toggle("is-error", !ok);
    input.setAttribute("aria-invalid", !ok);
    if (hint) hint.textContent = ok ? hint.dataset.base : message;
    return ok;
  }
  const errorSummary = n => `${n === 1 ? "حقل واحد يحتاج" : `${n} حقول تحتاج`} تصحيحا. الملاحظة مكتوبة تحت كل حقل.`;

  /* ---------- Contact: the message is composed here and sent from WhatsApp ---------- */
  const contact = $("contact-form");
  if (contact) {
    const orderField = $("order-field");
    contact.addEventListener("change", e => {
      if (e.target.name === "topic") orderField.hidden = e.target.value !== "طلب قائم";
    });
    const rules = {
      "c-name": [v => v.trim().length > 1, "اكتب اسمك."],
      "c-msg": [v => v.trim().length > 4, "اكتب سؤالك في سطر على الأقل."]
    };
    const check = input => mark(input, rules[input.id][0](input.value), rules[input.id][1]);
    contact.addEventListener("input", e => { if (rules[e.target.id] && e.target.closest(".is-error")) check(e.target); });
    contact.addEventListener("submit", e => {
      e.preventDefault();
      const bad = Object.keys(rules).map($).filter(i => !check(i));
      const err = $("contact-error");
      if (bad.length) { err.hidden = false; err.textContent = errorSummary(bad.length); bad[0].focus(); return; }
      err.hidden = true;
      const topic = contact.topic.value;
      const order = $("c-order").value.trim();
      const lines = [
        "مرحبا دار،",
        `الموضوع: ${topic}`,
        `الاسم: ${$("c-name").value.trim()}`,
        topic === "طلب قائم" && order && `رقم الطلب: ${order}`,
        "",
        $("c-msg").value.trim()
      ].filter(l => l !== false && l !== undefined);
      const url = `${WA}?text=${encodeURIComponent(lines.join("\n"))}`;
      $("contact-link").href = url;
      $("contact-done").hidden = false;
      $("contact-done").focus();
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Help: one search box filters every answer ---------- */
  const helpQ = $("help-q");
  if (helpQ) {
    // Arabic search ignores diacritics and the usual spelling variants of alef, ta marbuta and ya
    const norm = s => s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "")
      .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي");
    const sections = [...document.querySelectorAll("#help-list .faq-sec")];
    // data-k adds the words people search with but the answer does not use (غسيل for اغسلها)
    const items = sections.flatMap(sec => [...sec.querySelectorAll("details, .care > div")].map(el => ({ el, sec, text: norm(`${el.textContent} ${el.dataset.k || ""}`) })));
    const count = $("help-count"), empty = $("help-empty"), nav = document.querySelector(".topics-nav");
    const plural = n => n === 0 ? "لا نتيجة" : n === 1 ? "إجابة واحدة" : n === 2 ? "إجابتان" : n <= 10 ? `${n} إجابات` : `${n} إجابة`;
    let timer;
    function filter() {
      const q = norm(helpQ.value.trim());
      const words = q.split(/\s+/).filter(Boolean);
      let hits = 0;
      items.forEach(it => {
        const hit = !words.length || words.every(w => it.text.includes(w));
        it.el.classList.toggle("is-hit", hit);
        if (it.el.tagName === "DETAILS") {
          it.el.hidden = !hit;
          if (words.length) it.el.open = hit; else if (it.el.dataset.auto) it.el.open = false;
          it.el.dataset.auto = words.length ? "1" : "";
        }
        if (hit) hits++;
      });
      sections.forEach(sec => {
        sec.hidden = words.length > 0 && !items.some(it => it.sec === sec && it.el.classList.contains("is-hit"));
        sec.querySelector(".care")?.classList.toggle("is-filtered", words.length > 0);
      });
      empty.hidden = !words.length || hits > 0;
      nav.hidden = words.length > 0;
      count.textContent = words.length ? plural(hits) : "";
    }
    helpQ.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(filter, 120); });
    helpQ.addEventListener("search", filter);
  }

  /* ---------- Policies: the index marks the section you are reading ---------- */
  const toc = document.querySelector(".policy-toc");
  if (toc) {
    const links = new Map([...toc.querySelectorAll("a")].map(a => [a.getAttribute("href").slice(1), a]));
    const spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.removeAttribute("aria-current"));
      links.get(e.target.id)?.setAttribute("aria-current", "true");
    }), { rootMargin: "-25% 0px -65% 0px" });
    links.forEach((a, id) => { const s = $(id); if (s) spy.observe(s); });
  }

  /* ---------- Order tracking: reads orders saved by checkout and the dashboard in this browser ---------- */
  const track = $("track-form");
  if (track) {
    const orders = () => { try { return JSON.parse(localStorage.getItem("dar-admin") || "{}").orders || []; } catch (e) { return []; } };
    const all = Object.fromEntries((window.DAR_ALL_PRODUCTS || []).map(p => [p.id, p]));
    const fmt = iso => new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long" });
    const SHIP = { tr: "توصيل داخل تركيا", intl: "شحن دولي", pickup: "استلام من المركز" };
    const PAY = { card: "بطاقة بنكية", bank: "تحويل بنكي" };
    const STATUS = { new: "استلمنا طلبك", prep: "قيد التجهيز", ship: "تم الشحن", done: "تم التسليم", cancel: "ملغي" };
    const no = $("t-no"), phone = $("t-phone"), err = $("track-error"), miss = $("track-miss"), out = $("track-result");
    const legend = out.innerHTML;   // the journey of an order, shown until one is found

    const findOrder = q => {
      const key = q.trim().toUpperCase().replace(/\s+/g, "");
      return orders().find(o => o.id.toUpperCase() === key || (/^\d{4}$/.test(key) && o.id.endsWith(`-${key}`)));
    };
    // Dashboard demo orders carry masked numbers, so only orders placed here are checked against the phone
    const phoneMatches = (o, input) => !o.local || digits(o.phone).slice(-9) === digits(input).slice(-9);

    function render(o) {
      const pickup = o.ship === "pickup";
      const stops = [
        ["استلمنا طلبك", fmt(o.date)],
        ["نجهز القطع", "نطويها ونغلفها بعناية"],
        [pickup ? "جاهز للاستلام" : "في الطريق إليك", pickup ? "في المركز، إسطنبول" : "رقم الشحنة يصلك على واتساب"],
        [pickup ? "تم الاستلام" : "وصل", ""]
      ];
      const at = { new: 0, prep: 1, ship: 2, done: 3 }[o.status] ?? -1;
      const steps = stops.map(([t, s], i) => {
        const cls = o.status === "done" || i < at ? "is-done" : i === at ? "is-on" : "";
        return `<li class="${cls}" style="--n:${i}"${i === at && o.status !== "done" ? ' aria-current="step"' : ""}><span class="knot" aria-hidden="true"></span><b>${t}</b>${s ? `<span>${esc(s)}</span>` : ""}</li>`;
      }).join("");
      const lines = o.lines.map(l => {
        const p = all[l.pid]; if (!p) return "";
        const v = (p.variants || []).find(x => x.color === l.variant);
        return `<li><img src="${Site.SM(v ? v.img : p.img)}" alt="" width="56" height="70" loading="lazy"><span><b>${esc(p.name)}</b>${v ? `<span>${esc(v.name)}</span>` : ""}</span><span class="num">× ${l.qty}</span></li>`;
      }).join("");
      const ask = `${WA}?text=${encodeURIComponent(`مرحبا دار، أسأل عن طلبي رقم ${o.id}.`)}`;
      out.innerHTML = `
        <article class="tr-card">
          <header class="tr-card__head">
            <div><span class="eyebrow">طلب${o.local ? "" : " تجريبي من لوحة التحكم"}</span><h2 id="tr-h" tabindex="-1"><bdi>${esc(o.id)}</bdi></h2><p>بتاريخ ${fmt(o.date)}، ${SHIP[o.ship] || ""}${o.ship !== "pickup" && o.city ? ` إلى ${esc(o.city)}` : ""}</p></div>
            <span class="st st--${o.status}">${STATUS[o.status] || ""}</span>
          </header>
          ${o.status === "cancel"
            ? '<p class="tr-note tr-note--cancel">ألغي هذا الطلب. وإن كنت دفعت، يعود المبلغ بطريقة الدفع نفسها.</p>'
            : `<ol class="tr-steps is-cold" aria-label="مراحل الطلب">${steps}</ol>`}
          <div class="tr-body">
            <div><h3>القطع</h3><ul class="tr-lines">${lines}</ul></div>
            <div><h3>التفاصيل</h3><dl class="tr-facts"><dt>الاستلام</dt><dd>${SHIP[o.ship] || ""}</dd><dt>الدفع</dt><dd>${PAY[o.pay] || ""}</dd><dt>الطلب عبر</dt><dd>${o.channel === "wa" ? "واتساب" : "الموقع"}</dd></dl></div>
          </div>
          <footer class="tr-help"><p>سؤال عن طلبك؟ اذكر رقمه في رسالتك.</p><a class="btn btn--wa" href="${ask}" target="_blank" rel="noopener"><span data-motif="i-chat"></span>اسأل عن طلبك</a></footer>
        </article>`;
      Dar.mount(out);
      const stepsEl = out.querySelector(".tr-steps");
      // Two frames so the cold state paints first and the thread is stitched in front of the reader
      if (stepsEl) requestAnimationFrame(() => requestAnimationFrame(() => stepsEl.classList.remove("is-cold")));
      $("tr-h").focus({ preventScroll: true });
      const top = out.getBoundingClientRect().top + scrollY - 120;
      scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }

    function lookup() {
      const okNo = mark(no, no.value.trim().length >= 4, "اكتب رقم الطلب كما في رسالة التأكيد، مثل DAR-2026-1052.");
      const okPhone = mark(phone, phoneOk(phone.value), "اكتب رقم الجوال مع رمز الدولة، مثل ⁦+90 5xx xxx xx xx⁩.");
      const bad = [[no, okNo], [phone, okPhone]].filter(([, ok]) => !ok).map(([el]) => el);
      if (bad.length) { err.hidden = false; err.textContent = errorSummary(bad.length); bad[0].focus(); return; }
      err.hidden = true;
      const o = findOrder(no.value);
      if (!o || !phoneMatches(o, phone.value)) { out.innerHTML = legend; miss.hidden = false; miss.focus(); return; }
      miss.hidden = true;
      render(o);
    }
    track.addEventListener("submit", e => { e.preventDefault(); lookup(); });
    track.addEventListener("input", e => { if (e.target.closest(".is-error")) mark(e.target, true); });

    // Arriving from the order confirmation: the number is in the link, the phone in this session
    const fromUrl = new URLSearchParams(location.search).get("no");
    let last = null;
    try { last = JSON.parse(sessionStorage.getItem("dar-last-order") || "null"); } catch (e) {}
    if (fromUrl) {
      no.value = fromUrl;
      if (last && last.id === fromUrl) { phone.value = last.phone; lookup(); } else phone.focus();
    }

    // Demo shortcut: the newest order placed in this browser, or a shipped one from the dashboard
    const demo = $("t-demo");
    const sample = () => { const list = orders(); return list.find(o => o.local) || list.find(o => o.status === "ship") || list[0]; };
    if (sample()) {
      demo.hidden = false;
      demo.addEventListener("click", () => {
        const o = sample();
        no.value = o.id;
        phone.value = o.local ? o.phone : "+90 555 000 00 00";
        lookup();
      });
    }
  }

  /* ---------- 404: a few stitches are missing from the star, and can be mended ---------- */
  const star = $("lost-star");
  if (star) {
    // The page may be served from any depth, so in-page links must not resolve against <base>
    document.querySelectorAll('a[href^="#"]').forEach(a => { a.href = location.pathname + location.search + a.getAttribute("href"); });
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const cells = [...star.querySelectorAll(".c")];
    const lost = cells.filter(() => rnd() < .14);
    lost.forEach((c, k) => { c.classList.add("is-lost"); c.style.setProperty("--k", k); });
    const mend = $("mend");
    mend.addEventListener("click", () => {
      star.classList.add("is-mended");
      mend.disabled = true;
      Site.showToast("اكتملت النجمة. أما الصفحة فما زالت ضائعة.", "اذهب إلى المتجر", "shop.html");
    });
  }

  Dar.mount();
  Site.observe();
})();
