#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "project.h"

void read_students_file(const char *filename, Student students[], int *num_students) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("Error opening students file");
        exit(EXIT_FAILURE);
    }

    char line[256];
    while (fgets(line, sizeof(line), file)) {
        // Extract name
        strncpy(students[*num_students].name, line, 20);
        students[*num_students].name[20] = '\0'; // Null-terminate

        // Extract TC number
        strncpy(students[*num_students].tc_number, line + 20, 11);
        students[*num_students].tc_number[12] = '\0'; // Null-terminate

        // Extract ID number
        strncpy(students[*num_students].id_number, line + 31, 9);
        students[*num_students].id_number[9] = '\0'; // Null-terminate

        // Extract booklet type
        students[*num_students].booklet_type = line[41];

        // Extract answers (starting from index 42)
        strncpy(students[*num_students].answers, line + 41, MAX_QUESTIONS);
        students[*num_students].answers[MAX_QUESTIONS] = '\0'; // Null-terminate

        printf("Name: %s\n", students[*num_students].name);
        printf("TC Number: %s\n", students[*num_students].tc_number);
        printf("ID Number: %s\n", students[*num_students].id_number);
        printf("Booklet Type: %c\n", students[*num_students].booklet_type);
        printf("Answers: %s\n", students[*num_students].answers);

        (*num_students)++;
    }

    printf("Total students read: %d\n", *num_students);
    fclose(file);
}

void read_answer_key_file(const char *filename, char answer_keys[4][MAX_QUESTIONS + 1]) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("Error opening answer key file");
        exit(EXIT_FAILURE);
    }

    char buffer[MAX_QUESTIONS + 2];
    while (fscanf(file, "%s", buffer) == 1) {
        int index = buffer[0] - 'A';
        strcpy(answer_keys[index], buffer + 1);
        printf("Answer key for booklet %c: %s\n", buffer[0], answer_keys[index]);
    }
    fclose(file);
}

void calculate_grades(Student students[], int num_students, char answer_keys[4][MAX_QUESTIONS + 1], int correct_counts[MAX_QUESTIONS]) {
    for (int i = 0; i < num_students; i++) {
        int correct_answers = 0;

        // Get the appropriate answer key for the student's booklet type
        char *answer_key = answer_keys[students[i].booklet_type - 'A'];
        printf("Grading student %d (Booklet Type: %c)\n", i + 1, students[i].booklet_type);

        // Compare each answer
        for (int j = 0; j < MAX_QUESTIONS; j++) {
            if (students[i].answers[j] == answer_key[j]) {
                correct_answers++;
                correct_counts[j]++;
            } else {
                printf("Mismatch at Q%d: Student (%c), Key (%c)\n", j + 1, students[i].answers[j], answer_key[j]);
            }
        }

        // Scale the score
        students[i].score = correct_answers * 100 / MAX_QUESTIONS; // 102 is the max score
        printf("Student %d Score: %d\n", i + 1, students[i].score);
    }
}

void write_grades_file(const char *filename, Student students[], int num_students) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        perror("Error opening grades file");
        exit(EXIT_FAILURE);
    }

    // Write table header
    fprintf(file, "%-20s %-12s %-9s %-10s %-6s\n", "Name", "TC Number", "ID Number", "Booklet", "Score");
    fprintf(file, "%-20s %-12s %-9s %-10s %-6s\n", "--------------------", "------------", "---------", "----------", "-----");

    // Write student data
    for (int i = 0; i < num_students; i++) {
        fprintf(file, "%-20s %-12.12s %-9.9s %-10c %-6d\n",
                students[i].name,
                students[i].tc_number,
                students[i].id_number,
                students[i].booklet_type,
                students[i].score);
    }
    fclose(file);
}

void write_statistics_file(const char *filename, Student students[], int num_students, int correct_counts[MAX_QUESTIONS]) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        perror("Error opening statistics file");
        exit(EXIT_FAILURE);
    }

    int count_A = 0, count_B = 0;
    for (int i = 0; i < num_students; i++) {
        switch (students[i].booklet_type) {
            case 'A': count_A++; break;
            case 'B': count_B++; break;

        }
    }

    fprintf(file, "Count of A booklets   = %d\n", count_A);
    fprintf(file, "Count of B booklets   = %d\n", count_B);

    fprintf(file, "Count of all booklets = %d\n\n", num_students);

    fprintf(file, "Using Booklet A numbering:\n");
    fprintf(file, "Q    NoC\n");
    for (int i = 0; i < MAX_QUESTIONS; i++) {
        fprintf(file, "%03d  %d\n", i + 1, correct_counts[i]);
    }

    fclose(file);
}