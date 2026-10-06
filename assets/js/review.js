/* DAR review guide: ticks for reviewed pages, a cart filled for the cart and checkout links,
   and a way to start the prototype over. Every page shows a link back here while reviewing. */
(function () {
  const $ = s => document.getElementById(s);
  try { sessionStorage.setItem("dar-review", "1"); } catch (e) {}

  // Cart and checkout need pieces in the cart, so their links add two when it is empty
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-seed]")) return;
    try {
      const cart = JSON.parse(localStorage.getItem("dar-cart") || "[]");
      if (!cart.length) localStorage.setItem("dar-cart", JSON.stringify([{ pid: "thob-green", variant: "", qty: 1 }, { pid: "minibag", variant: "red", qty: 1 }]));
    } catch (err) {}
  });

  /* ---------- Reviewed pages, ticked in this browser ---------- */
  const KEY = "dar-reviewed";
  const boxes = [...document.querySelectorAll("[data-done]")];
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } };
  function paint() {
    const done = read();
    boxes.forEach(b => { b.checked = done.includes(b.dataset.done); b.closest(".rv-card").classList.toggle("is-done", b.checked); });
    const n = boxes.filter(b => b.checked).length;
    $("rv-n").textContent = n;
    $("rv-bar").style.setProperty("--p", (n / boxes.length).toFixed(3));
  }
  boxes.forEach(b => b.addEventListener("change", () => {
    const done = read().filter(id => id !== b.dataset.done);
    if (b.checked) done.push(b.dataset.done);
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {}
    paint();
  }));
  paint();

  /* ---------- Start over: clears what the prototype saved, keeps the review ticks ---------- */
  const reset = $("rv-reset"), ask = reset.innerHTML;
  reset.addEventListener("click", e => {
    const id = e.target.closest("button")?.id;
    if (id === "reset-ask") {
      reset.innerHTML = '<span>نمسح السلة والطلبات والحساب والمفضلة من هذا المتصفح.</span><div class="row"><button class="btn" type="button" id="reset-yes">امسح وابدأ</button><button class="btn btn--quiet" type="button" id="reset-no">تراجع</button></div>';
      $("reset-no").focus();
    } else if (id === "reset-no") {
      reset.innerHTML = ask;
      $("reset-ask").focus();
    } else if (id === "reset-yes") {
      try {
        Object.keys(localStorage).filter(k => k.startsWith("dar-") && k !== KEY).forEach(k => localStorage.removeItem(k));
        Object.keys(sessionStorage).filter(k => k.startsWith("dar-") && k !== "dar-review").forEach(k => sessionStorage.removeItem(k));
      } catch (err) {}
      reset.innerHTML = '<span role="status" tabindex="-1" id="reset-done">مسحنا كل شيء. ابدؤوا من جديد.</span>';
      $("reset-done").focus();
    }
  });
})();
