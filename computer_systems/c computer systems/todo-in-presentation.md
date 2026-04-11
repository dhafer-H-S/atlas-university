# TODO for Presentation (Slide-by-Slide)

Audience: teachers evaluating technical understanding, measurement rigor, and interpretation quality.

Use this as a speaking checklist during rehearsal.

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