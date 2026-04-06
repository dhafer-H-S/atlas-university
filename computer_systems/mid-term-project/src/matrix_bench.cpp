#include "matrix_bench.h"
#include "timer.h"
#include "config.h"
#include <vector>
#include <fstream>
#include <iostream>
#include <algorithm>

void run_matrix_bench(const std::string& output_dir) {
    std::cout << "\n=== Experiment 3: Matrix Row-Major vs Column-Major ===\n";
    std::cout << "  Element type: double (8 bytes) | NxN matrices\n\n";

    std::string outfile = output_dir + "/matrix.csv";
    std::ofstream csv(outfile);
    csv << "N,matrix_bytes,rowmajor_ns,colmajor_ns,slowdown_ratio\n";

    volatile double sink = 0.0;

    // Sweep N from 64 to 4096
    for (int N = 64; N <= 4096; N *= 2) {
        size_t total = static_cast<size_t>(N) * N;
        std::vector<double> mat(total, 1.0);

        // Initialize with distinct values
        for (size_t i = 0; i < total; ++i) mat[i] = static_cast<double>(i & 0xFF);

        long long n_accesses = static_cast<long long>(N) * N;
        long long passes = std::max(1LL, MIN_ACCESSES / n_accesses);

        // Row-major: inner loop steps by 1 element (contiguous)
        volatile double row_sink = 0.0;
        double row_ns = measure_ns([&]() {
            for (long long p = 0; p < passes; ++p) {
                for (int i = 0; i < N; ++i) {
                    for (int j = 0; j < N; ++j) {
                        row_sink += mat[static_cast<size_t>(i) * N + j];
                    }
                }
            }
        }, n_accesses * passes, BENCH_ITERS);

        // Column-major: inner loop steps by N elements (stride = N*8 bytes)
        volatile double col_sink = 0.0;
        double col_ns = measure_ns([&]() {
            for (long long p = 0; p < passes; ++p) {
                for (int j = 0; j < N; ++j) {
                    for (int i = 0; i < N; ++i) {
                        col_sink += mat[static_cast<size_t>(i) * N + j];
                    }
                }
            }
        }, n_accesses * passes, BENCH_ITERS);

        sink += row_sink + col_sink;
        double ratio = col_ns / row_ns;
        size_t matrix_bytes = total * sizeof(double);
        std::cout << "  N=" << N << " (" << (matrix_bytes / 1024) << " KB)  "
                  << "row=" << row_ns << " col=" << col_ns
                  << " slowdown=" << ratio << "x\n";
        csv << N << "," << matrix_bytes << "," << row_ns << "," << col_ns << "," << ratio << "\n";
    }

    csv.close();
    (void)sink;
    std::cout << "  Results saved to " << outfile << "\n";
}
