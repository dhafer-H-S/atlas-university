#pragma once
#include <string>

// Experiment 1: Stride Access Pattern
// Fix array at 64 MB; sweep stride 1..1024 elements.
// Measures ns/access vs stride to reveal cache-line granularity.
void run_stride_bench(const std::string& output_dir);
