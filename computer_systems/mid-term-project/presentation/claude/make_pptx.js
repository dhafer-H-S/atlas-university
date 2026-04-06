const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Team 11";
pres.subject = "Computer Systems Mid-term Project";
pres.title = "Cache & Locality Performance Lab";
pres.company = "Atlas University";

const C = {
  bg: "F7FAFC",
  panel: "FFFFFF",
  header: "0B2D52",
  headerText: "FFFFFF",
  title: "0F172A",
  text: "334155",
  muted: "64748B",
  line: "CBD5E1",
  accent: "0F766E",
  accent2: "1D4ED8",
  good: "059669",
  warn: "D97706",
  bad: "DC2626",
  key1: "0EA5E9",
  key2: "10B981",
  key3: "F59E0B",
};

const FONT = {
  title: "Arial",
  body: "Arial",
  mono: "Consolas",
};

function slideBase() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.62,
    fill: { color: C.header },
    line: { color: C.header },
  });
  s.addText("Atlas University  |  Computer Systems", {
    x: 0.35,
    y: 0.15,
    w: 6.8,
    h: 0.28,
    fontSize: 11,
    color: C.headerText,
    bold: true,
    fontFace: FONT.body,
    margin: 0,
  });
  s.addText("Team 11", {
    x: 11.5,
    y: 0.15,
    w: 1.4,
    h: 0.28,
    fontSize: 10,
    color: C.headerText,
    align: "right",
    fontFace: FONT.body,
    margin: 0,
  });
  return s;
}

function sectionTitle(s, title, subtitle) {
  s.addText(title, {
    x: 0.45,
    y: 0.84,
    w: 9.6,
    h: 0.45,
    fontSize: 26,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText(subtitle, {
    x: 0.45,
    y: 1.28,
    w: 11.9,
    h: 0.3,
    fontSize: 13,
    color: C.muted,
    fontFace: FONT.body,
    margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.45,
    y: 1.62,
    w: 12.4,
    h: 0,
    line: { color: C.line, width: 1 },
  });
}

function card(s, x, y, w, h, stripe) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    fill: { color: C.panel },
    line: { color: C.line, width: 1 },
    shadow: { type: "outer", color: "000000", blur: 3, angle: 45, distance: 2, opacity: 0.08 },
  });
  if (stripe) {
    s.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: 0.08,
      h,
      fill: { color: stripe },
      line: { color: stripe },
    });
  }
}

function footer(s, text) {
  s.addText(text, {
    x: 0.45,
    y: 7.17,
    w: 12.4,
    h: 0.2,
    fontSize: 9,
    color: C.muted,
    fontFace: FONT.body,
    margin: 0,
  });
}

// 1) Title
{
  const s = slideBase();
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0.62,
    w: 5.2,
    h: 6.88,
    fill: { color: "EAF2FB" },
    line: { color: "EAF2FB" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0.62,
    w: 0.16,
    h: 6.88,
    fill: { color: C.accent2 },
    line: { color: C.accent2 },
  });

  s.addText("Cache & Locality", {
    x: 0.55,
    y: 1.45,
    w: 4.4,
    h: 0.7,
    fontSize: 36,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText("Performance Lab", {
    x: 0.55,
    y: 2.12,
    w: 4.4,
    h: 0.6,
    fontSize: 34,
    bold: true,
    color: C.accent2,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText("Mid-term Project Technical Presentation", {
    x: 0.55,
    y: 2.9,
    w: 4.3,
    h: 0.3,
    fontSize: 13,
    color: C.text,
    fontFace: FONT.body,
    margin: 0,
  });

  s.addText("Team 11\nEbru Inci  |  Dhafer Hamza Sfaxi\nKasra Nikdel  |  Fadi Ibrahim Basha\nApril 2026", {
    x: 0.55,
    y: 5.9,
    w: 4.3,
    h: 1.3,
    fontSize: 10,
    color: C.muted,
    fontFace: FONT.body,
    margin: 0,
    lineSpacingMultiple: 1.3,
  });

  const levels = [
    { l: "Registers", v: "<1 KB  |  ~0.3 ns", c: "0369A1", w: 2.2 },
    { l: "L1 Cache", v: "32 KB  |  ~1-2 ns", c: "0284C7", w: 2.8 },
    { l: "L2 Cache", v: "256 KB  |  ~4 ns", c: "0EA5E9", w: 3.3 },
    { l: "L3 Cache", v: "6 MB  |  ~12 ns", c: "38BDF8", w: 3.9 },
    { l: "DRAM", v: ">8 GB  |  ~60 ns", c: "7DD3FC", w: 4.5 },
  ];
  let y = 1.2;
  levels.forEach((lv) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 7.0 - lv.w / 2,
      y,
      w: lv.w,
      h: 0.8,
      rectRadius: 0.06,
      fill: { color: lv.c },
      line: { color: lv.c },
    });
    s.addText(lv.l, {
      x: 7.0 - lv.w / 2,
      y: y + 0.14,
      w: lv.w,
      h: 0.22,
      align: "center",
      fontSize: 13,
      bold: true,
      color: "FFFFFF",
      fontFace: FONT.body,
      margin: 0,
    });
    s.addText(lv.v, {
      x: 7.0 - lv.w / 2,
      y: y + 0.39,
      w: lv.w,
      h: 0.2,
      align: "center",
      fontSize: 10,
      color: "E2E8F0",
      fontFace: FONT.body,
      margin: 0,
    });
    y += 1.0;
  });

  footer(s, "Technical presentation based on five benchmark experiments in C++.");
}

