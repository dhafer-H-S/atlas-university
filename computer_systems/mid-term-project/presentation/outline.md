# Presentation To-Do List
## Cache & Locality Performance Lab — Slide Outline

Use this checklist to build your presentation slide by slide.
Each bullet = content you need to prepare/type/add to that slide.

---

### SLIDE 1 — Title Slide
- [ ] Title: "Cache & Locality Performance Lab"
- [ ] Subtitle: "Measuring How Memory Access Patterns Affect Runtime"
- [ ] Your name and student ID
- [ ] Course name: Computer Systems
- [ ] University: Atlas University
- [ ] Date: April 2026
- [ ] (Optional) a background image of a CPU die

---

### SLIDE 2 — Motivation: Why Does Memory Speed Matter?
- [ ] State the CPU-memory speed gap:
  - "Modern CPUs execute ~3 billion instructions/sec"
  - "But RAM takes 60–100 ns per access = 200 wasted cycles"
- [ ] Introduce the "memory wall" concept (gap has grown since 1980s)
- [ ] Add a simple bar chart: L1=1 ns, L2=4 ns, L3=12 ns, RAM=60 ns
- [ ] Key question slide: "Can we *measure* this gap in real code?"

---

### SLIDE 3 — The Cache Hierarchy
- [ ] Draw a pyramid diagram: CPU registers → L1 → L2 → L3 → RAM → Disk
- [ ] Label each level with:
  - Size (e.g., L1=32 KB, L2=256 KB, L3=6–30 MB, RAM=8 GB+)
  - Latency (cycles and nanoseconds)
  - Typical use (hot variables, loop arrays, etc.)
- [ ] Explain who manages the cache: **hardware, not the programmer**
- [ ] Mention cache lines: the unit of transfer is 64 bytes, not 1 byte

---

### SLIDE 4 — Cache Line & Spatial Locality
- [ ] Define a cache line: 64 consecutive bytes fetched as one block
- [ ] Show code example:
  ```c
  int arr[16];        // exactly 1 cache line (16 × 4 bytes = 64 bytes)
  arr[0];             // cache miss → fetch entire 64-byte line
  arr[1..15];         // cache HIT — line already loaded!
  ```
- [ ] Define **spatial locality**: "accessing data near recently accessed data"
- [ ] Visual: cache line as a highlighted row in a bar of memory

---

### SLIDE 5 — Temporal Locality & Prefetching
- [ ] Define **temporal locality**: "reusing recently accessed data (loop variables)"
- [ ] Example: loop counter `i` lives in L1 across all iterations
- [ ] Explain hardware **stream prefetcher**: detects sequential access patterns and prefetches the next cache line automatically
- [ ] Contrast: random access defeats the prefetcher

---

### SLIDE 6 — Experimental Setup
- [ ] Hardware: [fill in CPU model, L1/L2/L3 sizes]
- [ ] Compiler: g++ -O2 -std=c++17
- [ ] Timer: `std::chrono::high_resolution_clock` (nanosecond resolution)
- [ ] Methodology: best-of-5 timed runs (eliminates OS jitter)
- [ ] Anti-optimization: `volatile` sink accumulator prevents dead-code elimination
- [ ] Warm-up pass before each measurement

---

### SLIDE 7 — Exp 1: Stride Access — Setup
- [ ] Setup description:
  - "64 MB array of int — larger than any cache"
  - Stride s = 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 elements
- [ ] Show the code snippet:
  ```cpp
  for (size_t i = 0; i < N; i += stride)
      sink += arr[i];
  ```
- [ ] Hypothesis: "Latency should jump at stride = 16 elements = 64 bytes (one cache line)"
- [ ] Add diagram: cache line with access arrows showing stride < line vs stride ≥ line

---

### SLIDE 8 — Exp 1: Stride Access — Results
- [ ] Insert `results/figures/stride.png`
- [ ] Annotate the 64-byte vertical line on the chart
- [ ] Explain the observed jump:
  - "Below 64 bytes: multiple accesses share 1 cache line → low miss rate"
  - "At 64 bytes: every access is a new cache line → 100% miss rate"
- [ ] Note that beyond 64 bytes, latency plateaus (miss rate already maxed)
- [ ] Quote the actual numbers from your run

---

### SLIDE 9 — Exp 2: Working Set — Setup
- [ ] Setup:
  - "Stride fixed at 1 (sequential scan)"
  - "Sweep array size: 1 KB → 256 MB"
- [ ] Show code snippet:
  ```cpp
  for (size_t i = 0; i < n; ++i)
      sink += arr[i];  // sequential, stride = 1
  ```
- [ ] Hypothesis: "Three latency plateaus at L1, L2, L3 boundaries"

---

### SLIDE 10 — Exp 2: Working Set — Results
- [ ] Insert `results/figures/workingset.png`
- [ ] Draw arrows to the three plateau regions, label them L1 / L2 / L3 / RAM
- [ ] Report actual measured latencies for each region
- [ ] Explain: "When the array fits in L1, every access is a L1 hit. Once the array overflows L1, data must come from L2, etc."

---

### SLIDE 11 — Exp 3: Matrix Traversal — Setup
- [ ] Show the two code patterns side by side:
  ```cpp
  // Row-major (fast)          // Column-major (slow)
  for (i = 0..N)               for (j = 0..N)
    for (j = 0..N)               for (i = 0..N)
      sum += mat[i][j];            sum += mat[i][j];
  ```
