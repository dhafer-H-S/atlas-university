#include "bandwidth_bench.h"
#include "timer.h"
#include "config.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void run_bandwidth_bench(const char *output_dir)
{
    printf("\n=== Experiment 5: Memory Bandwidth (Copy & Sum) ===\n");
    printf("  Element type: double (8 bytes) | Sweep 4 KB -> 256 MB\n\n");

    char outfile[512];
    snprintf(outfile, sizeof(outfile), "%s/bandwidth.csv", output_dir);
    FILE *csv = fopen(outfile, "w");
    if (!csv) { fprintf(stderr, "Cannot open %s\n", outfile); return; }
    fprintf(csv, "array_bytes,array_kb,copy_gb_per_s,sum_gb_per_s\n");

    volatile double sink = 0.0;

    /* Sweep from 4 KB to 256 MB (powers of 2) */
    for (size_t bytes = 4096; bytes <= 256ULL * 1024 * 1024; bytes *= 2) {
        size_t n = bytes / sizeof(double);
        if (n == 0) n = 1;

        double *a = (double *)malloc(n * sizeof(double));
        double *b = (double *)calloc(n, sizeof(double));
        if (!a || !b) { free(a); free(b); fprintf(stderr, "malloc failed\n"); continue; }

        /* a[i] = i+1 (like std::iota starting at 1.0) */
        for (size_t i = 0; i < n; i++) a[i] = (double)(i + 1);

        long long passes = MIN_ACCESSES / (long long)n;
        if (passes < 1) passes = 1;

        /* --- Copy benchmark: b[i] = a[i] --- */
        double copy_ns;
        {
            double best = 1e18;
            for (int iter = 0; iter < BENCH_ITERS; iter++) {
                struct timespec t0, t1;
                volatile double copy_sink;
                CLOCK_NOW(t0);
                for (long long p = 0; p < passes; p++) {
                    for (size_t i = 0; i < n; i++) {
                        b[i] = a[i];
                    }
                }
                copy_sink = b[0];
                CLOCK_NOW(t1);
                sink += copy_sink;
                double ns = timespec_diff_ns(&t0, &t1) / (double)((long long)n * passes);
                if (ns < best) best = ns;
            }
            copy_ns = best;
        }

        /* --- Sum benchmark: s += a[i] --- */
        double sum_ns;
        {
            double best = 1e18;
            for (int iter = 0; iter < BENCH_ITERS; iter++) {
                struct timespec t0, t1;
                volatile double sum_sink = 0.0;
                CLOCK_NOW(t0);
                for (long long p = 0; p < passes; p++) {
                    double s = 0.0;
                    for (size_t i = 0; i < n; i++) {
                        s += a[i];
                    }
                    sum_sink = s;
                }
                CLOCK_NOW(t1);
                sink += sum_sink;
                double ns = timespec_diff_ns(&t0, &t1) / (double)((long long)n * passes);
                if (ns < best) best = ns;
            }
            sum_ns = best;
        }

        /* ns/access -> GB/s: (8 bytes/access) / (ns/access * 1e-9 s/ns) / 1e9 */
        double copy_gb = ((double)sizeof(double) * 2.0) / (copy_ns * 1e-9) / 1e9; /* read+write */
        double sum_gb  =  (double)sizeof(double)        / (sum_ns  * 1e-9) / 1e9;

        double kb = (double)bytes / 1024.0;
        printf("  %.0f KB  copy=%.2f GB/s  sum=%.2f GB/s\n", kb, copy_gb, sum_gb);
        fprintf(csv, "%zu,%.4f,%.6f,%.6f\n", bytes, kb, copy_gb, sum_gb);

        free(a);
        free(b);
    }

    fclose(csv);
    (void)sink;
    printf("  Results saved to %s\n", outfile);
}
