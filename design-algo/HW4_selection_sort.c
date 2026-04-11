/*
 * HOMEWORK 4 — Selection Sort (C version)
 *
 * Algorithm (pseudocode):
 *   selectionSort(A)
 *     for i <- 0 to length(A) - 1
 *       minIndex = i
 *       for j <- i+1 to length(A) - 1
 *         if A[j] < A[minIndex]
 *           minIndex = j
 *       swap A[i] and A[minIndex]
 *
 * Idea: on each pass i, find the MINIMUM of the unsorted portion
 *       A[i..n-1] and place it at position i.
 *
 * Complexity:
 *   Time  — O(n²)  (two nested loops, always)
 *   Space — O(1)   (in-place, only a few variables)
 *
 * HOW TO COMPILE AND RUN:
 *   gcc HW4_selection_sort.c -o HW4_selection_sort
 *   ./HW4_selection_sort
 */

#include <stdio.h>

/* ── swap two integers in place ─────────────────────────────── */
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

/* ── selection sort ─────────────────────────────────────────── */
void selection_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_index = i;                  /* assume current pos is min */

        /* find the real minimum in the unsorted portion */
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_index]) {
                min_index = j;
            }
        }

        /* place the minimum at position i */
        if (min_index != i) {
            swap(&arr[i], &arr[min_index]);
        }
    }
}

/* ── helpers ────────────────────────────────────────────────── */
void print_array(int arr[], int n) {
    printf("[ ");
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(", ");
    }
    printf(" ]\n");
}

/* ── main ───────────────────────────────────────────────────── */
int main(void) {
    int arr[] = {18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2};
    int n     = sizeof(arr) / sizeof(arr[0]);

    printf("=== HOMEWORK 4: Selection Sort ===\n\n");
    printf("Original array (%d elements):\n", n);
    print_array(arr, n);

    selection_sort(arr, n);

    printf("\nSorted array:\n");
    print_array(arr, n);

    /* number of comparisons is always n*(n-1)/2 regardless of input */
    int comparisons = n * (n - 1) / 2;
    printf("\nTotal comparisons (n*(n-1)/2 = %d*%d/2): %d\n",
           n, n - 1, comparisons);
    printf("Complexity: O(n^2) time  |  O(1) extra space\n");

    return 0;
}
