# =============================================================
# HOMEWORK 4 — Selection Sort (Python version)
#
# Algorithm (pseudocode):
#   selectionSort(A)
#     for i <- 0 to length(A) - 1
#       minIndex = i
#       for j <- i+1 to length(A) - 1
#         if A[j] < A[minIndex]
#           minIndex = j
#       swap A[i] and A[minIndex]
#
# Idea: on each pass i, find the MINIMUM of the unsorted portion
#       A[i..n-1] and place it at position i.
#
# Complexity:
#   Time  — O(n²)  (two nested loops, always)
#   Space — O(1)   (in-place, only a few variables)
#
# HOW TO RUN:
#   python3 HW4_selection_sort.py
# =============================================================


def selection_sort(arr: list[int]) -> None:
    """Sort arr in place using Selection Sort."""
    n = len(arr)
    for i in range(n - 1):
        min_index = i                       # assume current pos is min

        # find the real minimum in the unsorted portion arr[i+1:]
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j

        # place the minimum at position i
        if min_index != i:
            arr[i], arr[min_index] = arr[min_index], arr[i]


def main() -> None:
    arr = [18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2]
    n   = len(arr)

    print("=== HOMEWORK 4: Selection Sort ===\n")
    print(f"Original array ({n} elements):")
    print(arr)

    selection_sort(arr)

    print("\nSorted array:")
    print(arr)

    comparisons = n * (n - 1) // 2
    print(f"\nTotal comparisons (n*(n-1)/2 = {n}*{n-1}//2): {comparisons}")
    print("Complexity: O(n²) time  |  O(1) extra space")


if __name__ == "__main__":
    main()
