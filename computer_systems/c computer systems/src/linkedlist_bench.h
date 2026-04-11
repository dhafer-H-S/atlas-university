#ifndef LINKEDLIST_BENCH_H
#define LINKEDLIST_BENCH_H

/* Experiment 4: Linked-List Pointer Chasing (Random Access)
 * Allocates N nodes with shuffled next-pointers; measures ns/hop
 * vs total list size (4 KB -> 256 MB). Defeats hardware prefetcher. */
void run_linkedlist_bench(const char *output_dir);

#endif /* LINKEDLIST_BENCH_H */
