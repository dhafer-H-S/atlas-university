# stride_bench.c

Original file: `src/stride_bench.c`

```c
#include "stride_bench.h"
#include "timer.h"
#include "config.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void run_stride_bench(const char *output_dir)
{
    printf("\n=== Experiment 1: Stride Access Pattern ===\n");
    printf("  Array size: 64 MB | Element type: int (4 bytes)\n");
    printf("  Sweep stride 1 -> 1024 elements\n\n");

    /* 64 MB array of int (fills any typical L3) */
    const size_t ARRAY_BYTES = 64ULL * 1024 * 1024;
    const size_t N = ARRAY_BYTES / sizeof(int);
    int *arr = (int *)malloc(N * sizeof(int));
    if (!arr) { fprintf(stderr, "malloc failed\n"); return; }
    for (size_t i = 0; i < N; i++) arr[i] = 1;

    /* Warm-up: touch all pages */
    volatile int sink = 0;
    for (size_t i = 0; i < N; i++) sink += arr[i];

    char outfile[512];
    snprintf(outfile, sizeof(outfile), "%s/stride.csv", output_dir);
    FILE *csv = fopen(outfile, "w");
    if (!csv) { fprintf(stderr, "Cannot open %s\n", outfile); free(arr); return; }
    fprintf(csv, "stride_elements,stride_bytes,ns_per_access\n");

    /* Strides to test (in elements) */
    const int strides[] = {1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024};
    const int n_strides = (int)(sizeof(strides) / sizeof(strides[0]));

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

    fclose(csv);
    free(arr);
    (void)sink;
    printf("  Results saved to %s\n", outfile);
}

```