- [ ] Draw memory layout diagram:
  - Row-major: access pattern walks forward (arrow right)
  - Col-major: access jumps by N×8 bytes each step (arrow jumps)
- [ ] Hypothesis: "Col-major loads 8 doubles per cache line but only uses 1 → 8× more misses"

---

### SLIDE 12 — Exp 3: Matrix Traversal — Results
- [ ] Insert `results/figures/matrix.png` (both panels)
- [ ] Report slowdown ratios for small N vs large N
- [ ] Explain: "For small matrices (fits in L1/L2), col-major is only slightly slower. For large matrices that exceed L3, slowdown is 5–20×."
- [ ] Practical implication: "Always use row-major order in C/C++ (row-major language)"

---

### SLIDE 13 — Exp 4: Pointer Chasing — Setup
- [ ] Describe the structure:
  - N nodes × 64 bytes, `next` pointer randomly shuffled (Fisher-Yates)
  - Traversal: `p = p->next` repeated millions of times
- [ ] Show code:
  ```cpp
  Node* p = start;
  for (int i = 0; i < steps; ++i)
      p = p->next;  // Each hop: random, unpredictable address
  ```
- [ ] Key insight: "The CPU cannot prefetch because it doesn't know where `p->next` points until the load completes — **load-use dependency chain**"
- [ ] Hypothesis: "Latency per hop = full cache miss latency for the level holding the node"

---

### SLIDE 14 — Exp 4: Pointer Chasing — Results
- [ ] Insert `results/figures/linkedlist.png`
- [ ] Compare to sequential (Exp 2): "Sequential was fast even at large sizes because the prefetcher helped. Pointer chasing gets no help."
- [ ] Show contrast numbers: sequential 256 MB ≈ X ns; pointer chasing 256 MB ≈ Y ns
- [ ] Practical implication: "Linked lists, tree nodes, hash tables with chaining all exhibit this behavior"

---

### SLIDE 15 — Exp 5: Bandwidth — Setup & Results
- [ ] Explain the two tests:
  - Copy: `b[i] = a[i]` — 1 read + 1 write per element
  - Sum: `sum += a[i]` — 1 read per element
- [ ] Bandwidth formula: Bandwidth (GB/s) = Bytes per access / ns per access × 10⁹
- [ ] Insert `results/figures/bandwidth.png`
- [ ] Annotate the drops at L1→L2→L3→RAM boundaries
- [ ] State peak DRAM bandwidth from spec vs measured

---

### SLIDE 16 — Connecting the Dots
- [ ] Summary table of all 5 experiments and their "proof" of some cache property:
  | Experiment | Reveals |
  |---|---|
  | Stride | Cache line width = 64 bytes |
  | Working set | L1/L2/L3 sizes and latencies |
  | Matrix | Spatial locality & sequential layout |
  | Ptr chasing | Prefetcher limitation; pointer cost |
  | Bandwidth | Peak throughput per cache level |
- [ ] One sentence per row explaining the link

---

### SLIDE 17 — Real-World Implications
- [ ] **Matrix multiply**: naive triple loop is cache-unfriendly for large matrices; blocked/tiled MM uses L1/L2 efficiently
- [ ] **Image processing**: always process pixels row by row (images are row-major in memory)
- [ ] **Database scans**: column stores beat row stores for aggregation queries (fewer cache lines needed)
- [ ] **Data structures**: `std::vector` beats `std::list` for iteration even O(n) delete is rare
- [ ] **Game dev**: Structure-of-Arrays (SoA) beats Array-of-Structures (AoS) for SIMD + cache

---

### SLIDE 18 — Conclusions
- [ ] 5 key takeaways (one per bullet):
  1. Access pattern matters as much as algorithm complexity
  2. Cache line granularity (64 B) defines the minimum unit of memory transfer
  3. Sequential access exploits spatial locality + prefetching → fast
  4. Random/pointer access defeats caches → slow at large sizes
  5. Cache-conscious data layout is free performance (no algorithmic change needed)
- [ ] Closing statement: "The memory hierarchy is invisible in code but dominates real-world performance"

---

### SLIDE 19 — Demo (Optional Live Slide)
- [ ] Show terminal running: `./cache_lab all`
- [ ] Live output scrolling with timing results
- [ ] Run: `python3 scripts/plot_results.py --experiment all`
- [ ] Show generated PNG — confirms theory with real measurements

---

### SLIDE 20 — References
- [ ] Bryant & O'Hallaron — *CS:APP* 3rd ed., Chapter 6 (The Memory Hierarchy)
- [ ] Stallings — *Operating Systems* 9th ed. (Cache memory chapter)
- [ ] Drepper, U. (2007). *What Every Programmer Should Know About Memory*
- [ ] Intel Optimization Reference Manual
- [ ] Your own measured results (date + machine)

---

## Presentation Checklist

- [ ] All 20 slides exist in Marp file (`presentation/slides.md`)
- [ ] Every result slide references the actual numbers you measured
- [ ] All PNG figures from `results/figures/` are embedded in the slides
- [ ] `src/config.h` updated with your actual machine's L1/L2/L3 sizes
- [ ] Report section 1 hardware table filled in
- [ ] Slide 6 (Setup) lists your actual CPU and compiler version
- [ ] Practiced speaking 30–60 seconds per slide
- [ ] Export to PDF: Marp → "Export as PDF" in VS Code
