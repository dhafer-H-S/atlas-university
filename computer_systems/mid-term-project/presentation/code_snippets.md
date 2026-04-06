# Presentation Code Snippets Reference

All code blocks below are ready to copy into your slides.
Each section is labelled with the slide it belongs to.

---

## SLIDE 4 — Cache Line & Spatial Locality

### Snippet A: Cache line in action
```cpp
int arr[16];     // 16 × 4 bytes = 64 bytes = exactly 1 cache line

arr[0];          // MISS → entire 64-byte line loaded into L1
arr[1];          // HIT  → already in L1 (same cache line!)
arr[2] .. [15];  // HIT  → all 16 elements in that line
```

### Snippet B: Memory layout diagram
```
Memory: [ 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |10 |11 |12 |13 |14 |15 ]
         ─────────────────── 1 cache line (64 bytes) ───────────────────────
                    ↑ one miss → all 16 elements loaded at once
```

---

## SLIDE 5 — Temporal Locality & Prefetching

### Snippet C: Temporal locality — loop variables stay in L1
```cpp
int sum = 0;
for (int i = 0; i < N; ++i) {
    sum += arr[i];   // arr[i]: read once; 'sum' and 'i': reused every iteration
}
// 'sum' and 'i' live in CPU registers/L1 cache the entire time
```

### Snippet D: Prefetcher contrast (comment-style)
```cpp
// ✅ Sequential — prefetcher PREDICTS next address
for (int i = 0; i < N; ++i)
    process(arr[i]);          // arr[0], arr[1], arr[2], ... predictable

// ❌ Random pointer chase — prefetcher CANNOT predict
Node* p = head;
while (p) {
    process(p->data);
    p = p->next;              // next address is unknown until NOW
}
```

---

## SLIDE 6 — Experimental Setup

### Snippet E: Timer implementation (timer.h)
```cpp
#include <chrono>

template<typename Fn>
double measure_ns(Fn&& f, long long num_accesses, int iterations = 5) {
    using clock = std::chrono::high_resolution_clock;
    double best = 1e18;
    for (int i = 0; i < iterations; ++i) {
        auto t0 = clock::now();
        f();
        auto t1 = clock::now();
        double ns = static_cast<double>(
            std::chrono::duration_cast<std::chrono::nanoseconds>(t1 - t0).count()
        ) / static_cast<double>(num_accesses);
        if (ns < best) best = ns;   // keep best (lowest jitter) run
    }
    return best;                    // ns per single access
}
```

### Snippet F: Anti-optimization pattern (volatile sink)
```cpp
// Without volatile, the compiler may eliminate the entire loop
// because the result is never "used" by the program.
volatile int sink = 0;

for (size_t i = 0; i < N; i += stride)
    sink += arr[i];   // volatile write forces every iteration to execute

(void)sink;   // suppress unused-variable warning
```

### Snippet G: CLI entry point (main.cpp)
```cpp
// Usage: ./cache_lab [all | stride | workingset | matrix | linkedlist | bandwidth]
int main(int argc, char* argv[]) {
    std::string mode = (argc >= 2) ? argv[1] : "all";

    if (mode == "all" || mode == "stride")      run_stride_bench("results");
    if (mode == "all" || mode == "workingset")  run_workingset_bench("results");
    if (mode == "all" || mode == "matrix")      run_matrix_bench("results");
    if (mode == "all" || mode == "linkedlist")  run_linkedlist_bench("results");
    if (mode == "all" || mode == "bandwidth")   run_bandwidth_bench("results");
}
```

---

## SLIDE 7 — Exp 1: Stride Access Setup

### Snippet H: Full stride benchmark loop
```cpp
// Array: 64 MB of int (N = 16,777,216 elements)
// Stride swept: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 elements

volatile int sink = 0;

for (int stride : {1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024}) {
    double ns = measure_ns([&]() {
        for (size_t i = 0; i < N; i += stride)
            sink += arr[i];         // access every `stride`-th element
    }, N / stride);

    printf("stride=%4d elems (%5d B) → %.3f ns/access\n",
           stride, stride * 4, ns);
}
```

### Snippet I: Cache-line threshold table (ASCII)
```
stride   bytes    ns/access   interpretation
──────   ─────    ─────────   ──────────────────────────────────────────
     1       4       ~0.9     16 accesses share 1 cache line  (spatial locality)
     4      16       ~0.9     4 accesses share 1 cache line
    16      64       ~0.9     1 access = 1 cache line          ← THRESHOLD
    32     128       ~4.6     1 access skips 1 cache line      ← LATENCY JUMP
   128     512       ~2.6     L3 prefetcher partially helps
  1024    4096       ~2.4     1 access every 64 cache lines
```

