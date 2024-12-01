#include <stdio.h>

// int main() {
//     int a = 10;
//     int b = 10;
//     int sum = a + b;
//     printf("Sum: %d\n", sum);
//     return 0;
// }

// int main () {
//     int num1 , num2 , num3;
//     printf("give three numbers");
//     scanf("%d %d %d", &num1, &num2, &num3);
//     int sum = num1 + num2 + num3;
//     printf("Sum: %d", sum);
//     return 0;
// }
// #define NAME "Dhafer"
// #define AGE 20

// int main() {
//     printf("%s is over %d years old", NAME, AGE);
// }

// int main () {
//     printf("Hello , welcome to the world of \"C\" programming! \n");
//     printf("this line contains a single quote : '\n");
//     printf("this line contain a backslash: \\\n");
//     return 0;
//     }

#define PI 3.14159265358979323846

int main() {
    int radius;
    printf("give the radius of the circle you want to calculate : ");
    scanf("%d" , &radius);
    float C = PI * 2 * radius;
    float A = PI * radius * radius;
    printf("circumference of the circle is : %f\n", C);
    printf("Area of the circle is : %f\n", A);
    return 0;
}