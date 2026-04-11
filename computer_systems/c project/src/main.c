#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include "config.h"
#include "stride_bench.h"
#include "workingset_bench.h"
#include "matrix_bench.h"
#include "linkedlist_bench.h"
#include "bandwidth_bench.h"

static void print_usage(const char *prog)
{
    printf("Usage: %s [all | stride | workingset | matrix | linkedlist | bandwidth]\n", prog);
    printf("  all        - Run all experiments (default)\n");
    printf("  stride     - Exp 1: Stride access pattern\n");
    printf("  workingset - Exp 2: Working set size vs cache levels\n");
    printf("  matrix     - Exp 3: Row-major vs column-major traversal\n");
    printf("  linkedlist - Exp 4: Random pointer chasing\n");
    printf("  bandwidth  - Exp 5: Memory bandwidth (copy & sum)\n");
}

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

int main(int argc, char *argv[])
{
    const char *mode = "all";

    if (argc >= 2) {
        mode = argv[1];
        if (strcmp(mode, "-h") == 0 || strcmp(mode, "--help") == 0) {
            print_usage(argv[0]);
            return 0;
        }
    }

    /* Ensure results directory exists */
    mkdir("results", 0755);

    print_machine_info();

    if (strcmp(mode, "all") == 0 || strcmp(mode, "stride") == 0)
        run_stride_bench("results");

    if (strcmp(mode, "all") == 0 || strcmp(mode, "workingset") == 0)
        run_workingset_bench("results");

    if (strcmp(mode, "all") == 0 || strcmp(mode, "matrix") == 0)
        run_matrix_bench("results");

    if (strcmp(mode, "all") == 0 || strcmp(mode, "linkedlist") == 0)
        run_linkedlist_bench("results");

    if (strcmp(mode, "all") == 0 || strcmp(mode, "bandwidth") == 0)
        run_bandwidth_bench("results");

    if (strcmp(mode, "all")        != 0 &&
        strcmp(mode, "stride")     != 0 &&
        strcmp(mode, "workingset") != 0 &&
        strcmp(mode, "matrix")     != 0 &&
        strcmp(mode, "linkedlist") != 0 &&
        strcmp(mode, "bandwidth")  != 0) {
        fprintf(stderr, "Unknown experiment: %s\n", mode);
        print_usage(argv[0]);
        return 1;
    }

    printf("\n=== All done. CSVs are in 'results/' ===\n");
    printf("  Run: python3 scripts/plot_results.py --experiment all\n");
    return 0;
}
