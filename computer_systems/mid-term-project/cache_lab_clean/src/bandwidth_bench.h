#pragma once
#include <string>

// Experiment 5: Memory Bandwidth (Copy & Sum)
// Sweeps array size; reports GB/s for array copy and sequential sum.
// Shows peak bandwidth per cache level.
void run_bandwidth_bench(const std::string& output_dir);
