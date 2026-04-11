#include "workingset_bench.h"
#include "timer.h"
#include "config.h"
#include <vector>
#include <fstream>
#include <iostream>
#include <algorithm>

void run_workingset_bench(const std::string& output_dir) {
    std::cout << "\n=== Experiment 2: Working Set Size ===\n";
    std::cout << "  Stride: 1 element (sequential) | Sweep 1 KB -> 256 MB\n\n";

    std::string outfile = output_dir + "/workingset.csv";
    std::ofstream csv(outfile);
    csv << "array_bytes,array_kb,ns_per_access\n";

    volatile int sink = 0;

    // Powers of 2 from 1 KB to 256 MB
    for (size_t bytes = 1024; bytes <= 256ULL * 1024 * 1024; bytes *= 2) {
        size_t n = bytes / sizeof(int);
        if (n == 0) n = 1;
        std::vector<int> arr(n, 1);

        // Touch all pages before timing
        for (size_t i = 0; i < n; ++i) arr[i] = static_cast<int>(i & 0xFF);

        long long n_accesses = static_cast<long long>(n);
        long long passes = std::max(1LL, MIN_ACCESSES / n_accesses);

        volatile int local_sink = 0;
        double ns = measure_ns([&]() {
            for (long long p = 0; p < passes; ++p) {
                for (size_t i = 0; i < n; ++i) {
                    local_sink += arr[i];
                }
            }
        }, n_accesses * passes, BENCH_ITERS);

        sink += local_sink;
        double kb = static_cast<double>(bytes) / 1024.0;
        std::cout << "  " << kb << " KB -> " << ns << " ns/access\n";
        csv << bytes << "," << kb << "," << ns << "\n";
    }

    csv.close();
    (void)sink;
    std::cout << "  Results saved to " << outfile << "\n";
}
