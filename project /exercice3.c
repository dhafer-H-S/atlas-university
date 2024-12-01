#include <stdio.h>
#include <string.h>
#include "project.h" // Include the header file

void exercise3(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("Error opening file");
        return;
    }

    const char *answer_key = "AABACADBDDDCDCACADCBCBBDBACDDDBCBBCBDACAABACACCCBBA";
    char id[10], name[50], answers[MAX_QUESTIONS + 1];
    int original_mt;

    FILE *temp_file = fopen("temp.txt", "w");
    if (!temp_file) {
        perror("Error opening temp file");
        fclose(file);
        return;
    }

    // Read and update grades
    while (fscanf(file, "%s %s %s %d", id, name, answers, &original_mt) == 4) {
        printf("Read student: ID=%s, Name=%s, Answers=%s, Original MT=%d\n", id, name, answers, original_mt);

        // Calculate correct answers
        int correct_count = 0;
        for (int i = 0; i < MAX_QUESTIONS; i++) {
            if (answers[i] == answer_key[i]) {
                correct_count++;
            }
        }

        // Scale score to a maximum of 102
        int new_mt = (correct_count * 102) / MAX_QUESTIONS;
        printf("New MT for student %s: %d\n", id, new_mt);

        // Write to temp file
        fprintf(temp_file, "%s %s %s %d\n", id, name, answers, new_mt);
    }

    fclose(file);
    fclose(temp_file);

    // Replace original file with updated file
    remove(filename);
    rename("temp.txt", filename);
}