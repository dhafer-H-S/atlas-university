# TODO for Presentation (Slide-by-Slide)

Audience: teachers evaluating technical understanding, measurement rigor, and interpretation quality.

Use this as a speaking checklist during rehearsal.

Common point with the course topics: this project is a direct application of what we studied, because every benchmark is built from nested loops that control access order, dynamic memory allocation (`malloc`/`calloc`) that creates test arrays and buffers of different sizes, and pointer-based structures (linked lists) that expose latency behavior when access is dependent; in short, we did not only learn syntax, we used loops + heap allocation + linked-list traversal to measure real hardware effects (cache locality, bandwidth, and DRAM latency) and convert them into engineering rules.

## Slide 1 — Title: Cache & Locality Performance Lab
- [ ] Introduce the project goal in one sentence: show how memory access patterns change performance on real hardware.
- [ ] Identify course context: Computer Systems mid-term, Team 11.
- [ ] Explain the memory hierarchy graphic briefly (registers -> L1 -> L2 -> L3/SLC -> DRAM) and why latency grows.
- [ ] Set expectation: this is an experimental talk with measured data, not only theory.

## Slide 2 — Project Overview & Agenda
- [ ] Walk teachers through the 7-part flow (methodology + 5 experiments + findings).
- [ ] Emphasize the scientific structure: each experiment isolates one variable.
- [ ] State deliverables: CSV outputs, plotted figures, reproducible C code.
- [ ] Clarify that results are platform-specific (Apple Silicon) and compared with x86 expectations.

## Slide 3 — Methodology (Timer & Benchmark Architecture)
- [ ] Explain timing method: `clock_gettime(CLOCK_MONOTONIC)` and nanosecond normalization.
- [ ] Explain why we use best-of-5: remove OS noise and capture latency floor.
- [ ] Explain why we divide by accesses/hops: comparable per-operation metric.
- [ ] Mention anti-optimization safeguards: volatile sinks, noinline, compiler barrier.
- [ ] State build and run reproducibility (`make`, `make run`, CSV generation).
- [ ] Teacher-value point: defend validity of measurements before showing any chart.

## Slide 4 — Experiment 1: Stride Access Pattern
- [ ] Define stride in bytes/elements and connect to 64-byte cache lines.
- [ ] Highlight key data point: low latency for small stride, spike around larger stride (notably near 128 B on this platform).
- [ ] Explain prefetch impact on Apple Silicon (why behavior differs from simple textbook spike assumptions).
- [ ] Mention practical implication: contiguous access and cache-line-aware data layout improve performance.
- [ ] Teacher-value point: show you can connect graph shape to hardware mechanism.

## Slide 5 — Experiment 2: Working Set Size
- [ ] Explain expectation from theory: step-like latency increases when exceeding cache levels.
- [ ] Explain observed result: near-flat curve on this machine for sequential scan.
- [ ] Attribute causes: strong prefetcher, system-level cache, high LPDDR bandwidth.
- [ ] Explicitly compare with x86 behavior to show architectural awareness.
- [ ] Teacher-value point: demonstrate that "unexpected" results are interpreted correctly, not ignored.

## Slide 6 — Experiment 3: Matrix Traversal Order
- [ ] Explain row-major memory layout in C.
- [ ] Compare loop orders clearly: `for i then j` (row-major friendly) vs `for j then i` (strided).
- [ ] Call out slowdown trend (about 1.5x in your data) and why it is not 8x theoretical worst-case.
- [ ] Explain partial prefetch compensation and remaining locality penalty.
- [ ] Give coding takeaway: always align inner loop with contiguous dimension.
- [ ] Teacher-value point: connect code-level choice directly to measured penalty.

