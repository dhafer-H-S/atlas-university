#include <stdio.h>

int main(void) {
    int length = 7;
    int width = 4;

    int area = length * width;
    int perimeter = 2 * (length + width);

    printf("Length: %d\n", length);
    printf("Width: %d\n", width);
    printf("Area: %d\n", area);
    printf("Perimeter: %d\n", perimeter);

    return 0;
}