---

## SLIDE 9 — Exp 2: Working Set Setup

### Snippet J: Working set benchmark loop
```cpp
// Stride = 1 (sequential), sweep array size 1 KB → 256 MB
for (size_t bytes = 1024; bytes <= 256ULL*1024*1024; bytes *= 2) {
    size_t n = bytes / sizeof(int);
    std::vector<int> arr(n, 1);

    // Touch all pages first (warm-up)
    for (size_t i = 0; i < n; ++i) arr[i] = i & 0xFF;

    volatile int sink = 0;
    double ns = measure_ns([&]() {
        for (size_t i = 0; i < n; ++i)
            sink += arr[i];   // sequential scan — stride = 1
    }, n);

    printf("%8.1f KB → %.3f ns/access\n", bytes/1024.0, ns);
}
```

### Snippet K: Expected step-function (ASCII diagram)
```
ns/access
  60 ┤                                      ╔══════════ RAM  (> 6 MB)
  40 ┤                                      ║
  12 ┤                         ╔════════════╝           L3  (256 KB – 6 MB)
   4 ┤            ╔════════════╝                        L2  (32 – 256 KB)
   2 ┤  ══════════╝                                     L1  (< 32 KB)
     └──────┬──────────┬──────────┬─────────┬───────────→ array size
           1 KB       32 KB     256 KB      6 MB       256 MB
```

---

## SLIDE 11 — Exp 3: Matrix Traversal Setup

### Snippet L: Row-major vs column-major side by side
```cpp
// ROW-MAJOR — inner loop walks along a row (contiguous in memory)
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        sum += mat[i * N + j];   // stride = 1 element = 8 bytes  ✅ FAST

// COLUMN-MAJOR — inner loop jumps between rows (stride = N elements)
for (int j = 0; j < N; j++)
    for (int i = 0; i < N; i++)
        sum += mat[i * N + j];   // stride = N × 8 bytes           ❌ SLOW
```

### Snippet M: Memory layout for N = 4
```
C/C++ row-major memory layout for a 4×4 double matrix:

Address:  [base+0]  [base+8]  [base+16] [base+24]   ← row 0
          [base+32] [base+40] [base+48] [base+56]   ← row 1
          ...

Row-major access pattern (→ = +8 bytes per step):
  mat[0][0] → mat[0][1] → mat[0][2] → mat[0][3]    fits 4 doubles per cache line

Column-major access pattern (↓ = +N×8 bytes per step, e.g. +256 B for N=32):
  mat[0][0] ↓ mat[1][0] ↓ mat[2][0] ↓ mat[3][0]   each access = new cache line
```

### Snippet N: Cache line utilisation comparison
```cpp
// For N = 512 (doubles, 8 bytes each), col-major stride = 512 × 8 = 4096 bytes
//
// Row-major:  load 1 cache line (64 B) → use all 8 doubles in it
//             cache line utilisation: 8/8 = 100%
//
// Col-major:  load 1 cache line (64 B) → use only 1 double, discard other 7
//             cache line utilisation: 1/8 = 12.5%
//             → needs 8× more cache misses for same computation
```

---

## SLIDE 13 — Exp 4: Pointer Chasing Setup

### Snippet O: Node structure (64 bytes = 1 cache line)
```cpp
// Each node is aligned to and sized at exactly 1 cache line (64 bytes).
// This ensures every pointer hop crosses into a fresh cache line.
struct alignas(64) Node {
    Node* next;               // 8 bytes — pointer to next node
    char  pad[64 - 8];        // 56 bytes padding — fills the cache line
};
// sizeof(Node) == 64 ✓   alignof(Node) == 64 ✓
```

### Snippet P: Fisher-Yates shuffle to create random traversal order
```cpp
#include <numeric>   // std::iota
#include <random>    // std::mt19937, std::shuffle

std::vector<Node> nodes(n_nodes);
std::vector<size_t> order(n_nodes);

std::iota(order.begin(), order.end(), 0);          // order = [0, 1, 2, ..., n-1]
std::shuffle(order.begin(), order.end(), rng);      // randomise

// Wire up the linked list in shuffled order
for (size_t i = 0; i < n_nodes; ++i)
    nodes[order[i]].next = &nodes[order[(i + 1) % n_nodes]];
// The list visits all n nodes but in a completely unpredictable sequence.
```

