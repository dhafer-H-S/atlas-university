/**
 * make_report_pptx.js
 * Generates CacheLocalityLab_Presentation.pptx
 * Istanbul Atlas University | Computer Systems | Mid-term Project | Team 11
 *
 * Run from this directory:
 *   node make_report_pptx.js
 */

const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");

// ── Paths ─────────────────────────────────────────────────────────────────
const ROOT = path.join(__dirname, "..", "..");
const FIGS = path.join(ROOT, "results", "figures");
const OUT  = path.join(ROOT, "presentation", "CacheLocalityLab_Presentation.pptx");

function fig(name) {
  const p = path.join(FIGS, name);
  if (!fs.existsSync(p)) throw new Error(`Missing figure: ${p}`);
  return p;
}

// ── Colour palette ────────────────────────────────────────────────────────
const C = {
  bg:      "080D14",   // near-black background
  panel:   "0D1B2A",   // panel
  panel2:  "101828",   // alt panel
  border:  "1E3A5F",   // panel border accent
  navy:    "0B2D52",   // deep navy (headings)
  teal:    "2DD4BF",   // teal accent
  blue:    "60A5FA",   // sky blue
  gold:    "FBBF24",   // amber/gold
  red:     "F87171",   // soft red
  green:   "34D399",   // emerald
  purple:  "A78BFA",   // violet
  text:    "E6EDF3",   // primary text
  muted:   "8B949E",   // secondary text
  white:   "FFFFFF",
};

const FONT = { title: "Arial", body: "Arial", mono: "Consolas" };

// ── PptxGenJS instance ────────────────────────────────────────────────────
const pres = new pptxgen();
pres.layout  = "LAYOUT_WIDE";   // 13.33" × 7.5"
pres.author  = "Team 11";
pres.subject = "Computer Systems Mid-term Project";
pres.title   = "Cache & Locality Performance Lab";
pres.company = "Istanbul Atlas University";

const W = 13.33;
const H = 7.5;

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/** Dark full-bleed background for every slide */
function baseSlide() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  return s;
}

/** Horizontal rule under the slide header bar */
function headerBar(s, title, tag) {
  // dark navy bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 1.0,
    fill: { color: C.navy }, line: { color: C.navy },
  });
  // left teal accent stripe
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 1.0,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  // slide title
  s.addText(title, {
    x: 0.35, y: 0.12, w: 10.5, h: 0.72,
    fontSize: 22, bold: true, color: C.white, fontFace: FONT.title, valign: "middle",
  });
  // tag pill (top-right)
  if (tag) {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: W - 2.6, y: 0.15, w: 2.45, h: 0.65,
      fill: { color: C.teal }, line: { color: C.teal }, rectRadius: 0.12,
    });
    s.addText(tag, {
      x: W - 2.6, y: 0.15, w: 2.45, h: 0.65,
      fontSize: 10, bold: true, color: C.navy, fontFace: FONT.body, align: "center", valign: "middle",
    });
  }
  // bottom separator line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.98, w: W, h: 0.04,
    fill: { color: "1A5F57" }, line: { color: "1A5F57" },
  });
}

/** Rounded panel card */
function panel(s, x, y, w, h, accentColor) {
  const col = accentColor || C.border;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: C.panel }, line: { color: col, pt: 1.2 }, rectRadius: 0.1,
  });
}

/** Compact insight box with left stripe */
function insightBox(s, x, y, w, h, text, stripeColor) {
  const sc = stripeColor || C.teal;
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: C.panel2 }, line: { color: sc, pt: 1 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.12, h,
    fill: { color: sc }, line: { color: sc },
  });
  s.addText(text, {
    x: x + 0.2, y, w: w - 0.25, h,
    fontSize: 10.5, color: C.text, fontFace: FONT.body, valign: "middle",
    lineSpacingMultiple: 1.25, wrap: true,
  });
}

/** Footer bar */
function footer(s, text) {
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: H - 0.32, w: W, h: 0.32,
    fill: { color: C.navy }, line: { color: C.navy },
  });
  s.addText(text, {
    x: 0.25, y: H - 0.3, w: W - 0.5, h: 0.28,
    fontSize: 8, color: C.muted, fontFace: FONT.body, valign: "middle",
  });
}

