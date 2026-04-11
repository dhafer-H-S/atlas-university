#ifndef TIMER_H
#define TIMER_H

#include <time.h>

/*
 * Returns the elapsed nanoseconds between two timespec values.
 */
static inline double timespec_diff_ns(const struct timespec *t0,
                                       const struct timespec *t1)
{
    return (double)(t1->tv_sec  - t0->tv_sec)  * 1.0e9
         + (double)(t1->tv_nsec - t0->tv_nsec);
}

/*
 * CLOCK_NOW(ts) — captures the current monotonic clock into ts.
 * Usage:
 *   struct timespec t0, t1;
 *   CLOCK_NOW(t0);
 *   // ... work ...
 *   CLOCK_NOW(t1);
 *   double ns_per_access = timespec_diff_ns(&t0, &t1) / num_accesses;
 */
#define CLOCK_NOW(ts)  clock_gettime(CLOCK_MONOTONIC, &(ts))

#endif /* TIMER_H */
