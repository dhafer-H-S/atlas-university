# Cache & Locality Performance Lab — Report

**Course:** Computer Systems  
**Student:** [Your Name]  
**Date:** April 2026  
**Platform:** [Fill in: CPU model, OS, compiler version]

---

## 1. Introduction

Modern CPUs are dramatically faster than main memory. A single L1 cache hit takes roughly **4 cycles**, but accessing RAM can take **200+ cycles** — a 50× penalty. To bridge this gap, processors use a hierarchy of increasingly large but slower caches (L1 → L2 → L3 → RAM). Programs that keep their data in the smallest, fastest level will run orders of magnitude faster than those that don't.

Two properties determine how well a program uses the cache hierarchy:

- **Temporal locality** — data accessed recently is likely to be accessed again soon (loop bodies, hot variables).
- **Spatial locality** — data near recently accessed addresses is likely to be accessed soon (sequential array scans, struct fields used together).

This lab measures these effects empirically across five experiments, using a C++ benchmarking suite compiled with `-O2`.

### Cache Hierarchy on This Machine

| Level | Size | Approx. Latency |
|-------|------|-----------------|
| L1    | 32 KB   | ~4 cycles (~1–2 ns)   |
| L2    | 256 KB  | ~12 cycles (~4 ns)    |
| L3    | 6 MB    | ~40 cycles (~12 ns)   |
| RAM   | > 8 GB  | ~200 cycles (~60 ns)  |

> **Note:** Update the sizes above from `sysctl hw.l1icachesize hw.l2cachesize hw.l3cachesize` (macOS) or `lscpu` (Linux).

---

## 2. Methodology

### 2.1 Timing

All measurements use `std::chrono::high_resolution_clock`. Each data point is the **minimum** across 5 timed runs (best-of-N removes OS jitter). Results are reported as **nanoseconds per memory access** (ns/access) or **GB/s**.

### 2.2 Anti-Optimization

Benchmark loops use a `volatile` sink accumulator to prevent the compiler from eliminating the loop. The `volatile` qualifier forces a write to memory, making every iteration carry a visible side effect. Compiler flags: `-O2 -std=c++17`.

### 2.3 Warm-up

Before each timed run, a warm-up pass touches all array elements once to ensure pages are mapped and TLB entries are established, isolating cache effects from OS page fault overhead.

---

## 3. Experiment 1 — Stride Access Pattern

### Setup

A 64 MB array of `int` (16M elements) is accessed with a varying stride `s` (1, 2, 4, ... 1024 elements). At each stride, $\lfloor 16M / s \rfloor$ unique elements are touched per pass.

```cpp
// Stride benchmark inner loop
for (size_t i = 0; i < N; i += stride)
    sink += arr[i];
```

The array is large enough to exceed all cache levels, so every access to a new cache line is a guaranteed **cache miss** once the stride ≥ (cache line size / element size).

### Expected Behavior

A cache line is 64 bytes (16 × `int`). For strides < 16 elements, multiple accesses hit the same cache line → **low apparent miss rate**. At stride = 16 elements (= 64 bytes), each access hits a *new* cache line → **maximum miss rate**. Beyond that, latency plateaus because miss rate is already 100%.

### Results

*(Insert `results/figures/stride.png` here)*

| Stride (elements) | Stride (bytes) | ns/access |
|-------------------|----------------|-----------|
| 1                 | 4              | [result]  |
| 4                 | 16             | [result]  |
| 16                | 64             | [result]  |
| 64                | 256            | [result]  |
| 1024              | 4096           | [result]  |

### Analysis

The sharp jump in latency at stride = 16 elements (= 64 bytes) directly reveals the **cache line width**. Below this threshold, each cache line load serves multiple accesses (spatial locality). Above it, every access is a독립 cache miss.

---

## 4. Experiment 2 — Working Set Size

### Setup

The array is scanned sequentially (stride = 1) at increasing sizes from 1 KB to 256 MB. This measures the **effective latency per access as the working set overflows each cache level**.

```cpp
// Sequential scan
for (size_t i = 0; i < n; ++i)
    sink += arr[i];
```

### Expected Behavior

Three distinct latency plateaus, each corresponding to a cache level:

1. **L1 plateau** (< 32 KB): fast, ~1–2 ns/access  
2. **L2 plateau** (32 KB – 256 KB): moderate, ~3–5 ns/access  
3. **L3 plateau** (256 KB – 6 MB): slower, ~10–15 ns/access  
4. **RAM region** (> 6 MB): slowest, ~40–60 ns/access  

### Results

*(Insert `results/figures/workingset.png` here)*

### Analysis

The step-function behavior in the log-scale plot directly maps working set overflow to cache level latency. This confirms the cache hierarchy predicted by the hardware specification.

---

## 5. Experiment 3 — Matrix Row-Major vs Column-Major Traversal

### Setup

An NxN matrix of `double` is summed in two traversal orders. Both visit every element exactly once, but their memory access patterns differ fundamentally.

```cpp
// Row-major (spatial locality: accesses arr[i][0], arr[i][1], arr[i][2], ...)
for (int i = 0; i < N; ++i)
    for (int j = 0; j < N; ++j)
        sink += mat[i * N + j];   // stride = 1 element = 8 bytes

// Column-major (poor locality: accesses arr[0][j], arr[1][j], arr[2][j], ...)
for (int j = 0; j < N; ++j)
    for (int i = 0; i < N; ++i)
        sink += mat[i * N + j];   // stride = N elements = N*8 bytes
```

