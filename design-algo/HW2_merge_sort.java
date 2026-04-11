// =============================================================
// HOMEWORK 2 — Example of Merge Sort (Java version)
//
// Task: Sort the array
//       [18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2]
//       using the Merge Sort algorithm and count the number of steps.
//
// For n = 16 elements: log2(16) = 4 merge levels.
//
// HOW TO COMPILE AND RUN:
//   javac HW2_merge_sort.java
//   java  HW2_merge_sort
// =============================================================

import java.util.Arrays;

public class HW2_merge_sort {

    private static int stepCount = 0;

    // ----- merge two sorted halves back into arr[left..right] -----
    private static void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] L = Arrays.copyOfRange(arr, left, left + n1);
        int[] R = Arrays.copyOfRange(arr, mid + 1, mid + 1 + n2);

        int i = 0, j = 0, k = left;

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else               arr[k++] = R[j++];
            stepCount++;
        }
        while (i < n1) { arr[k++] = L[i++]; stepCount++; }
        while (j < n2) { arr[k++] = R[j++]; stepCount++; }
    }

    // ----- recursive divide-and-conquer -----
    private static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    // ----- main -----
    public static void main(String[] args) {
        int[] arr = {18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2};
        int n = arr.length;

        System.out.println("=== HOMEWORK 2: Merge Sort ===\n");
        System.out.println("Original array (" + n + " elements):");
        System.out.println(Arrays.toString(arr));

        mergeSort(arr, 0, n - 1);

        System.out.println("\nSorted array:");
        System.out.println(Arrays.toString(arr));

        int levels = (int)(Math.log(n) / Math.log(2));
        System.out.println("\nNumber of merge levels (log2(" + n + ")): " + levels);
        System.out.println("Total comparison/copy steps counted: " + stepCount);
    }
}
