#pragma once
#include <chrono>

// Returns elapsed nanoseconds for a callable f() that takes N accesses.
// Usage: double ns = measure_ns([&](){ ... }, num_accesses);
template<typename Fn>
double measure_ns(Fn&& f, long long num_accesses, int iterations = 5) {
    using clock = std::chrono::high_resolution_clock;
    double best = 1e18;
    for (int i = 0; i < iterations; ++i) {
        auto t0 = clock::now();
        f();
        auto t1 = clock::now();
        double ns = static_cast<double>(
            std::chrono::duration_cast<std::chrono::nanoseconds>(t1 - t0).count()
        ) / static_cast<double>(num_accesses);
        if (ns < best) best = ns;
    }
    return best;
}
