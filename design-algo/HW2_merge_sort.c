/*
 * HOMEWORK 2 — Example of Merge Sort
 *
 * Task: Sort the array [18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2]
 *       using the Merge Sort algorithm and count the number of steps.
 *
 * For n = 16 elements: log2(16) = 4 merge levels (passes).
 *
 * HOW TO COMPILE AND RUN:
 *   gcc HW2_merge_sort.c -o HW2_merge_sort
 *   ./HW2_merge_sort
 */

#include <stdio.h>
#include <stdlib.h>

static int step_count = 0;

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    int *L = (int *)malloc(n1 * sizeof(int));
    int *R = (int *)malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j])
            arr[k++] = L[i++];
        else
            arr[k++] = R[j++];
        step_count++;
    }
    while (i < n1) { arr[k++] = L[i++]; step_count++; }
    while (j < n2) { arr[k++] = R[j++]; step_count++; }

    free(L);
    free(R);
}

void merge_sort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void print_array(int arr[], int n) {
    printf("[ ");
    for (int i = 0; i < n; i++) {
        printf("%d", arr[i]);
        if (i < n - 1) printf(", ");
    }
    printf(" ]\n");
}

int main(void) {
    int arr[] = {18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("=== HOMEWORK 2: Merge Sort ===\n\n");
    printf("Original array (%d elements):\n", n);
    print_array(arr, n);

    merge_sort(arr, 0, n - 1);

    printf("\nSorted array:\n");
    print_array(arr, n);

    printf("\nNumber of merge levels (log2(%d)) : 4\n", n);
    printf("Total comparison/copy steps counted: %d\n", step_count);

    return 0;
}
