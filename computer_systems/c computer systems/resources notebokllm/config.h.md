# config.h

Original file: `src/config.h`

```c
#ifndef CONFIG_H
#define CONFIG_H

#include <stddef.h>

/* -------------------------------------------------------
 * Typical cache sizes — edit to match your machine.
 * Run: sysctl hw.l1icachesize hw.l2cachesize hw.l3cachesize  (macOS)
 *   or: cat /sys/devices/system/cpu/cpu0/cache/index* /size  (Linux)
 * ------------------------------------------------------- */
#define L1_SIZE  (32ULL  * 1024)          /*  32 KB */
#define L2_SIZE  (256ULL * 1024)          /* 256 KB */
#define L3_SIZE  (6ULL   * 1024 * 1024)  /*   6 MB (Apple M-series varies) */

/* Number of timed iterations per data point (best-of N) */
#define BENCH_ITERS  5

/* Minimum number of accesses per timed measurement to reduce clock noise */
#define MIN_ACCESSES  4000000LL

#endif /* CONFIG_H */

```
