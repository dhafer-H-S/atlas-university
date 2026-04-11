#pragma once
#include <string>

// Experiment 4: Linked-List Pointer Chasing (Random Access)
// Allocates N nodes with shuffled next-pointers; measures ns/hop
// vs total list size (4 KB -> 256 MB). Defeats hardware prefetcher.
void run_linkedlist_bench(const std::string& output_dir);
