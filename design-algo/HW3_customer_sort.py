# =============================================================
# HOMEWORK 3 — Sorting Customer Data Using Merge Sort (Python)
#
# Dataset: customer name, purchase amount (TRY), satisfaction score (1-5).
#
# Tasks:
#   1. Sort customers by Purchase Amount (ascending).
#   2. Sort customers by Satisfaction Score (ascending).
#
# HOW TO RUN:
#   python3 HW3_customer_sort.py
# =============================================================

from __future__ import annotations
from dataclasses import dataclass
from typing import Callable, Union
import copy


# ── Data model ───────────────────────────────────────────────
@dataclass
class Customer:
    name:               str
    purchase_amount:    float
    satisfaction_score: int

    def __repr__(self) -> str:
        return (f"{self.name:<12}  {self.purchase_amount:>6.1f} TRY  "
                f"score={self.satisfaction_score}")


# ── Dataset ───────────────────────────────────────────────────
CUSTOMERS: list[Customer] = [
    Customer("Ahmet",   500.0, 3),
    Customer("Ayse",    150.0, 5),
    Customer("Mehmet",  300.0, 4),
    Customer("Fatma",   200.0, 2),
    Customer("Zeynep",  400.0, 4),
    Customer("Ali",     350.0, 1),
    Customer("Elif",    120.0, 3),
    Customer("Hasan",   600.0, 2),
    Customer("Huseyin", 250.0, 4),
    Customer("Emine",   700.0, 3),
    Customer("Canan",   320.0, 5),
    Customer("Kemal",   450.0, 2),
    Customer("Veli",    390.0, 3),
    Customer("Sevim",   370.0, 4),
    Customer("Burak",   180.0, 2),
]


# ── Generic Merge Sort ────────────────────────────────────────
KeyFn = Callable[[Customer], Union[float, int]]


def _merge(arr: list[Customer], left: int, mid: int, right: int,
           key: KeyFn) -> None:
    L = arr[left : mid + 1]
    R = arr[mid + 1 : right + 1]

    i = j = 0
    k = left

    while i < len(L) and j < len(R):
        if key(L[i]) <= key(R[j]):
            arr[k] = L[i]; i += 1
        else:
            arr[k] = R[j]; j += 1
        k += 1

    while i < len(L): arr[k] = L[i]; i += 1; k += 1
    while j < len(R): arr[k] = R[j]; j += 1; k += 1


def merge_sort(arr: list[Customer], left: int, right: int,
               key: KeyFn) -> None:
    if left < right:
        mid = left + (right - left) // 2
        merge_sort(arr, left, mid, key)
        merge_sort(arr, mid + 1, right, key)
        _merge(arr, left, mid, right, key)


# ── Helpers ───────────────────────────────────────────────────
def print_customers(label: str, customers: list[Customer]) -> None:
    print(f"\n--- {label} ---")
    print(f"{'Name':<12}  {'Purchase (TRY)':>14}  {'Satisfaction':>12}")
    print("-" * 44)
    for c in customers:
        print(f"{c.name:<12}  {c.purchase_amount:>14.1f}  {c.satisfaction_score:>12}")


# ── Main ──────────────────────────────────────────────────────
def main() -> None:
    print("=== HOMEWORK 3: Sorting Customer Data with Merge Sort ===")

    print_customers("Original Data", CUSTOMERS)

    # Sort by purchase amount
    by_purchase = copy.deepcopy(CUSTOMERS)
    merge_sort(by_purchase, 0, len(by_purchase) - 1,
               key=lambda c: c.purchase_amount)
    print_customers("Sorted by Purchase Amount (ascending)", by_purchase)

    # Sort by satisfaction score
    by_score = copy.deepcopy(CUSTOMERS)
    merge_sort(by_score, 0, len(by_score) - 1,
               key=lambda c: c.satisfaction_score)
    print_customers("Sorted by Satisfaction Score (ascending)", by_score)


if __name__ == "__main__":
    main()