// 2) Project Goals (top 3)
{
  const s = slideBase();
  sectionTitle(s, "Project Goals (Top 3)", "Agreed technical goals for this mid-term study");

  const goals = [
    {
      title: "1) Measure Real Cache Behavior",
      body: "Quantify latency transitions across L1, L2, L3, and DRAM using reproducible timing experiments.",
      col: C.accent2,
    },
    {
      title: "2) Prove Access Pattern Impact",
      body: "Demonstrate how stride, traversal order, and pointer chasing change runtime without changing algorithm complexity.",
      col: C.accent,
    },
    {
      title: "3) Derive Practical Rules",
      body: "Turn benchmark evidence into implementation guidelines for cache-aware software design.",
      col: C.key3,
    },
  ];

  goals.forEach((g, i) => {
    const y = 1.95 + i * 1.66;
    card(s, 0.6, y, 12.1, 1.42, g.col);
    s.addText(g.title, {
      x: 0.9,
      y: y + 0.2,
      w: 11.6,
      h: 0.3,
      fontSize: 19,
      bold: true,
      color: C.title,
      fontFace: FONT.title,
      margin: 0,
    });
    s.addText(g.body, {
      x: 0.9,
      y: y + 0.58,
      w: 11.6,
      h: 0.56,
      fontSize: 13,
      color: C.text,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  footer(s, "Scope: C++ benchmarks, Apple Silicon platform, ns/access and GB/s metrics.");
}

// 3) Design & Implementation
{
  const s = slideBase();
  sectionTitle(s, "Design & Implementation", "Methodology, benchmark architecture, and execution flow");

  card(s, 0.6, 1.95, 6.2, 2.5, C.accent2);
  s.addText("measure_ns<Fn>()  —  src/timer.h", {
    x: 0.9,
    y: 2.15,
    w: 5.8,
    h: 0.28,
    fontSize: 12,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9,
    y: 2.49,
    w: 5.5,
    h: 1.78,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  s.addText(
    "template<typename Fn>\ndouble measure_ns(Fn&& f, long long n_acc,\n                  int iters = 5) {\n  using clk = chrono::high_resolution_clock;\n  double best = 1e18;\n  for (int i = 0; i < iters; ++i) {\n    auto t0 = clk::now();\n    f();               // benchmark lambda\n    auto t1 = clk::now();\n    double ns = (double)\n      duration_cast<nanoseconds>(t1-t0)\n      .count() / (double)n_acc;\n    if (ns < best) best = ns;\n  }\n  return best; // best of 5 runs\n}",
    {
      x: 1.03,
      y: 2.57,
      w: 5.18,
      h: 1.63,
      fontSize: 8.5,
      color: "E2E8F0",
      fontFace: FONT.mono,
      margin: 0,
      lineSpacingMultiple: 1.1,
    }
  );

  card(s, 7.05, 1.95, 5.65, 2.5, C.accent);
  s.addText("Implementation Steps", {
    x: 7.35,
    y: 2.15,
    w: 5.2,
    h: 0.28,
    fontSize: 14,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });

  const steps = [
    "1. Implement benchmark kernels",
    "2. Sweep input sizes / strides",
    "3. Collect ns/access and GB/s",
    "4. Export CSV + visualize",
    "5. Interpret cache-level transitions",
  ];
  steps.forEach((st, i) => {
    s.addText(st, {
      x: 7.35,
      y: 2.55 + i * 0.35,
      w: 5.1,
      h: 0.24,
      fontSize: 11.5,
      color: C.text,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  card(s, 0.6, 4.65, 12.1, 2.25, C.key1);
  s.addText("Benchmark Modules", {
    x: 0.9,
    y: 4.87,
    w: 11.7,
    h: 0.28,
    fontSize: 14,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });

  const mods = [
    "Stride Access",
    "Working Set Size",
    "Matrix Traversal",
    "Pointer Chasing",
    "Memory Bandwidth",
  ];
  mods.forEach((m, i) => {
    const x = 0.9 + i * 2.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x,
      y: 5.3,
      w: 2.1,
      h: 1.2,
      rectRadius: 0.06,
      fill: { color: "F8FAFC" },
      line: { color: C.line },
    });
    s.addText(m, {
      x: x + 0.1,
      y: 5.72,
      w: 1.9,
      h: 0.32,
      align: "center",
      fontSize: 11,
      bold: true,
      color: C.title,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  footer(s, "Compiler: g++ -O2 -std=c++17; timer: std::chrono high_resolution_clock.");
}

// 4) Key Point 1
{
  const s = slideBase();
  sectionTitle(s, "Key Point 1: Stride Access", "Latency jumps when stride exceeds one 64-byte cache line");

  card(s, 0.6, 1.95, 5.9, 5.1, C.key1);
  s.addChart(
    pres.charts.BAR,
    [
      { name: "ns/access", labels: ["1", "2", "4", "8", "16", "32", "64", "128", "256", "512", "1024"], values: [0.9, 0.9, 0.9, 0.9, 0.9, 4.5, 4.6, 4.6, 4.7, 4.7, 4.8] },
    ],
    {
      x: 0.95,
      y: 2.35,
      w: 5.2,
      h: 3.55,
      chartColors: [C.accent2],
      showLegend: false,
      showValue: false,
      showTitle: true,
      title: "Stride vs Latency",
      titleFontSize: 11,
      titleColor: C.title,
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
    }
  );

  card(s, 6.8, 1.95, 5.9, 2.35, C.accent2);
  s.addText("Timing Diagram Logic", {
    x: 7.1,
    y: 2.15,
    w: 5.4,
    h: 0.26,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText("stride <= 16 elems (64B): multiple hits per fetched line\nstride > 16 elems: each access fetches a new line", {
    x: 7.1,
    y: 2.48,
    w: 5.35,
    h: 1.1,
    fontSize: 11.5,
    color: C.text,
    fontFace: FONT.body,
    margin: 0,
    lineSpacingMultiple: 1.2,
  });

  card(s, 6.8, 4.45, 5.9, 2.6, C.accent);
  s.addText("Benchmark Kernel  —  stride_bench.cpp", {
    x: 7.1,
    y: 4.66,
    w: 5.4,
    h: 0.26,
    fontSize: 11.5,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.1,
    y: 4.97,
    w: 5.35,
    h: 1.88,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  s.addText(
    "// 64 MB int array, sweep stride 1..1024\nfor (int stride : strides) {\n  long long n_acc = N / stride;\n\n  double ns = measure_ns([&]() {\n    for (size_t i = 0; i < N; i += stride)\n      local_sink += arr[i]; // 1 hit/stride\n  }, n_acc, BENCH_ITERS);\n\n  // stride<=16: ~0.9 ns | stride>16: ~4.5 ns\n  // => 64B cache-line boundary confirmed!\n  csv << stride*4 << \"B,\" << ns << \"\\n\";\n}",
    {
      x: 7.22,
      y: 5.05,
      w: 5.1,
      h: 1.73,
      fontSize: 8.5,
      color: "E2E8F0",
      fontFace: FONT.mono,
      margin: 0,
      lineSpacingMultiple: 1.1,
    }
  );

  footer(s, "Key point 1 supported by chart + benchmark kernel code.");
}

// 5) Key Point 2
{
  const s = slideBase();
  sectionTitle(s, "Key Point 2: Working Set Size", "Step transitions reveal effective cache capacities");

  card(s, 0.6, 1.95, 6.15, 5.1, C.key2);
  s.addChart(
    pres.charts.LINE,
    [
      {
        name: "ns/access",
        labels: ["1K", "4K", "16K", "64K", "256K", "1M", "4M", "16M", "64M", "256M"],
        values: [1.2, 1.2, 1.2, 1.3, 4.2, 13.5, 14.0, 55, 58, 60],
      },
    ],
    {
      x: 0.95,
      y: 2.35,
      w: 5.6,
      h: 3.8,
      chartColors: [C.accent],
      lineSize: 2.5,
      lineSmooth: false,
      showLegend: false,
      showTitle: true,
      title: "Array Size vs Latency (ns/access)",
      titleFontSize: 11,
      titleColor: C.title,
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
    }
  );

  card(s, 6.95, 1.95, 5.75, 5.1, C.accent2);
  s.addText("Sweep Loop  —  workingset_bench.cpp", {
    x: 7.22,
    y: 2.15,
    w: 5.25,
    h: 0.26,
    fontSize: 11.5,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.2,
    y: 2.47,
    w: 5.25,
    h: 1.75,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  s.addText(
    "// Double array size 1 KB -> 256 MB\nfor (size_t bytes = 1024;\n     bytes <= 256ULL<<20; bytes *= 2) {\n  size_t n = bytes / sizeof(int);\n  long long passes =\n    max(1LL, MIN_ACCESSES/(long long)n);\n\n  double ns = measure_ns([&]() {\n    for (long long p = 0; p < passes; ++p)\n      for (size_t i = 0; i < n; ++i)\n        local_sink += arr[i]; // seq scan\n  }, n * passes, BENCH_ITERS);\n}",
    {
      x: 7.3,
      y: 2.55,
      w: 5.05,
      h: 1.6,
      fontSize: 8.5,
      color: "E2E8F0",
      fontFace: FONT.mono,
      margin: 0,
      lineSpacingMultiple: 1.1,
    }
  );
  s.addText("Observed Latency by Cache Level", {
    x: 7.22,
    y: 4.3,
    w: 5.25,
    h: 0.24,
    fontSize: 11,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  const inf = [
    { t: "L1 region", v: "~1.2 ns" },
    { t: "L2 region", v: "~4 ns" },
    { t: "L3 region", v: "~13-15 ns" },
    { t: "DRAM region", v: "~55-60 ns" },
  ];
  inf.forEach((p, i) => {
    const y = 4.59 + i * 0.57;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 7.2,
      y,
      w: 5.25,
      h: 0.46,
      rectRadius: 0.05,
      fill: { color: "F8FAFC" },
      line: { color: C.line },
    });
    s.addText(p.t, {
      x: 7.38,
      y: y + 0.11,
      w: 2.5,
      h: 0.22,
      fontSize: 11,
      bold: true,
      color: C.title,
      fontFace: FONT.body,
      margin: 0,
    });
    s.addText(p.v, {
      x: 10.55,
      y: y + 0.11,
      w: 1.28,
      h: 0.22,
      align: "right",
      fontSize: 11,
      bold: true,
      color: C.accent,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  footer(s, "Key point 2: powers-of-2 sweep reveals step-like latency transitions.");
}

// 6) Key Point 3
{
  const s = slideBase();
  sectionTitle(s, "Key Point 3: Matrix Traversal", "Row-major order is dramatically faster than column-major in C/C++");

  card(s, 0.6, 1.95, 6.1, 2.4, C.key3);
  s.addText("Traversal Methods", {
    x: 0.9,
    y: 2.15,
    w: 5.6,
    h: 0.25,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  const code = `// Row-major (cache-friendly)\nfor (int i = 0; i < N; ++i)\n  for (int j = 0; j < N; ++j)\n    sum += A[i][j];\n\n// Column-major (cache-unfriendly)\nfor (int j = 0; j < N; ++j)\n  for (int i = 0; i < N; ++i)\n    sum += A[i][j];`;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9,
    y: 2.5,
    w: 5.5,
    h: 1.65,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  s.addText(code, {
    x: 1.05,
    y: 2.62,
    w: 5.15,
    h: 1.45,
    fontSize: 9.5,
    color: "E2E8F0",
    fontFace: FONT.mono,
    margin: 0,
    lineSpacingMultiple: 1.1,
  });

  card(s, 0.6, 4.55, 6.1, 2.5, C.accent2);
  s.addText("Measured Slowdown", {
    x: 0.9,
    y: 4.75,
    w: 5.5,
    h: 0.24,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  const rows = [
    "N=64:  ~1.5x",
    "N=512: ~5.5x",
    "N=2048: ~12x",
    "N=4096: ~17x",
  ];
  rows.forEach((r, i) => {
    s.addText(r, {
      x: 1.05,
      y: 5.07 + i * 0.42,
      w: 5.0,
      h: 0.25,
      fontSize: 11.5,
      color: C.text,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  card(s, 6.95, 1.95, 5.75, 5.1, C.accent);
  s.addChart(
    pres.charts.BAR,
    [
      { name: "Row-major", labels: ["64", "512", "2048", "4096"], values: [1.0, 1.1, 1.2, 1.3] },
      { name: "Column-major", labels: ["64", "512", "2048", "4096"], values: [1.5, 6.0, 14.0, 22.0] },
    ],
    {
      x: 7.2,
      y: 2.25,
      w: 5.25,
      h: 3.7,
      barDir: "col",
      barGrouping: "clustered",
      chartColors: [C.good, C.bad],
      showLegend: true,
      legendPos: "b",
      legendFontSize: 9,
      showTitle: true,
      title: "Row vs Column ns/access",
      titleFontSize: 11,
      titleColor: C.title,
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
    }
  );

  footer(s, "Key point 3 supported by code, numeric slowdown, and chart.");
}

// 7) Pointer Chasing
{
  const s = slideBase();
  sectionTitle(s, "Pointer Chasing vs Sequential", "Random linked traversal defeats hardware prefetching");

  card(s, 0.6, 1.95, 5.8, 5.1, C.bad);
  s.addText("Why it is slow", {
    x: 0.9,
    y: 2.15,
    w: 5.3,
    h: 0.25,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  const codeP = `struct alignas(64) Node {\n  Node* next;\n  char pad[56];\n};\n\nNode* p = start;\nfor (long long i = 0; i < steps; ++i)\n  p = p->next;`;
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9,
    y: 2.5,
    w: 5.2,
    h: 2.2,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  s.addText(codeP, {
    x: 1.05,
    y: 2.64,
    w: 4.9,
    h: 1.9,
    fontSize: 10,
    color: "E2E8F0",
    fontFace: FONT.mono,
    margin: 0,
    lineSpacingMultiple: 1.1,
  });
  s.addText("Load-use dependency serializes each hop; next address is unknown until current load completes.", {
    x: 0.9,
    y: 4.95,
    w: 5.25,
    h: 1.65,
    fontSize: 11.5,
    color: C.text,
    fontFace: FONT.body,
    margin: 0,
  });

  card(s, 6.7, 1.95, 6.0, 5.1, C.accent2);
  s.addChart(
    pres.charts.LINE,
    [
      { name: "Sequential", labels: ["1K", "4K", "16K", "64K", "256K", "1M", "4M", "16M", "64M", "256M"], values: [1.2, 1.2, 1.2, 1.3, 4.2, 13.5, 14, 55, 58, 60] },
      { name: "Pointer Chasing", labels: ["1K", "4K", "16K", "64K", "256K", "1M", "4M", "16M", "64M", "256M"], values: [1.5, 1.5, 1.6, 4.1, 15, 16, 17, 80, 90, 95] },
    ],
    {
      x: 6.95,
      y: 2.25,
      w: 5.5,
      h: 3.7,
      chartColors: [C.good, C.bad],
      lineSize: 2.5,
      showLegend: true,
      legendPos: "b",
      legendFontSize: 9,
      showTitle: true,
      title: "Sequential vs Pointer Chasing",
      titleFontSize: 11,
      titleColor: C.title,
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
    }
  );

  footer(s, "Random pointer traversal pays higher effective memory latency than sequential scans.");
}

// 8) Memory Bandwidth
{
  const s = slideBase();
  sectionTitle(s, "Memory Bandwidth", "Throughput drops as data leaves cache and reaches DRAM");

  card(s, 0.6, 1.95, 7.9, 5.1, C.accent2);
  s.addChart(
    pres.charts.LINE,
    [
      { name: "Sum (GB/s)", labels: ["1K", "4K", "32K", "256K", "1M", "8M", "64M", "256M"], values: [350, 340, 320, 100, 60, 40, 35, 30] },
      { name: "Copy (GB/s)", labels: ["1K", "4K", "32K", "256K", "1M", "8M", "64M", "256M"], values: [280, 270, 240, 80, 45, 25, 20, 18] },
    ],
    {
      x: 0.95,
      y: 2.3,
      w: 7.4,
      h: 3.8,
      chartColors: [C.good, C.accent2],
      lineSize: 2.5,
      showLegend: true,
      legendPos: "b",
      legendFontSize: 9,
      showTitle: true,
      title: "Bandwidth vs Array Size",
      titleFontSize: 11,
      titleColor: C.title,
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
    }
  );

  card(s, 8.75, 1.95, 3.95, 5.1, C.accent);
  s.addText("Per-Level Throughput", {
    x: 9.02,
    y: 2.15,
    w: 3.45,
    h: 0.25,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });

  const bws = [
    { n: "L1", v: "~320+ GB/s", c: C.good },
    { n: "L2", v: "~80-100 GB/s", c: C.warn },
    { n: "L3", v: "~40-60 GB/s", c: "EA580C" },
    { n: "DRAM", v: "~20-40 GB/s", c: C.bad },
  ];
  bws.forEach((b, i) => {
    const y = 2.6 + i * 0.82;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 9.0,
      y,
      w: 3.45,
      h: 0.64,
      rectRadius: 0.05,
      fill: { color: "F8FAFC" },
      line: { color: C.line },
    });
    s.addText(b.n, {
      x: 9.17,
      y: y + 0.1,
      w: 1.0,
      h: 0.22,
      fontSize: 12,
      bold: true,
      color: b.c,
      fontFace: FONT.body,
      margin: 0,
    });
    s.addText(b.v, {
      x: 10.2,
      y: y + 0.1,
      w: 2.1,
      h: 0.22,
      align: "right",
      fontSize: 11,
      bold: true,
      color: C.title,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  // GB/s formula code box
  s.addText("GB/s Formula  —  bandwidth_bench.cpp", {
    x: 9.0,
    y: 5.95,
    w: 3.45,
    h: 0.24,
    fontSize: 10,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.0,
    y: 6.22,
    w: 3.45,
    h: 0.8,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  s.addText(
    "// ns/access -> GB/s conversion:\ndouble sum_gb = sizeof(double)\n  / (sum_ns * 1e-9) / 1e9;\ndouble copy_gb = (sizeof(double)*2.0)\n  / (copy_ns * 1e-9) / 1e9; // R+W",
    {
      x: 9.1,
      y: 6.28,
      w: 3.28,
      h: 0.68,
      fontSize: 7.5,
      color: "E2E8F0",
      fontFace: FONT.mono,
      margin: 0,
      lineSpacingMultiple: 1.1,
    }
  );

  footer(s, "Bandwidth confirms hierarchy throughput limits; formula shows ns→GB/s conversion.");
}

// 9) Timing & Methodology Graphics
{
  const s = slideBase();
  sectionTitle(s, "Timing Diagrams & Methodology", "How benchmark timing was made reproducible");

  card(s, 0.6, 1.95, 12.1, 2.2, C.accent2);
  s.addText("Execution timeline per data point", {
    x: 0.9,
    y: 2.18,
    w: 4.0,
    h: 0.24,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });

  const stages = [
    { t: "Warm-up", w: 1.8, c: "94A3B8" },
    { t: "Run #1", w: 1.6, c: "0EA5E9" },
    { t: "Run #2", w: 1.6, c: "0EA5E9" },
    { t: "Run #3", w: 1.6, c: "0EA5E9" },
    { t: "Run #4", w: 1.6, c: "0EA5E9" },
    { t: "Run #5", w: 1.6, c: "0EA5E9" },
    { t: "Best", w: 1.5, c: "10B981" },
  ];
  let sx = 0.95;
  stages.forEach((st) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: sx,
      y: 2.7,
      w: st.w,
      h: 1.0,
      rectRadius: 0.06,
      fill: { color: st.c },
      line: { color: st.c },
    });
    s.addText(st.t, {
      x: sx,
      y: 3.05,
      w: st.w,
      h: 0.22,
      align: "center",
      fontSize: 10,
      bold: true,
      color: "FFFFFF",
      fontFace: FONT.body,
      margin: 0,
    });
    sx += st.w + 0.12;
  });

  card(s, 0.6, 4.45, 5.95, 2.6, C.accent);
  s.addText("Measurement Equation", {
    x: 0.9,
    y: 4.68,
    w: 5.4,
    h: 0.24,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.95,
    y: 5.05,
    w: 5.2,
    h: 1.55,
    fill: { color: "0F172A" },
    line: { color: "0F172A" },
  });
  s.addText(
    "auto t0 = clk::now();\nf();  // benchmark lambda runs here\nauto t1 = clk::now();\n\ndouble ns =\n  (double)duration_cast<nanoseconds>\n  (t1 - t0).count() / (double)n_acc;\n\nif (ns < best) best = ns; // keep min",
    {
      x: 1.08,
      y: 5.11,
      w: 4.95,
      h: 1.43,
      fontSize: 9,
      color: "E2E8F0",
      fontFace: FONT.mono,
      margin: 0,
      lineSpacingMultiple: 1.1,
    }
  );

  card(s, 6.75, 4.45, 5.95, 2.6, C.key3);
  s.addText("Controls", {
    x: 7.05,
    y: 4.68,
    w: 5.4,
    h: 0.24,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText("- Fixed compiler flags\n- Same dataset per run\n- Isolated benchmark kernels\n- No dead-code elimination (volatile sink)", {
    x: 7.05,
    y: 5.05,
    w: 5.4,
    h: 1.5,
    fontSize: 11.5,
    color: C.text,
    fontFace: FONT.body,
    margin: 0,
    lineSpacingMultiple: 1.2,
  });

  footer(s, "Methodology slide provides timing-diagram support requested in template notes.");
}

// 10) Main Findings
{
  const s = slideBase();
  sectionTitle(s, "Main Findings", "Key message: memory access pattern is a first-order performance factor");

  card(s, 0.6, 1.95, 12.1, 1.35, C.accent2);
  s.addText("One message across all experiments: Data layout + traversal order can dominate runtime even without changing algorithm complexity.", {
    x: 0.9,
    y: 2.38,
    w: 11.5,
    h: 0.6,
    fontSize: 16,
    bold: true,
    color: C.title,
    align: "center",
    fontFace: FONT.title,
    margin: 0,
  });

  const findings = [
    { n: "01", t: "64-byte cache line behavior is visible in stride tests", c: C.key1 },
    { n: "02", t: "Working-set growth maps cleanly to L1/L2/L3/DRAM latency steps", c: C.key2 },
    { n: "03", t: "Row-major traversal avoids cache-line waste and large slowdowns", c: C.key3 },
    { n: "04", t: "Pointer chasing blocks prefetching and increases effective latency", c: C.bad },
    { n: "05", t: "Cache provides order-of-magnitude bandwidth advantages over DRAM", c: C.accent2 },
  ];

  findings.forEach((f, i) => {
    const y = 3.45 + i * 0.74;
    card(s, 0.9, y, 11.5, 0.62, f.c);
    s.addText(f.n, {
      x: 1.08,
      y: y + 0.14,
      w: 0.55,
      h: 0.22,
      fontSize: 10.5,
      bold: true,
      color: f.c,
      align: "center",
      fontFace: FONT.body,
      margin: 0,
    });
    s.addText(f.t, {
      x: 1.75,
      y: y + 0.14,
      w: 10.4,
      h: 0.24,
      fontSize: 11.5,
      bold: true,
      color: C.title,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  footer(s, "This slide emphasizes the main technical message, as requested.");
}

// 11) Real-world impact
{
  const s = slideBase();
  sectionTitle(s, "Practical Impact (3 Examples)", "Applying findings to real systems and software engineering");

  const impacts = [
    {
      t: "Numerical Computing",
      b: "Blocked row-major traversal in matrix kernels keeps tiles hot in cache and can produce large speedups.",
      c: C.key1,
    },
    {
      t: "Data Structures",
      b: "Contiguous containers (vector/array) usually outperform linked lists for iteration-heavy paths.",
      c: C.key2,
    },
    {
      t: "Backend Analytics",
      b: "Columnar scans reduce unnecessary cache-line loads for aggregation/filter pipelines.",
      c: C.key3,
    },
  ];

  impacts.forEach((it, i) => {
    const x = 0.75 + i * 4.2;
    card(s, x, 2.2, 3.85, 4.9, it.c);
    s.addText(it.t, {
      x: x + 0.25,
      y: 2.53,
      w: 3.3,
      h: 0.35,
      fontSize: 16,
      bold: true,
      color: C.title,
      fontFace: FONT.title,
      margin: 0,
    });
    s.addText(it.b, {
      x: x + 0.25,
      y: 3.0,
      w: 3.35,
      h: 2.0,
      fontSize: 12,
      color: C.text,
      fontFace: FONT.body,
      margin: 0,
      valign: "top",
    });

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.25,
      y: 5.65,
      w: 3.3,
      h: 1.1,
      rectRadius: 0.06,
      fill: { color: "F8FAFC" },
      line: { color: C.line },
    });
    s.addText("Cache-aware design can improve throughput without changing big-O complexity.", {
      x: x + 0.38,
      y: 5.95,
      w: 3.05,
      h: 0.55,
      align: "center",
      fontSize: 10,
      bold: true,
      color: C.accent,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  footer(s, "Three application examples required by the technical template guidance.");
}

// 12) Practical rules
{
  const s = slideBase();
  sectionTitle(s, "Practical Optimization Rules", "Implementation checklist derived from measurements");

  const rules = [
    ["Prefer contiguous data", "Use vector/array over scattered nodes on hot paths."],
    ["Traverse in memory order", "In C/C++, prefer row-major loops for matrices and tables."],
    ["Batch and tile", "Process blocks that fit in L1/L2 to maximize data reuse."],
    ["Avoid unpredictable indirection", "Pointer chasing and random jumps hurt prefetch efficiency."],
    ["Measure before tuning", "Use ns/access and GB/s to validate optimization decisions."],
  ];

  rules.forEach((r, i) => {
    const y = 2.0 + i * 1.0;
    card(s, 0.8, y, 12.0, 0.8, i % 2 ? C.accent2 : C.accent);
    s.addText(`${i + 1}. ${r[0]}`, {
      x: 1.05,
      y: y + 0.16,
      w: 4.0,
      h: 0.24,
      fontSize: 12,
      bold: true,
      color: C.title,
      fontFace: FONT.title,
      margin: 0,
    });
    s.addText(r[1], {
      x: 5.1,
      y: y + 0.16,
      w: 7.45,
      h: 0.24,
      fontSize: 11.5,
      color: C.text,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  footer(s, "Checklist turns benchmark findings into coding decisions.");
}

// 13) Performance summary chart
{
  const s = slideBase();
  sectionTitle(s, "Performance Summary", "Relative cost comparison across memory behaviors");

  card(s, 0.6, 1.95, 8.4, 5.1, C.accent2);
  s.addChart(
    pres.charts.BAR,
    [
      {
        name: "Relative Cost",
        labels: ["L1 hit", "L2 hit", "L3 hit", "DRAM", "Row-major", "Column-major", "Pointer chase"],
        values: [1, 3, 10, 45, 1.2, 12, 18],
      },
    ],
    {
      x: 0.9,
      y: 2.3,
      w: 7.85,
      h: 3.8,
      barDir: "col",
      chartColors: [C.accent],
      showLegend: false,
      showTitle: true,
      title: "Normalized Runtime Cost (illustrative from measured trends)",
      titleFontSize: 11,
      titleColor: C.title,
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
    }
  );

  card(s, 9.25, 1.95, 3.45, 5.1, C.key3);
  s.addText("Interpretation", {
    x: 9.48,
    y: 2.16,
    w: 3.0,
    h: 0.24,
    fontSize: 13,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText("- Cache misses are expensive\n- Access order matters\n- Locality gives multiplicative gains\n- Memory-aware code is often low-effort, high-impact", {
    x: 9.48,
    y: 2.52,
    w: 2.95,
    h: 2.6,
    fontSize: 11,
    color: C.text,
    fontFace: FONT.body,
    margin: 0,
    lineSpacingMultiple: 1.2,
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 9.48,
    y: 5.45,
    w: 2.95,
    h: 1.22,
    rectRadius: 0.06,
    fill: { color: "F8FAFC" },
    line: { color: C.line },
  });
  s.addText("Design for locality first, then micro-optimize.", {
    x: 9.67,
    y: 5.84,
    w: 2.6,
    h: 0.55,
    align: "center",
    fontSize: 10.5,
    bold: true,
    color: C.accent2,
    fontFace: FONT.body,
    margin: 0,
  });

  footer(s, "Summary chart unifies cross-experiment performance impact.");
}

// 14) Conclusion
{
  const s = slideBase();
  sectionTitle(s, "Conclusion", "Concluding remarks and key technical lessons");

  card(s, 0.85, 2.0, 11.8, 4.95, C.accent2);

  const concl = [
    "Cache and memory hierarchy behavior is directly measurable in user-level C++ code.",
    "Three key findings (stride, working set, traversal order) explain most observed performance gaps.",
    "Random pointer-heavy access patterns strongly reduce throughput and increase latency.",
    "Cache-conscious layout and loop order can yield major gains without algorithm changes.",
    "The strongest engineering rule: design data + traversal for locality from the start.",
  ];

  concl.forEach((c, i) => {
    s.addText(`${i + 1}. ${c}`, {
      x: 1.15,
      y: 2.45 + i * 0.86,
      w: 11.1,
      h: 0.32,
      fontSize: 13,
      bold: true,
      color: C.title,
      fontFace: FONT.body,
      margin: 0,
    });
  });

  footer(s, "End of technical content.");
}

// 15) Acknowledgments
{
  const s = slideBase();
  sectionTitle(s, "Acknowledgments & References", "Contributors and core references");

  card(s, 0.6, 1.95, 5.85, 5.1, C.accent2);
  s.addText("Acknowledgments", {
    x: 0.9,
    y: 2.15,
    w: 5.3,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText("Team 11\nEbru Inci\nDhafer Hamza Sfaxi\nKasra Nikdel\nFadi Ibrahim Basha\n\nCourse: Computer Systems\nAtlas University", {
    x: 0.9,
    y: 2.58,
    w: 5.2,
    h: 3.9,
    fontSize: 12,
    color: C.text,
    fontFace: FONT.body,
    margin: 0,
    lineSpacingMultiple: 1.2,
  });

  card(s, 6.85, 1.95, 5.85, 5.1, C.accent);
  s.addText("References", {
    x: 7.15,
    y: 2.15,
    w: 5.3,
    h: 0.3,
    fontSize: 16,
    bold: true,
    color: C.title,
    fontFace: FONT.title,
    margin: 0,
  });
  s.addText(
    "[1] Bryant & O'Hallaron, Computer Systems: A Programmer's Perspective\n\n[2] Ulrich Drepper, What Every Programmer Should Know About Memory\n\n[3] Intel Optimization Reference Manual\n\n[4] William Stallings, Operating Systems",
    {
      x: 7.15,
      y: 2.58,
      w: 5.25,
      h: 3.9,
      fontSize: 11,
      color: C.text,
      fontFace: FONT.body,
      margin: 0,
      lineSpacingMultiple: 1.2,
    }
  );

  footer(s, "Thank you.");
}

pres
  .writeFile({ fileName: "./CacheLocalityLab.pptx" })
  .then(() => console.log("Done: CacheLocalityLab.pptx (15-slide technical deck)"))
  .catch((e) => console.error("Error:", e));
