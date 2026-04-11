# =============================================================
# HOMEWORK 2 — Example of Merge Sort (Python version)
#
# Task: Sort the array
#       [18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2]
#       using the Merge Sort algorithm and count the number of steps.
#
# For n = 16 elements: log2(16) = 4 merge levels.
#
# HOW TO RUN:
#   python3 HW2_merge_sort.py
# =============================================================

step_count = 0         


def merge(arr: list[int], left: int, mid: int, right: int) -> None:
    global step_count

    left_half  = arr[left : mid + 1]  
    right_half = arr[mid + 1 : right + 1] 

    i = j = 0
    k = left

    while i < len(left_half) and j < len(right_half):
        if left_half[i] <= right_half[j]:
            arr[k] = left_half[i]
            i += 1
        else:
            arr[k] = right_half[j]
            j += 1
        k += 1
        step_count += 1

    while i < len(left_half):
        arr[k] = left_half[i]
        i += 1
        k += 1
        step_count += 1

    while j < len(right_half):
        arr[k] = right_half[j]
        j += 1
        k += 1
        step_count += 1


def merge_sort(arr: list[int], left: int, right: int) -> None:
    if left < right:
        mid = left + (right - left) // 2
        merge_sort(arr, left, mid)
        merge_sort(arr, mid + 1, right)
        merge(arr, left, mid, right)


def main() -> None:
    arr = [18, 26, 32, 6, 43, 15, 9, 1, 22, 26, 19, 55, 37, 43, 99, 2]
    n   = len(arr)

    print("=== HOMEWORK 2: Merge Sort ===\n")
    print(f"Original array ({n} elements):")
    print(arr)

    merge_sort(arr, 0, n - 1)

    print("\nSorted array:")
    print(arr)

    import math
    levels = int(math.log2(n))
    print(f"\nNumber of merge levels (log2({n})): {levels}")
    print(f"Total comparison/copy steps counted: {step_count}")


if __name__ == "__main__":
    main()
