#pragma once
#include <cstddef>

// -------------------------------------------------------
// Typical cache sizes — edit to match your machine.
// Run: sysctl hw.l1icachesize hw.l2cachesize hw.l3cachesize  (macOS)
//   or: cat /sys/devices/system/cpu/cpu0/cache/index*/size  (Linux)
// -------------------------------------------------------
static constexpr size_t L1_SIZE = 32  * 1024ULL;        //  32 KB
static constexpr size_t L2_SIZE = 256 * 1024ULL;        // 256 KB
static constexpr size_t L3_SIZE = 6   * 1024 * 1024ULL; //   6 MB (Apple M-series varies)

// Number of timed iterations per data point (best-of N)
static constexpr int BENCH_ITERS = 5;

// Minimum number of accesses per timed measurement to reduce clock noise
static constexpr long long MIN_ACCESSES = 4'000'000LL;
