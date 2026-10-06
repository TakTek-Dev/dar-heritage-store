/* DAR checkout. Front end only: nothing is sent until the backend and payment gateway exist. Needs site.js */
(function () {
  const { cart, price, money, IMG, reduce } = Site;
  const $ = s => document.getElementById(s);
  const byId = Object.fromEntries(DAR_PRODUCTS.map(p => [p.id, p]));
  const items = cart.get();
  if (!items.length) { location.replace("cart.html"); return; }

  let extras = {};
  try { extras = JSON.parse(localStorage.getItem("dar-cart-extras") || "{}"); } catch (e) {}

  // A signed-in customer starts with their details and default address filled in
  const me = Site.account.current();
  if (me) {
    const addr = (me.addresses || []).find(a => a.isDefault) || (me.addresses || [])[0];
    const fill = (id, v) => { const el = $(id); if (el && !el.value && v) el.value = v; };
    fill("f-name", addr?.name || me.name); fill("f-phone", addr?.phone || me.phone); fill("f-email", me.email);
    if (addr) { fill("f-city", addr.city); fill("f-address", addr.address); }
  }

  const SHIP_TR = +(DAR_SETTINGS.shipTr || 120);    // demo default until DAR sets the rate in the dashboard
  const form = $("co-form");
  const view = i => { const p = byId[i.pid]; const v = (p.variants || []).find(x => x.color === i.variant); return { p, v, unit: price(p), img: v ? v.img : p.img }; };
  const subtotal = items.reduce((s, i) => s + view(i).unit * i.qty, 0);

  /* ---------- Summary ---------- */
  $("mini").innerHTML = items.map(i => {
    const { p, v, unit, img } = view(i);
    return `<li><span class="thumb${p.dark ? " is-dark" : ""}"><img src="${Site.SM(img)}" alt="" width="56" height="70"><span class="q num" aria-label="الكمية">${i.qty}</span></span><span><b>${p.name}</b>${v ? v.name : ""}</span><span class="num">${money(unit * i.qty)}</span></li>`;
  }).join("");
  document.querySelector('[data-cost="tr"]').textContent = money(SHIP_TR);
  $("co-gift-dt").hidden = $("co-gift-dd").hidden = !extras.gift;

  function totals() {
    const ship = form.ship.value;
    const shipCost = ship === "tr" ? SHIP_TR : 0;
    $("co-sub").textContent = money(subtotal);
    $("co-ship").textContent = ship === "intl" ? "يحدد لاحقا" : ship === "pickup" ? "مجاني" : money(shipCost);
    const total = money(subtotal + shipCost) + (ship === "intl" ? " + الشحن" : "");
    $("co-total").textContent = total;
    $("co-toggle-total").textContent = total;
    // Pickup needs no address
    $("address").hidden = ship === "pickup";
    ["f-city", "f-address"].forEach(id => $(id).required = ship !== "pickup");
  }
  form.addEventListener("change", e => { if (e.target.name === "ship") totals(); });
  totals();

  // Summary folds on small screens
  const sum = $("co-summary"), toggle = sum.querySelector(".summary-toggle");
  toggle.addEventListener("click", () => {
    const open = !sum.classList.contains("is-open");
    sum.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  });

  /* ---------- Step indicator follows the section being filled ---------- */
  const marks = [...document.querySelectorAll(".steps li")];
  form.addEventListener("focusin", e => {
    const step = +(e.target.closest(".co-step")?.dataset.step || 1);
    marks.forEach(m => {
      const n = +m.dataset.step;
      m.classList.toggle("is-on", n === step);
      m.classList.toggle("is-done", n < step);
      n === step ? m.setAttribute("aria-current", "step") : m.removeAttribute("aria-current");
    });
  });

  /* ---------- Validation: say what is wrong and how to fix it ---------- */
  const messages = {
    "f-name": "اكتب الاسم الكامل كما سيظهر على الطرد.",
    "f-phone": "اكتب رقم جوال صحيحا مع رمز الدولة، مثل ⁦+90 5xx xxx xx xx⁩.",
    "f-city": "اكتب المدينة.",
    "f-address": "اكتب العنوان كاملا: الحي والشارع ورقم البناء."
  };
  const phoneOk = v => v.replace(/[\s()-]/g, "").match(/^\+?\d{9,15}$/);
  function check(input) {
    const field = input.closest(".field"); if (!field) return true;
    let ok = !input.required || input.value.trim().length > 1;
    if (ok && input.id === "f-phone") ok = !!phoneOk(input.value);
    if (ok && input.type === "email" && input.value) ok = input.checkValidity();
    const hint = field.querySelector("[data-hint]");
    if (hint && !hint.dataset.base) hint.dataset.base = hint.textContent;
    field.classList.toggle("is-error", !ok);
    input.setAttribute("aria-invalid", !ok);
    if (hint) {
      hint.textContent = ok ? hint.dataset.base : (messages[input.id] || "أكمل البريد الإلكتروني، مثل name@email.com.");
      if (!hint.id) hint.id = `${input.id}-hint`;
      input.setAttribute("aria-describedby", hint.id);
    }
    return ok;
  }
  form.addEventListener("blur", e => { if (e.target.matches("input") && e.target.value) check(e.target); }, true);
  form.addEventListener("input", e => { if (e.target.closest(".is-error")) check(e.target); });

  // Kept in this browser so the tracking page and the dashboard preview can show the order
  function saveOrder(pay, ship) {
    let state = {};
    try { state = JSON.parse(localStorage.getItem("dar-admin") || "{}"); } catch (e) {}
    const list = state.orders || [];
    const next = Math.max(1051, ...list.map(o => +String(o.id).split("-").pop() || 0)) + 1;
    const id = `DAR-${new Date().getFullYear()}-${next}`;
    const val = f => $(f).value.trim();
    list.unshift({
      id, name: val("f-name"), city: ship === "pickup" ? "إسطنبول" : val("f-city"), phone: val("f-phone"),
      lines: items.map(i => ({ pid: i.pid, qty: i.qty, variant: i.variant })),
      channel: "web", pay, ship, status: "new", date: new Date().toISOString(), local: true
    });
    state.orders = list;
    try {
      localStorage.setItem("dar-admin", JSON.stringify(state));
      sessionStorage.setItem("dar-last-order", JSON.stringify({ id, phone: val("f-phone") }));
      localStorage.removeItem("dar-cart-extras");
    } catch (e) {}
    cart.set([]);
    return id;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const inputs = [...form.querySelectorAll("#f-name, #f-phone, #f-email, #f-city, #f-address")].filter(i => !i.closest("[hidden]"));
    const bad = inputs.filter(i => !check(i));
    const terms = $("f-terms");
    const err = $("co-error");
    if (bad.length || !terms.checked) {
      err.hidden = false;
      err.textContent = bad.length ? `${bad.length === 1 ? "حقل واحد يحتاج" : `${bad.length} حقول تحتاج`} تصحيحا. الملاحظة مكتوبة تحت كل حقل.` : "وافق على شروط البيع لإتمام الطلب.";
      (bad[0] || terms).focus();
      return;
    }
    err.hidden = true;

    const btn = $("co-submit");
    btn.classList.add("is-loading");
    setTimeout(() => {
      const pay = form.pay.value;
      const no = saveOrder(pay, form.ship.value);
      $("checkout").hidden = true;
      document.querySelector(".page-head").hidden = true;
      $("done").hidden = false;
      $("order-no").textContent = no;
      $("done-track").href = `track.html?no=${encodeURIComponent(no)}`;
      $("done-text").textContent = pay === "card"
        ? "في الموقع الحقيقي تنتقل الآن إلى صفحة الدفع الآمنة. هذه معاينة: حفظنا الطلب في هذا المتصفح فقط، ولم يخصم أي مبلغ."
        : "في الموقع الحقيقي نرسل لك بيانات التحويل على واتساب. هذه معاينة: حفظنا الطلب في هذا المتصفح فقط.";
      const star = $("done-star");
      Dar.mount($("done"));
      if (!reduce) { star.classList.add("stitch-go"); }
      $("done-h").focus();
      scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    }, 900);
  });
})();
