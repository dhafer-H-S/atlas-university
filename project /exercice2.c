#include <stdio.h>
#include <string.h>

void exercise2(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("Error opening file");
        return;
    }

    char id[10], name[50], codeplace[100];
    printf("ID\tNumber\tPlace\n");

    // Read the file
    while (fscanf(file, "%s %s %s", id, name, codeplace) == 3) {
        char number[20], place[50];

        // Extract Number and Place
        sscanf(codeplace, "%[^0-9]%s", number, place);

        // Print result
        printf("%s\t%s\t%s\n", id, number, place);
    }

    fclose(file);
}
