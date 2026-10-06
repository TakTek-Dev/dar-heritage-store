/* DAR dashboard preview. Everything is saved in this browser (localStorage) so the
   storefront in the same browser reflects it; the real backend replaces this store. */
(function () {
  const $ = s => document.getElementById(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const IMG = id => `../assets/img/dar/${id}.webp`;
  const SM = id => `../assets/img/dar/${id}-480.webp`;
  const money = n => `${Math.round(n).toLocaleString("en-US")} ₺`;
  const DEMO_PRICE = { wear: 2400, bags: 850, kufiya: 450, wall: 650, jewel: 350, home: 550 };
  const catName = id => (DAR_CATS.find(c => c.id === id) || {}).name || "";

  /* ---------- Store ---------- */
  const KEY = "dar-admin";
  let state;
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { state = {}; }
  state.products ||= {}; state.settings ||= {}; state.content ||= {};
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { toast("تعذر الحفظ في هذا المتصفح"); } };

  // The editable product list: catalogue + saved edits, drafts included
  const products = () => DAR_ALL_PRODUCTS.map(p => Object.assign({}, p, state.products[p.id] || {}));
  const product = id => products().find(p => p.id === id);
  const saveProduct = (id, patch) => { state.products[id] = Object.assign({}, state.products[id], patch); persist(); };
  const unit = p => +p.price || DEMO_PRICE[p.cat];

  /* ---------- Demo orders: generated once, clearly labelled, statuses persist ---------- */
  if (!state.orders) {
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const people = [["سارة أحمد", "إسطنبول"], ["Ayşe Yılmaz", "أنقرة"], ["محمد الخطيب", "إسطنبول"], ["Fatma Demir", "بورصة"], ["ليلى حسن", "غازي عنتاب"], ["Mehmet Kaya", "إسطنبول"], ["نور الهدى", "الرياض"], ["Zeynep Arslan", "إزمير"], ["رنا عبد الله", "إسطنبول"], ["Emre Çelik", "قونية"], ["هبة يوسف", "برلين"], ["Elif Şahin", "إسطنبول"], ["عمر سليم", "عمان"], ["Hatice Öztürk", "قيصري"], ["دينا مصطفى", "إسطنبول"], ["Ali Koç", "أنطاليا"]];
    const flow = ["new", "new", "new", "prep", "prep", "ship", "ship", "done", "done", "done", "done", "done", "done", "cancel", "done", "done"];
    const all = DAR_ALL_PRODUCTS;
    const today = new Date(); today.setHours(12, 0, 0, 0);
    state.orders = people.map(([name, city], i) => {
      const lines = Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => ({ pid: all[Math.floor(rnd() * all.length)].id, qty: 1 + Math.floor(rnd() * 2) }));
      const d = new Date(today); d.setDate(d.getDate() - Math.floor(i * .9 + rnd() * 1.5));
      return {
        id: `DAR-2026-${String(1051 - i)}`, name, city, lines,
        channel: rnd() > .45 ? "web" : "wa", pay: city === "إسطنبول" && rnd() > .6 ? "bank" : "card",
        ship: city === "إسطنبول" && rnd() > .7 ? "pickup" : ["الرياض", "برلين", "عمان"].includes(city) ? "intl" : "tr",
        status: flow[i], date: d.toISOString(), phone: `+90 5${Math.floor(10 + rnd() * 89)} ••• •• ${Math.floor(10 + rnd() * 89)}`
      };
    });
    persist();
  }
  const orderTotal = o => o.lines.reduce((s, l) => { const p = product(l.pid); return s + (p ? unit(p) * l.qty : 0); }, 0) + (o.ship === "tr" ? +(state.settings.shipTr || 120) : 0);
  const STATUS = { new: "جديد", prep: "قيد التجهيز", ship: "تم الشحن", done: "تم التسليم", cancel: "ملغي" };
  const stLabel = s => `<span class="st st--${s}">${STATUS[s]}</span>`;
  const fmtDate = iso => new Date(iso).toLocaleDateString("ar-EG-u-nu-latn", { day: "numeric", month: "short" });
  const chan = c => c === "wa" ? '<span class="chan"><span data-motif="i-chat"></span>واتساب</span>' : '<span class="chan"><span data-motif="i-bag"></span>الموقع</span>';

  /* ---------- Toast ---------- */
  const slot = $("toast-slot");
  let tTimer;
  function toast(text) {
    slot.inert = false;
    slot.innerHTML = `<div class="toast"><span data-motif="starlet" data-mode="cross"></span><span>${text}</span></div>`;
    Dar.mount(slot);
    slot.classList.add("is-on");
    clearTimeout(tTimer);
    tTimer = setTimeout(() => { slot.classList.remove("is-on"); slot.inert = true; }, 3200);
  }
  slot.inert = true;

  /* ---------- Launch readiness, computed from the data ---------- */
  function readiness() {
    const ps = products();
    const priced = ps.filter(p => +p.price > 0).length;
    const named = ps.filter(p => p.nameTr && p.nameEn).length;
    const s = state.settings;
    return [
      { done: priced === ps.length, title: "أسعار المنتجات", note: `${priced} من ${ps.length} قطعة لها سعر`, ratio: priced / ps.length, go: "#products?f=noprice" },
      { done: named === ps.length, title: "الأسماء بالتركية والإنجليزية", note: `${named} من ${ps.length} قطعة مترجمة`, ratio: named / ps.length, go: "#products" },
      { done: !!s.address, title: "العنوان المعتمد للمركز", note: s.address ? "تم الاختيار" : "إنستغرام ولينكتري يذكران عنوانين مختلفين", go: "#settings" },
      { done: !!s.gateway, title: "بوابة الدفع", note: s.gateway ? s.gateway : "لم تختر بعد", go: "#settings" },
      { done: !!s.shipTr, title: "أسعار الشحن", note: s.shipTr ? `داخل تركيا ${money(s.shipTr)}` : "غير محددة", go: "#settings" },
      { done: !!(s.policyReturns && s.policyTerms), title: "شروط البيع وسياسة الإرجاع", note: s.policyReturns && s.policyTerms ? "مكتوبة" : "مطلوبة قبل قبول الدفع", go: "#settings" }
    ];
  }

  /* ---------- Views ---------- */
  const views = {
    overview() {
      const tasks = readiness();
      const doneN = tasks.filter(t => t.done).length;
      const orders = state.orders;
      const week = orders.filter(o => Date.now() - new Date(o.date) < 7 * 864e5 && o.status !== "cancel");
      const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 13 + i); return d; });
      const perDay = days.map(d => orders.filter(o => new Date(o.date).toDateString() === d.toDateString()).length);
      const max = Math.max(2, ...perDay);
      return `
      <div class="panel">
        <div class="panel__head"><div><h2>جاهزية الإطلاق</h2><p>ما يحتاجه المتجر قبل استقبال أول طلب حقيقي</p></div></div>
        <div class="panel__body ready">
          <div class="ready__score"><span id="ready-star" data-motif="star" data-mode="cross" data-order="radial" aria-hidden="true"></span><b class="num">${doneN} من ${tasks.length}</b><small>مهام مكتملة</small></div>
          <ul class="tasks">${tasks.map(t => `
            <li class="${t.done ? "is-done" : ""}">
              <span class="tick">${t.done ? '<span data-motif="i-check"></span>' : ""}</span>
              <span><b>${t.title}</b><small>${t.note}</small>${t.ratio !== undefined && !t.done ? `<span class="bar"><i style="width:${Math.round(t.ratio * 100)}%"></i></span>` : ""}</span>
              ${t.done ? "" : `<a class="btn btn--quiet" href="${t.go}" aria-label="أكمل: ${t.title}">أكمل</a>`}
            </li>`).join("")}
          </ul>
        </div>
      </div>

      <div class="stats" role="group" aria-label="مؤشرات تجريبية">
        <div class="stat"><span>طلبات جديدة</span><b class="num">${orders.filter(o => o.status === "new").length}</b><small class="demo">تجريبي</small></div>
        <div class="stat"><span>بانتظار التجهيز</span><b class="num">${orders.filter(o => o.status === "prep").length}</b><small class="demo">تجريبي</small></div>
        <div class="stat"><span>مبيعات آخر 7 أيام</span><b class="num">${money(week.reduce((s, o) => s + orderTotal(o), 0))}</b><small class="demo">تجريبي</small></div>
        <div class="stat"><span>طلبات واتساب</span><b class="num">${Math.round(orders.filter(o => o.channel === "wa").length / orders.length * 100)}%</b><small class="demo">تجريبي</small></div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel__head"><div><h2>الطلبات اليومية</h2><p>آخر 14 يوما</p></div><span class="demo">بيانات تجريبية</span></div>
          <div class="panel__body">
            <div class="chart" role="img" aria-label="عدد الطلبات في آخر 14 يوما: ${perDay.join("، ")}">
              <div class="chart-grid" style="inset-block-start:0"><span class="num">${max}</span></div>
              <div class="chart-grid" style="inset-block-start:50%"><span class="num">${Math.round(max / 2)}</span></div>
              ${perDay.map((n, i) => `<div class="col" aria-hidden="true"><i style="height:${n / max * 100}%"></i><span class="tip">${fmtDate(days[i].toISOString())}، ${n} ${n === 1 ? "طلب" : "طلبات"}</span></div>`).join("")}
            </div>
            <div class="chart-x num" aria-hidden="true">${days.map((d, i) => `<span>${i % 2 ? "" : d.getDate()}</span>`).join("")}</div>
          </div>
        </div>
        <div class="panel">
          <div class="panel__head"><h2>أحدث الطلبات</h2><a class="thread" href="#orders">كل الطلبات</a></div>
          <div class="table-wrap"><table class="t"><tbody>
            <caption class="sr-only">أحدث خمسة طلبات</caption><thead class="sr-only"><tr><th>الطلب</th><th>الحالة</th><th>الإجمالي</th></tr></thead>
            ${orders.slice(0, 5).map(o => `<tr class="is-click" data-order="${o.id}"><td><button class="link-btn num" type="button" data-open="${o.id}">${o.id.slice(-4)}</button><br><small style="color:var(--muted)">${esc(o.name)}</small></td><td>${stLabel(o.status)}</td><td class="num">${money(orderTotal(o))}</td></tr>`).join("")}
          </tbody></table></div>
        </div>
      </div>`;
    },

    orders(params) {
      const f = params.get("f") || "all";
      const q = (params.get("q") || "").trim();
      const counts = Object.fromEntries(Object.keys(STATUS).map(k => [k, state.orders.filter(o => o.status === k).length]));
      const list = state.orders.filter(o => (f === "all" || o.status === f) && (!q || (o.id + o.name + o.city).toLowerCase().includes(q.toLowerCase())));
      return `
      <div class="bar-tools">
        <div class="seg" role="group" aria-label="حالة الطلب">
          <button type="button" data-f="all" aria-pressed="${f === "all"}">الكل <span class="n">${state.orders.length}</span></button>
          ${Object.entries(STATUS).map(([k, v]) => `<button type="button" data-f="${k}" aria-pressed="${f === k}">${v} <span class="n">${counts[k]}</span></button>`).join("")}
        </div>
        <label class="search" style="margin-inline-start:auto"><span data-motif="i-search"></span><input type="search" id="order-q" placeholder="رقم الطلب أو اسم العميل" value="${esc(q)}" aria-label="ابحث في الطلبات"></label>
        <span class="demo">طلبات تجريبية</span>
      </div>
      <div class="panel"><div class="table-wrap">
        ${list.length ? `<table class="t">
          <thead><tr><th>الطلب</th><th>العميل</th><th class="hide-sm">القطع</th><th class="hide-sm">القناة</th><th class="hide-sm">الدفع</th><th>الحالة</th><th>الإجمالي</th><th class="hide-sm">التاريخ</th></tr></thead>
          <tbody>${list.map(o => `<tr class="is-click" data-order="${o.id}">
            <td class="num"><button class="link-btn" type="button" data-open="${o.id}" aria-label="افتح الطلب ${o.id}"><span class="hide-sm">DAR-2026-</span>${o.id.slice(-4)}</button></td>
            <td><b>${esc(o.name)}</b><br><small style="color:var(--muted)">${esc(o.city)}</small></td>
            <td class="hide-sm num">${o.lines.reduce((s, l) => s + l.qty, 0)}</td>
            <td class="hide-sm">${chan(o.channel)}</td>
            <td class="hide-sm">${o.pay === "card" ? "بطاقة" : "تحويل بنكي"}</td>
            <td>${stLabel(o.status)}</td>
            <td class="num">${money(orderTotal(o))}</td>
            <td class="hide-sm num">${fmtDate(o.date)}</td>
          </tr>`).join("")}</tbody></table>` : `<div class="empty-t"><span data-motif="starlet" data-mode="cross"></span><b>لا طلبات بهذه الحالة</b></div>`}
      </div></div>`;
    },

    products(params) {
      const f = params.get("f") || "all";
      const cat = params.get("cat") || "";
      const q = (params.get("q") || "").trim();
      const all = products();
      const list = all.filter(p =>
        (f === "all" || (f === "noprice" && !(+p.price > 0)) || (f === "draft" && p.status === "draft")) &&
        (!cat || p.cat === cat) && (!q || (p.name + (p.code || "")).includes(q)));
      const noPrice = all.filter(p => !(+p.price > 0)).length;
      return `
      <div class="bar-tools">
        <div class="seg" role="group" aria-label="تصفية المنتجات">
          <button type="button" data-f="all" aria-pressed="${f === "all"}">الكل <span class="n">${all.length}</span></button>
          <button type="button" data-f="noprice" aria-pressed="${f === "noprice"}">بلا سعر <span class="n">${noPrice}</span></button>
          <button type="button" data-f="draft" aria-pressed="${f === "draft"}">مسودة <span class="n">${all.filter(p => p.status === "draft").length}</span></button>
        </div>
        <select class="select" id="prod-cat" aria-label="المجموعة"><option value="">كل المجموعات</option>${DAR_CATS.map(c => `<option value="${c.id}"${c.id === cat ? " selected" : ""}>${c.name}</option>`).join("")}</select>
        <label class="search" style="margin-inline-start:auto"><span data-motif="i-search"></span><input type="search" id="prod-q" placeholder="اسم القطعة أو الكود" value="${esc(q)}" aria-label="ابحث في المنتجات"></label>
      </div>
      <p style="color:var(--muted)">اكتب السعر والمخزون مباشرة في الجدول، ويحفظ كل تغيير فورا ويظهر في المتجر.</p>
      <div class="panel"><div class="table-wrap">
        ${list.length ? `<table class="t" id="prod-table">
          <thead><tr><th><span class="sr-only">الصورة</span></th><th>القطعة</th><th class="hide-sm">المجموعة</th><th>السعر ₺</th><th class="hide-sm">المخزون</th><th>منشور</th><th><span class="sr-only">تعديل</span></th></tr></thead>
          <tbody>${list.map(p => `<tr data-id="${p.id}">
            <td><img class="thumb${p.dark ? " is-dark" : ""}" src="${SM(p.img)}" alt="" width="44" height="55"${list.indexOf(p) > 11 ? ' loading="lazy"' : ""}></td>
            <td class="name">${esc(p.name)}<small class="num">${p.code ? `كود ${p.code}` : "بلا كود"}${p.nameTr ? "، مترجمة" : ""}</small></td>
            <td class="hide-sm">${catName(p.cat)}</td>
            <td><input class="cell num${+p.price > 0 ? "" : " is-empty"}" type="number" min="0" step="10" inputmode="numeric" data-field="price" value="${+p.price > 0 ? p.price : ""}" placeholder="أضف السعر" aria-label="سعر ${esc(p.name)}"></td>
            <td class="hide-sm"><input class="cell cell--sm num" type="number" min="0" inputmode="numeric" data-field="stock" value="${p.stock ?? ""}" placeholder="عدد" aria-label="مخزون ${esc(p.name)}"></td>
            <td><label class="switch"><input type="checkbox" data-field="status" ${p.status === "draft" ? "" : "checked"} aria-label="نشر ${esc(p.name)}"></label></td>
            <td><a class="btn btn--quiet" href="#product/${p.id}">تعديل</a></td>
          </tr>`).join("")}</tbody></table>` : `<div class="empty-t"><span data-motif="starlet" data-mode="cross"></span><b>${f === "noprice" ? "كل القطع لها أسعار" : "لا نتائج"}</b></div>`}
      </div></div>`;
    },

    product(params, id) {
      const p = product(id);
      if (!p) return `<div class="empty-t"><b>لم نجد هذه القطعة</b><a class="btn" href="#products">عد إلى المنتجات</a></div>`;
      const shots = [...new Set([p.img, ...(p.gallery || []), ...(p.variants || []).map(v => v.img)])];
      return `
      <form class="grid-2 grid-2--editor" id="prod-form" data-id="${p.id}">
        <div class="form">
          <div class="panel"><div class="panel__body">
            <div class="lang-tabs" role="tablist" aria-label="لغة المحتوى">
              <button type="button" role="tab" id="tab-ar" aria-controls="pane-ar" aria-selected="true" data-lang="ar">العربية</button>
              <button type="button" role="tab" id="tab-tr" aria-controls="pane-tr" aria-selected="false" tabindex="-1" data-lang="tr"><span lang="tr">Türkçe</span> ${p.nameTr ? "" : '<span class="miss">ناقص</span>'}</button>
              <button type="button" role="tab" id="tab-en" aria-controls="pane-en" aria-selected="false" tabindex="-1" data-lang="en"><span lang="en">English</span> ${p.nameEn ? "" : '<span class="miss">ناقص</span>'}</button>
            </div>
            <div class="form" data-pane="ar" id="pane-ar" role="tabpanel" aria-labelledby="tab-ar">
              <label class="f"><span>اسم القطعة</span><input name="name" value="${esc(p.name)}" required></label>
              <label class="f"><span>الوصف</span><textarea name="desc">${esc(p.desc)}</textarea></label>
            </div>
            <div class="form" data-pane="tr" id="pane-tr" role="tabpanel" aria-labelledby="tab-tr" lang="tr" hidden>
              <label class="f"><span>Ürün adı</span><input name="nameTr" dir="ltr" lang="tr" value="${esc(p.nameTr)}"></label>
              <label class="f"><span>Açıklama</span><textarea name="descTr" dir="ltr" lang="tr">${esc(p.descTr)}</textarea></label>
            </div>
            <div class="form" data-pane="en" id="pane-en" role="tabpanel" aria-labelledby="tab-en" lang="en" hidden>
              <label class="f"><span>Product name</span><input name="nameEn" dir="ltr" lang="en" value="${esc(p.nameEn)}"></label>
              <label class="f"><span>Description</span><textarea name="descEn" dir="ltr" lang="en">${esc(p.descEn)}</textarea></label>
            </div>
          </div></div>

          <div class="panel"><div class="panel__head"><div><h2>حكاية النقشة</h2><p>تظهر في صفحة المنتج تحت الوصف. هذا ما يميز قطعة دار عن غيرها.</p></div></div>
            <div class="panel__body form-grid">
              <label class="f"><span>المدينة أو القرية</span><input name="origin" value="${esc(p.origin)}" placeholder="مثلا: الخليل"></label>
              <label class="f"><span>اسم النقشة</span><input name="motif" value="${esc(p.motif)}" placeholder="مثلا: السرو"></label>
              <label class="f full"><span>المعنى والحكاية</span><textarea name="story" placeholder="ماذا تعني النقشة، ومن أين جاءت">${esc(p.story)}</textarea></label>
            </div>
          </div>

          <div class="panel"><div class="panel__head"><div><h2>الصور</h2><p>الصورة الأولى هي صورة البطاقة في المتجر</p></div></div>
            <div class="panel__body imgs">
              ${shots.map((s, i) => `<figure class="${p.dark ? "is-dark" : ""}"><img src="${SM(s)}" alt="">${i === 0 ? "<span>الرئيسية</span>" : ""}</figure>`).join("")}
              <label class="drop"><span data-motif="i-upload"></span>أضف صورة<small>تحفظ بعد ربط الخادم</small><input type="file" accept="image/*" class="sr-only" id="img-up"></label>
            </div>
          </div>
        </div>

        <div class="form editor-side">
          <div class="panel"><div class="panel__body form">
            <label class="switch"><input type="checkbox" name="live" ${p.status === "draft" ? "" : "checked"}><span>منشور في المتجر</span></label>
            <div class="form-grid">
              <label class="f"><span>السعر ₺</span><input name="price" type="number" min="0" step="10" inputmode="numeric" value="${+p.price > 0 ? p.price : ""}" placeholder="مطلوب" class="num"></label>
              <label class="f"><span>المخزون</span><input name="stock" type="number" min="0" inputmode="numeric" value="${p.stock ?? ""}" class="num"></label>
            </div>
            <label class="f"><span>الكود</span><input name="code" value="${esc(p.code)}" dir="ltr" class="num"></label>
            <label class="f"><span>المجموعة</span><select name="cat">${DAR_CATS.map(c => `<option value="${c.id}"${c.id === p.cat ? " selected" : ""}>${c.name}</option>`).join("")}</select></label>
            <label class="f"><span>الصنعة</span><select name="craft"><option value="">غير محدد</option>${Object.entries(DAR_CRAFT).map(([k, v]) => `<option value="${k}"${k === p.craft ? " selected" : ""}>${v}</option>`).join("")}</select></label>
            <fieldset class="f" style="border:0;padding:0;margin:0"><span>الألوان</span><div class="chips">${Object.entries(DAR_COLORS).map(([k, c]) => `<label><input class="box" type="checkbox" name="colors" value="${k}"${(p.colors || []).includes(k) ? " checked" : ""}><i style="--c:${c.hex}"></i>${c.name}</label>`).join("")}</div></fieldset>
          </div></div>
          <a class="btn btn--quiet" href="../product.html?id=${p.id}" target="_blank" rel="noopener"><span data-motif="i-eye"></span>عرض في المتجر</a>
        </div>
      </form>
      <div class="savebar" id="savebar"><span role="status">تعديلات غير محفوظة</span><span class="row"><button class="btn btn--quiet" type="button" data-discard>تجاهل</button><button class="btn btn--henna" type="button" data-save>حفظ</button></span></div>`;
    },

    content() {
      const c = state.content;
      const quiz = c.quiz || { q: "أي مدينة تلقب بعاصمة فلسطين الاقتصادية؟", opts: ["غزة", "نابلس", "عكا"], right: 1, hint: "تشتهر بالكنافة وصناعة الصابون." };
      const featured = c.featured || ["jacket-blue", "velvet-wallet", "earrings-map", "shoulder-miras", "kufiya", "cups-olive", "hoop-hand", "minibag"];
      return `
      <form class="form" id="settings-form" data-scope="content">
        <div class="panel"><div class="panel__head"><div><h2>الواجهة الرئيسية</h2><p>العنوان الكبير وما تحته</p></div></div>
          <div class="panel__body form-grid">
            <label class="f"><span>السطر الأول</span><input name="hero1" value="${esc(c.hero1 ?? "حكاية وطن")}"></label>
            <label class="f"><span>السطر الثاني، بلون الحناء</span><input name="hero2" value="${esc(c.hero2 ?? "تروى بالحرفة")}"></label>
            <label class="f full"><span>النص تحت العنوان</span><textarea name="heroSub">${esc(c.heroSub ?? "وتقدم بقيمة، وتعاش في الحاضر. قطع مطرزة وأزياء وهدايا تراثية، يذهب عائدها لدعم مشاريع في غزة، خاصة للنساء والأطفال.")}</textarea></label>
          </div>
        </div>
        <div class="panel"><div class="panel__head"><div><h2>سؤال الأسبوع</h2><p>نفس سؤال إنستغرام، يظهر في الرئيسية</p></div></div>
          <div class="panel__body form-grid">
            <label class="f full"><span>السؤال</span><input name="quizQ" value="${esc(quiz.q)}"></label>
            ${quiz.opts.map((o, i) => `<label class="f"><span>الخيار ${"ABC"[i]}</span><input name="quizO${i}" value="${esc(o)}"></label>`).join("")}
            <fieldset class="f" style="border:0;padding:0;margin:0"><span>الجواب الصحيح</span><div class="chips">${[0, 1, 2].map(i => `<label><input class="radio" type="radio" name="quizRight" value="${i}"${quiz.right === i ? " checked" : ""}>${"ABC"[i]}</label>`).join("")}</div></fieldset>
            <label class="f full"><span>التلميح</span><input name="quizHint" value="${esc(quiz.hint)}"></label>
          </div>
        </div>
        <div class="panel"><div class="panel__head"><div><h2>مختارات الرئيسية</h2><p>اختر 8 قطع تظهر تحت عنوان قطع من دار</p></div><span class="num" id="feat-n">${featured.length} من 8</span></div>
          <div class="panel__body chips">${products().map(p => `<label><input class="box" type="checkbox" name="featured" value="${p.id}"${featured.includes(p.id) ? " checked" : ""}>${esc(p.name)}</label>`).join("")}</div>
        </div>
      </form>
      <div class="savebar" id="savebar"><span role="status">تعديلات غير محفوظة</span><span class="row"><button class="btn btn--quiet" type="button" data-discard>تجاهل</button><button class="btn btn--henna" type="button" data-save>حفظ</button></span></div>`;
    },

    settings() {
      const s = state.settings;
      const sw = (name, on, label) => `<label class="switch"><input type="checkbox" name="${name}"${on ? " checked" : ""}><span>${label}</span></label>`;
      return `
      <form class="form" id="settings-form" data-scope="settings">
        <div class="panel"><div class="panel__head"><div><h2>المركز والتواصل</h2><p>يظهر في الفوتر وصفحة زورونا والدفع</p></div></div>
          <div class="panel__body form-grid">
            <fieldset class="f full" style="border:0;padding:0;margin:0"><span>العنوان المعتمد</span><small>إنستغرام ولينكتري يذكران عنوانين مختلفين. اختر الصحيح.</small>
              <div class="chips" style="margin-block-start:6px">
                <label><input class="radio" type="radio" name="address" value="Altın Sk. No:11/A، Bahçelievler، إسطنبول"${s.address?.startsWith("Altın") ? " checked" : ""}>Altın Sk. No:11/A، Bahçelievler</label>
                <label><input class="radio" type="radio" name="address" value="Halıcılar Cd. No:12، Akşemsettin، Fatih، إسطنبول"${s.address?.startsWith("Halıcılar") ? " checked" : ""}>Halıcılar Cd. No:12، Fatih</label>
              </div></fieldset>
            <label class="f"><span>رقم واتساب</span><input name="whatsapp" dir="ltr" value="${esc(s.whatsapp ?? "+90 553 828 62 35")}"></label>
            <label class="f"><span>البريد الإلكتروني</span><input name="email" type="email" dir="ltr" value="${esc(s.email)}" placeholder="info@..."></label>
            <label class="f full"><span>مواعيد الزيارة</span><input name="hours" value="${esc(s.hours)}" placeholder="مثلا: يوميا من 10 صباحا إلى 7 مساء"></label>
          </div>
        </div>
        <div class="panel"><div class="panel__head"><div><h2>الشحن</h2><p>يستخدم في صفحة الدفع</p></div></div>
          <div class="panel__body form-grid">
            <label class="f"><span>الشحن داخل تركيا ₺</span><input name="shipTr" type="number" min="0" inputmode="numeric" class="num" value="${esc(s.shipTr)}" placeholder="مطلوب"></label>
            <label class="f"><span>شحن مجاني فوق ₺</span><input name="freeOver" type="number" min="0" inputmode="numeric" class="num" value="${esc(s.freeOver)}" placeholder="اختياري"></label>
            <div class="f full" style="display:flex;gap:var(--s4);flex-wrap:wrap">${sw("intl", s.intl ?? true, "الشحن الدولي")}${sw("pickup", s.pickup ?? true, "الاستلام من المركز")}</div>
          </div>
        </div>
        <div class="panel"><div class="panel__head"><div><h2>الدفع</h2><p>بيانات البطاقة تدخل في صفحة البوابة الآمنة، لا في موقع دار</p></div></div>
          <div class="panel__body form-grid">
            <label class="f"><span>بوابة الدفع بالبطاقة</span><select name="gateway"><option value="">لم تختر بعد</option>${["iyzico", "PayTR", "Param", "Sipay"].map(g => `<option${s.gateway === g ? " selected" : ""}>${g}</option>`).join("")}</select><small>المفاتيح السرية تحفظ في الخادم فقط</small></label>
            <div class="f" style="align-content:end">${sw("bank", s.bank ?? true, "التحويل البنكي")}${sw("cod", s.cod, "الدفع عند الاستلام")}</div>
            <label class="f"><span>اسم البنك</span><input name="bankName" value="${esc(s.bankName)}"></label>
            <label class="f"><span>IBAN</span><input name="iban" dir="ltr" value="${esc(s.iban)}" placeholder="TR00 0000 0000 0000 0000 0000 00"></label>
          </div>
        </div>
        <div class="panel"><div class="panel__head"><div><h2>السياسات</h2><p>مطلوبة قانونيا قبل قبول الدفع الإلكتروني</p></div></div>
          <div class="panel__body form">
            <label class="f"><span>الشحن والتوصيل</span><textarea name="policyShipping">${esc(s.policyShipping)}</textarea></label>
            <label class="f"><span>الإرجاع والاستبدال</span><textarea name="policyReturns">${esc(s.policyReturns)}</textarea></label>
            <label class="f"><span>شروط البيع</span><textarea name="policyTerms">${esc(s.policyTerms)}</textarea></label>
          </div>
        </div>
        <div class="panel"><div class="panel__head"><div><h2>اللغات</h2><p>العربية أساسية دائما</p></div></div>
          <div class="panel__body" style="display:flex;gap:var(--s4);flex-wrap:wrap">${sw("langAr", true, "العربية").replace("<input", "<input disabled")}${sw("langTr", s.langTr ?? true, "Türkçe")}${sw("langEn", s.langEn ?? true, "English")}</div>
        </div>
      </form>
      <div class="savebar" id="savebar"><span role="status">تعديلات غير محفوظة</span><span class="row"><button class="btn btn--quiet" type="button" data-discard>تجاهل</button><button class="btn btn--henna" type="button" data-save>حفظ</button></span></div>`;
    }
  };

  const titles = { overview: "الرئيسية", orders: "الطلبات", products: "المنتجات", product: "تعديل قطعة", content: "محتوى الموقع", settings: "الإعدادات" };

  /* ---------- Router ---------- */
  function route() {
    const [path, query] = (location.hash.slice(1) || "overview").split("?");
    const [name, id] = path.split("/");
    const key = views[name] ? name : "overview";
    const params = new URLSearchParams(query || "");
    // Only the open view keeps its markup, so ids like #savebar stay unique
    document.querySelectorAll(".view").forEach(v => { v.hidden = v.id !== `v-${key}`; if (v.hidden) v.innerHTML = ""; });
    const view = $(`v-${key}`);
    view.innerHTML = views[key](params, id);
    $("title").textContent = key === "product" && product(id) ? product(id).name : titles[key];
    $("crumb").innerHTML = key === "product" ? '<a href="#products" style="color:inherit">المنتجات</a>' : "لوحة دار";
    document.title = `${$("title").textContent}، لوحة دار`;
    document.querySelectorAll("[data-nav]").forEach(a => a.toggleAttribute("aria-current", a.dataset.nav === (key === "product" ? "products" : key)));
    document.querySelectorAll("[data-nav][aria-current]").forEach(a => a.setAttribute("aria-current", "page"));
    Dar.mount(view);
    badges();
    wire[key]?.(view, params, id);
    closeSide();
    if (refocus && view.querySelector(refocus)) view.querySelector(refocus).focus();
    else { scrollTo(0, 0); if (!firstRoute) $("title").focus({ preventScroll: true }); }
    refocus = null; firstRoute = false;
  }
  addEventListener("hashchange", route);

  // After a filter re-renders the view, focus goes back to the control that changed it
  let refocus = null, firstRoute = true;
  function setParam(k, v) {
    const a = document.activeElement;
    refocus = a?.dataset?.f ? `[data-f="${a.dataset.f}"]` : a?.id ? `#${a.id}` : null;
    const [path, query] = (location.hash.slice(1) || "overview").split("?");
    const p = new URLSearchParams(query || "");
    v ? p.set(k, v) : p.delete(k);
    location.hash = `${path}${p.toString() ? `?${p}` : ""}`;
  }

  function badges() {
    const n = state.orders.filter(o => o.status === "new").length;
    $("nav-new").textContent = n || ""; $("nav-new").hidden = !n;
    const np = products().filter(p => !(+p.price > 0)).length;
    $("nav-noprice").textContent = np || ""; $("nav-noprice").hidden = !np;
    $("nav-noprice").title = `${np} قطعة بلا سعر`;
  }

  /* ---------- Per-view wiring ---------- */
  const wire = {
    overview(view) {
      // The readiness star is stitched in proportion to the tasks done
      const star = $("ready-star");
      const cells = [...star.querySelectorAll(".c")];
      const tasks = readiness();
      const n = Math.round(cells.length * tasks.filter(t => t.done).length / tasks.length);
      cells.forEach((c, i) => { c.style.opacity = i < n ? 1 : .12; });
      view.addEventListener("click", e => { const tr = e.target.closest("[data-order]"); if (tr) openOrder(tr.dataset.order); });
    },

    orders(view) {
      view.querySelector(".seg").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) setParam("f", b.dataset.f === "all" ? "" : b.dataset.f); });
      const q = $("order-q"); let t;
      q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { setParam("q", q.value); }, 300); });
      if (q.value) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
      view.addEventListener("click", e => { const tr = e.target.closest("[data-order]"); if (tr) openOrder(tr.dataset.order); });
    },

    products(view) {
      view.querySelector(".seg").addEventListener("click", e => { const b = e.target.closest("[data-f]"); if (b) setParam("f", b.dataset.f === "all" ? "" : b.dataset.f); });
      $("prod-cat").addEventListener("change", e => setParam("cat", e.target.value));
      const q = $("prod-q"); let t;
      q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => setParam("q", q.value), 300); });
      if (q.value) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
      view.querySelector("#prod-table")?.addEventListener("change", e => {
        const tr = e.target.closest("tr"); const field = e.target.dataset.field; if (!tr || !field) return;
        const id = tr.dataset.id, name = product(id).name;
        if (field === "status") { saveProduct(id, { status: e.target.checked ? "live" : "draft" }); toast(e.target.checked ? `نشرت ${name}` : `أخفيت ${name} من المتجر`); }
        else {
          const v = e.target.value === "" ? null : Math.max(0, Math.round(+e.target.value));
          saveProduct(id, { [field]: v });
          if (field === "price") e.target.classList.toggle("is-empty", !v);
          toast(field === "price" ? (v ? `سعر ${name}: ${money(v)}` : `أزيل سعر ${name}`) : `مخزون ${name}: ${v ?? "غير محدد"}`);
        }
        badges();
      });
    },

    product(view, params, id) {
      const form = $("prod-form"); if (!form) return;
      dirtyForm(form, () => {
        const fd = new FormData(form);
        const patch = {};
        ["name", "desc", "nameTr", "descTr", "nameEn", "descEn", "origin", "motif", "story", "code", "cat", "craft"].forEach(k => patch[k] = (fd.get(k) || "").trim());
        if (!patch.name) { toast("اسم القطعة بالعربية مطلوب"); form.name.focus(); return false; }
        patch.price = fd.get("price") ? Math.max(0, Math.round(+fd.get("price"))) : null;
        patch.stock = fd.get("stock") === "" ? null : Math.max(0, Math.round(+fd.get("stock")));
        patch.colors = fd.getAll("colors");
        patch.status = fd.get("live") ? "live" : "draft";
        saveProduct(id, patch);
        toast("حفظت القطعة، وتظهر التعديلات في المتجر");
        return true;
      });
      // Tabs: click or arrow keys, one tab stop for the whole set
      const tabs = [...form.querySelectorAll("[data-lang]")];
      const pick = b => {
        tabs.forEach(x => { x.setAttribute("aria-selected", x === b); x.tabIndex = x === b ? 0 : -1; });
        form.querySelectorAll("[data-pane]").forEach(p => p.hidden = p.dataset.pane !== b.dataset.lang);
      };
      form.querySelector(".lang-tabs").addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (b) pick(b); });
      form.querySelector(".lang-tabs").addEventListener("keydown", e => {
        const i = tabs.indexOf(document.activeElement); if (i < 0) return;
        // Right-to-left: the left arrow moves to the next tab
        const step = { ArrowLeft: 1, ArrowRight: -1, Home: -i, End: tabs.length - 1 - i }[e.key];
        if (step === undefined) return;
        e.preventDefault();
        const next = tabs[(i + step + tabs.length) % tabs.length];
        pick(next); next.focus();
      });
      $("img-up").addEventListener("change", e => {
        const file = e.target.files[0]; if (!file) return;
        const fig = document.createElement("figure");
        fig.innerHTML = `<img src="${URL.createObjectURL(file)}" alt=""><span>معاينة فقط</span>`;
        e.target.closest(".drop").before(fig);
        toast("الصورة معروضة هنا فقط، ورفعها الحقيقي يحتاج الخادم");
      });
    },

    content(view) {
      const form = $("settings-form");
      const featN = () => { const n = form.querySelectorAll('[name="featured"]:checked').length; $("feat-n").textContent = `${n} من 8`; return n; };
      form.addEventListener("change", e => {
        if (e.target.name === "featured" && featN() > 8) { e.target.checked = false; featN(); toast("المختارات 8 قطع فقط"); }
      });
      dirtyForm(form, () => {
        const fd = new FormData(form);
        state.content = {
          hero1: fd.get("hero1").trim(), hero2: fd.get("hero2").trim(), heroSub: fd.get("heroSub").trim(),
          quiz: { q: fd.get("quizQ").trim(), opts: [0, 1, 2].map(i => fd.get(`quizO${i}`).trim()), right: +fd.get("quizRight"), hint: fd.get("quizHint").trim() },
          featured: fd.getAll("featured")
        };
        persist(); toast("حفظ المحتوى، ويظهر في الرئيسية");
        return true;
      });
    },

    settings(view) {
      const form = $("settings-form");
      dirtyForm(form, () => {
        const fd = new FormData(form);
        const s = {};
        ["address", "whatsapp", "email", "hours", "gateway", "bankName", "iban", "policyShipping", "policyReturns", "policyTerms"].forEach(k => s[k] = (fd.get(k) || "").trim());
        s.shipTr = fd.get("shipTr") ? Math.round(+fd.get("shipTr")) : null;
        s.freeOver = fd.get("freeOver") ? Math.round(+fd.get("freeOver")) : null;
        ["intl", "pickup", "bank", "cod", "langTr", "langEn"].forEach(k => s[k] = !!fd.get(k));
        state.settings = s; persist(); toast("حفظت الإعدادات");
        return true;
      });
    }
  };

  // Show the save bar once anything changes; save or discard from there
  function dirtyForm(form, save) {
    const bar = $("savebar");
    const mark = () => bar.classList.add("is-on");
    form.addEventListener("input", mark); form.addEventListener("change", mark);
    bar.querySelector("[data-save]").addEventListener("click", () => { if (save() !== false) { bar.classList.remove("is-on"); route(); } });
    bar.querySelector("[data-discard]").addEventListener("click", () => route());
    form.addEventListener("submit", e => { e.preventDefault(); if (save() !== false) route(); });
  }

  /* ---------- Order sheet ---------- */
  const sheet = $("sheet"), scrim = $("scrim");
  let lastFocus;
  function openOrder(id) {
    const o = state.orders.find(x => x.id === id); if (!o) return;
    lastFocus = document.activeElement;
    const steps = ["new", "prep", "ship", "done"];
    const at = steps.indexOf(o.status);
    $("sheet-h").textContent = `الطلب ${o.id}`;
    $("sheet-body").innerHTML = `
      <p><span class="demo">طلب تجريبي</span> ${stLabel(o.status)}</p>
      <dl class="kv">
        <dt>العميل</dt><dd><b>${esc(o.name)}</b></dd>
        <dt>الجوال</dt><dd><bdi class="num" dir="ltr">${o.phone}</bdi></dd>
        <dt>المدينة</dt><dd>${esc(o.city)}</dd>
        <dt>الاستلام</dt><dd>${o.ship === "pickup" ? "من المركز" : o.ship === "intl" ? "شحن دولي" : "توصيل داخل تركيا"}</dd>
        <dt>الدفع</dt><dd>${o.pay === "card" ? "بطاقة بنكية" : "تحويل بنكي"}</dd>
        <dt>القناة</dt><dd>${chan(o.channel)}</dd>
        <dt>التاريخ</dt><dd class="num">${new Date(o.date).toLocaleDateString("ar-EG-u-nu-latn", { dateStyle: "long" })}</dd>
      </dl>
      <div class="panel"><table class="t"><tbody>${o.lines.map(l => { const p = product(l.pid); return p ? `<tr><td><img class="thumb${p.dark ? " is-dark" : ""}" src="${SM(p.img)}" alt="" width="44" height="55"></td><td class="name">${esc(p.name)}<small class="num">× ${l.qty}</small></td><td class="num">${money(unit(p) * l.qty)}</td></tr>` : ""; }).join("")}
        <tr><td></td><td>الشحن</td><td class="num">${o.ship === "tr" ? money(+(state.settings.shipTr || 120)) : o.ship === "pickup" ? "مجاني" : "حسب الدولة"}</td></tr>
        <tr><td></td><td><b>الإجمالي</b></td><td class="num"><b>${money(orderTotal(o))}</b></td></tr></tbody></table></div>
      <div><h3 style="font:700 1rem/1.4 var(--font-display);margin-block-end:var(--s1)">مسار الطلب</h3>
        <ol class="timeline">${steps.map((s, i) => `<li class="${o.status !== "cancel" && i <= at ? "is-done" : ""}"><span>${STATUS[s]}</span></li>`).join("")}</ol></div>
      <label class="f"><span>غير الحالة</span><select id="order-status">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}"${k === o.status ? " selected" : ""}>${v}</option>`).join("")}</select></label>`;
    $("sheet-foot").innerHTML = `<button class="btn btn--henna" type="button" id="order-save">حفظ الحالة</button><button class="btn btn--quiet" type="button" title="الأرقام تجريبية" disabled><span data-motif="i-chat"></span>راسل العميل</button><button class="btn btn--quiet" type="button" onclick="print()">طباعة</button>`;
    Dar.mount(sheet);
    $("order-save").addEventListener("click", () => {
      o.status = $("order-status").value; persist();
      toast(`الطلب ${o.id}: ${STATUS[o.status]}`);
      closeSheet(); route();
    });
    sheet.classList.add("is-open"); scrim.classList.add("is-on"); sheet.setAttribute("aria-hidden", "false");
    app.inert = true;   // the sheet is modal: nothing behind it takes focus
    sheet.querySelector("[data-close-sheet]").focus();
  }
  function closeSheet() {
    if (!sheet.classList.contains("is-open")) return;
    sheet.classList.remove("is-open"); scrim.classList.remove("is-on"); sheet.setAttribute("aria-hidden", "true");
    app.inert = false;
    lastFocus?.focus?.();
  }
  sheet.addEventListener("click", e => { if (e.target.closest("[data-close-sheet]")) closeSheet(); });
  scrim.addEventListener("click", () => { closeSheet(); closeSide(true); });
  addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (sheet.classList.contains("is-open")) closeSheet();
    else if (side.classList.contains("is-open")) closeSide(true);
  });

  /* ---------- Sidebar on small screens ---------- */
  const side = $("side"), menu = document.querySelector(".top .menu"), app = document.querySelector(".app");
  const mainCol = side.nextElementSibling;
  // On phones the sidebar opens as a modal panel; focus returns to the menu button when it closes
  function closeSide(returnFocus) {
    const wasOpen = side.classList.contains("is-open");
    side.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false");
    side.removeAttribute("role"); side.removeAttribute("aria-modal");
    mainCol.inert = false;
    if (!sheet.classList.contains("is-open")) scrim.classList.remove("is-on");
    if (wasOpen && returnFocus) menu.focus();
  }
  menu.addEventListener("click", () => {
    side.classList.add("is-open"); scrim.classList.add("is-on"); menu.setAttribute("aria-expanded", "true");
    side.setAttribute("role", "dialog"); side.setAttribute("aria-modal", "true");
    mainCol.inert = true;
    side.querySelector("nav a").focus();
  });

  // Thread band on the sidebar edge
  const chain = Dar.tile("chain", { G: "#F4EEE4" }, 2);
  side.style.setProperty("--chain", chain.url);

  Dar.mount();
  route();
})();
