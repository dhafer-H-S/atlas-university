#include <stdio.h>
#include <string.h>  // For strlen()

int main()
{
    char inputString[100];
    int key = 0;

    while (1)
    {
        printf("\nEnter a string without white spaces: ");
        scanf("%s", inputString);

        // Input for key
        printf("\nEnter a key (An integer between -9 and 9): ");
        scanf("%d", &key);

        // Check if key is within the valid range
        if (key < -9 || key > 9)
        {
            printf("Invalid key! Please enter a key between -9 and 9.\n");
            continue;  // Restart the loop if the key is invalid
        }

        // Iterate over the input string and apply Caesar cipher
        printf("The resulting string is: ");
        for (int i = 0; i < strlen(inputString); i++)
        {
            char ch = inputString[i];
            
            // Ciphering/deciphering logic for alphabetic characters
            if (ch >= 'a' && ch <= 'z')  // Lowercase letters
            {
                ch = (ch - 'a' + key + 26) % 26 + 'a';
            }
            else if (ch >= 'A' && ch <= 'Z')  // Uppercase letters
            {
                ch = (ch - 'A' + key + 26) % 26 + 'A';
            }
            
            printf("%c", ch);
        }

        printf("\n");
    }

    return 0;
}
