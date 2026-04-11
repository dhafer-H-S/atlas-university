#ifndef STRIDE_BENCH_H
#define STRIDE_BENCH_H

/* Experiment 1: Stride Access Pattern
 * Fix array at 64 MB; sweep stride 1..1024 elements.
 * Measures ns/access vs stride to reveal cache-line granularity. */
void run_stride_bench(const char *output_dir);

#endif /* STRIDE_BENCH_H */
