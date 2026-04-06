#include "bandwidth_bench.h"
#include "timer.h"
#include "config.h"
#include <vector>
#include <fstream>
#include <iostream>
#include <algorithm>
#include <numeric>

void run_bandwidth_bench(const std::string& output_dir) {
    std::cout << "\n=== Experiment 5: Memory Bandwidth (Copy & Sum) ===\n";
    std::cout << "  Element type: double (8 bytes) | Sweep 4 KB -> 256 MB\n\n";

    std::string outfile = output_dir + "/bandwidth.csv";
    std::ofstream csv(outfile);
    csv << "array_bytes,array_kb,copy_gb_per_s,sum_gb_per_s\n";

    volatile double sink = 0.0;

    // Sweep from 4 KB to 256 MB (powers of 2)
    for (size_t bytes = 4096; bytes <= 256ULL * 1024 * 1024; bytes *= 2) {
        size_t n = bytes / sizeof(double);
        if (n == 0) n = 1;

        std::vector<double> a(n), b(n, 0.0);
        std::iota(a.begin(), a.end(), 1.0);  // a[i] = i+1

        long long passes = std::max(1LL, MIN_ACCESSES / static_cast<long long>(n));

        // --- Copy benchmark: b[i] = a[i] ---
        volatile double copy_sink = 0.0;
        double copy_ns = measure_ns([&]() {
            for (long long p = 0; p < passes; ++p) {
                for (size_t i = 0; i < n; ++i) {
                    b[i] = a[i];
                }
            }
            copy_sink = b[0];
        }, static_cast<long long>(n) * passes, BENCH_ITERS);

        // --- Sum benchmark: sum += a[i] ---
        volatile double sum_sink = 0.0;
        double sum_ns = measure_ns([&]() {
            double s = 0.0;
            for (long long p = 0; p < passes; ++p) {
                for (size_t i = 0; i < n; ++i) {
                    s += a[i];
                }
            }
            sum_sink = s;
        }, static_cast<long long>(n) * passes, BENCH_ITERS);

        sink += copy_sink + sum_sink;

        // ns/access -> GB/s: (8 bytes/access) / (ns/access * 1e-9 s/ns) / 1e9
        double copy_gb = (sizeof(double) * 2.0) / (copy_ns * 1e-9) / 1e9; // read+write
        double sum_gb  = sizeof(double) / (sum_ns * 1e-9) / 1e9;

        double kb = static_cast<double>(bytes) / 1024.0;
        std::cout << "  " << kb << " KB  copy=" << copy_gb
                  << " GB/s  sum=" << sum_gb << " GB/s\n";
        csv << bytes << "," << kb << "," << copy_gb << "," << sum_gb << "\n";
    }

    csv.close();
    (void)sink;
    std::cout << "  Results saved to " << outfile << "\n";
}
