#include <stdio.h>

// Declare the exercise functions
void exercise1(const char *filename);
void exercise2(const char *filename);
void exercise3(const char *filename);

int main() {
    const char *filename = "GradesTest.txt";

    printf("Exercise 1:\n");
    exercise1(filename);
    printf("\n");

    printf("Exercise 2:\n");
    exercise2(filename);
    printf("\n");

    printf("Exercise 3:\n");
    exercise3(filename);
    printf("\n");

    return 0;
}