# workingset_bench.c

Original file: `src/workingset_bench.c`

```c
#include "workingset_bench.h"
#include "timer.h"
#include "config.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void run_workingset_bench(const char *output_dir)
{
    printf("\n=== Experiment 2: Working Set Size ===\n");
    printf("  Stride: 1 element (sequential) | Sweep 1 KB -> 256 MB\n\n");

    char outfile[512];
    snprintf(outfile, sizeof(outfile), "%s/workingset.csv", output_dir);
    FILE *csv = fopen(outfile, "w");
    if (!csv) { fprintf(stderr, "Cannot open %s\n", outfile); return; }
    fprintf(csv, "array_bytes,array_kb,ns_per_access\n");

    volatile int sink = 0;

    /* Powers of 2 from 1 KB to 256 MB */
    for (size_t bytes = 1024; bytes <= 256ULL * 1024 * 1024; bytes *= 2) {
        size_t n = bytes / sizeof(int);
        if (n == 0) n = 1;

        int *arr = (int *)malloc(n * sizeof(int));
        if (!arr) { fprintf(stderr, "malloc failed\n"); continue; }

        /* Touch all pages before timing */
        for (size_t i = 0; i < n; i++) arr[i] = (int)(i & 0xFF);

        long long n_accesses = (long long)n;
        long long passes = MIN_ACCESSES / n_accesses;
        if (passes < 1) passes = 1;

        double best_ns = 1e18;
        for (int iter = 0; iter < BENCH_ITERS; iter++) {
            struct timespec t0, t1;
            volatile int local_sink = 0;

            CLOCK_NOW(t0);
            for (long long p = 0; p < passes; p++) {
                for (size_t i = 0; i < n; i++) {
                    local_sink += arr[i];
                }
            }
            CLOCK_NOW(t1);

            sink += local_sink;
            double ns = timespec_diff_ns(&t0, &t1) / (double)(n_accesses * passes);
            if (ns < best_ns) best_ns = ns;
        }

        double kb = (double)bytes / 1024.0;
        printf("  %.0f KB -> %.4f ns/access\n", kb, best_ns);
        fprintf(csv, "%zu,%.4f,%.6f\n", bytes, kb, best_ns);

        free(arr);
    }

    fclose(csv);
    (void)sink;
    printf("  Results saved to %s\n", outfile);
}

```
