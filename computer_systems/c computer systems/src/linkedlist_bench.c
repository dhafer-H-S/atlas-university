#include "linkedlist_bench.h"
#include "timer.h"
#include "config.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
 * Each node is padded to 64 bytes (one cache line) to prevent
 * false spatial locality from packing.
 * __attribute__((aligned(64))) ensures each element in the array
 * starts on a 64-byte boundary.
 */
struct __attribute__((aligned(64))) Node {
    struct Node *next;
    char pad[56]; /* 64 - 8 (pointer on 64-bit) = 56 bytes padding */
};
typedef struct Node Node;

/*
 * __attribute__((noinline)) prevents the compiler from inlining this function
 * and collapsing the pointer-chasing dependency chain at -O2.
 * The asm volatile("" ::: "memory") inside the loop is a compiler memory
 * barrier: it tells the compiler that this inline-assembly statement may
 * read or write ANY memory location, so the p->next load cannot be hoisted,
 * reordered, or eliminated.  It emits zero actual CPU instructions.
 */
__attribute__((noinline))
static Node *chase_nodes(Node *start, size_t n_nodes, long long passes)
{
    Node *p = start;
    for (long long pass = 0; pass < passes; pass++) {
        for (size_t i = 0; i < n_nodes; i++) {
            p = p->next;
            __asm__ volatile("" ::: "memory"); /* compiler barrier */
        }
    }
    return p;
}

void run_linkedlist_bench(const char *output_dir)
{
    printf("\n=== Experiment 4: Linked-List Pointer Chasing ===\n");
    printf("  Node size: 64 bytes (1 cache line) | Sweep 4 KB -> 256 MB\n\n");

    char outfile[512];
    snprintf(outfile, sizeof(outfile), "%s/linkedlist.csv", output_dir);
    FILE *csv = fopen(outfile, "w");
    if (!csv) { fprintf(stderr, "Cannot open %s\n", outfile); return; }
    fprintf(csv, "list_bytes,list_kb,ns_per_hop\n");

    srand(42);

    volatile Node *sink = NULL;

    /* Sweep list size from 4 KB to 256 MB (powers of 2) */
    for (size_t bytes = 4096; bytes <= 256ULL * 1024 * 1024; bytes *= 2) {
        size_t n_nodes = bytes / sizeof(Node);
        if (n_nodes < 4) n_nodes = 4;

        /* aligned_alloc requires size to be a multiple of alignment (64) */
        size_t alloc_size = n_nodes * sizeof(Node); /* sizeof(Node)==64, always aligned */
        Node *nodes = (Node *)aligned_alloc(64, alloc_size);
        if (!nodes) { fprintf(stderr, "aligned_alloc failed\n"); continue; }

        /* Build a random permutation of indices (Fisher-Yates) */
        size_t *order = (size_t *)malloc(n_nodes * sizeof(size_t));
        if (!order) { free(nodes); fprintf(stderr, "malloc failed\n"); continue; }
        for (size_t i = 0; i < n_nodes; i++) order[i] = i;
        for (size_t i = n_nodes - 1; i > 0; i--) {
            size_t j = (size_t)rand() % (i + 1);
            size_t tmp = order[i]; order[i] = order[j]; order[j] = tmp;
        }

        /* Link nodes in shuffled order */
        for (size_t i = 0; i < n_nodes; i++) {
            nodes[order[i]].next = &nodes[order[(i + 1) % n_nodes]];
        }

        /* Warm up: walk once */
        {
            Node *p = &nodes[order[0]];
            for (size_t i = 0; i < n_nodes; i++) p = p->next;
            sink = p;
        }

        long long passes = MIN_ACCESSES / (long long)n_nodes;
        if (passes < 1) passes = 1;

        double best_ns = 1e18;
        volatile Node *local_sink = &nodes[order[0]];

        for (int iter = 0; iter < BENCH_ITERS; iter++) {
            struct timespec t0, t1;
            CLOCK_NOW(t0);
            Node *result = chase_nodes((Node *)local_sink, n_nodes, passes);
            CLOCK_NOW(t1);
            local_sink = result;

            double ns = timespec_diff_ns(&t0, &t1)
                        / (double)((long long)n_nodes * passes);
            if (ns < best_ns) best_ns = ns;
        }

        sink = local_sink;
        double kb = (double)(n_nodes * sizeof(Node)) / 1024.0;
        printf("  %.0f KB  %zu nodes -> %.4f ns/hop\n", kb, n_nodes, best_ns);
        fprintf(csv, "%zu,%.4f,%.6f\n", n_nodes * sizeof(Node), kb, best_ns);

        free(order);
        free(nodes);
    }

    fclose(csv);
    (void)sink;
    printf("  Results saved to %s\n", outfile);
}
