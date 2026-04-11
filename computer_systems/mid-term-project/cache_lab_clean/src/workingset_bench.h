#pragma once
#include <string>

// Experiment 2: Working Set Size
// Fix stride=1 (sequential); sweep array size 1 KB -> 256 MB.
// Reveals L1/L2/L3/RAM latency plateaus.
void run_workingset_bench(const std::string& output_dir);
