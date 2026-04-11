#include "linkedlist_bench.h"
#include "timer.h"
#include "config.h"
#include <vector>
#include <fstream>
#include <iostream>
#include <algorithm>
#include <numeric>
#include <random>

// Each node is padded to 64 bytes (one cache line) to prevent
// false spatial locality from packing.
struct alignas(64) Node {
    Node* next;
    char  pad[64 - sizeof(Node*)];
};

// __attribute__((noinline)) prevents the compiler from inlining this function
// and collapsing the pointer-chasing dependency chain at -O2.
// The asm volatile("" ::: "memory") inside the loop is a *compiler* memory
// barrier: it tells the compiler that this inline-assembly statement may
// read or write ANY memory location, so the p->next load cannot be hoisted,
// reordered, or eliminated.  It emits zero actual CPU instructions.
__attribute__((noinline))
static Node* chase_nodes(Node* start, size_t n_nodes, long long passes) {
    Node* p = start;
    for (long long pass = 0; pass < passes; ++pass) {
        for (size_t i = 0; i < n_nodes; ++i) {
            p = p->next;
            asm volatile("" ::: "memory"); // compiler barrier — prevents loop collapse
        }
    }
    return p;
}

void run_linkedlist_bench(const std::string& output_dir) {
    std::cout << "\n=== Experiment 4: Linked-List Pointer Chasing ===\n";
    std::cout << "  Node size: 64 bytes (1 cache line) | Sweep 4 KB -> 256 MB\n\n";

    std::string outfile = output_dir + "/linkedlist.csv";
    std::ofstream csv(outfile);
    csv << "list_bytes,list_kb,ns_per_hop\n";

    std::mt19937 rng(42);

    volatile Node* sink = nullptr;

    // Sweep list size from 4 KB to 256 MB (powers of 2)
    for (size_t bytes = 4096; bytes <= 256ULL * 1024 * 1024; bytes *= 2) {
        size_t n_nodes = bytes / sizeof(Node);
        if (n_nodes < 4) n_nodes = 4;

        std::vector<Node> nodes(n_nodes);

        // Build a random permutation of indices -> shuffled linked list
        std::vector<size_t> order(n_nodes);
        std::iota(order.begin(), order.end(), 0);
        std::shuffle(order.begin(), order.end(), rng);

        for (size_t i = 0; i < n_nodes; ++i) {
            nodes[order[i]].next = &nodes[order[(i + 1) % n_nodes]];
        }

        // Warm up: walk once
        {
            Node* p = &nodes[order[0]];
            for (size_t i = 0; i < n_nodes; ++i) p = p->next;
            sink = p;
        }

        long long passes = std::max(1LL, MIN_ACCESSES / static_cast<long long>(n_nodes));

        volatile Node* local_sink = &nodes[order[0]];
        double ns = measure_ns([&]() {
            // Call non-inlined chaser — prevents compiler from collapsing
            // the load-use dependency chain that serialises each hop.
            Node* result = chase_nodes(
                const_cast<Node*>(local_sink), n_nodes, passes);
            local_sink = result;
        }, static_cast<long long>(n_nodes) * passes, BENCH_ITERS);

        sink = local_sink;
        double kb = static_cast<double>(n_nodes * sizeof(Node)) / 1024.0;
        std::cout << "  " << kb << " KB  " << n_nodes
                  << " nodes -> " << ns << " ns/hop\n";
        csv << (n_nodes * sizeof(Node)) << "," << kb << "," << ns << "\n";
    }

    csv.close();
    (void)sink;
    std::cout << "  Results saved to " << outfile << "\n";
}
