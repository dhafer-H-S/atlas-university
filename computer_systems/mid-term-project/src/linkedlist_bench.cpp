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
            Node* p = const_cast<Node*>(local_sink);
            for (long long pass = 0; pass < passes; ++pass) {
                for (size_t i = 0; i < n_nodes; ++i) {
                    p = p->next;
                }
            }
            local_sink = p;
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
