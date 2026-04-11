# Valuable Functions and Sample Output

This note collects the most useful code snippets in the cache and locality lab. These are the functions that define the timing model, print the machine configuration, and implement the benchmark patterns that expose cache behavior.

## 1. Machine configuration banner

This function prints the cache configuration and benchmark settings before any experiment runs.

Source: `src/main.c`

```c
static void print_machine_info(void)
{
    printf("============================================\n");
    printf("  Cache & Locality Performance Lab\n");
    printf("============================================\n");
    printf("  Configured cache sizes (edit src/config.h):\n");
    printf("    L1: %zu KB\n",  (size_t)(L1_SIZE / 1024));
    printf("    L2: %zu KB\n",  (size_t)(L2_SIZE / 1024));
    printf("    L3: %zu MB\n",  (size_t)(L3_SIZE / (1024 * 1024)));
    printf("  Timer: clock_gettime(CLOCK_MONOTONIC)\n");
    printf("  Timed iterations per point: %d (best-of)\n", BENCH_ITERS);
    printf("============================================\n");
}
```

Why it matters:

- Makes the run self-describing.
- Connects runtime output to the values in `src/config.h`.
- Shows that every benchmark uses the same timing method and repeat count.

## 2. Core timer helper

This helper converts two `timespec` values into nanoseconds, which is the base unit used throughout the lab.

Source: `src/timer.h`

```c
static inline double timespec_diff_ns(const struct timespec *t0,
                                      const struct timespec *t1)
{
    return (double)(t1->tv_sec  - t0->tv_sec)  * 1.0e9
         + (double)(t1->tv_nsec - t0->tv_nsec);
}

#define CLOCK_NOW(ts)  clock_gettime(CLOCK_MONOTONIC, &(ts))
```

Why it matters:

- Every experiment depends on this measurement primitive.
- `CLOCK_MONOTONIC` avoids wall-clock adjustments.
- The rest of the code normalizes this elapsed time into ns/access, ns/hop, or GB/s.

## 3. Stride benchmark timed loop

This is the main locality experiment. It varies the gap between accessed elements and measures the cost per access.

Source: `src/stride_bench.c`

```c
for (int si = 0; si < n_strides; si++) {
    int stride = strides[si];
    long long n_accesses = (long long)N / stride;
    long long passes = MIN_ACCESSES / n_accesses;
    if (passes < 1) passes = 1;

    double best_ns = 1e18;
    for (int iter = 0; iter < BENCH_ITERS; iter++) {
        struct timespec t0, t1;
        volatile int local_sink = 0;

        CLOCK_NOW(t0);
        for (long long p = 0; p < passes; p++) {
            for (size_t i = 0; i < N; i += (size_t)stride) {
                local_sink += arr[i];
            }
        }
        CLOCK_NOW(t1);

        sink += local_sink;
        double ns = timespec_diff_ns(&t0, &t1) / (double)(n_accesses * passes);
        if (ns < best_ns) best_ns = ns;
    }

    int stride_bytes = stride * (int)sizeof(int);
    printf("  stride=%d elems (%d B) -> %.4f ns/access\n",
           stride, stride_bytes, best_ns);
    fprintf(csv, "%d,%d,%.6f\n", stride, stride_bytes, best_ns);
}
```

Why it matters:

- Shows how spatial locality degrades as stride grows.
- Uses `best-of` timing to reduce noise.
- Writes both human-readable output and CSV data for plotting.

## 4. Matrix row-major vs column-major traversal

This snippet compares contiguous traversal against strided traversal on the same matrix.

Source: `src/matrix_bench.c`

```c
/* Row-major: inner loop steps by 1 element (contiguous) */
double row_ns;
{
    double best = 1e18;
    for (int iter = 0; iter < BENCH_ITERS; iter++) {
        struct timespec t0, t1;
        volatile double row_sink = 0.0;
        CLOCK_NOW(t0);
        for (long long p = 0; p < passes; p++) {
            for (int i = 0; i < N; i++) {
                for (int j = 0; j < N; j++) {
                    row_sink += mat[(size_t)i * (size_t)N + (size_t)j];
                }
            }
        }
        CLOCK_NOW(t1);
        sink += row_sink;
        double ns = timespec_diff_ns(&t0, &t1) / (double)(n_accesses * passes);
        if (ns < best) best = ns;
    }
    row_ns = best;
}

/* Column-major: inner loop steps by N elements (stride = N*8 bytes) */
double col_ns;
{
    double best = 1e18;
    for (int iter = 0; iter < BENCH_ITERS; iter++) {
        struct timespec t0, t1;
        volatile double col_sink = 0.0;
        CLOCK_NOW(t0);
        for (long long p = 0; p < passes; p++) {
            for (int j = 0; j < N; j++) {
                for (int i = 0; i < N; i++) {
                    col_sink += mat[(size_t)i * (size_t)N + (size_t)j];
                }
            }
        }
        CLOCK_NOW(t1);
        sink += col_sink;
        double ns = timespec_diff_ns(&t0, &t1) / (double)(n_accesses * passes);
        if (ns < best) best = ns;
    }
    col_ns = best;
}
```

