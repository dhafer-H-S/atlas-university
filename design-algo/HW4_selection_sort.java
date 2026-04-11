// =============================================================
// HOMEWORK 4 — Selection Sort (Java version)
//
// Algorithm (pseudocode):
//   selectionSort(A)
//     for i <- 0 to length(A) - 1
//       minIndex = i
//       for j <- i+1 to length(A) - 1
//         if A[j] < A[minIndex]
//           minIndex = j
//       swap A[i] and A[minIndex]
//
// Idea: on each pass i, find the MINIMUM of the unsorted portion
//       A[i..n-1] and place it at position i.
//
// Complexity:
//   Time  — O(n²)  (two nested loops, always)
//   Space — O(1)   (in-place, only a few variables)
//
// HOW TO COMPILE AND RUN:
//   javac HW4_selection_sort.java
//   java  HW4_selection_sort
// =============================================================

import java.util.Arrays;

public class HW4_selection_sort {

    // ── selection sort ───────────────────────────────────────────
    private static void selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIndex = i;               // assume current pos is min

            // find the real minimum in the unsorted portion arr[i+1..n-1]
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            // place the minimum at position i
            if (minIndex != i) {
                int tmp        = arr[i];
                arr[i]         = arr[minIndex];
                arr[minIndex]  = tmp;
            }
        }
    }

    // ── main ─────────────────────────────────────────────────────
    public static void main(String[] args) {
        int[] arr = {18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2};
        int   n   = arr.length;

        System.out.println("=== HOMEWORK 4: Selection Sort ===\n");
        System.out.println("Original array (" + n + " elements):");
        System.out.println(Arrays.toString(arr));

        selectionSort(arr);

        System.out.println("\nSorted array:");
        System.out.println(Arrays.toString(arr));

        int comparisons = n * (n - 1) / 2;
        System.out.println("\nTotal comparisons (n*(n-1)/2 = " + n + "*" + (n-1) + "/2): " + comparisons);
        System.out.println("Complexity: O(n²) time  |  O(1) extra space");
    }
}
