#include <iostream>
#include <string>
#include <filesystem>
#include "config.h"
#include "stride_bench.h"
#include "workingset_bench.h"
#include "matrix_bench.h"
#include "linkedlist_bench.h"
#include "bandwidth_bench.h"

namespace fs = std::filesystem;

static void print_usage(const char* prog) {
    std::cout << "Usage: " << prog
              << " [all | stride | workingset | matrix | linkedlist | bandwidth]\n";
    std::cout << "  all        - Run all experiments (default)\n";
    std::cout << "  stride     - Exp 1: Stride access pattern\n";
    std::cout << "  workingset - Exp 2: Working set size vs cache levels\n";
    std::cout << "  matrix     - Exp 3: Row-major vs column-major traversal\n";
    std::cout << "  linkedlist - Exp 4: Random pointer chasing\n";
    std::cout << "  bandwidth  - Exp 5: Memory bandwidth (copy & sum)\n";
}

static void print_machine_info() {
    std::cout << "============================================\n";
    std::cout << "  Cache & Locality Performance Lab\n";
    std::cout << "============================================\n";
    std::cout << "  Configured cache sizes (edit src/config.h):\n";
    std::cout << "    L1: " << (L1_SIZE / 1024) << " KB\n";
    std::cout << "    L2: " << (L2_SIZE / 1024) << " KB\n";
    std::cout << "    L3: " << (L3_SIZE / (1024 * 1024)) << " MB\n";
    std::cout << "  Timer: std::chrono::high_resolution_clock\n";
    std::cout << "  Timed iterations per point: " << BENCH_ITERS << " (best-of)\n";
    std::cout << "============================================\n";
}

int main(int argc, char* argv[]) {
    std::string mode = "all";
    if (argc >= 2) {
        mode = argv[1];
        if (mode == "-h" || mode == "--help") {
            print_usage(argv[0]);
            return 0;
        }
    }

    // Ensure results directory exists
    const std::string results_dir = "results";
    fs::create_directories(results_dir);

    print_machine_info();

    if (mode == "all" || mode == "stride")
        run_stride_bench(results_dir);

    if (mode == "all" || mode == "workingset")
        run_workingset_bench(results_dir);

    if (mode == "all" || mode == "matrix")
        run_matrix_bench(results_dir);

    if (mode == "all" || mode == "linkedlist")
        run_linkedlist_bench(results_dir);

    if (mode == "all" || mode == "bandwidth")
        run_bandwidth_bench(results_dir);

    if (mode != "all"  && mode != "stride"  && mode != "workingset" &&
        mode != "matrix" && mode != "linkedlist" && mode != "bandwidth") {
        std::cerr << "Unknown experiment: " << mode << "\n";
        print_usage(argv[0]);
        return 1;
    }

    std::cout << "\n=== All done. CSVs are in '" << results_dir << "/' ===\n";
    std::cout << "  Run: python3 scripts/plot_results.py --experiment all\n";
    return 0;
}
