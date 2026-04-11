#include "stride_bench.h"
#include "timer.h"
#include "config.h"
#include <vector>
#include <fstream>
#include <iostream>
#include <cstdint>
#include <algorithm>

void run_stride_bench(const std::string& output_dir) {
    std::cout << "\n=== Experiment 1: Stride Access Pattern ===\n";
    std::cout << "  Array size: 64 MB | Element type: int (4 bytes)\n";
    std::cout << "  Sweep stride 1 -> 1024 elements\n\n";

    // 64 MB array of int (fills any typical L3)
    constexpr size_t ARRAY_BYTES = 64ULL * 1024 * 1024;
    constexpr size_t N = ARRAY_BYTES / sizeof(int);
    std::vector<int> arr(N, 1);

    // Warm-up: touch all pages
    volatile int sink = 0;
    for (size_t i = 0; i < N; ++i) sink += arr[i];

    std::string outfile = output_dir + "/stride.csv";
    std::ofstream csv(outfile);
    csv << "stride_elements,stride_bytes,ns_per_access\n";

    // Strides to test (in elements)
    const int strides[] = {1,2,4,8,16,32,64,128,256,512,1024};

    for (int stride : strides) {
        // Number of accesses per pass
        long long n_accesses = static_cast<long long>(N) / stride;
        // Ensure enough total accesses for accuracy
        long long passes = std::max(1LL, MIN_ACCESSES / n_accesses);

        volatile int local_sink = 0;
        double ns = measure_ns([&]() {
            for (long long p = 0; p < passes; ++p) {
                for (size_t i = 0; i < N; i += stride) {
                    local_sink += arr[i];
                }
            }
        }, n_accesses * passes, BENCH_ITERS);

        sink += local_sink;
        int stride_bytes = stride * static_cast<int>(sizeof(int));
        std::cout << "  stride=" << stride << " elems (" << stride_bytes
                  << " B) -> " << ns << " ns/access\n";
        csv << stride << "," << stride_bytes << "," << ns << "\n";
    }

    csv.close();
    (void)sink;
    std::cout << "  Results saved to " << outfile << "\n";
}