## Slide 7 — Experiment 4: Linked-List Pointer Chasing
- [ ] Explain why pointer chasing is latency-dominated: next address unknown until current load finishes.
- [ ] Highlight dramatic latency growth from cache-resident sizes to DRAM sizes.
- [ ] Explain node alignment to 64 bytes and shuffled links (defeats spatial locality).
- [ ] Explain why prefetch cannot help much with random dependent loads.
- [ ] Teacher-value point: prove understanding of memory-level parallelism limits.

## Slide 8 — Experiment 5: Memory Bandwidth (Copy vs Sum)
- [ ] Explain two kernels: copy (independent operations) vs sum (loop-carried dependency).
- [ ] Interpret data: copy reaches high GB/s; sum remains much lower and flatter.
- [ ] Explain bottleneck shift: copy is memory-bandwidth-bound; sum is compute/dependency-bound.
- [ ] Mention vectorization/unrolling as partial help but not full removal of dependency chain.
- [ ] Teacher-value point: show that high bandwidth alone does not guarantee high throughput.

## Slide 9 — Results Dashboard
- [ ] Synthesize all experiments in 30-45 seconds.
- [ ] State one sentence per plot: stride penalty, flat working-set curve, matrix-order slowdown, copy vs sum gap.
- [ ] Emphasize consistency: all plots support the same core thesis (access pattern matters).
- [ ] Teacher-value point: demonstrate ability to summarize complex data concisely.

## Slide 10 — Key Findings (Five Practical Rules)
- [ ] Present each rule as "evidence -> engineering action".
- [ ] Keep each rule grounded in one measured number from earlier slides.
- [ ] Suggested framing:
- [ ] Rule 1: Cache-line granularity is real -> align/pad hot structures.
- [ ] Rule 2: Sequential scans are favored on this platform -> prefer linear traversal.
- [ ] Rule 3: Row-major loops matter -> choose loop order by memory layout.
- [ ] Rule 4: Pointer chasing is expensive -> prefer array-based or blocked designs where possible.
- [ ] Rule 5: Dependencies cap throughput -> use multiple accumulators / restructure reductions.
- [ ] Teacher-value point: convert benchmark data into actionable systems guidelines.

## Slide 11 — Conclusion / Q&A
- [ ] Re-state the thesis in one strong sentence.
- [ ] Mention limitations honestly: one platform, one compiler setup, mostly microbenchmarks.
- [ ] Propose next steps: compare x86, vary compiler flags, add cache-blocked kernels.
- [ ] Close with confidence and invite questions about methodology or interpretation.

## Final Rehearsal Checklist
- [ ] Keep slide timing near 1 minute each (total ~10-12 min with Q&A).
- [ ] Every slide must include one "what the data means" statement.
- [ ] Avoid only reading numbers; always explain mechanism.
- [ ] Be ready to justify measurement reliability (best-of-5, normalization, anti-optimization guards).
- [ ] Be ready for teacher questions on architecture differences (Apple Silicon vs x86).

## Ready Speaking Script (One Paragraph Per Slide)

### Slide 1 Script
In this project, our goal is to show that memory access pattern changes performance on real hardware, even when the code looks similar at a high level. This is part of our Computer Systems mid-term work as Team 11. The memory hierarchy in the figure explains the core idea: as we move from registers to L1, L2, L3/SLC, and then DRAM, latency increases. So our talk is evidence-based: we measured these effects with controlled C benchmarks, not only with theory.

### Slide 2 Script
Our presentation follows a scientific flow: first methodology, then five experiments, then final findings. Each experiment isolates one variable, such as stride, working-set size, traversal order, pointer chasing, or kernel type. Our deliverables are reproducible C code, CSV outputs, and generated plots. We also clarify that these numbers are platform-specific for Apple Silicon, and we compare interpretation with common x86 expectations where relevant.

### Slide 3 Script
For methodology, we use `clock_gettime(CLOCK_MONOTONIC)` and normalize results to ns/access or ns/hop so different problem sizes remain comparable. We use best-of-5 iterations to reduce OS noise and keep the latency floor. To prevent misleading compiler optimizations, we use volatile sinks, noinline in dependency-sensitive code, and a compiler barrier in pointer chasing. This gives us confidence that plotted values represent memory behavior, not measurement artifacts.

