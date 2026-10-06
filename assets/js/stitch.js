/* DAR stitch engine
   Motifs are cross-stitch charts: one character = one stitch.
   R = henna, G = zaytoun, X = currentColor, anything else = bare cloth. */
(function () {
  const motifs = {
    // Traced stitch by stitch from the DAR logo (44 x 45 grid).
    star: [
      "...................G....G...................",
      "...................GG..GG...................",
      "....................G..G....................",
      ".............R.......GG.......R.............",
      ".............RR......GG......RR.............",
      ".............RRR............RRR.............",
      ".............RRRR..........RRRR.............",
      ".............RRRRR........RRRRR.............",
      ".............RRRRRR......RRRRRR.............",
      ".............RRRRRRR....RRRRRRR.............",
      ".............RRRRRRRR..RRRRRRRR.............",
      "..............RRRRRRR..RRRRRRR..............",
      "...............RRRRRR..RRRRRR...............",
      "................RRRRR..RRRRR................",
      "...RRRRRRRR......RRRR..RRRR......RRRRRRRR...",
      "....RRRRRRRR......RRR..RRR......RRRRRRRR....",
      ".....RRRRRRRR......RR..RR......RRRRRRRR.....",
      "......RRRRRRRR......R..R......RRRRRRRR......",
      ".......RRRRRRRR......GG......RRRRRRRR.......",
      "........RRRRRRRR.....GG.....RRRRRRRR........",
      "GG.......RRRRRRRR..........RRRRRRRR.......GG",
      ".GG.......RRRRRRRR...GG...RRRRRRRR.......GG.",
      "...GG.............GGGGGGGG.............GG...",
      "...GG.............GGGGGGGG.............GG...",
      ".GG.......RRRRRRRR...GG...RRRRRRRR.......GG.",
      "GG.......RRRRRRRR..........RRRRRRRR.......GG",
      "........RRRRRRRR.....GG.....RRRRRRRR........",
      ".......RRRRRRRR......GG......RRRRRRRR.......",
      "......RRRRRRRR......R..R......RRRRRRRR......",
      ".....RRRRRRRR......RR..RR......RRRRRRRR.....",
      "....RRRRRRRR......RRR..RRR......RRRRRRRR....",
      "...RRRRRRRR......RRRR..RRRR......RRRRRRRR...",
      "................RRRRR..RRRRR................",
      "...............RRRRRR..RRRRRR...............",
      "..............RRRRRRR..RRRRRRR..............",
      ".............RRRRRRRR..RRRRRRRR.............",
      ".............RRRRRRR....RRRRRRR.............",
      ".............RRRRRR......RRRRRR.............",
      ".............RRRRR........RRRRR.............",
      ".............RRRR..........RRRR.............",
      ".............RRR.....GG.....RRR.............",
      ".............RR......GG......RR.............",
      ".............R......G..G......R.............",
      "...................GG..GG...................",
      "...................G....G..................."
    ],
    // Small eight-point star, for bullets and rhythm marks.
    starlet: [
      "R..R..R",
      ".R.R.R.",
      "..RGR..",
      "RRGGGRR",
      "..RGR..",
      ".R.R.R.",
      "R..R..R"
    ],
    // Cypress tree.
    cypress: [
      "....R....",
      "...RRR...",
      "..RRRRR..",
      "...RRR...",
      "..RRRRR..",
      ".RRRRRRR.",
      "..RRRRR..",
      ".RRRRRRR.",
      "RRRRRRRRR",
      "....G....",
      "....G....",
      "...GGG..."
    ],
    // Amulet triangle (hijab), worn as protection.
    amulet: [
      "....G....",
      "...G.G...",
      "..G.R.G..",
      ".G.RRR.G.",
      "G.RRRRR.G",
      "GGGGGGGGG",
      ".R..R..R.",
      ".R..R..R.",
      "RRR.R.RRR"
    ],
    // Repeating band tiles. Tiles are drawn edge to edge.
    chain: [
      "...R...",
      "..R.R..",
      ".R.G.R.",
      "R.GGG.R",
      ".R.G.R.",
      "..R.R..",
      "...R..."
    ],
    saw: [
      "G.....",
      "GG....",
      "GGG...",
      "RRRR..",
      "RRRRR.",
      "RRRRRR"
    ],
    wheat: [
      "R...",
      ".R.R",
      "..R.",
      ".R.R",
      "R...",
      "GGGG"
    ],

    /* Interface icons on a 12 x 12 stitch grid. X = currentColor. */
    "i-bag": [
      "....XXXX....",
      "...X....X...",
      "...X....X...",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".X........X.",
      ".X........X.",
      ".X........X.",
      ".X........X.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "............"
    ],
    "i-search": [
      "............",
      "...XXXX.....",
      "..X....X....",
      ".X......X...",
      ".X......X...",
      ".X......X...",
      ".X......X...",
      "..X....X....",
      "...XXXX.X...",
      ".........X..",
      "..........X.",
      "............"
    ],
    "i-heart": [
      "............",
      "..XX....XX..",
      ".X..X..X..X.",
      ".X...XX...X.",
      ".X........X.",
      "..X......X..",
      "...X....X...",
      "....X..X....",
      ".....XX.....",
      "............",
      "............",
      "............"
    ],
    "i-user": [
      "....XXXX....",
      "...X....X...",
      "...X....X...",
      "...X....X...",
      "....XXXX....",
      "............",
      "..XXXXXXXX..",
      ".X........X.",
      ".X........X.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "............"
    ],
    "i-menu": [
      "............",
      "............",
      ".XXXXXXXXXX.",
      "............",
      "............",
      ".XXXXXXXXXX.",
      "............",
      "............",
      ".XXXXXXXXXX.",
      "............",
      "............",
      "............"
    ],
    "i-arrow": [
      "............",
      "............",
      "....X.......",
      "...X........",
      "..X.........",
      ".XXXXXXXXXX.",
      "..X.........",
      "...X........",
      "....X.......",
      "............",
      "............",
      "............"
    ],
    "i-plus": [
      "............",
      "............",
      ".....XX.....",
      ".....XX.....",
      ".....XX.....",
      "..XXXXXXXX..",
      "..XXXXXXXX..",
      ".....XX.....",
      ".....XX.....",
      ".....XX.....",
      "............",
      "............"
    ],
    "i-minus": [
      "............",
      "............",
      "............",
      "............",
      "............",
      "..XXXXXXXX..",
      "..XXXXXXXX..",
      "............",
      "............",
      "............",
      "............",
      "............"
    ],
    "i-close": [
      "............",
      "............",
      "..X......X..",
      "...X....X...",
      "....X..X....",
      ".....XX.....",
      ".....XX.....",
      "....X..X....",
      "...X....X...",
      "..X......X..",
      "............",
      "............"
    ],
    "i-play": [
      "............",
      "..X.........",
      "..XX........",
      "..XXX.......",
      "..XXXX......",
      "..XXXXX.....",
      "..XXXXX.....",
      "..XXXX......",
      "..XXX.......",
      "..XX........",
      "..X.........",
      "............"
    ],
    "i-chat": [
      "............",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".X.XX.XX..X.",
      ".X........X.",
      ".X.XXXXX..X.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "...XX.......",
      "...X........",
      "............",
      "............"
    ],
    "i-home": [
      "............",
      ".....XX.....",
      "....X..X....",
      "...X....X...",
      "..X......X..",
      ".XXXXXXXXXX.",
      "..X......X..",
      "..X.XXX..X..",
      "..X.X.X..X..",
      "..X.X.X..X..",
      "..XXXXXXXX..",
      "............"
    ],
    "i-box": [
      "............",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "..X......X..",
      "..X.XXXX.X..",
      "..X......X..",
      "..X......X..",
      "..X......X..",
      "..XXXXXXXX..",
      "............",
      "............"
    ],
    "i-tag": [
      "............",
      ".XXXXX......",
      ".X....X.....",
      ".X.XX..X....",
      ".X.XX...X...",
      ".X.......X..",
      "..X.......X.",
      "...X.....X..",
      "....X...X...",
      ".....X.X....",
      "......X.....",
      "............"
    ],
    "i-frame": [
      "............",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".X...XX...X.",
      ".X..X..X..X.",
      ".X.X....X.X.",
      ".X.X....X.X.",
      ".X..X..X..X.",
      ".X...XX...X.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "............"
    ],
    "i-pin": [
      "............",
      "....XXXX....",
      "...X....X...",
      "..X......X..",
      "..X..XX..X..",
      "..X..XX..X..",
      "..X......X..",
      "...X....X...",
      "....X..X....",
      ".....XX.....",
      "............",
      "............"
    ],
    "i-camera": [
      "............",
      "....XXXX....",
      ".XXX....XXX.",
      ".X........X.",
      ".X...XX...X.",
      ".X..X..X..X.",
      ".X..X..X..X.",
      ".X...XX...X.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "............",
      "............"
    ],
    "i-truck": [
      "............",
      "............",
      "....XXXXXXX.",
      "....X.....X.",
      ".XXXX.....X.",
      ".X..X.....X.",
      "X...X.....X.",
      "XXXXXXXXXXX.",
      ".XX....XX...",
      ".XX....XX...",
      "............",
      "............"
    ],
    "i-return": [
      "............",
      "...X........",
      "..XX........",
      ".XXXXXXXX...",
      "..XX.....X..",
      "...X......X.",
      "..........X.",
      "..........X.",
      ".........X..",
      "...XXXXXX...",
      "............",
      "............"
    ],
    "i-wash": [
      "............",
      "............",
      ".X..XX..XX..",
      "X.XX..XX..X.",
      "............",
      "XXXXXXXXXXXX",
      ".X........X.",
      ".X........X.",
      "..X......X..",
      "...XXXXXX...",
      "............",
      "............"
    ],
    "i-iron": [
      "............",
      "............",
      "......XXXX..",
      ".....X...X..",
      "....XXXXXXX.",
      "...X......X.",
      "..X.......X.",
      ".X........X.",
      "XXXXXXXXXXX.",
      "............",
      "............",
      "............"
    ],
    "i-sun": [
      "............",
      ".....XX.....",
      "..X......X..",
      "....XXXX....",
      "...X....X...",
      ".X.X....X.X.",
      ".X.X....X.X.",
      "...X....X...",
      "....XXXX....",
      "..X......X..",
      ".....XX.....",
      "............"
    ],
    "i-fold": [
      "............",
      "............",
      "..XXXXXXXX..",
      ".X........X.",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "............",
      "............",
      "............"
    ],
    "i-card": [
      "............",
      "............",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".XXXXXXXXXX.",
      ".X........X.",
      ".X.XXX....X.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "............",
      "............",
      "............"
    ],
    "i-lock": [
      "............",
      "....XXXX....",
      "...X....X...",
      "...X....X...",
      "..XXXXXXXX..",
      "..X......X..",
      "..X..XX..X..",
      "..X..XX..X..",
      "..X......X..",
      "..XXXXXXXX..",
      "............",
      "............"
    ],
    "i-needle": [
      ".........XX.",
      "........X..X",
      "........X.X.",
      ".......X.X..",
      "......X.X...",
      ".....X.X....",
      "....X.X.....",
      "...X.X......",
      "..XX........",
      ".XX.........",
      ".X..........",
      "............"
    ],
    "i-text": [
      "............",
      ".XXXXXXXXXX.",
      "............",
      ".XXXXXXXX...",
      "............",
      ".XXXXXXXXXX.",
      "............",
      ".XXXXXX.....",
      "............",
      ".XXXXXXXXX..",
      "............",
      "............"
    ],
    "i-sliders": [
      "............",
      "..X.....X...",
      "..X.....X...",
      ".XXX....X...",
      "..X....XXX..",
      "..X.....X...",
      "..X.....X...",
      "..X..X..X...",
      "..X.XXX.X...",
      "..X..X..X...",
      "..X..X..X...",
      "............"
    ],
    "i-eye": [
      "............",
      "............",
      "....XXXX....",
      "..XX....XX..",
      ".X...XX...X.",
      "X...XXXX...X",
      ".X...XX...X.",
      "..XX....XX..",
      "....XXXX....",
      "............",
      "............",
      "............"
    ],
    "i-check": [
      "............",
      "............",
      "..........X.",
      ".........X..",
      "........X...",
      ".X.....X....",
      "..X...X.....",
      "...X.X......",
      "....X.......",
      "............",
      "............",
      "............"
    ],
    "i-upload": [
      "............",
      ".....XX.....",
      "....XXXX....",
      "...X.XX.X...",
      ".....XX.....",
      ".....XX.....",
      ".....XX.....",
      "............",
      ".X........X.",
      ".X........X.",
      ".XXXXXXXXXX.",
      "............"
    ],
    "i-pause": [
      "............",
      "............",
      "...XX..XX...",
      "...XX..XX...",
      "...XX..XX...",
      "...XX..XX...",
      "...XX..XX...",
      "...XX..XX...",
      "...XX..XX...",
      "...XX..XX...",
      "............",
      "............"
    ],
    "i-globe": [
      "............",
      "....XXXX....",
      "..XX.X..XX..",
      ".X...X...X..",
      ".XXXXXXXXX..",
      ".X...X...X..",
      ".X...X...X..",
      ".XXXXXXXXX..",
      ".X...X...X..",
      "..XX.X..XX..",
      "....XXXX....",
      "............"
    ]
  };

  const ink = { R: "var(--henna)", G: "var(--zaytoun)", X: "currentColor" };

  function cells(name) {
    const rows = motifs[name];
    const out = [];
    rows.forEach((row, y) => [...row].forEach((ch, x) => { if (ink[ch]) out.push({ x, y, ch }); }));
    return { w: Math.max(...rows.map(r => r.length)), h: rows.length, list: out };
  }

  // order: "radial" grows from the center like a star being worked outward,
  // "rows" follows the needle row by row, alternating direction.
  function sortCells(c, order) {
    const cx = (c.w - 1) / 2, cy = (c.h - 1) / 2;
    if (order === "radial") return c.list.sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));
    return c.list.sort((a, b) => a.y - b.y || (a.y % 2 ? b.x - a.x : a.x - b.x));
  }

  function svg(name, opts = {}) {
    const mode = opts.mode || "block";
    const map = Object.assign({}, ink, opts.ink || {});
    const c = cells(name);
    const list = sortCells(c, opts.order || "rows");
    const body = list.map((p, i) => {
      const fill = map[p.ch];
      if (mode === "cross") {
        const a = .18, b = .82;
        return `<path class="c" style="--i:${i}" stroke="${fill}" d="M${p.x + a} ${p.y + a}L${p.x + b} ${p.y + b}M${p.x + b} ${p.y + a}L${p.x + a} ${p.y + b}"/>`;
      }
      return `<rect class="c" style="--i:${i}" x="${p.x}" y="${p.y}" width="1.02" height="1.02" fill="${fill}"/>`;
    }).join("");
    const strokeAttr = mode === "cross" ? ' stroke-width=".26" stroke-linecap="square" fill="none"' : "";
    return `<svg viewBox="0 0 ${c.w} ${c.h}" ${opts.label ? `role="img" aria-label="${opts.label}"` : 'aria-hidden="true"'} shape-rendering="${mode === "cross" ? "geometricPrecision" : "crispEdges"}"${strokeAttr}>${body}</svg>`;
  }

  // Data URL for a repeating band. Colors must be literal here.
  function tile(name, colors = {}, cellPx = 4, pad = 0) {
    const map = Object.assign({ R: "#B25426", G: "#364639", X: "#364639" }, colors);
    const c = cells(name);
    const rects = c.list.map(p => `<rect x="${p.x * cellPx}" y="${p.y * cellPx}" width="${cellPx}" height="${cellPx}" fill="${map[p.ch]}"/>`).join("");
    const w = c.w * cellPx + pad, h = c.h * cellPx + pad;
    const s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" shape-rendering="crispEdges"><g transform="translate(${pad / 2} ${pad / 2})">${rects}</g></svg>`;
    return { url: `url("data:image/svg+xml,${encodeURIComponent(s)}")`, w, h };
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mount(root = document) {
    root.querySelectorAll("[data-motif]").forEach(el => {
      if (el.dataset.mounted) return;
      el.dataset.mounted = "1";
      el.innerHTML = svg(el.dataset.motif, {
        mode: el.dataset.mode, order: el.dataset.order, label: el.getAttribute("data-label"),
        ink: el.dataset.mono ? { R: "currentColor", G: "currentColor" } : el.dataset.night ? { G: "var(--paper)" } : undefined
      });
      if (el.hasAttribute("data-stitch") && !reduce) el.classList.add("stitch-wait");
    });
    root.querySelectorAll("[data-band]").forEach(el => {
      const t = tile(el.dataset.band, el.dataset.night ? { G: "#F4EEE4" } : {}, +(el.dataset.cell || 4));
      el.style.backgroundImage = t.url;
      el.style.setProperty("--band-h", t.h + "px");
      el.style.backgroundSize = `${t.w}px ${t.h}px`;
    });
    if (reduce) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove("stitch-wait");
      e.target.classList.add("stitch-go");
      io.unobserve(e.target);
    }), { threshold: .35 });
    root.querySelectorAll(".stitch-wait").forEach(el => io.observe(el));
  }

  window.Dar = { motifs, svg, tile, mount };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => mount()) : mount();
})();