### Snippet Q: Pointer-chasing traversal (the benchmark loop)
```cpp
// Every iteration: the CPU must WAIT for p->next to be loaded
// before it knows which address to fetch next.
// This serialises all memory latency — there is no overlap.
Node* p = start;
for (long long i = 0; i < steps; ++i)
    p = p->next;          // load-use dependency chain

// Compare: sequential access lets the CPU fetch the NEXT line in parallel
for (size_t i = 0; i < n; ++i)
    sink += arr[i];        // CPU can prefetch arr[i+1] while processing arr[i]
```

---

## SLIDE 15 — Exp 5: Bandwidth Setup

### Snippet R: Copy and sum benchmark loops
```cpp
std::vector<double> a(n), b(n, 0.0);
std::iota(a.begin(), a.end(), 1.0);   // a = [1, 2, 3, ..., n]

// COPY benchmark: 1 read + 1 write per element = 16 bytes of bus traffic
for (size_t i = 0; i < n; ++i)
    b[i] = a[i];

// SUM benchmark: 1 read per element = 8 bytes of bus traffic
double sum = 0.0;
for (size_t i = 0; i < n; ++i)
    sum += a[i];
```

### Snippet S: Bandwidth formula applied in code
```cpp
// After measuring ns_per_access with the timer:

// Copy:  each access moves sizeof(double) bytes read + sizeof(double) bytes written
double copy_gb_s = (2.0 * sizeof(double)) / (copy_ns * 1e-9) / 1e9;

// Sum:   each access reads sizeof(double) bytes
double sum_gb_s  = sizeof(double) / (sum_ns * 1e-9) / 1e9;

// Formula in plain English:
//   Bandwidth (GB/s) = bytes_per_access / time_per_access_in_seconds / 1e9
```

---

## SLIDE 19 — Live Demo Commands

### Snippet T: Full build and run sequence
```bash
# 1. Build the project (all 5 benchmark modules)
make

# 2. Run all experiments — produces results/*.csv
./cache_lab all

# 3. Run a single experiment
./cache_lab stride
./cache_lab workingset
./cache_lab matrix
./cache_lab linkedlist
./cache_lab bandwidth

# 4. Generate all PNG plots from the CSV data
python3 scripts/plot_results.py --experiment all

# 5. View output files
ls results/          # CSV files
ls results/figures/  # PNG plots
```

### Snippet U: Project file tree (for context slide)
```
mid-term-project/
├── Makefile                         ← build / run / plot targets
├── src/
│   ├── config.h                     ← L1/L2/L3 sizes (edit for your machine)
│   ├── timer.h                      ← high_resolution_clock wrapper
│   ├── main.cpp                     ← CLI router
│   ├── stride_bench.{h,cpp}         ← Exp 1: stride vs latency
│   ├── workingset_bench.{h,cpp}     ← Exp 2: working set size
│   ├── matrix_bench.{h,cpp}         ← Exp 3: row-major vs col-major
│   ├── linkedlist_bench.{h,cpp}     ← Exp 4: pointer chasing
│   └── bandwidth_bench.{h,cpp}      ← Exp 5: copy & sum bandwidth
├── scripts/
│   └── plot_results.py              ← matplotlib, all 5 plots
├── results/                         ← CSV + PNG figures (generated at runtime)
├── report/report.md                 ← written analysis
└── presentation/
    ├── outline.md                   ← slide-by-slide checklist
    ├── code_snippets.md             ← THIS FILE
    └── slides.md                    ← Marp slide deck (export to PDF)
```

---

## Quick Reference: All Compile Flags
```bash
g++ -O2 -std=c++17 -Wall -Wextra \
    src/main.cpp src/stride_bench.cpp src/workingset_bench.cpp \
    src/matrix_bench.cpp src/linkedlist_bench.cpp src/bandwidth_bench.cpp \
    -o cache_lab
```

## Quick Reference: Check Your Cache Sizes (macOS)
```bash
sysctl hw.l1icachesize hw.l1dcachesize hw.l2cachesize hw.l3cachesize
# Example output:
# hw.l1icachesize: 32768    (32 KB instruction cache)
# hw.l1dcachesize: 32768    (32 KB data cache)
# hw.l2cachesize:  262144   (256 KB)
# hw.l3cachesize:  6291456  (6 MB)
```

## Quick Reference: Check Your Cache Sizes (Linux)
```bash
lscpu | grep -i cache
# or
cat /sys/devices/system/cpu/cpu0/cache/index*/size
```
