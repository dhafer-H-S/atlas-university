# matrix_bench.c

Original file: `src/matrix_bench.c`

```c
#include "matrix_bench.h"
#include "timer.h"
#include "config.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void run_matrix_bench(const char *output_dir)
{
    printf("\n=== Experiment 3: Matrix Row-Major vs Column-Major ===\n");
    printf("  Element type: double (8 bytes) | NxN matrices\n\n");

    char outfile[512];
    snprintf(outfile, sizeof(outfile), "%s/matrix.csv", output_dir);
    FILE *csv = fopen(outfile, "w");
    if (!csv) { fprintf(stderr, "Cannot open %s\n", outfile); return; }
    fprintf(csv, "N,matrix_bytes,rowmajor_ns,colmajor_ns,slowdown_ratio\n");

    volatile double sink = 0.0;

    /* Sweep N from 64 to 4096 */
    for (int N = 64; N <= 4096; N *= 2) {
        size_t total = (size_t)N * (size_t)N;
        double *mat = (double *)malloc(total * sizeof(double));
        if (!mat) { fprintf(stderr, "malloc failed\n"); continue; }

        /* Initialize with distinct values */
        for (size_t i = 0; i < total; i++) mat[i] = (double)(i & 0xFF);

        long long n_accesses = (long long)N * N;
        long long passes = MIN_ACCESSES / n_accesses;
        if (passes < 1) passes = 1;

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

        double ratio = col_ns / row_ns;
        size_t matrix_bytes = total * sizeof(double);
        printf("  N=%d (%zu KB)  row=%.4f col=%.4f slowdown=%.2fx\n",
               N, matrix_bytes / 1024, row_ns, col_ns, ratio);
        fprintf(csv, "%d,%zu,%.6f,%.6f,%.6f\n",
                N, matrix_bytes, row_ns, col_ns, ratio);

        free(mat);
    }

    fclose(csv);
    (void)sink;
    printf("  Results saved to %s\n", outfile);
}

```
