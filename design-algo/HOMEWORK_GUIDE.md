# Design & Algorithms — Homework Guide
### Topic: Merge Sort · Master Theorem

> **How to read this file**
> This document is structured like a lesson. Read it top to bottom.
> Each section builds on the previous one.
> Code files referenced: `HW2_merge_sort.c` and `HW3_customer_sort.c`

---

## Table of Contents

1. [What is Merge Sort?](#1-what-is-merge-sort)
2. [The Master Theorem — Why O(n log n)?](#2-the-master-theorem--why-on-log-n)
3. [Homework 2 — Sorting an Integer Array](#3-homework-2--sorting-an-integer-array)
4. [Homework 3 — Sorting Customer Data](#4-homework-3--sorting-customer-data)
5. [Key Takeaways](#5-key-takeaways)

---

## 1. What is Merge Sort?

Merge Sort is a classic **divide-and-conquer** sorting algorithm.
It works in two phases:

| Phase     | What happens                                              |
|-----------|-----------------------------------------------------------|
| **Divide**  | Recursively split the array in half until each piece has 1 element |
| **Conquer** | Repeatedly merge pairs of sorted pieces into a larger sorted piece |

A single element is always sorted by definition — that is the **base case**.

### The Big Picture

```
UNSORTED ARRAY
      │
      ▼
  ┌───────┐
  │ SPLIT │  ◄─── keep splitting in half (log₂n levels deep)
  └───────┘
      │
      ▼
  ┌───────┐
  │ MERGE │  ◄─── merge pairs back together, sorted
  └───────┘
      │
      ▼
SORTED ARRAY
```

---

## 2. The Master Theorem — Why O(n log n)?

The Master Theorem lets us solve recurrence relations of the form:

$$T(n) = a \cdot T\!\left(\frac{n}{b}\right) + f(n)$$

For Merge Sort:

| Symbol | Meaning               | Value for Merge Sort |
|--------|-----------------------|----------------------|
| `a`    | subproblems per call  | **2**                |
| `b`    | size reduction factor | **2**                |
| `f(n)` | work done at each level (merging) | **O(n)**  |

$$T(n) = 2 \cdot T\!\left(\frac{n}{2}\right) + O(n)$$

Since $f(n) = O(n) = O(n^{\log_b a}) = O(n^{\log_2 2}) = O(n^1)$, we are in **Case 2**
of the Master Theorem:

$$\boxed{T(n) = O(n \log n)}$$

This is **optimal** for a comparison-based sorting algorithm.

---

## 3. Homework 2 — Sorting an Integer Array

### The Array

```
Index:  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
      ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
      │18 │26 │32 │ 6 │43 │15 │ 9 │ 1 │22 │26 │19 │55 │37 │43 │99 │ 2 │
      └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
        n = 16  →  log₂(16) = 4 levels
```

---

### Phase 1 — DIVIDE (splitting down the tree)

Each row below is one level of recursion. The array keeps being cut in half.

```
LEVEL 0 — original (1 block of 16)
┌─────────────────────────────────────────────────────────────────┐
│  18  26  32   6  43  15   9   1  22  26  19  55  37  43  99   2 │
└─────────────────────────────────────────────────────────────────┘
                            │ split
                ┌───────────┴───────────┐
LEVEL 1 — 2 blocks of 8
┌───────────────────────┐   ┌───────────────────────┐
│  18  26  32   6  43  15   9   1 │   │  22  26  19  55  37  43  99   2 │
└───────────────────────┘   └───────────────────────┘
         │ split                        │ split
    ┌────┴────┐                    ┌────┴────┐
LEVEL 2 — 4 blocks of 4
┌───────────┐ ┌───────────┐   ┌───────────┐ ┌───────────┐
│ 18  26  32   6 │ │ 43  15   9   1 │   │ 22  26  19  55 │ │ 37  43  99   2 │
└───────────┘ └───────────┘   └───────────┘ └───────────┘
      │              │               │              │
LEVEL 3 — 8 blocks of 2
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│18 26│ │32  6│ │43 15│ │ 9  1│ │22 26│ │19 55│ │37 43│ │99  2│
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘
      │                                                          │
LEVEL 4 — 16 blocks of 1  ← BASE CASE (each element alone = sorted)
┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│18│ │26│ │32│ │ 6│ │43│ │15│ │ 9│ │ 1│ │22│ │26│ │19│ │55│ │37│ │43│ │99│ │ 2│
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘
```

> **Key insight:** There are exactly **4 split levels** because log₂(16) = 4.

---

### Phase 2 — CONQUER (merging back up the tree)

Now we merge pairs of sorted sub-arrays, bottom to top.
At each merge step we compare elements one by one and place the smaller one first.

```
LEVEL 4 → 3  (merge 16 singles into 8 sorted pairs)
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│18 26│ │ 6 32│ │15 43│ │ 1  9│ │22 26│ │19 55│ │37 43│ │ 2 99│
└─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘

LEVEL 3 → 2  (merge 8 pairs into 4 sorted quads)
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ 6 18 26 32│ │ 1  9 15 43│ │19 22 26 55│ │ 2 37 43 99│
└───────────┘ └───────────┘ └───────────┘ └───────────┘

LEVEL 2 → 1  (merge 4 quads into 2 sorted halves)
┌─────────────────────────┐   ┌─────────────────────────┐
│  1   6   9  15  18  26  32  43 │   │  2  19  22  26  37  43  55  99 │
└─────────────────────────┘   └─────────────────────────┘

LEVEL 1 → 0  (final merge → fully sorted array)
┌─────────────────────────────────────────────────────────────────┐
│   1   2   6   9  15  18  19  22  26  26  32  37  43  43  55  99 │
└─────────────────────────────────────────────────────────────────┘
```

> **Answer:** It takes **4 merge levels** to fully sort the array.
> Total operations ≈ n × log₂(n) = 16 × 4 = **64 operations**.

---

### How to Run HW2

```bash
gcc HW2_merge_sort.c -o HW2_merge_sort
./HW2_merge_sort
```

Expected output excerpt:
```
Original array (16 elements):
[ 18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2 ]

Sorted array:
[ 1, 2, 6, 9, 15, 18, 19, 22, 26, 26, 32, 37, 43, 43, 55, 99 ]

Number of merge levels (log2(16)) : 4
```

---

## 4. Homework 3 — Sorting Customer Data

### The Dataset

Instead of plain integers, each record now contains **three fields**:

```
┌──────────────┬──────────────────────┬────────────────────────┐
│ Customer Name│ Purchase Amount (TRY)│ Satisfaction Score (1-5)│
├──────────────┼──────────────────────┼────────────────────────┤
│ Ahmet        │        500.0         │            3            │
│ Ayse         │        150.0         │            5            │
│ Mehmet       │        300.0         │            4            │
│ Fatma        │        200.0         │            2            │
│ Zeynep       │        400.0         │            4            │
│ Ali          │        350.0         │            1            │
│ Elif         │        120.0         │            3            │
│ Hasan        │        600.0         │            2            │
│ Huseyin      │        250.0         │            4            │
│ Emine        │        700.0         │            3            │
│ Canan        │        320.0         │            5            │
│ Kemal        │        450.0         │            2            │
│ Veli         │        390.0         │            3            │
│ Sevim        │        370.0         │            4            │
│ Burak        │        180.0         │            2            │
└──────────────┴──────────────────────┴────────────────────────┘
```

### The Data Structure (C struct)

```c
typedef struct {
    char   name[32];          // customer's name
    double purchase_amount;   // spending in TRY
    int    satisfaction_score; // 1 (worst) → 5 (best)
} Customer;
```

---

### Task A — Sort by Purchase Amount

We tell the merge sort algorithm **how to compare** two customers using a comparator function:

```c
int cmp_by_purchase(const Customer *a, const Customer *b) {
    if (a->purchase_amount < b->purchase_amount) return -1;  // a comes first
    if (a->purchase_amount > b->purchase_amount) return  1;  // b comes first
    return 0;                                                  // equal
}
```

**Diagram — merge step example (comparing purchase amounts):**

```
Left half (already sorted):    Right half (already sorted):
┌──────┬──────┬──────┬──────┐  ┌──────┬──────┬──────┬──────┐
│Elif  │Fatma │Burak │Ahmet │  │Husey.│Mehmet│Canan │Zeynep│
│120.0 │200.0 │180.0 │500.0 │  │250.0 │300.0 │320.0 │400.0 │
└──────┴──────┴──────┴──────┘  └──────┴──────┴──────┴──────┘

          ↓ merge by comparing purchase_amount ↓

┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐
│Elif  │Fatma │Burak │Husey.│Mehmet│Canan │Zeynep│Ahmet │
│120.0 │180.0 │200.0 │250.0 │300.0 │320.0 │400.0 │500.0 │
└──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘
```

**Result — sorted by Purchase Amount (ascending):**

```
Elif(120) → Ayse(150) → Burak(180) → Fatma(200) → Huseyin(250)
→ Mehmet(300) → Canan(320) → Ali(350) → Veli(390) → Zeynep(400)
→ Kemal(450) → Ahmet(500) → Hasan(600) → Emine(700)
```

---

### Task B — Sort by Satisfaction Score

Same algorithm, different comparator:

```c
int cmp_by_satisfaction(const Customer *a, const Customer *b) {
    return a->satisfaction_score - b->satisfaction_score;
    // negative → a first | positive → b first | 0 → equal
}
```

**Result — sorted by Satisfaction Score (ascending):**

```
Score 1: Ali
Score 2: Fatma, Hasan, Kemal, Burak
Score 3: Ahmet, Elif, Emine, Veli
Score 4: Mehmet, Zeynep, Huseyin, Sevim
Score 5: Ayse, Canan
```

---

### The Power of the Comparator Pattern

```
                ┌──────────────────────────┐
                │      merge_sort()        │
                │  (same code every time)  │
                └────────────┬─────────────┘
                             │ uses
              ┌──────────────┴──────────────┐
              ▼                             ▼
   cmp_by_purchase()            cmp_by_satisfaction()
   sort by TRY amount           sort by score 1→5
```

> **Lesson:** The sorting logic never changes. Only the **comparator** changes.
> This is the **Strategy design pattern** — swap the rule, keep the engine.

---

### How to Run HW3

```bash
gcc HW3_customer_sort.c -o HW3_customer_sort
./HW3_customer_sort
```

The program prints three tables:
1. Original data (as given)
2. Sorted by Purchase Amount
3. Sorted by Satisfaction Score

---

## 5. Key Takeaways

| Concept | Summary |
|---------|---------|
| **Divide & Conquer** | Break the problem in half recursively until trivially solvable |
| **Merge Sort complexity** | O(n log n) — proven via the Master Theorem |
| **Number of levels** | Always log₂(n) — for n=16 that is **4 levels** |
| **Stable sort** | Merge Sort preserves the original order of equal elements |
| **Comparator pattern** | The same merge sort engine sorts ANY data type — just swap the comparator |
| **Space cost** | Merge Sort needs O(n) extra memory for temporary arrays |

### Complexity Summary Table

| Case    | Time         | Space  |
|---------|--------------|--------|
| Best    | O(n log n)   | O(n)   |
| Average | O(n log n)   | O(n)   |
| Worst   | O(n log n)   | O(n)   |

> Merge Sort is unique: its **worst case equals its best case**.
> Unlike QuickSort (O(n²) worst), Merge Sort is always guaranteed O(n log n).

---

### Self-Check Questions

1. What is the base case of Merge Sort and why is it important?
2. For an array of 32 elements, how many merge levels are needed?
3. Why do we need extra memory in Merge Sort?
4. How would you modify the comparator in HW3 to sort by purchase amount **descending**?
5. Can you apply Merge Sort to sort by **two fields at once** (e.g., first by score, then alphabetically for ties)?

---

*End of guide — compile, run, and experiment!*
