#include <stdio.h>

int main() {
    // code 1 

    // char array[] = {'D', 'h', 'a', 'f', 'e', 'r'};
    // for (int i = 0; i < 6; i++) {
    //     printf("%c", array[i]);
    // }
    // printf("\n");
    // return 0;

    // code 2
    // int numbers[5];
    // int sum;
    // int i;
    // printf("enter 5 numbers \n");
    // for (i =0; i <5; i++) {
    //     printf("print %d number : ", i + 1);
    //     scanf("%d", &numbers[i]);
    // }
    // for (i = 0; i < 5; i++) {
    //     sum += numbers[i];
    // }
    // printf("the sum of numbers is : %d", sum);
    // return 0;

    // lab work 4:

    int numbers[10];
    int max, min;
    int i;
    int j;
    printf("enter 10 positive random numbers :\n");
    for (i = 0; i < 10; i++) {
        printf("enter %d number : ", i + 1);
        scanf("%d", &numbers[i]);
    }
    min = max = numbers[0];

    for (i = 0; i < 10; i++) {
        if (numbers[i] <= min) {
            min = numbers[i];
        }
        if (numbers[i] > max) {
            max = numbers[i];
        }

    }
    printf("maximum number is : %d \n", max);
    printf("minimum number is : %d \n", min);
    return 0;
}