#include <stdio.h>

int main(void) {
    int n;

    printf("Enter n: ");
    if (scanf("%d", &n) != 1) {
        return 1;
    }

    for (int i = 1; i <= 5; ++i) {
        printf("%d * %d = %d\n", n, i, n * i);
    }

    int sum = 0;
    int value;

    printf("Enter numbers to sum (0 to stop):\n");
    while (1) {
        if (scanf("%d", &value) != 1) {
            break;
        }
        if (value == 0) {
            break;
        }
        sum += value;
    }

    printf("Total sum: %d\n", sum);

    return 0;
}
