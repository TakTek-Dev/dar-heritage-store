/* DAR customer account preview: sign in with a phone code, then orders, addresses, favourites and details.
   Everything is kept in this browser until the backend exists. Needs site.js */
(function () {
  const { account, money, price } = Site;
  const $ = s => document.getElementById(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const phoneOk = v => /^\+?\d{9,15}$/.test(String(v).replace(/[\s()-]/g, ""));
  const emailOk = v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const fmtDate = iso => new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "long" });
  const fmtMonth = iso => new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { month: "long", year: "numeric" });
  const pieces = n => n === 1 ? "قطعة واحدة" : n === 2 ? "قطعتان" : n <= 10 ? `${n} قطع` : `${n} قطعة`;
  const PHONE_MSG = "اكتب الرقم مع رمز الدولة، مثل ⁦+90 5xx xxx xx xx⁩.";

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

  /* ---------- Orders: the ones placed in this browser with this account's phone ---------- */
  const readAdmin = () => { try { return JSON.parse(localStorage.getItem("dar-admin") || "{}"); } catch (e) { return {}; } };
  const ordersOf = u => {
    const keys = [u.phone, ...(u.oldPhones || [])].map(account.key);
    return (readAdmin().orders || []).filter(o => o.local && keys.includes(account.key(o.phone))).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  /* ---------- Demo account: one tap gives a full account to look at ---------- */
  function demo() {
    const phone = "+90 532 000 11 22";
    const user = account.find(phone) || account.save({
      name: "سارة أحمد", phone, email: "sara@example.com", since: "2026-03-12T10:00:00.000Z", demo: true,
      notify: { orders: true, news: true }, lang: "ar",
      addresses: [
        { id: "a1", label: "البيت", name: "سارة أحمد", phone, city: "إسطنبول", address: "Şirinevler Mah. Adnan Kahveci Blv. No:12 D:4, Bahçelievler", isDefault: true },
        { id: "a2", label: "العمل", name: "سارة أحمد", phone, city: "إسطنبول", address: "Kızıltaş Sk. No:3, Fatih" }
      ]
    });
    // Two past orders, kept where checkout keeps orders, so tracking and the dashboard see them too
    const state = readAdmin();
    const list = state.orders || [];
    if (!list.some(o => o.local && account.key(o.phone) === account.key(phone))) {
      let next = Math.max(1051, ...list.map(o => +String(o.id).split("-").pop() || 0));
      const day = 864e5, now = Date.now(), year = new Date().getFullYear();
      const older = { id: `DAR-${year}-${++next}`, name: user.name, city: "إسطنبول", phone, lines: [{ pid: "kufiya", qty: 2 }], channel: "web", pay: "bank", ship: "pickup", status: "done", date: new Date(now - 24 * day).toISOString(), local: true };
      const newer = { id: `DAR-${year}-${++next}`, name: user.name, city: "إسطنبول", phone, lines: [{ pid: "thob-green", qty: 1 }, { pid: "cups-red", qty: 1 }], channel: "web", pay: "card", ship: "tr", status: "ship", date: new Date(now - 2 * day).toISOString(), local: true };
      list.unshift(newer, older);
      state.orders = list;
      try { localStorage.setItem("dar-admin", JSON.stringify(state)); } catch (e) {}
    }
    if (!Site.favs.get().length) Site.favs.set(["necklace-map", "minibag", "hoop-hand"]);
    account.signIn(user);
    return user;
  }

  /* ---------- Sign in: phone, then the code, then a name for new accounts ---------- */
  const phoneForm = $("step-phone");
  if (phoneForm) {
    const params = new URLSearchParams(location.search);
    const changing = params.get("change") === "1" && account.current();
    const safeNext = n => /^[a-z-]+\.html(#[a-z-]+)?$/.test(n || "") ? n : "account.html";
    const next = changing ? "account.html#profile" : safeNext(params.get("next"));
    if (account.current() && !changing) { location.replace(next); return; }

    const h = $("auth-h"), lead = $("auth-lead"), err = $("auth-error");
    const steps = [...$("auth-steps").children];
    const forms = { phone: phoneForm, code: $("step-code"), profile: $("step-profile") };
    const titles = {
      phone: changing ? ["رقمك الجديد", "نرسل رمزا إلى الرقم الجديد لنتأكد أنه لك."] : [h.textContent, lead.textContent],
      code: ["اكتب الرمز", "الرمز صالح لعشر دقائق، ولا تشاركه مع أحد."],
      profile: ["أهلا بك في دار", "خطوة أخيرة: كيف نناديك؟"]
    };
    const phoneIn = $("a-phone"), codeIn = $("a-code");
    let phone = "", code = "", timer;

    function show(step) {
      Object.entries(forms).forEach(([k, f]) => { f.hidden = k !== step; });
      const at = ["phone", "code", "profile"].indexOf(step);
      steps.forEach((li, j) => {
        li.className = j < at ? "is-done" : j === at ? "is-on" : "";
        if (j === at) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      [h.textContent, lead.textContent] = titles[step];
      err.hidden = true;
    }
    if (changing) { show("phone"); $("demo-acct").closest(".demo-note").hidden = true; document.querySelector(".auth-guest").hidden = true; }

    function startTimer() {
      let n = 30;
      $("resend").hidden = true; $("resend-wait").hidden = false; $("resend-n").textContent = n;
      clearInterval(timer);
      timer = setInterval(() => {
        n--; $("resend-n").textContent = n;
        if (n <= 0) { clearInterval(timer); $("resend-wait").hidden = true; $("resend").hidden = false; }
      }, 1000);
    }
    function sendCode() {
      code = String(Math.floor(100000 + Math.random() * 900000));
      $("code-to").textContent = phone;
      $("demo-code-value").textContent = code;
      codeIn.value = "";
      mark(codeIn, true);
      startTimer();
    }

    phoneForm.addEventListener("submit", e => {
      e.preventDefault();
      if (!mark(phoneIn, phoneOk(phoneIn.value), PHONE_MSG)) { phoneIn.focus(); return; }
      if (changing) {
        const other = account.find(phoneIn.value);
        if (account.key(phoneIn.value) === account.key(changing.phone)) { mark(phoneIn, false, "هذا رقمك الحالي. اكتب الرقم الجديد."); phoneIn.focus(); return; }
        if (other) { mark(phoneIn, false, "هذا الرقم مسجل في حساب آخر."); phoneIn.focus(); return; }
      }
      phone = phoneIn.value.trim();
      const btn = e.submitter;
      btn?.classList.add("is-loading");
      setTimeout(() => { btn?.classList.remove("is-loading"); sendCode(); show("code"); codeIn.focus(); }, 500);
    });
    phoneIn.addEventListener("input", () => { if (phoneIn.closest(".is-error")) mark(phoneIn, true); });

    codeIn.addEventListener("input", () => {
      codeIn.value = codeIn.value.replace(/\D/g, "").slice(0, 6);
      if (codeIn.closest(".is-error")) mark(codeIn, true);
      if (codeIn.value.length === 6) forms.code.requestSubmit();
    });
    forms.code.addEventListener("submit", e => {
      e.preventDefault();
      if (codeIn.value !== code) {
        mark(codeIn, false, codeIn.value.length < 6 ? "الرمز ستة أرقام." : "الرمز غير صحيح. تأكد منه، أو اطلب رمزا جديدا.");
        codeIn.select();
        return;
      }
      clearInterval(timer);
      if (changing) {
        // The account moves to the new number; old numbers still find its past orders
        const u = account.current();
        const moved = Object.assign({}, u, { phone, oldPhones: [...(u.oldPhones || []), u.phone] });
        account.remove(u);
        account.save(moved);
        account.signIn(moved);
        sessionStorage.setItem("dar-welcome", "phone");
        location.replace(next);
        return;
      }
      const user = account.find(phone);
      if (user) { account.signIn(user); sessionStorage.setItem("dar-welcome", "back"); location.replace(next); return; }
      show("profile");
      $("a-name").focus();
    });
    $("change-phone").addEventListener("click", () => { clearInterval(timer); show("phone"); phoneIn.focus(); phoneIn.select(); });
    $("resend").addEventListener("click", () => { sendCode(); codeIn.focus(); Site.showToast("أرسلنا رمزا جديدا."); });

    forms.profile.addEventListener("submit", e => {
      e.preventDefault();
      const name = $("a-name"), email = $("a-email");
      const bad = [
        [name, name.value.trim().length > 1, "اكتب اسمك."],
        [email, emailOk(email.value.trim()), "أكمل البريد، مثل name@email.com، أو اتركه فارغا."]
      ].filter(([input, ok, msg]) => !mark(input, ok, msg)).map(([input]) => input);
      if (bad.length) { bad[0].focus(); return; }
      const user = account.save({ name: name.value.trim(), phone, email: email.value.trim(), since: new Date().toISOString(), notify: { orders: true, news: $("a-news").checked }, lang: "ar", addresses: [] });
      account.signIn(user);
      sessionStorage.setItem("dar-welcome", "new");
      location.replace(next);
    });

    $("demo-acct").addEventListener("click", () => { demo(); sessionStorage.setItem("dar-welcome", "demo"); location.replace("account.html"); });
  }

  /* ---------- Account ---------- */
  const acct = document.querySelector(".acct");
  if (acct) {
    let user = account.current();
    if (!user) { location.replace("login.html?next=account.html"); return; }
    const byId = Object.fromEntries((window.DAR_ALL_PRODUCTS || []).map(p => [p.id, p]));
    const SHIP = { tr: "توصيل داخل تركيا", intl: "شحن دولي", pickup: "استلام من المركز" };
    const STATUS = { new: "استلمنا طلبك", prep: "قيد التجهيز", ship: "تم الشحن", done: "تم التسليم", cancel: "ملغي" };
    const firstName = () => user.name.split(/\s+/)[0];

    const welcome = sessionStorage.getItem("dar-welcome");
    if (welcome) {
      sessionStorage.removeItem("dar-welcome");
      Site.showToast({ new: `أهلا بك يا ${firstName()}، حسابك جاهز.`, phone: "غيرنا رقم جوالك.", demo: `هذا حساب تجريبي باسم ${user.name}.` }[welcome] || `أهلا بعودتك يا ${firstName()}.`);
    }
    $("acct-h").textContent = `أهلا، ${firstName()}`;
    $("acct-since").textContent = `في دار منذ ${fmtMonth(user.since)}`;
    $("acct-demo").hidden = !user.demo;

    const save = () => { user = account.save(user); counts(); };
    function counts() {
      $("n-orders").textContent = ordersOf(user).length || "";
      $("n-addresses").textContent = (user.addresses || []).length || "";
      $("n-favorites").textContent = Site.favs.get().length || "";
    }
    const empty = (icon, title, text, href, label) =>
      `<div class="acct-empty"><span data-motif="${icon}"></span><b>${title}</b><p>${text}</p><a class="btn" href="${href}">${label}</a></div>`;

    // Same four stops as the tracking page
    function stepItems(o) {
      const pickup = o.ship === "pickup";
      const stops = ["استلمنا طلبك", "نجهز القطع", pickup ? "جاهز للاستلام" : "في الطريق إليك", pickup ? "تم الاستلام" : "وصل"];
      const at = { new: 0, prep: 1, ship: 2, done: 3 }[o.status] ?? -1;
      return stops.map((t, i) => `<li class="${o.status === "done" || i < at ? "is-done" : i === at ? "is-on" : ""}" style="--n:${i}"${i === at && o.status !== "done" ? ' aria-current="step"' : ""}><span class="knot" aria-hidden="true"></span><b>${t}</b></li>`).join("");
    }
    function orderCard(o, withSteps) {
      const total = o.lines.reduce((s, l) => s + (byId[l.pid] ? price(byId[l.pid]) * l.qty : 0), 0);
      const n = o.lines.reduce((s, l) => s + l.qty, 0);
      const thumbs = o.lines.map(l => {
        const p = byId[l.pid]; if (!p) return "";
        const v = (p.variants || []).find(x => x.color === l.variant);
        return `<li><img src="${Site.SM(v ? v.img : p.img)}" alt="${esc(p.name)}${l.qty > 1 ? `، ${l.qty} قطع` : ""}" width="64" height="80" loading="lazy"></li>`;
      }).join("");
      return `<article class="order">
        <div class="order__head"><div><h3><bdi>${esc(o.id)}</bdi></h3><p>${fmtDate(o.date)}، ${SHIP[o.ship] || ""}، ${pieces(n)}</p></div><span class="st st--${o.status}">${STATUS[o.status] || ""}</span></div>
        ${withSteps && o.status !== "cancel" ? `<ol class="tr-steps" aria-label="مراحل الطلب">${stepItems(o)}</ol>` : ""}
        <ul class="thumbs" aria-label="القطع">${thumbs}</ul>
        <div class="order__foot"><span class="total num">${money(total)}<small>سعر تجريبي</small></span><div class="row"><a class="btn btn--quiet" href="track.html?no=${encodeURIComponent(o.id)}">تتبع الطلب</a><button class="btn" type="button" data-reorder="${esc(o.id)}">اطلبها مرة أخرى</button></div></div>
      </article>`;
    }

    function overview() {
      const orders = ordersOf(user);
      $("ov-latest").innerHTML = orders.length
        ? orderCard(orders[0], true)
        : empty("i-box", "لا طلبات بعد", "حين تطلب قطعة برقم جوالك، تظهر هنا مع حالتها.", "shop.html", "تسوق القطع");
      $("ov-tiles").innerHTML = [["orders", orders.length, "الطلبات"], ["addresses", (user.addresses || []).length, "العناوين المحفوظة"], ["favorites", Site.favs.get().length, "المفضلة"]]
        .map(([id, n, label]) => `<a class="tile" href="#${id}" data-go="${id}"><b class="num">${n}</b><span>${label}</span></a>`).join("");
      Dar.mount($("ov-latest"));
    }
    function ordersPanel() {
      const orders = ordersOf(user);
      $("orders-list").innerHTML = orders.length
        ? orders.map(o => orderCard(o, false)).join("")
        : empty("i-box", "لا طلبات بعد", "طلباتك من الموقع برقم جوالك تظهر هنا.", "shop.html", "تسوق القطع");
      Dar.mount($("orders-list"));
    }

    /* Addresses: add, edit, delete with a confirm in place, and one default */
    function addresses(focusSel) {
      const list = user.addresses || [];
      $("addr-list").innerHTML = list.map(a => `
        <article class="addr${a.isDefault ? " is-default" : ""}" data-addr="${a.id}" tabindex="-1" aria-label="${esc(a.label || "عنوان")}">
          <div class="addr__top"><b>${esc(a.label || "عنوان")}</b>${a.isDefault ? '<span class="tag">الافتراضي</span>' : ""}</div>
          <p>${esc(a.name)}، <bdi class="num">${esc(a.phone)}</bdi></p>
          <p>${esc(a.city)}، <bdi>${esc(a.address)}</bdi></p>
          <div class="addr__actions"><button class="link-btn" type="button" data-edit="${a.id}">تعديل</button>${a.isDefault ? "" : `<button class="link-btn" type="button" data-default="${a.id}">اجعله الافتراضي</button>`}<button class="link-btn" type="button" data-del="${a.id}">حذف</button></div>
        </article>`).join("") + '<button class="addr-add" type="button" data-new><span data-motif="i-plus"></span>أضف عنوانا</button>';
      Dar.mount($("addr-list"));
      if (focusSel) $("addr-list").querySelector(focusSel)?.focus();
    }
    function addrForm(a) {
      const isNew = !a.id;
      const f = (id, label, value, extra = "", hint = "") => `<div class="field${id === "address" ? " full" : ""}"><label for="ad-${id}">${label}</label><input id="ad-${id}" value="${esc(value || "")}" ${extra} aria-describedby="ad-${id}-hint"><span class="hint" id="ad-${id}-hint" data-hint>${hint}</span></div>`;
      const req = '<span class="req" aria-hidden="true">*</span>';
      return `<form class="addr-form" data-form="${a.id || ""}" novalidate aria-labelledby="ad-h">
        <h3 id="ad-h" tabindex="-1">${isNew ? "عنوان جديد" : "تعديل العنوان"}</h3>
        <div class="grid">
          ${f("label", "اسم العنوان", a.label, 'placeholder="البيت، العمل"')}
          ${f("name", `اسم المستلم ${req}`, a.name || user.name, 'autocomplete="name" required')}
          ${f("phone", `جوال المستلم ${req}`, a.phone || user.phone, 'type="tel" inputmode="tel" dir="ltr" autocomplete="tel" required')}
          ${f("city", `المدينة ${req}`, a.city, 'autocomplete="address-level2" required')}
          ${f("address", `العنوان ${req}`, a.address, 'autocomplete="street-address" required placeholder="الحي، الشارع، رقم المبنى والشقة"')}
        </div>
        <label class="check"><input class="box" type="checkbox" id="ad-default"${a.isDefault || !(user.addresses || []).length ? " checked" : ""}><span>اجعله العنوان الافتراضي</span></label>
        <div class="row"><button class="btn" type="submit">احفظ العنوان</button><button class="btn btn--quiet" type="button" data-cancel>إلغاء</button></div>
      </form>`;
    }
    const addrList = $("addr-list");
    addrList.addEventListener("click", e => {
      const t = e.target.closest("button"); if (!t) return;
      const list = user.addresses || (user.addresses = []);
      if (t.hasAttribute("data-new")) {
        t.outerHTML = addrForm({});
        $("ad-h").focus();
      } else if (t.dataset.edit) {
        addrList.querySelector(`[data-addr="${t.dataset.edit}"]`).outerHTML = addrForm(list.find(a => a.id === t.dataset.edit));
        $("ad-h").focus();
      } else if (t.hasAttribute("data-cancel")) {
        const id = t.closest("form").dataset.form;
        addresses(id ? `[data-addr="${id}"]` : "[data-new]");
      } else if (t.dataset.default) {
        list.forEach(a => { a.isDefault = a.id === t.dataset.default; });
        save(); addresses(`[data-addr="${t.dataset.default}"]`);
        Site.showToast("صار هذا عنوانك الافتراضي.");
      } else if (t.dataset.del) {
        const actions = t.closest(".addr__actions");
        actions.outerHTML = `<div class="addr__ask" role="group" aria-label="تأكيد حذف العنوان"><span>حذف هذا العنوان؟</span><button class="link-btn" type="button" data-del-yes="${t.dataset.del}">احذف</button><button class="link-btn" type="button" data-del-no="${t.dataset.del}">تراجع</button></div>`;
        addrList.querySelector(`[data-del-no="${t.dataset.del}"]`).focus();
      } else if (t.dataset.delNo) {
        addresses(`[data-addr="${t.dataset.delNo}"]`);
      } else if (t.dataset.delYes) {
        const gone = list.find(a => a.id === t.dataset.delYes);
        user.addresses = list.filter(a => a !== gone);
        if (gone?.isDefault && user.addresses[0]) user.addresses[0].isDefault = true;
        save(); addresses(user.addresses[0] ? `[data-addr="${user.addresses[0].id}"]` : "[data-new]");
        Site.showToast("حذفنا العنوان.");
      }
    });
    addrList.addEventListener("submit", e => {
      e.preventDefault();
      const form = e.target, v = id => $(`ad-${id}`).value.trim();
      const bad = [
        ["name", v("name").length > 1, "اكتب اسم المستلم."],
        ["phone", phoneOk(v("phone")), PHONE_MSG],
        ["city", v("city").length > 1, "اكتب المدينة."],
        ["address", v("address").length > 5, "اكتب الحي والشارع ورقم المبنى."]
      ].filter(([id, ok, msg]) => !mark($(`ad-${id}`), ok, msg));
      if (bad.length) { $(`ad-${bad[0][0]}`).focus(); return; }
      const list = user.addresses || (user.addresses = []);
      let a = list.find(x => x.id === form.dataset.form);
      if (!a) { a = { id: `a${Date.now().toString(36)}` }; list.push(a); }
      Object.assign(a, { label: v("label") || "عنوان", name: v("name"), phone: v("phone"), city: v("city"), address: v("address") });
      if ($("ad-default").checked || !list.some(x => x.isDefault && x !== a)) list.forEach(x => { x.isDefault = x === a; });
      save(); addresses(`[data-addr="${a.id}"]`);
      Site.showToast("حفظنا العنوان.");
    });
    addrList.addEventListener("input", e => { if (e.target.closest(".is-error")) mark(e.target, true); });

    /* Favourites: the same cards as the shop; un-hearting one here takes it off the list */
    function favorites() {
      const list = Site.favs.get().map(id => (window.DAR_PRODUCTS || []).find(p => p.id === id)).filter(Boolean);
      $("fav-list").innerHTML = list.length
        ? `<div class="products">${list.map((p, i) => Site.card(p, i)).join("")}</div>`
        : empty("i-heart", "لا قطع في المفضلة", "اضغط القلب على أي قطعة لتحفظها هنا.", "shop.html", "تصفح المتجر");
      Dar.mount($("fav-list"));
      Site.observe($("fav-list"));
    }
    $("fav-list").addEventListener("click", e => {
      if (!e.target.closest("[data-fav]")) return;
      setTimeout(() => { favorites(); counts(); $("favorites-h").focus({ preventScroll: true }); }, 350);
    });

    /* Details */
    function profile() {
      $("p-name").value = user.name;
      $("p-email").value = user.email || "";
      $("p-phone").textContent = user.phone;
      $("p-notify-orders").checked = user.notify?.orders !== false;
      $("p-notify-news").checked = !!user.notify?.news;
      $("p-lang").value = user.lang || "ar";
    }
    $("profile-form").addEventListener("submit", e => {
      e.preventDefault();
      const name = $("p-name"), email = $("p-email"), err = $("profile-error");
      const bad = [
        [name, name.value.trim().length > 1, "اكتب اسمك."],
        [email, emailOk(email.value.trim()), "أكمل البريد، مثل name@email.com، أو اتركه فارغا."]
      ].filter(([input, ok, msg]) => !mark(input, ok, msg)).map(([input]) => input);
      if (bad.length) { err.hidden = false; err.textContent = bad.length === 1 ? "حقل واحد يحتاج تصحيحا. الملاحظة مكتوبة تحته." : "حقلان يحتاجان تصحيحا. الملاحظة مكتوبة تحت كل حقل."; bad[0].focus(); return; }
      err.hidden = true;
      Object.assign(user, { name: name.value.trim(), email: email.value.trim(), lang: $("p-lang").value, notify: { orders: $("p-notify-orders").checked, news: $("p-notify-news").checked } });
      save();
      $("acct-h").textContent = `أهلا، ${firstName()}`;
      document.getElementById("acct-btn").setAttribute("aria-label", `حسابي، ${user.name}`);
      Site.showToast("حفظنا بياناتك.");
    });
    $("profile-form").addEventListener("input", e => { if (e.target.closest(".is-error")) mark(e.target, true); });

    const dangerActions = $("danger-actions"), askHTML = dangerActions.innerHTML;
    $("danger").addEventListener("click", e => {
      const id = e.target.closest("button")?.id;
      if (id === "del-ask") {
        dangerActions.innerHTML = '<span>لا يمكن التراجع عن الحذف.</span><button class="btn btn--danger" type="button" id="del-yes">احذف حسابي</button><button class="btn btn--quiet" type="button" id="del-no">تراجع</button>';
        $("del-no").focus();
      } else if (id === "del-no") {
        dangerActions.innerHTML = askHTML;
        $("del-ask").focus();
      } else if (id === "del-yes") {
        account.remove(user);
        location.replace("index.html");
      }
    });
    $("sign-out").addEventListener("click", () => { account.signOut(); location.replace("index.html"); });

    /* Re-order: the pieces of an order go back into the cart */
    acct.addEventListener("click", e => {
      const r = e.target.closest("[data-reorder]"); if (!r) return;
      const o = ordersOf(user).find(x => x.id === r.dataset.reorder); if (!o) return;
      const items = Site.cart.get();
      let added = 0;
      o.lines.forEach(l => {
        const p = byId[l.pid]; if (!p || p.status === "draft") return;
        const variant = l.variant || "";
        const hit = items.find(i => i.pid === l.pid && i.variant === variant);
        if (hit) hit.qty = Math.min(9, hit.qty + l.qty); else items.push({ pid: l.pid, variant, qty: l.qty });
        added++;
      });
      Site.cart.set(items);
      Site.showToast(added ? "أضفنا قطع الطلب إلى سلتك." : "قطع هذا الطلب لم تعد متاحة.", added ? "عرض السلة" : "", "cart.html");
    });

    /* Sections: one shows at a time, the address bar remembers which */
    const tabs = [...document.querySelectorAll("[data-tab]")];
    const render = { overview, orders: ordersPanel, addresses: () => addresses(), favorites, profile };
    function route(focus) {
      const key = render[location.hash.slice(1)] ? location.hash.slice(1) : "overview";
      document.querySelectorAll(".panel").forEach(p => { p.hidden = p.id !== key; });
      tabs.forEach(t => { if (t.dataset.tab === key) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current"); });
      render[key]();
      counts();
      if (focus) $(`${key}-h`).focus({ preventScroll: true });
      const nav = tabs[0].parentElement, tab = tabs.find(t => t.dataset.tab === key);
      if (nav.scrollWidth > nav.clientWidth) nav.scrollLeft = tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2;
    }
    acct.addEventListener("click", e => {
      const a = e.target.closest("a[href^='#']");
      if (!a || !render[a.getAttribute("href").slice(1)]) return;
      e.preventDefault();
      history.pushState(null, "", a.getAttribute("href"));
      route(true);
      const top = acct.getBoundingClientRect().top + scrollY - 110;
      if (scrollY > top) scrollTo({ top, behavior: Site.reduce ? "auto" : "smooth" });
    });
    addEventListener("popstate", () => route(true));
    route(false);
  }

  Dar.mount();
  Site.observe();
})();