Why it matters:

- Demonstrates the effect of layout-aware loop ordering.
- Keeps the data set identical while changing only the access order.
- Produces the slowdown ratio that is easy to discuss in reports.

## 5. Pointer-chasing kernel

This is the most important snippet for latency-dominated behavior. The dependency chain prevents easy prefetching and limits instruction-level overlap.

Source: `src/linkedlist_bench.c`

```c
__attribute__((noinline))
static Node *chase_nodes(Node *start, size_t n_nodes, long long passes)
{
    Node *p = start;
    for (long long pass = 0; pass < passes; pass++) {
        for (size_t i = 0; i < n_nodes; i++) {
            p = p->next;
            __asm__ volatile("" ::: "memory");
        }
    }
    return p;
}
```

Why it matters:

- Models cache-miss latency more directly than array streaming.
- The `noinline` and compiler barrier help preserve the dependency chain.
- Useful for explaining why linked structures behave differently from arrays.

## 6. Memory bandwidth conversion

This part turns raw timing into throughput for copy and sum kernels.

Source: `src/bandwidth_bench.c`

```c
/* ns/access -> GB/s: (8 bytes/access) / (ns/access * 1e-9 s/ns) / 1e9 */
double copy_gb = ((double)sizeof(double) * 2.0) / (copy_ns * 1e-9) / 1e9;
double sum_gb  =  (double)sizeof(double)        / (sum_ns  * 1e-9) / 1e9;

double kb = (double)bytes / 1024.0;
printf("  %.0f KB  copy=%.2f GB/s  sum=%.2f GB/s\n", kb, copy_gb, sum_gb);
fprintf(csv, "%zu,%.4f,%.6f,%.6f\n", bytes, kb, copy_gb, sum_gb);
```

Why it matters:

- Separates read-only throughput from read+write throughput.
- Converts per-element timing into a system-level bandwidth metric.
- Makes it easy to compare cache-resident and DRAM-sized transfers.

## Sample Output

The following is the sample console output you provided for a full run:

