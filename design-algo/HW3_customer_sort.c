/*
 * HOMEWORK 3 — Sorting Customer Data Using Merge Sort
 *
 * Dataset: customer name, purchase amount (TRY), satisfaction score (1-5).
 *
 * Tasks:
 *   1. Sort customers by Purchase Amount (ascending).
 *   2. Sort customers by Satisfaction Score (ascending).
 *
 * HOW TO COMPILE AND RUN:
 *   gcc HW3_customer_sort.c -o HW3_customer_sort
 *   ./HW3_customer_sort
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char   name[32];
    double purchase_amount;
    int    satisfaction_score;
} Customer;

/* ---------- generic merge sort for Customer array ---------- */

typedef int (*CompareFn)(const Customer *a, const Customer *b);

static void merge(Customer arr[], int left, int mid, int right, CompareFn cmp) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    Customer *L = (Customer *)malloc(n1 * sizeof(Customer));
    Customer *R = (Customer *)malloc(n2 * sizeof(Customer));

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (cmp(&L[i], &R[j]) <= 0)
            arr[k++] = L[i++];
        else
            arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    free(L);
    free(R);
}

static void merge_sort(Customer arr[], int left, int right, CompareFn cmp) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid, cmp);
        merge_sort(arr, mid + 1, right, cmp);
        merge(arr, left, mid, right, cmp);
    }
}

/* ---------- comparators ---------- */

int cmp_by_purchase(const Customer *a, const Customer *b) {
    if (a->purchase_amount < b->purchase_amount) return -1;
    if (a->purchase_amount > b->purchase_amount) return  1;
    return 0;
}

int cmp_by_satisfaction(const Customer *a, const Customer *b) {
    return a->satisfaction_score - b->satisfaction_score;
}

/* ---------- helpers ---------- */

void print_customers(const Customer arr[], int n) {
    printf("%-12s  %20s  %22s\n",
           "Customer", "Purchase Amount (TRY)", "Satisfaction Score");
    printf("%-12s  %20s  %22s\n",
           "------------", "--------------------", "--------------------");
    for (int i = 0; i < n; i++) {
        printf("%-12s  %20.1f  %22d\n",
               arr[i].name, arr[i].purchase_amount, arr[i].satisfaction_score);
    }
    printf("\n");
}

/* ---------- main ---------- */

int main(void) {
    Customer customers[] = {
        {"Ahmet",   500.0, 3},
        {"Ayse",    150.0, 5},
        {"Mehmet",  300.0, 4},
        {"Fatma",   200.0, 2},
        {"Zeynep",  400.0, 4},
        {"Ali",     350.0, 1},
        {"Elif",    120.0, 3},
        {"Hasan",   600.0, 2},
        {"Huseyin", 250.0, 4},
        {"Emine",   700.0, 3},
        {"Canan",   320.0, 5},
        {"Kemal",   450.0, 2},
        {"Veli",    390.0, 3},
        {"Sevim",   370.0, 4},
        {"Burak",   180.0, 2},
    };
    int n = sizeof(customers) / sizeof(customers[0]);

    printf("=== HOMEWORK 3: Sorting Customer Data with Merge Sort ===\n\n");

    /* --- original --- */
    printf("--- Original Data ---\n");
    print_customers(customers, n);

    /* --- sort by purchase amount --- */
    Customer by_purchase[sizeof(customers) / sizeof(customers[0])];
    memcpy(by_purchase, customers, n * sizeof(Customer));
    merge_sort(by_purchase, 0, n - 1, cmp_by_purchase);
    printf("--- Sorted by Purchase Amount (ascending) ---\n");
    print_customers(by_purchase, n);

    /* --- sort by satisfaction score --- */
    Customer by_score[sizeof(customers) / sizeof(customers[0])];
    memcpy(by_score, customers, n * sizeof(Customer));
    merge_sort(by_score, 0, n - 1, cmp_by_satisfaction);
    printf("--- Sorted by Satisfaction Score (ascending) ---\n");
    print_customers(by_score, n);

    return 0;
}
