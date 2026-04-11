// =============================================================
// HOMEWORK 3 — Sorting Customer Data Using Merge Sort (Java)
//
// Dataset: customer name, purchase amount (TRY), satisfaction score (1-5).
//
// Tasks:
//   1. Sort customers by Purchase Amount (ascending).
//   2. Sort customers by Satisfaction Score (ascending).
//
// HOW TO COMPILE AND RUN:
//   javac HW3_customer_sort.java
//   java  HW3_customer_sort
// =============================================================

import java.util.Comparator;

public class HW3_customer_sort {

    // ── Data model ──────────────────────────────────────────────
    static class Customer {
        String name;
        double purchaseAmount;
        int    satisfactionScore;

        Customer(String name, double purchaseAmount, int satisfactionScore) {
            this.name               = name;
            this.purchaseAmount     = purchaseAmount;
            this.satisfactionScore  = satisfactionScore;
        }

        // deep copy constructor
        Customer(Customer other) {
            this.name              = other.name;
            this.purchaseAmount    = other.purchaseAmount;
            this.satisfactionScore = other.satisfactionScore;
        }
    }

    // ── Generic Merge Sort ───────────────────────────────────────
    private static void merge(Customer[] arr, int left, int mid, int right,
                              Comparator<Customer> cmp) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        Customer[] L = new Customer[n1];
        Customer[] R = new Customer[n2];

        for (int i = 0; i < n1; i++) L[i] = new Customer(arr[left + i]);
        for (int j = 0; j < n2; j++) R[j] = new Customer(arr[mid + 1 + j]);

        int i = 0, j = 0, k = left;
        while (i < n1 && j < n2) {
            if (cmp.compare(L[i], R[j]) <= 0) arr[k++] = L[i++];
            else                               arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }

    private static void mergeSort(Customer[] arr, int left, int right,
                                  Comparator<Customer> cmp) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid, cmp);
            mergeSort(arr, mid + 1, right, cmp);
            merge(arr, left, mid, right, cmp);
        }
    }

    // ── Comparators ─────────────────────────────────────────────
    static final Comparator<Customer> BY_PURCHASE =
        (a, b) -> Double.compare(a.purchaseAmount, b.purchaseAmount);

    static final Comparator<Customer> BY_SATISFACTION =
        (a, b) -> Integer.compare(a.satisfactionScore, b.satisfactionScore);

    // ── Helpers ──────────────────────────────────────────────────
    private static void printCustomers(String label, Customer[] arr) {
        System.out.println("\n--- " + label + " ---");
        System.out.printf("%-12s  %20s  %22s%n",
            "Name", "Purchase Amount (TRY)", "Satisfaction Score");
        System.out.println("-".repeat(58));
        for (Customer c : arr) {
            System.out.printf("%-12s  %20.1f  %22d%n",
                c.name, c.purchaseAmount, c.satisfactionScore);
        }
    }

    private static Customer[] copyArray(Customer[] src) {
        Customer[] dst = new Customer[src.length];
        for (int i = 0; i < src.length; i++) dst[i] = new Customer(src[i]);
        return dst;
    }

    // ── Main ─────────────────────────────────────────────────────
    public static void main(String[] args) {
        Customer[] customers = {
            new Customer("Ahmet",   500.0, 3),
            new Customer("Ayse",    150.0, 5),
            new Customer("Mehmet",  300.0, 4),
            new Customer("Fatma",   200.0, 2),
            new Customer("Zeynep",  400.0, 4),
            new Customer("Ali",     350.0, 1),
            new Customer("Elif",    120.0, 3),
            new Customer("Hasan",   600.0, 2),
            new Customer("Huseyin", 250.0, 4),
            new Customer("Emine",   700.0, 3),
            new Customer("Canan",   320.0, 5),
            new Customer("Kemal",   450.0, 2),
            new Customer("Veli",    390.0, 3),
            new Customer("Sevim",   370.0, 4),
            new Customer("Burak",   180.0, 2),
        };

        System.out.println("=== HOMEWORK 3: Sorting Customer Data with Merge Sort ===");

        printCustomers("Original Data", customers);

        // Sort by purchase amount
        Customer[] byPurchase = copyArray(customers);
        mergeSort(byPurchase, 0, byPurchase.length - 1, BY_PURCHASE);
        printCustomers("Sorted by Purchase Amount (ascending)", byPurchase);

        // Sort by satisfaction score
        Customer[] byScore = copyArray(customers);
        mergeSort(byScore, 0, byScore.length - 1, BY_SATISFACTION);
        printCustomers("Sorted by Satisfaction Score (ascending)", byScore);
    }
}
