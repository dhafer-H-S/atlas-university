(.venv) Darks-MacBook-Pro:c computer systems darkarc$ ./cache_lab
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

  stride=1 elems (4 B) -> 0.8714 ns/access
  stride=2 elems (8 B) -> 0.8749 ns/access
  stride=4 elems (16 B) -> 0.8776 ns/access
  stride=8 elems (32 B) -> 0.8731 ns/access
  stride=16 elems (64 B) -> 0.8965 ns/access
  stride=32 elems (128 B) -> 2.9763 ns/access
  stride=64 elems (256 B) -> 3.6674 ns/access
  stride=128 elems (512 B) -> 2.2725 ns/access
  stride=256 elems (1024 B) -> 1.6462 ns/access
  stride=512 elems (2048 B) -> 2.2571 ns/access
  stride=1024 elems (4096 B) -> 2.2568 ns/access
  Results saved to results/stride.csv

=== Experiment 2: Working Set Size ===
  Stride: 1 element (sequential) | Sweep 1 KB -> 256 MB

  1 KB -> 0.9748 ns/access
  2 KB -> 0.9991 ns/access
  4 KB -> 1.0023 ns/access
  8 KB -> 0.9976 ns/access
  16 KB -> 1.0081 ns/access
  32 KB -> 1.0051 ns/access
  64 KB -> 1.0153 ns/access
  128 KB -> 1.0088 ns/access
  256 KB -> 1.0066 ns/access
  512 KB -> 1.0091 ns/access
  1024 KB -> 1.0073 ns/access
  2048 KB -> 1.0014 ns/access
  4096 KB -> 1.0061 ns/access
  8192 KB -> 1.0133 ns/access
  16384 KB -> 1.0056 ns/access
  32768 KB -> 1.0056 ns/access
  65536 KB -> 1.0049 ns/access
  131072 KB -> 1.0204 ns/access
  262144 KB -> 1.0076 ns/access
  Results saved to results/workingset.csv

=== Experiment 3: Matrix Row-Major vs Column-Major ===
  Element type: double (8 bytes) | NxN matrices

  N=64 (32 KB)  row=1.8328 col=1.9834 slowdown=1.08x
  N=128 (128 KB)  row=1.9281 col=2.1220 slowdown=1.10x
  N=256 (512 KB)  row=1.9744 col=2.8899 slowdown=1.46x
  N=512 (2048 KB)  row=1.9605 col=2.8770 slowdown=1.47x
  N=1024 (8192 KB)  row=1.9855 col=2.8928 slowdown=1.46x
  N=2048 (32768 KB)  row=1.9748 col=3.0868 slowdown=1.56x
  N=4096 (131072 KB)  row=2.0310 col=3.1648 slowdown=1.56x
  Results saved to results/matrix.csv

=== Experiment 4: Linked-List Pointer Chasing ===
  Node size: 64 bytes (1 cache line) | Sweep 4 KB -> 256 MB

  4 KB  64 nodes -> 0.6562 ns/hop
  8 KB  128 nodes -> 0.6540 ns/hop
  16 KB  256 nodes -> 0.6570 ns/hop
  32 KB  512 nodes -> 0.6538 ns/hop
  64 KB  1024 nodes -> 0.6663 ns/hop
  128 KB  2048 nodes -> 0.6650 ns/hop
  256 KB  4096 nodes -> 2.6035 ns/hop
  512 KB  8192 nodes -> 2.9019 ns/hop
  1024 KB  16384 nodes -> 3.5183 ns/hop
  2048 KB  32768 nodes -> 6.1738 ns/hop
  4096 KB  65536 nodes -> 6.6966 ns/hop
  8192 KB  131072 nodes -> 7.2530 ns/hop
  16384 KB  262144 nodes -> 9.5202 ns/hop
  32768 KB  524288 nodes -> 37.2007 ns/hop
  65536 KB  1048576 nodes -> 69.2358 ns/hop
  131072 KB  2097152 nodes -> 76.0937 ns/hop
  262144 KB  4194304 nodes -> 83.3359 ns/hop
  Results saved to results/linkedlist.csv

=== Experiment 5: Memory Bandwidth (Copy & Sum) ===
  Element type: double (8 bytes) | Sweep 4 KB -> 256 MB

  4 KB  copy=249.01 GB/s  sum=26.69 GB/s
  8 KB  copy=249.98 GB/s  sum=20.78 GB/s
  16 KB  copy=260.15 GB/s  sum=18.63 GB/s
  32 KB  copy=163.59 GB/s  sum=17.65 GB/s
  64 KB  copy=221.33 GB/s  sum=17.59 GB/s
  128 KB  copy=191.51 GB/s  sum=17.15 GB/s
  256 KB  copy=171.94 GB/s  sum=17.19 GB/s
  512 KB  copy=171.94 GB/s  sum=17.24 GB/s
  1024 KB  copy=167.33 GB/s  sum=17.07 GB/s
  2048 KB  copy=167.77 GB/s  sum=17.22 GB/s
  4096 KB  copy=168.74 GB/s  sum=17.18 GB/s
  8192 KB  copy=129.72 GB/s  sum=16.74 GB/s
  16384 KB  copy=108.24 GB/s  sum=17.21 GB/s
  32768 KB  copy=108.94 GB/s  sum=17.10 GB/s
  65536 KB  copy=104.78 GB/s  sum=17.03 GB/s
  131072 KB  copy=107.63 GB/s  sum=17.06 GB/s
  262144 KB  copy=106.82 GB/s  sum=16.95 GB/s
  Results saved to results/bandwidth.csv

=== All done. CSVs are in 'results/' ===
  Run: python3 scripts/plot_results.py --experiment all