```text
============================================
  Cache & Locality Performance Lab
============================================
  Configured cache sizes (edit src/config.h):
    L1: 32 KB
    L2: 256 KB
    L3: 6 MB
  Timer: clock_gettime(CLOCK_MONOTONIC)
  Timed iterations per point: 5 (best-of)
============================================

=== Experiment 1: Stride Access Pattern ===
  Array size: 64 MB | Element type: int (4 bytes)
  Sweep stride 1 -> 1024 elements

  stride=1 elems (4 B) -> 0.8823 ns/access
  stride=2 elems (8 B) -> 0.8755 ns/access
  stride=4 elems (16 B) -> 0.8755 ns/access
  stride=8 elems (32 B) -> 0.8783 ns/access
  stride=16 elems (64 B) -> 0.9012 ns/access
  stride=32 elems (128 B) -> 4.4253 ns/access
  stride=64 elems (256 B) -> 3.6222 ns/access
  stride=128 elems (512 B) -> 2.1469 ns/access
  stride=256 elems (1024 B) -> 1.6017 ns/access
  stride=512 elems (2048 B) -> 2.3729 ns/access
  stride=1024 elems (4096 B) -> 2.2816 ns/access
  Results saved to results/stride.csv

=== Experiment 2: Working Set Size ===
  Stride: 1 element (sequential) | Sweep 1 KB -> 256 MB

  1 KB -> 0.9762 ns/access
  2 KB -> 0.9951 ns/access
  4 KB -> 0.9961 ns/access
  8 KB -> 1.0006 ns/access
  16 KB -> 1.0016 ns/access
  32 KB -> 1.0041 ns/access
  64 KB -> 1.0041 ns/access
  128 KB -> 1.0041 ns/access
  256 KB -> 1.0038 ns/access
  512 KB -> 1.0073 ns/access
  1024 KB -> 1.0017 ns/access
  2048 KB -> 1.0054 ns/access
  4096 KB -> 1.0077 ns/access
  8192 KB -> 1.0004 ns/access
  16384 KB -> 1.0042 ns/access
  32768 KB -> 1.0034 ns/access
  65536 KB -> 1.0042 ns/access
  131072 KB -> 1.0043 ns/access
  262144 KB -> 1.0114 ns/access
  Results saved to results/workingset.csv

=== Experiment 3: Matrix Row-Major vs Column-Major ===
  Element type: double (8 bytes) | NxN matrices

  N=64 (32 KB)  row=1.8120 col=1.9711 slowdown=1.09x
  N=128 (128 KB)  row=1.9104 col=2.0975 slowdown=1.10x
  N=256 (512 KB)  row=1.9504 col=2.9049 slowdown=1.49x
  N=512 (2048 KB)  row=1.9590 col=2.8483 slowdown=1.45x
  N=1024 (8192 KB)  row=1.9789 col=2.8804 slowdown=1.46x
  N=2048 (32768 KB)  row=1.9736 col=2.9318 slowdown=1.49x
  N=4096 (131072 KB)  row=1.9857 col=3.0484 slowdown=1.54x
  Results saved to results/matrix.csv

=== Experiment 4: Linked-List Pointer Chasing ===
  Node size: 64 bytes (1 cache line) | Sweep 4 KB -> 256 MB

  4 KB  64 nodes -> 0.6637 ns/hop
  8 KB  128 nodes -> 0.6567 ns/hop
  16 KB  256 nodes -> 0.6615 ns/hop
  32 KB  512 nodes -> 0.6660 ns/hop
  64 KB  1024 nodes -> 0.6585 ns/hop
  128 KB  2048 nodes -> 0.6660 ns/hop
  256 KB  4096 nodes -> 4.6267 ns/hop
  512 KB  8192 nodes -> 7.9126 ns/hop
  1024 KB  16384 nodes -> 5.6030 ns/hop
  2048 KB  32768 nodes -> 11.0989 ns/hop
  4096 KB  65536 nodes -> 6.4372 ns/hop
  8192 KB  131072 nodes -> 7.1696 ns/hop
  16384 KB  262144 nodes -> 9.6603 ns/hop
  32768 KB  524288 nodes -> 36.6176 ns/hop
  65536 KB  1048576 nodes -> 69.1703 ns/hop
  131072 KB  2097152 nodes -> 77.6982 ns/hop
  262144 KB  4194304 nodes -> 83.3948 ns/hop
  Results saved to results/linkedlist.csv

=== Experiment 5: Memory Bandwidth (Copy & Sum) ===
  Element type: double (8 bytes) | Sweep 4 KB -> 256 MB

  4 KB  copy=226.94 GB/s  sum=26.64 GB/s
  8 KB  copy=249.98 GB/s  sum=20.75 GB/s
  16 KB  copy=259.09 GB/s  sum=18.82 GB/s
  32 KB  copy=170.57 GB/s  sum=17.56 GB/s
  64 KB  copy=221.33 GB/s  sum=17.56 GB/s
  128 KB  copy=190.93 GB/s  sum=17.23 GB/s
  256 KB  copy=167.88 GB/s  sum=17.09 GB/s
  512 KB  copy=123.24 GB/s  sum=17.25 GB/s
  1024 KB  copy=143.31 GB/s  sum=16.82 GB/s
  2048 KB  copy=121.46 GB/s  sum=17.19 GB/s
  4096 KB  copy=146.43 GB/s  sum=17.21 GB/s
  8192 KB  copy=142.99 GB/s  sum=17.18 GB/s
  16384 KB  copy=117.32 GB/s  sum=17.15 GB/s
  32768 KB  copy=118.57 GB/s  sum=16.98 GB/s
  65536 KB  copy=110.74 GB/s  sum=17.02 GB/s
  131072 KB  copy=108.20 GB/s  sum=16.94 GB/s
  262144 KB  copy=107.37 GB/s  sum=16.93 GB/s
  Results saved to results/bandwidth.csv

=== All done. CSVs are in 'results/' ===
  Run: python3 scripts/plot_results.py --experiment all
(.venv) Darks-MacBook-Pro:c computer systems darkarc$
```