### Slide 4 Script (Stride)
In the stride experiment, we scan a large array while increasing stride from 4 bytes up to 4096 bytes. The result is clear: latency is very low around 0.87 to 0.90 ns/access for 4 to 64 B stride, then jumps strongly at 128 B to about 2.98 ns/access, and peaks around 256 B near 3.67 ns/access. This means contiguous access is favored, while skipping larger gaps wastes cache-line locality. The graph shape also suggests prefetch effects on Apple Silicon, so the curve is not a perfect monotonic textbook step.

### Slide 5 Script (Working Set)
In the working-set experiment, we keep sequential access and only increase array size from 1 KB to 256 MB. Instead of dramatic steps, latency stays almost flat around 1.00 ns/access. Our interpretation is that strong prefetching and this memory system hide much of the expected cache-transition penalty for sequential scans. So the key message is not that caches do not matter, but that access pattern can dominate what we observe.

### Slide 6 Script (Matrix)
This experiment compares row-major-friendly loops against column-major-like strided loops on C row-major matrices. Row-major access stays near about 1.93 to 2.03 ns/access, while column-major rises to around 2.84 to 3.16 ns/access. The slowdown ratio is about 1.46 to 1.56x for larger sizes, which is significant but below worst-case theoretical ratios because hardware prefetch partially helps. The practical rule is simple: align inner loops with contiguous memory layout.

### Slide 7 Script (Linked List)
The linked-list benchmark is random pointer chasing with 64-byte aligned nodes, so each hop depends on the previous load and locality is intentionally poor. At small sizes, latency is around 0.65 ns/hop, but it grows to about 2.60 ns/hop at 256 KB, around 6 to 9.5 ns/hop in MB ranges, then jumps dramatically to about 37 ns at 32 MB and up to roughly 83 ns/hop at 256 MB. This is a direct demonstration of latency-dominated dependent loads and why prefetch cannot fully solve random pointer chains.

### Slide 8 Script (Bandwidth)
In the bandwidth experiment, we compare copy and sum kernels. Copy reaches very high throughput, roughly above 100 GB/s at large sizes and up to around 250 GB/s at small sizes, while sum stays much lower and flatter around 17 to 27 GB/s. The reason is bottleneck type: copy is mainly bandwidth-driven, but sum has loop-carried dependency that limits throughput. So high memory bandwidth alone does not guarantee high performance for all kernels.

### Slide 9 Script (Dashboard)
Across all plots, one thesis is consistent: access pattern matters as much as data size. Stride shows locality loss when spacing grows, working set shows sequential robustness on this platform, matrix shows loop-order penalty, linked list shows dependency-driven latency explosion, and copy-vs-sum shows that dependency can dominate even when bandwidth is high. The dashboard is not just many graphs; it is one coherent performance story.

### Slide 10 Script (Five Rules)
We convert evidence into engineering actions. Rule 1: cache-line granularity is real, so align and pack hot data carefully. Rule 2: sequential scans are favored here, so prefer linear traversal when possible. Rule 3: row-major loops matter in C, so set inner loops to contiguous dimensions. Rule 4: pointer chasing is expensive, so use array-based or blocked layouts when possible. Rule 5: dependency chains cap throughput, so use multiple accumulators and dependency-breaking strategies in reductions.

### Slide 11 Script (Conclusion and Q&A)
To conclude, this project applies course fundamentals, loops, dynamic allocation (`malloc` and `calloc`), and linked structures, to measure real cache and memory behavior and derive practical optimization rules. Our limitations are honest: one platform, one compiler setup, and mostly microbenchmarks. Future work is to repeat on x86, vary compiler flags, and add cache-blocked kernels. We are ready for questions on methodology, architecture differences, and interpretation of each graph.