### Expected Behavior

- Row-major: each 64-byte cache line holds 8 `double` values, all of which are consumed before eviction — **8 useful bytes per miss** (spatial locality).
- Column-major: each cache line is loaded, 1 element is used, then the line is evicted before the other 7 elements are ever needed — **1 useful byte per miss** (spatial locality destroyed).

For large N (matrix exceeds L3), column-major should be **≈8× slower** in theory. In practice, effects from prefetchers and cache associativity give 5–20×.

### Results

*(Insert `results/figures/matrix.png` here)*

| N    | Matrix (MB) | Row (ns) | Col (ns) | Slowdown |
|------|-------------|----------|----------|----------|
| 64   | 0.03        | [result] | [result] | [result] |
| 512  | 2.0         | [result] | [result] | [result] |
| 2048 | 32          | [result] | [result] | [result] |
| 4096 | 128         | [result] | [result] | [result] |

### Analysis

The slowdown ratio grows as N increases and the matrix exceeds L3 size. For small matrices fitting in L1/L2, access order matters less because evicted cache lines are quickly re-fetched from L2. For large matrices, column-major causes systematic L3 thrashing.

---

## 6. Experiment 4 — Linked-List Pointer Chasing (Random Access)

### Setup

N nodes of 64 bytes (one cache line each) are allocated, and their `next` pointers are shuffled into a random permutation (Fisher-Yates). Traversal follows the chain for K steps.

```cpp
Node* p = start;
for (int i = 0; i < steps; ++i)
    p = p->next;   // Each hop: random cache miss
```

Because each next-pointer points to a random node, the hardware **stream prefetcher cannot predict** the next address. Every hop beyond L1 results in a full cache miss to the level containing that node.

### Expected Behavior

- Small lists (< 32 KB): all nodes in L1 → fast (~1–2 ns/hop)
- Lists 32 KB – 256 KB: L2 hits (~4 ns/hop)
- Lists 256 KB – 6 MB: L3 hits (~15 ns/hop)
- Large lists (> 6 MB): RAM hits (~60–100 ns/hop)

### Results

*(Insert `results/figures/linkedlist.png` here)*

### Analysis

Contrast with Experiment 2: sequential access was fast even for large arrays because the prefetcher predicts the next address. Pointer chasing completely defeats prefetching — the CPU must wait for each load to complete before knowing the next address (**load-use dependency chain**). This is a fundamental limitation of pointer-heavy data structures (linked lists, tree nodes).

---

## 7. Experiment 5 — Memory Bandwidth

### Setup

Two loops are measured: an **array copy** (`b[i] = a[i]`) and an **array sum** (`sum += a[i]`), sweeping array size from 4 KB to 256 MB.

Bandwidth is calculated as:

$$
\text{Copy GB/s} = \frac{2 \times \text{sizeof(double)}}{\text{ns/access} \times 10^{-9}} \times 10^{-9}
$$

(Copy reads + writes; sum reads only.)

### Expected Behavior

- L1/L2: extremely high bandwidth (hundreds of GB/s for sum; L1 bandwidth often matches register throughput)  
- L3: moderate bandwidth (50–100 GB/s)  
- RAM: limited by memory controller (10–80 GB/s depending on hardware)

### Results

*(Insert `results/figures/bandwidth.png` here)*

### Analysis

Peak L1 bandwidth vastly exceeds DRAM bandwidth. The drop at L2 and again at L3/RAM boundaries shows the progressive bottleneck of the memory hierarchy. Copy bandwidth is approximately half of sum bandwidth for the same array size because copy both reads and writes (uses twice the bus capacity).

---

## 8. Summary and Conclusions

| Experiment | Key Result |
|------------|------------|
| Stride     | Latency jumps sharply at stride = 64 bytes (1 cache line) |
| Working Set | Three distinct plateaus matching L1/L2/L3 boundaries |
| Matrix     | Col-major is 5–20× slower than row-major for large N |
| Ptr Chasing | Random access ~10–50× slower than sequential for large lists |
| Bandwidth  | L1 bandwidth >> L3 bandwidth >> DRAM bandwidth |

### Lessons for Software Design

1. **Use sequential/row-major access** when possible — it exploits spatial locality and enables hardware prefetching.
2. **Keep hot working sets small** — data structures that fit in L1/L2 are orders of magnitude faster.
3. **Avoid pointer-heavy structures** (linked lists, trees) for performance-critical paths; prefer arrays/vectors.
4. **Cache-oblivious algorithms** (e.g., recursive matrix multiply, B-trees) achieve good cache behavior across all levels without knowing cache sizes in advance.
5. **False sharing** (two threads writing to data in the same cache line) causes invisible cache thrashing in parallel programs.

---

## References

1. Bryant, R. E., & O'Hallaron, D. R. (2016). *Computer Systems: A Programmer's Perspective* (3rd ed.). Pearson.
2. Stallings, W. (2018). *Operating Systems: Internals and Design Principles* (9th ed.). Pearson.
3. Drepper, U. (2007). *What Every Programmer Should Know About Memory*. Red Hat, Inc.
4. Intel Corporation. *Intel® 64 and IA-32 Architectures Optimization Reference Manual*.
