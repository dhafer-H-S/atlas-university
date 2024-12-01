#include <stdio.h>

//exercise of matrix//

//i ve faced a problem with the size of the matrix so i made them 3 x 3//
// #define ROWS 3
// #define COLS 3

// void printMatrix(int matrix[ROWS][COLS], int rows, int cols) {
//     for (int i = 0; i < rows; i++) {
//         for (int j = 0; j < cols; j++) {
//             printf("%d ", matrix[i][j]);
//         }
//         printf("\n");
//     }
// }

// void transposeMatrix(int original[ROWS][COLS], int transposed[COLS][ROWS]) {
//     for (int i = 0; i < ROWS; i++) {
//         for (int j = 0; j < COLS; j++) {
//             transposed[j][i] = original[i][j];
//         }
//     }
// }
// // main function to test the code //
// int main() {
//     int matrix[ROWS][COLS] = {
//         {1, 2, 3},
//         {4, 5, 6},
//         {7, 8, 9}
//     };

//     int transposed[COLS][ROWS];

//     printf("Original Matrix:\n");
//     printMatrix(matrix, ROWS, COLS);

//     transposeMatrix(matrix, transposed);

//     printf("\nTransposed Matrix:\n");
//     printMatrix(transposed, COLS, ROWS);

//     return 0;
// }
/////////////////////////////////////////////////////////////////////////////////////////

// exercise of a function adding two numbers //
// int sumEven(int number[], int size) {
//     int total = 0;
//     for (int i = 0; i < size; i++) {
//         if (number[i] % 2 == 0) {
//             total += number[i];
//         }
//     }
//     return total;
// }
// int sumOdd(int number[], int size) {
//     int total = 0;
//     for (int i = 0; i < size; i++) {
//         if (number[i] % 2 != 0) {
//             total += number[i];
//         }
//     }
//     return total;
// }

// int main() {
//     int number[10];
//     int i;

//     for (i = 0; i < 10; i++) {
//         printf("Enter number %d to add: ", i + 1);
//         scanf("%d", &number[i]);
//     }

//     int evenResult = sumEven(number, 10);
//     int oddResult = sumOdd(number, 10);

//     printf("The sum of the even numbers is: %d\n", evenResult);
//     printf("The sum of the odd numbers is: %d\n", oddResult);

//     return 0;
// }


// lab exercise //

int getarraysize() {
    int size;
    printf("Enter the size of the array: ");
    scanf("%d", &size);
    return size;
}

// Function to find the largest element in an array
int findlargest(int number[], int size) {
    int largest = number[0];
    for (int i = 1; i < size; i++) {
        if (number[i] > largest) {
            largest = number[i];
        }
    }
    return largest;
}

int main() {
    int size = getarraysize();
    int number[size];

    for (int i = 0; i < size; i++) {
        printf("Enter number %d: ", i + 1);
        scanf("%d", &number[i]);
    }

    int largest = findlargest(number, size);
    printf("The largest element in the array is: %d\n", largest);

    return 0;
}

