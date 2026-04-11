#ifndef BANDWIDTH_BENCH_H
#define BANDWIDTH_BENCH_H

/* Experiment 5: Memory Bandwidth (Copy & Sum)
 * Sweeps array size; reports GB/s for array copy and sequential sum.
 * Shows peak bandwidth per cache level. */
void run_bandwidth_bench(const char *output_dir);

#endif /* BANDWIDTH_BENCH_H */