/** Bullet list helper */
function bullets(s, x, y, w, h, items, fontSize, color) {
  const lines = items.map(it => ({ text: "  " + it, options: {} }));
  s.addText(lines, {
    x, y, w, h,
    fontSize: fontSize || 11,
    color: color || C.text,
    fontFace: FONT.body,
    bullet: { type: "bullet", characterCode: "25B8", indent: 10 },
    lineSpacingMultiple: 1.4,
    valign: "top",
    wrap: true,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();

  // right-side dark panel
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.5, y: 0, w: W - 8.5, h: H,
    fill: { color: C.panel }, line: { color: C.panel },
  });

  // left blue gradient accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.22, h: H,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  // memory hierarchy pyramid (decorative bars)
  const levels = [
    { label: "Registers", sub: "<1 KB · ~0.3 ns",   color: "0369A1", w: 2.2 },
    { label: "L1 Cache",  sub: "32 KB · ~1 ns",      color: "0284C7", w: 2.8 },
    { label: "L2 Cache",  sub: "256 KB · ~4 ns",     color: "0EA5E9", w: 3.4 },
    { label: "L3 Cache",  sub: "6 MB · ~12 ns",      color: "38BDF8", w: 4.0 },
    { label: "DRAM",      sub: ">8 GB · ~60–80 ns",  color: "7DD3FC", w: 4.6 },
  ];
  let ty = 1.25;
  levels.forEach(lv => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 8.7, y: ty, w: lv.w, h: 0.56,
      fill: { color: lv.color }, line: { color: lv.color },
    });
    s.addText(lv.label, {
      x: 8.75, y: ty + 0.04, w: 2.0, h: 0.26,
      fontSize: 9.5, bold: true, color: C.white, fontFace: FONT.body,
    });
    s.addText(lv.sub, {
      x: 8.75, y: ty + 0.28, w: 3.5, h: 0.22,
      fontSize: 8.5, color: "C0CDD8", fontFace: FONT.body,
    });
    ty += 0.66;
  });
  s.addText("Memory Hierarchy", {
    x: 8.6, y: 5.1, w: 4.5, h: 0.3,
    fontSize: 9.5, italic: true, color: C.muted, fontFace: FONT.body, align: "center",
  });

  // main title
  s.addText("Cache & Locality", {
    x: 0.45, y: 1.4, w: 7.9, h: 0.85,
    fontSize: 44, bold: true, color: C.white, fontFace: FONT.title,
  });
  s.addText("Performance Lab", {
    x: 0.45, y: 2.2, w: 7.9, h: 0.85,
    fontSize: 42, bold: true, color: C.teal, fontFace: FONT.title,
  });

  // divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 3.1, w: 5.2, h: 0.04,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  s.addText("Mid-term Project Technical Presentation", {
    x: 0.45, y: 3.22, w: 7.8, h: 0.36,
    fontSize: 14, color: C.muted, fontFace: FONT.body,
  });
  s.addText("Computer Systems  |  Istanbul Atlas University  |  April 2026", {
    x: 0.45, y: 3.65, w: 7.8, h: 0.28,
    fontSize: 11, color: C.muted, fontFace: FONT.body,
  });

  // team box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.45, y: 4.35, w: 5.5, h: 1.9,
    fill: { color: C.panel }, line: { color: C.border }, rectRadius: 0.1,
  });
  s.addText("Team 11", {
    x: 0.65, y: 4.5, w: 5.0, h: 0.3,
    fontSize: 12, bold: true, color: C.teal, fontFace: FONT.title,
  });
  const members = [
    "Ebru Inci             Dhafer Hamza Sfaxi",
    "Kasra Nikdel          Fadi Ibrahim Basha",
  ];
  members.forEach((m, i) => {
    s.addText(m, {
      x: 0.65, y: 4.88 + i * 0.4, w: 5.0, h: 0.35,
      fontSize: 11, color: C.text, fontFace: FONT.mono,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — AGENDA
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Project Overview & Agenda", "Overview");

  const items = [
    { num: "01", title: "Methodology",       desc: "Timer infrastructure · measure_ns<Fn>() · platform notes for Apple Silicon",      color: C.blue },
    { num: "02", title: "Stride Access",      desc: "How cache-line granularity controls per-access latency",                         color: C.teal },
    { num: "03", title: "Working Set Size",   desc: "Latency step transitions across L1 → L2 → L3 → DRAM",                           color: C.green },
    { num: "04", title: "Matrix Traversal",   desc: "Row-major vs column-major: spatial locality and slowdown ratio",                 color: C.gold },
    { num: "05", title: "Pointer Chasing",    desc: "Random linked-list hops that defeat hardware prefetching",                       color: C.red },
    { num: "06", title: "Memory Bandwidth",   desc: "Copy vs sum kernels · peak GB/s by cache level · serial dependency bottleneck",  color: C.purple },
    { num: "07", title: "Key Findings",       desc: "Five practical rules derived from measured data",                                color: C.blue },
  ];

  items.forEach((it, i) => {
    const col = i % 2 === 0 ? 0.35 : 6.85;
    const row = Math.floor(i / 2);
    const y   = 1.3 + row * 1.6;
    const w   = 6.2;
    const h   = 1.42;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: col, y, w, h,
      fill: { color: C.panel }, line: { color: it.color, pt: 1 }, rectRadius: 0.08,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: col, y, w: 0.1, h, fill: { color: it.color }, line: { color: it.color },
    });
    s.addText(it.num, {
      x: col + 0.2, y: y + 0.08, w: 0.65, h: 0.55,
      fontSize: 20, bold: true, color: it.color, fontFace: FONT.title,
    });
    s.addText(it.title, {
      x: col + 0.88, y: y + 0.1, w: w - 1.0, h: 0.36,
      fontSize: 13, bold: true, color: C.white, fontFace: FONT.title,
    });
    s.addText(it.desc, {
      x: col + 0.88, y: y + 0.5, w: w - 1.0, h: 0.74,
      fontSize: 9.5, color: C.muted, fontFace: FONT.body, lineSpacingMultiple: 1.25, wrap: true,
    });
  });

  // last item (odd) centred
  if (items.length % 2 !== 0) {
    // already rendered in loop above (i=6, col=0.35) — reposition to centre
  }

  footer(s, "Five benchmark modules  ·  C++17  ·  g++ -O2  ·  Apple Silicon M-series");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — METHODOLOGY
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Methodology — Timer & Benchmark Architecture", "Methodology");

  // left: code block
  panel(s, 0.35, 1.15, 6.4, 4.8, C.blue);
  s.addText("Core Timing Primitive  —  src/timer.h", {
    x: 0.58, y: 1.3, w: 6.0, h: 0.3,
    fontSize: 11, bold: true, color: C.blue, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 1.65, w: 5.95, h: 3.15,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    `template<typename Fn>\ndouble measure_ns(Fn&& f,\n                  long long n_accesses,\n                  int iterations = 5) {\n  using clk = chrono::high_resolution_clock;\n  double best = 1e18;\n  for (int i = 0; i < iterations; ++i) {\n    auto t0 = clk::now();\n    f();               // benchmark kernel\n    auto t1 = clk::now();\n    double ns = (double)\n      duration_cast<nanoseconds>(t1-t0)\n      .count() / (double)n_accesses;\n    if (ns < best) best = ns; // best of 5\n  }\n  return best;\n}`,
    {
      x: 0.68, y: 1.72, w: 5.72, h: 3.0,
      fontSize: 9, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.15, wrap: false,
    }
  );

  // right: key points
  const rights = [
    { title: "Why best-of-5?", text: "OS scheduling, page faults, and thermal events produce upward outliers. The minimum timer value represents the hardware latency floor without software noise.", color: C.teal },
    { title: "Why divide by n_accesses?", text: "Measures per-operation cost, not total elapsed time. Allows fair comparison across experiments with different loop counts.", color: C.gold },
    { title: "Platform: Apple Silicon", text: "UMA architecture, ~8-16 MB System Level Cache, LPDDR bandwidth >100 GB/s, aggressive hardware prefetcher. Results differ predictably from x86 textbooks.", color: C.purple },
  ];

  rights.forEach((r, i) => {
    const y = 1.15 + i * 1.6;
    panel(s, 6.95, y, 6.05, 1.47, r.color);
    s.addText(r.title, {
      x: 7.18, y: y + 0.12, w: 5.6, h: 0.3,
      fontSize: 11.5, bold: true, color: r.color, fontFace: FONT.title,
    });
    s.addText(r.text, {
      x: 7.18, y: y + 0.45, w: 5.6, h: 0.9,
      fontSize: 10, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.25, wrap: true,
    });
  });

  // ── bottom: project structure & build strip ────────────────────────
  panel(s, 0.35, 6.0, 5.95, 1.1, C.purple);
  s.addText("Project Source Layout", {
    x: 0.58, y: 6.07, w: 5.5, h: 0.26,
    fontSize: 9.5, bold: true, color: C.purple, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 6.36, w: 5.65, h: 0.62,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    "src/  timer.h  config.h  main.cpp\n"
    + "     stride_bench.cpp   workingset_bench.cpp\n"
    + "     matrix_bench.cpp   linkedlist_bench.cpp   bandwidth_bench.cpp",
    {
      x: 0.58, y: 6.38, w: 5.48, h: 0.58,
      fontSize: 8.2, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.2, wrap: false,
    }
  );

  panel(s, 6.5, 6.0, 6.48, 1.1, C.teal);
  s.addText("Build & Run", {
    x: 6.73, y: 6.07, w: 6.0, h: 0.26,
    fontSize: 9.5, bold: true, color: C.teal, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.67, y: 6.36, w: 6.15, h: 0.62,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    "$ make              # builds all five benchmarks\n"
    + "$ make run          # runs + writes results/*.csv\n"
    + "$ g++ -O2 -std=c++17 -Wall -Wextra src/*.cpp -o bench",
    {
      x: 6.8, y: 6.38, w: 5.95, h: 0.58,
      fontSize: 8.2, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.2, wrap: false,
    }
  );

  footer(s, "Compiler: g++ -O2 -std=c++17 -Wall -Wextra  ·  BENCH_ITERS=5  ·  MIN_ACCESSES=4,000,000");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — EXPERIMENT 1: STRIDE
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Experiment 1 — Stride Access Pattern", "Stride");

  // large chart image
  s.addImage({ path: fig("report_stride.png"), x: 0.25, y: 1.12, w: 9.1, h: 4.05 });

  // insight panel (right)
  panel(s, 9.55, 1.12, 3.55, 1.85, C.teal);
  s.addText("Cache-Line Boundary", {
    x: 9.78, y: 1.22, w: 3.2, h: 0.3, fontSize: 11.5, bold: true, color: C.teal, fontFace: FONT.title,
  });
  s.addText(
    "64-byte cache lines are the atomic unit of data transfer. "
    + "On Apple Silicon the prefetcher hides the 64B boundary — "
    + "the latency spike appears at 128 bytes (two consecutive lines).",
    { x: 9.78, y: 1.56, w: 3.2, h: 1.3, fontSize: 9.8, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.3, wrap: true }
  );

  panel(s, 9.55, 3.05, 3.55, 2.1, C.gold);
  s.addText("Measured Results", {
    x: 9.78, y: 3.15, w: 3.2, h: 0.3, fontSize: 11.5, bold: true, color: C.gold, fontFace: FONT.title,
  });
  const strideRows = [
    "4–64 B stride:   ~0.88 ns  (L1 hit)",
    "128 B stride:    4.50 ns   ★ spike!",
    "256+ B:          1.6–3.8 ns (stream)",
  ];
  strideRows.forEach((r, i) => {
    s.addText(r, { x: 9.78, y: 3.5 + i * 0.45, w: 3.2, h: 0.38, fontSize: 9.5, color: C.text, fontFace: FONT.mono });
  });

  // ── bottom code + hardware explanation strip ────────────────────────
  panel(s, 0.25, 5.28, 6.1, 1.72, C.teal);
  s.addText("Benchmark Kernel  —  stride_bench.cpp", {
    x: 0.48, y: 5.36, w: 5.7, h: 0.26,
    fontSize: 9.5, bold: true, color: C.teal, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.65, w: 5.7, h: 1.24,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    `for (long long i = 0; i < SIZE; i += stride_elems)\n  sum += arr[i];      // touches a new 64-B cache line\n                      // whenever stride_bytes >= 64\n\n// volatile sink prevents dead-code elimination:\nvolatile long long _sink = sum;`,
    {
      x: 0.58, y: 5.68, w: 5.5, h: 1.17,
      fontSize: 8.5, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.2, wrap: false,
    }
  );

  panel(s, 6.55, 5.28, 6.53, 1.72, C.blue);
  s.addText("Hardware: What Triggers a Cache Miss?", {
    x: 6.78, y: 5.36, w: 6.1, h: 0.3,
    fontSize: 10.5, bold: true, color: C.blue, fontFace: FONT.title,
  });
  s.addText(
    "The CPU loads memory in 64-byte blocks (cache lines). Two accesses to the same line cost only one fetch. "
    + "Apple M-series prefetches pairs of lines (128 B window), so the spike shifts from the expected 64 B to 128 B — "
    + "only a stride that crosses both lines in the prefetch pair causes a guaranteed miss. "
    + "Padding hot structs to 64-byte boundaries prevents false sharing across cores.",
    {
      x: 6.78, y: 5.7, w: 6.15, h: 1.22,
      fontSize: 9.5, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.28, wrap: true,
    }
  );

  footer(s, "Experiment 1: 64 MB int array  ·  strides swept 1–1024 elements  ·  ~0.88 ns (hit) vs ~4.5 ns (miss)");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — EXPERIMENT 2: WORKING SET
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Experiment 2 — Working Set Size", "Working Set");

  s.addImage({ path: fig("report_workingset.png"), x: 0.25, y: 1.12, w: 8.7, h: 4.0 });

  panel(s, 9.15, 1.12, 3.95, 4.0, C.green);
  s.addText("Expected vs Observed", {
    x: 9.38, y: 1.22, w: 3.6, h: 0.3, fontSize: 11.5, bold: true, color: C.green, fontFace: FONT.title,
  });

  const expected = [
    { label: "Expected (x86):", val: "4-step latency profile\nL1→L2→L3→DRAM", color: C.muted },
    { label: "Observed (M-series):", val: "Flat ~1 ns across\nall array sizes", color: C.teal },
  ];
  expected.forEach((e, i) => {
    s.addText(e.label, {
      x: 9.38, y: 1.62 + i * 1.3, w: 3.55, h: 0.28, fontSize: 10.5, bold: true, color: e.color, fontFace: FONT.body,
    });
    s.addText(e.val, {
      x: 9.38, y: 1.94 + i * 1.3, w: 3.55, h: 0.56, fontSize: 10, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.25,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 9.35, y: 4.18, w: 3.55, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });

  s.addText("Why the flat curve?", {
    x: 9.38, y: 4.28, w: 3.6, h: 0.28, fontSize: 10.5, bold: true, color: C.gold, fontFace: FONT.title,
  });
  s.addText(
    "① Aggressive HW prefetcher recognises sequential scans\n"
    + "② ~8-16 MB System Level Cache absorbs medium arrays\n"
    + "③ LPDDR bandwidth >100 GB/s serves large arrays fast",
    { x: 9.38, y: 4.6, w: 3.55, h: 0.98, fontSize: 9.2, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.3, wrap: true }
  );

  // ── bottom code + prefetch explanation strip ────────────────────────
  panel(s, 0.25, 5.22, 6.1, 1.78, C.green);
  s.addText("Sequential Scan Kernel  —  workingset_bench.cpp", {
    x: 0.48, y: 5.3, w: 5.7, h: 0.26,
    fontSize: 9.5, bold: true, color: C.green, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.58, w: 5.7, h: 1.3,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    `// Scan the entire working set once per iteration\nlong long sum = 0;\nfor (long long i = 0; i < n_elems; ++i)\n  sum += arr[i];    // stride = 4 B (int)\n\n// HW prefetcher detects stride=1 and issues\n// the NEXT cache line BEFORE the CPU asks for it`,
    {
      x: 0.58, y: 5.62, w: 5.5, h: 1.22,
      fontSize: 8.5, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.22, wrap: false,
    }
  );

  panel(s, 6.55, 5.22, 6.53, 1.78, C.teal);
  s.addText("x86 vs Apple Silicon — Why the Curve Differs", {
    x: 6.78, y: 5.3, w: 6.1, h: 0.3,
    fontSize: 10.5, bold: true, color: C.teal, fontFace: FONT.title,
  });
  s.addText(
    "x86 (Intel/AMD): prefetcher covers only L1/L2. Arrays larger than L2 still show a step increase at the L3/DRAM boundary because the prefetcher cannot hide L3 misses.\n\n"
    + "Apple M-series: the System Level Cache (SLC, ~8–16 MB) is private to the CPU cluster and sits between L3 and DRAM. "
    + "It absorbs medium-size sequential arrays entirely, collapsing the expected 4-step profile to a flat ~1 ns line.",
    {
      x: 6.78, y: 5.6, w: 6.15, h: 1.32,
      fontSize: 9.2, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.28, wrap: true,
    }
  );

  footer(s, "Experiment 2: array sizes 1 KB – 256 MB  ·  sequential scan  ·  Apple Silicon hides all transitions");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — EXPERIMENT 3: MATRIX
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Experiment 3 — Matrix Traversal Order", "Matrix");

  s.addImage({ path: fig("report_matrix.png"), x: 0.25, y: 1.12, w: 9.0, h: 4.1 });

  panel(s, 9.5, 1.12, 3.6, 4.1, C.gold);
  s.addText("Slowdown Summary", {
    x: 9.72, y: 1.22, w: 3.3, h: 0.3, fontSize: 11.5, bold: true, color: C.gold, fontFace: FONT.title,
  });

  const mdata = [
    ["N=64",   "32 KB",   "1.09×"],
    ["N=256",  "512 KB",  "1.47×"],
    ["N=1024", "8 MB",    "1.45×"],
    ["N=4096", "128 MB",  "1.53×"],
  ];
  s.addText("Matrix   Size     Slowdown", {
    x: 9.72, y: 1.62, w: 3.3, h: 0.28, fontSize: 9, bold: true, color: C.muted, fontFace: FONT.mono,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 9.72, y: 1.92, w: 3.1, h: 0.03, fill: { color: C.muted }, line: { color: C.muted } });
  mdata.forEach((row, i) => {
    const rColor = parseFloat(row[2]) >= 1.4 ? C.gold : C.green;
    s.addText(`${row[0]}  ${row[1]}   ${row[2]}`, {
      x: 9.72, y: 1.98 + i * 0.38, w: 3.3, h: 0.34,
      fontSize: 9.5, color: rColor, fontFace: FONT.mono,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 9.5, y: 3.62, w: 3.6, h: 0.04, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText("Key Insight", {
    x: 9.72, y: 3.72, w: 3.2, h: 0.28, fontSize: 10.5, bold: true, color: C.teal, fontFace: FONT.title,
  });
  s.addText(
    "Observed 1.5× vs theoretical 8× max. The hardware prefetcher detects the regular column stride and partially compensates — but the penalty remains real and consistent.",
    { x: 9.72, y: 4.06, w: 3.2, h: 0.98, fontSize: 9.5, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.3, wrap: true }
  );

  // ── bottom code + spatial-locality explanation strip ──────────────────
  panel(s, 0.25, 5.32, 6.1, 1.72, C.gold);
  s.addText("The Critical Difference  —  matrix_bench.cpp", {
    x: 0.48, y: 5.4, w: 5.7, h: 0.26,
    fontSize: 9.5, bold: true, color: C.gold, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.68, w: 5.7, h: 1.24,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    `// ✓ Row-major — cache-friendly (stride = 8 B / double)\nfor (int i=0;i<N;++i)\n  for (int j=0;j<N;++j) s += m[i][j];\n\n// ✗ Col-major — cache-hostile (stride = N×8 B)\nfor (int j=0;j<N;++j)\n  for (int i=0;i<N;++i) s += m[i][j];   // 1.5× slower!`,
    {
      x: 0.58, y: 5.72, w: 5.5, h: 1.15,
      fontSize: 8.4, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.2, wrap: false,
    }
  );

  panel(s, 6.55, 5.32, 6.53, 1.72, C.teal);
  s.addText("Spatial Locality & C++ Memory Layout", {
    x: 6.78, y: 5.4, w: 6.1, h: 0.3,
    fontSize: 10.5, bold: true, color: C.teal, fontFace: FONT.title,
  });
  s.addText(
    "C++ stores 2-D arrays in row-major order: m[0][0], m[0][1], m[0][2] … are adjacent bytes in memory. "
    + "Row-major access walks through contiguous memory — each 64-byte cache line holds 8 doubles and all 8 are used.\n\n"
    + "Column-major access jumps N×8 bytes between iterations. For N=1024 that is 8 KB per step — one cache miss per element. "
    + "The theoretical max slowdown is 8× (one double per line); we measured 1.5× because the HW prefetcher partially compensates.",
    {
      x: 6.78, y: 5.7, w: 6.15, h: 1.24,
      fontSize: 9.3, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.28, wrap: true,
    }
  );

  footer(s, "Experiment 3: N×N double matrices, N=64–4096  ·  col-major is always slower  ·  write cache-friendly loops");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — EXPERIMENT 4: POINTER CHASING
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Experiment 4 — Pointer Chasing (Linked List)", "Pointer Chasing");

  s.addImage({ path: fig("report_linkedlist.png"), x: 0.25, y: 1.12, w: 8.8, h: 4.05 });

  panel(s, 9.25, 1.12, 3.85, 4.05, C.red);
  s.addText("Latency by Cache Level", {
    x: 9.48, y: 1.22, w: 3.55, h: 0.3, fontSize: 11, bold: true, color: C.red, fontFace: FONT.title,
  });

  const llData = [
    { range: "≤128 KB   ", ns: "~0.65 ns", level: "L1/L2",  color: C.green },
    { range: "256 KB    ", ns: "~4 ns",     level: "L2→L3", color: C.teal  },
    { range: "512K–16MB ", ns: "~8–11 ns",  level: "L3",     color: C.gold  },
    { range: "32 MB     ", ns: "~38 ns",    level: "→DRAM",  color: C.red   },
    { range: "≥64 MB    ", ns: "~70–83 ns", level: "DRAM",   color: C.red   },
  ];
  llData.forEach((row, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 9.48, y: 1.62 + i * 0.58, w: 0.12, h: 0.48,
      fill: { color: row.color }, line: { color: row.color },
    });
    s.addText(`${row.range} ${row.ns}`, {
      x: 9.66, y: 1.62 + i * 0.58, w: 3.35, h: 0.29, fontSize: 9.5, color: C.text, fontFace: FONT.mono,
    });
    s.addText(row.level, {
      x: 9.66, y: 1.92 + i * 0.58, w: 3.35, h: 0.24, fontSize: 8.5, color: row.color, fontFace: FONT.body,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 9.25, y: 4.52, w: 3.85, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });
  s.addText(
    "128× latency range from L1 to DRAM. Pointer chasing serialises loads — the CPU cannot prefetch the next address until the current load completes.",
    { x: 9.48, y: 4.62, w: 3.5, h: 0.88, fontSize: 9.5, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.3, wrap: true }
  );

  // ── bottom code + prefetch-defeat explanation strip ──────────────────
  panel(s, 0.25, 5.28, 6.1, 1.72, C.red);
  s.addText("Node Struct & Chase Loop  —  linkedlist_bench.cpp", {
    x: 0.48, y: 5.36, w: 5.7, h: 0.26,
    fontSize: 9.5, bold: true, color: C.red, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.64, w: 5.7, h: 1.24,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    `struct alignas(64) Node { Node* next; };  // 1 node = 1 cache line\n\n// Fisher-Yates randomly shuffles pointer chain\n__attribute__((noinline))\nvoid chase(Node* head, long long n) {\n  for (Node* p = head; p; p = p->next);\n  asm volatile("" ::: "memory"); // prevent opt-out\n}`,
    {
      x: 0.58, y: 5.68, w: 5.5, h: 1.17,
      fontSize: 8.2, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.2, wrap: false,
    }
  );

  panel(s, 6.55, 5.28, 6.53, 1.72, C.gold);
  s.addText("Why Hardware Prefetching Cannot Help", {
    x: 6.78, y: 5.36, w: 6.1, h: 0.3,
    fontSize: 10.5, bold: true, color: C.gold, fontFace: FONT.title,
  });
  s.addText(
    "The address of the next node is stored inside the current node — which has not been loaded yet. "
    + "This creates a load-use dependency: the CPU cannot issue the next memory request until the current one completes. Each hop is a fully serialised cache miss.\n\n"
    + "alignas(64) guarantees that every node occupies exactly one cache line, so each hop always fetches a fresh 64-byte block. "
    + "The __attribute__((noinline)) + asm volatile barrier was essential to prevent the compiler from eliminating the loop at -O2.",
    {
      x: 6.78, y: 5.7, w: 6.15, h: 1.24,
      fontSize: 9.3, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.28, wrap: true,
    }
  );

  footer(s, "Experiment 4: Fisher-Yates shuffled list · alignas(64) nodes · __attribute__((noinline)) + asm volatile barrier");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — EXPERIMENT 5: BANDWIDTH
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Experiment 5 — Memory Bandwidth", "Bandwidth");

  s.addImage({ path: fig("report_bandwidth.png"), x: 0.25, y: 1.12, w: 9.05, h: 4.05 });

  panel(s, 9.55, 1.12, 3.55, 4.05, C.blue);
  s.addText("Peak Copy Bandwidth", {
    x: 9.78, y: 1.22, w: 3.2, h: 0.3, fontSize: 11, bold: true, color: C.blue, fontFace: FONT.title,
  });

  const bwData = [
    { level: "L1 (~8 KB)",   copy: "253 GB/s",  sum: "17.2 GB/s" },
    { level: "L2 (~256 KB)", copy: "168 GB/s",  sum: "17.2 GB/s" },
    { level: "L3 (~8 MB)",   copy: "89 GB/s",   sum: "17.2 GB/s" },
    { level: "DRAM (>64MB)", copy: "109 GB/s",  sum: "17.1 GB/s" },
  ];
  s.addText("Level         Copy        Sum", {
    x: 9.78, y: 1.58, w: 3.2, h: 0.24, fontSize: 8.5, bold: true, color: C.muted, fontFace: FONT.mono,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 9.78, y: 1.84, w: 3.0, h: 0.03, fill: { color: C.muted }, line: { color: C.muted } });
  bwData.forEach((row, i) => {
    s.addText(`${row.level}`, {
      x: 9.78, y: 1.9 + i * 0.4, w: 3.2, h: 0.18, fontSize: 8, color: C.muted, fontFace: FONT.mono,
    });
    s.addText(`${row.copy}`, {
      x: 9.78, y: 2.08 + i * 0.4, w: 1.5, h: 0.2, fontSize: 9, color: C.blue, fontFace: FONT.mono,
    });
    s.addText(`${row.sum}`, {
      x: 11.3, y: 2.08 + i * 0.4, w: 1.5, h: 0.2, fontSize: 9, color: C.gold, fontFace: FONT.mono,
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 9.55, y: 3.62, w: 3.55, h: 0.04, fill: { color: C.gold }, line: { color: C.gold } });
  s.addText("Why is sum always ~17 GB/s?", {
    x: 9.78, y: 3.72, w: 3.2, h: 0.28, fontSize: 10.5, bold: true, color: C.gold, fontFace: FONT.title,
  });
  s.addText(
    "Serial FP-add dependency chain: each iteration s += src[i] must wait for the previous addition (~5 cycle latency at 3.5 GHz). Memory bandwidth is completely irrelevant.",
    { x: 9.78, y: 4.06, w: 3.15, h: 0.98, fontSize: 9.3, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.28, wrap: true }
  );

  // ── bottom code + serial-dependency explanation strip ──────────────────
  panel(s, 0.25, 5.28, 6.1, 1.72, C.blue);
  s.addText("Two Kernels, Two Bottlenecks  —  bandwidth_bench.cpp", {
    x: 0.48, y: 5.36, w: 5.7, h: 0.26,
    fontSize: 9.5, bold: true, color: C.blue, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.64, w: 5.7, h: 1.24,
    fill: { color: "020810" }, line: { color: C.border },
  });
  s.addText(
    `// Copy — independent, bandwidth-limited:\nfor (long long i=0; i<n; ++i) dst[i]=src[i];\n\n// Sum — SERIAL dependency on 's' (compute-limited):\ndouble s = 0;\nfor (long long i=0; i<n; ++i) s += src[i];\n//  each iter WAITS for prev FP-add to finish (~5 cyc)`,
    {
      x: 0.58, y: 5.68, w: 5.5, h: 1.17,
      fontSize: 8.2, color: "A5D8FF", fontFace: FONT.mono,
      lineSpacingMultiple: 1.2, wrap: false,
    }
  );

  panel(s, 6.55, 5.28, 6.53, 1.72, C.gold);
  s.addText("The Serial Dependency Bottleneck Explained", {
    x: 6.78, y: 5.36, w: 6.1, h: 0.3,
    fontSize: 10.5, bold: true, color: C.gold, fontFace: FONT.title,
  });
  s.addText(
    "Copy issues independent load/store pairs — the CPU can pipeline many at once and the bottleneck is purely memory bandwidth (>100 GB/s on Apple Silicon).\n\n"
    + "Sum carries a loop-carried dependency: s_{i+1} = s_i + src[i]. The FP-add unit has ~5-cycle latency, so only one addition completes per 5 cycles. "
    + "At 3.2 GHz: 4 B ÷ (5 cycles ÷ 3.2 GHz) ≈ 2.6 GB/s theoretical ceiling. "
    + "Measured 17 GB/s means the compiler auto-vectorised with partial unrolling — but it still cannot reach memory-speed.",
    {
      x: 6.78, y: 5.7, w: 6.15, h: 1.24,
      fontSize: 9.0, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.25, wrap: true,
    }
  );

  footer(s, "Experiment 5: copy (read+write) vs sum (read-only)  ·  DRAM copy 109 GB/s  ·  sum bottlenecked by compute, not memory");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — RESULTS DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Results Dashboard — All Experiments at a Glance", "Dashboard");

  // large dashboard image
  s.addImage({ path: fig("report_dashboard.png"), x: 0.25, y: 1.12, w: 12.82, h: 5.95 });

  footer(s, "Dashboard: Stride · Working Set · Matrix Slowdown · Bandwidth  ·  all data from live benchmarks on Apple Silicon");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — KEY FINDINGS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();
  headerBar(s, "Key Findings — Five Practical Rules", "Findings");

  const findings = [
    {
      n: "1",
      title: "Cache-line granularity is real",
      body: "Accesses spaced >64 bytes apart each require a new 64-byte fetch. Pad hot data structures to align with cache-line boundaries to avoid wasting bandwidth.",
      code: "struct alignas(64) HotData { int x, y, z, pad[13]; };",
      color: C.teal,   badge: "0D4F47",
    },
    {
      n: "2",
      title: "Sequential access is nearly free on Apple Silicon",
      body: "Prefetching + SLC hides the memory hierarchy for sequential scans. On x86 the 4-tier latency penalty is fully visible at each cache boundary.",
      code: "for (size_t i=0; i<n; ++i) sum+=arr[i]; // stride=1 → prefetch wins",
      color: C.blue,   badge: "1B3A5E",
    },
    {
      n: "3",
      title: "Write row-major loops",
      body: "Column-major traversal is 1.5× slower on M-series and up to 8× on x86. Always let the innermost loop index advance the last (column) dimension.",
      code: "for(i) for(j) s+=m[i][j];  // ✓  vs  for(j) for(i) s+=m[i][j];  // ✗",
      color: C.gold,   badge: "5A4510",
    },
    {
      n: "4",
      title: "Pointer chasing forces full memory latency",
      body: "128× gap between L1 (0.65 ns) and DRAM (83 ns). Each hop is serialised — the CPU cannot prefetch the next address until the current load completes.",
      code: "// Prefer arr[idx[i]] over p=p->next when list fits in cache",
      color: C.red,    badge: "5A2929",
    },
    {
      n: "5",
      title: "High bandwidth ≠ high performance",
      body: "Serial loop-carried dependencies (prefix-sum, reductions) are CPU-latency-bound. Breaking the chain with multiple accumulators recovers throughput.",
      code: "double s0=0,s1=0; s0+=a[2*i]; s1+=a[2*i+1]; // break dep chain",
      color: C.purple, badge: "3D2F5E",
    },
  ];

  findings.forEach((f, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = 0.35 + col * 4.35;
    const y = 1.28 + row * 2.6;
    const w = 4.15;
    const h = 2.42;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h,
      fill: { color: C.panel }, line: { color: f.color, pt: 1.2 }, rectRadius: 0.1,
    });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.1, h, fill: { color: f.color }, line: { color: f.color } });

    // number badge
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.18, y: y + 0.15, w: 0.5, h: 0.44,
      fill: { color: f.badge }, line: { color: f.color },
    });
    s.addText(f.n, {
      x: x + 0.18, y: y + 0.14, w: 0.5, h: 0.44,
      fontSize: 14, bold: true, color: f.color, fontFace: FONT.title, align: "center", valign: "middle",
    });

    s.addText(f.title, {
      x: x + 0.76, y: y + 0.15, w: w - 0.88, h: 0.44,
      fontSize: 11, bold: true, color: f.color, fontFace: FONT.title, wrap: true,
    });
    s.addText(f.body, {
      x: x + 0.18, y: y + 0.72, w: w - 0.3, h: 1.12,
      fontSize: 10, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.3, wrap: true, valign: "top",
    });
    // code hint box at the bottom of the card
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.18, y: y + 1.89, w: w - 0.3, h: 0.4,
      fill: { color: "020810" }, line: { color: f.color, pt: 0.8 },
    });
    s.addText(f.code, {
      x: x + 0.24, y: y + 1.91, w: w - 0.42, h: 0.36,
      fontSize: 7.6, color: "A5D8FF", fontFace: FONT.mono, valign: "middle", wrap: false,
    });
  });

  footer(s, "All findings supported by live benchmark data collected on Apple Silicon M-series  ·  C++17  ·  g++ -O2");
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 11 — CONCLUSION / THANK YOU
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = baseSlide();

  // full-bleed decorative left block
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 5.6, h: H,
    fill: { color: C.panel }, line: { color: C.panel },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: H,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  s.addText("Conclusions", {
    x: 0.4, y: 0.8, w: 4.9, h: 0.56,
    fontSize: 28, bold: true, color: C.white, fontFace: FONT.title,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.42, w: 3.8, h: 0.06, fill: { color: C.teal }, line: { color: C.teal },
  });

  const concluding = [
    "Memory access pattern is a first-order performance variable — often more impactful than algorithm choice.",
    "Platform architecture determines which memory hierarchy effects are visible. Apple Silicon hides effects that x86 exposes.",
    "Benchmarking requires careful implementation: noinline, volatile sinks, and compiler barriers prevent dead-code elimination.",
    "The 128× latency range from L1 to DRAM underlines the value of keeping hot data in cache.",
    "Memory bandwidth only helps when the algorithm structure can exploit it; serial dependencies override it.",
  ];
  concluding.forEach((c, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: 1.65 + i * 0.9, w: 0.1, h: 0.7,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    s.addText(c, {
      x: 0.6, y: 1.62 + i * 0.9, w: 4.8, h: 0.7,
      fontSize: 10, color: C.text, fontFace: FONT.body, lineSpacingMultiple: 1.3, wrap: true, valign: "middle",
    });
  });

  // right side — thank you
  s.addText("Thank You", {
    x: 6.0, y: 1.5, w: 6.8, h: 0.7,
    fontSize: 36, bold: true, color: C.teal, fontFace: FONT.title, align: "center",
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 2.28, w: 3.8, h: 0.05, fill: { color: C.gold }, line: { color: C.gold },
  });

  s.addText("Cache & Locality Performance Lab", {
    x: 6.0, y: 2.5, w: 6.8, h: 0.4,
    fontSize: 15, color: C.white, fontFace: FONT.title, align: "center",
  });
  s.addText("Computer Systems  ·  Istanbul Atlas University  ·  April 2026", {
    x: 6.0, y: 2.96, w: 6.8, h: 0.3,
    fontSize: 11, color: C.muted, fontFace: FONT.body, align: "center",
  });

  // team box
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.35, y: 3.6, w: 6.15, h: 1.8,
    fill: { color: "0D1B2A" }, line: { color: C.border }, rectRadius: 0.1,
  });
  s.addText("Team 11", {
    x: 6.55, y: 3.72, w: 5.75, h: 0.3,
    fontSize: 11.5, bold: true, color: C.teal, fontFace: FONT.title, align: "center",
  });
  [
    "Ebru Inci                 Dhafer Hamza Sfaxi",
    "Kasra Nikdel              Fadi Ibrahim Basha",
  ].forEach((m, i) => {
    s.addText(m, {
      x: 6.55, y: 4.1 + i * 0.38, w: 5.75, h: 0.34,
      fontSize: 11, color: C.text, fontFace: FONT.mono, align: "center",
    });
  });

  // questions
  s.addText("Questions?", {
    x: 6.0, y: 5.65, w: 6.8, h: 0.5,
    fontSize: 18, bold: true, color: C.white, fontFace: FONT.title, align: "center",
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SAVE
// ═══════════════════════════════════════════════════════════════════════════
pres.writeFile({ fileName: OUT })
  .then(() => {
    const stat = fs.statSync(OUT);
    console.log(`\n✅  Presentation saved to: ${OUT}`);
    console.log(`    Slides: 11  ·  Size: ${Math.round(stat.size / 1024)} KB`);
  })
  .catch(err => {
    console.error("Error writing PPTX:", err);
    process.exit(1);
  });
