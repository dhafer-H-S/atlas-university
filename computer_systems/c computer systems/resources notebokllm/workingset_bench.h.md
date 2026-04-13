# workingset_bench.h

Original file: `src/workingset_bench.h`

```c
#ifndef WORKINGSET_BENCH_H
#define WORKINGSET_BENCH_H

/* Experiment 2: Working Set Size
 * Fix stride=1 (sequential); sweep array size 1 KB -> 256 MB.
 * Reveals L1/L2/L3/RAM latency plateaus. */
void run_workingset_bench(const char *output_dir);

#endif /* WORKINGSET_BENCH_H */

```
