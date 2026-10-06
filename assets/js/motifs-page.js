/* DAR motifs page: draws each chart from the stitch library, switches stitched/chart view, and counts the stitches. Needs site.js */
(function () {
  const M = Dar.motifs;

  // Chart width: big cells for small motifs, capped so a tall one never outgrows the panel
  const sizeOf = (w, h) => Math.round(Math.min(w * 44, 400 * w / h, 440));

  function draw(chart, mode, animate) {
    const name = chart.dataset.chart, rows = M[name];
    const w = Math.max(...rows.map(r => r.length)), h = rows.length;
    chart.style.setProperty("--w", w);
    chart.style.setProperty("--h", h);
    chart.style.setProperty("--size", `${sizeOf(w, h)}px`);
    chart.classList.toggle("is-stitched", mode === "cross");
    const label = `${mode === "cross" ? "نقشة" : "مخطط نقشة"} ${chart.dataset.name}، ${w} في ${h} غرزة`;
    chart.innerHTML = `<span data-motif="${name}"${mode === "cross" ? ' data-mode="cross"' : ""} data-order="${chart.dataset.order || "rows"}"${animate ? " data-stitch" : ""} data-label="${label}"></span>`;
    Dar.mount(chart);
    return { w, h, rows };
  }

  document.querySelectorAll(".specimen").forEach(sp => {
    const chart = sp.querySelector(".chart");
    let mode = "cross";
    const { w, h, rows } = draw(chart, mode, true);

    // Facts come from the chart itself, so they stay true if a chart is redrawn
    const flat = rows.join("");
    const count = [...flat].filter(c => c !== ".").length;
    const colours = [flat.includes("R") && "حناء", flat.includes("G") && "زيتون"].filter(Boolean).join(" و");
    sp.querySelector("[data-facts]").insertAdjacentHTML("afterbegin",
      `<dt>على المخطط</dt><dd class="num">${w} × ${h} غرزة</dd><dt>عدد الغرز</dt><dd class="num">${count.toLocaleString("en-US")}</dd><dt>الألوان</dt><dd>${colours}</dd>`);

    sp.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => {
      if (btn.dataset.view === mode) return;
      mode = btn.dataset.view;
      sp.querySelectorAll("[data-view]").forEach(b => b.setAttribute("aria-pressed", b === btn));
      draw(chart, mode, true);
    }));
    sp.querySelector("[data-replay]").addEventListener("click", () => draw(chart, mode, true));
  });

  // Bands: the motif repeated with a little cloth between, the way it runs along a hem
  document.querySelectorAll("[data-repeat]").forEach(el => {
    const t = Dar.tile(el.dataset.repeat, {}, +el.dataset.cell, +el.dataset.pad);
    el.style.backgroundImage = t.url;
    el.style.backgroundSize = `${t.w}px ${t.h}px`;
    el.style.backgroundRepeat = "repeat-x";
    el.style.height = `${t.h + 16}px`;
  });

  // Couching: small tacks hold the cord down along its whole length
  const cord = document.getElementById("couch-path");
  const tacks = document.getElementById("couch-tacks");
  if (cord && tacks && cord.getTotalLength) {
    const L = cord.getTotalLength();
    let marks = "";
    for (let d = 5; d < L - 2; d += 8) {
      const p = cord.getPointAtLength(d), q = cord.getPointAtLength(Math.min(L, d + 1));
      const a = Math.atan2(q.y - p.y, q.x - p.x) + Math.PI / 2;
      const dx = (Math.cos(a) * 5).toFixed(2), dy = (Math.sin(a) * 5).toFixed(2);
      marks += `<line x1="${(p.x - dx).toFixed(2)}" y1="${(p.y - dy).toFixed(2)}" x2="${(p.x + +dx).toFixed(2)}" y2="${(p.y + +dy).toFixed(2)}"/>`;
    }
    tacks.innerHTML = marks;
  }

  Dar.mount();
  Site.observe();
})();
