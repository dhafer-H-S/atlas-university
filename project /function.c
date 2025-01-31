#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "project.h"

void read_students_file(const char *filename, Student students[], int *num_students) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("Error opening student file");
        exit(EXIT_FAILURE);
    }

    char line[256]; // Assuming each line is less than 256 characters
    *num_students = 0;

    printf("Reading students file...\n");
    while (fgets(line, sizeof(line), file)) {
        printf("Line read: %s\n", line);

        // Extract booklet type
        students[*num_students].booklet_type = line[41];
        printf("Booklet Type: %c\n", students[*num_students].booklet_type);

        // Extract ID number
        strncpy(students[*num_students].id_number, line + 32, 9);
        students[*num_students].id_number[9] = '\0'; // Null-terminate the string
        printf("ID Number: %s\n", students[*num_students].id_number);

        // Extract answers (starting from index 42)
        strncpy(students[*num_students].answers, line + 42, MAX_QUESTIONS);
        students[*num_students].answers[MAX_QUESTIONS] = '\0'; // Null-terminate
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

void calculate_grades(Student students[], int num_students, char answer_keys[4][MAX_QUESTIONS + 1]) {
    for (int i = 0; i < num_students; i++) {
        int correct_answers = 0;

        // Get the appropriate answer key for the student's booklet type
        char *answer_key = answer_keys[students[i].booklet_type - 'A'];
        printf("Grading student %d (Booklet Type: %c)\n", i + 1, students[i].booklet_type);

        // Compare each answer
        for (int j = 0; j < MAX_QUESTIONS; j++) {
            if (students[i].answers[j] == answer_key[j]) {
                correct_answers++;
            } else {
                printf("Mismatch at Q%d: Student (%c), Key (%c)\n", j + 1, students[i].answers[j], answer_key[j]);
            }
        }

        // Scale the score
        students[i].score = correct_answers * 102 / MAX_QUESTIONS; // 102 is the max score
        printf("Student %d Score: %d\n", i + 1, students[i].score);
    }
}

void write_grades_file(const char *filename, Student students[], int num_students) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        perror("Error opening grades file");
        exit(EXIT_FAILURE);
    }

    for (int i = 0; i < num_students; i++) {
        fprintf(file, "%s %s %s %c %d\n",
                students[i].name,
                students[i].tc_number,
                students[i].id_number,
                students[i].booklet_type,
                students[i].score);
    }
    fclose(file);
}

void write_statistics_file(const char *filename, Student students[], int num_students) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        perror("Error opening statistics file");
        exit(EXIT_FAILURE);
    }

    int total_score = 0, max_score = 0, min_score = 102;
    for (int i = 0; i < num_students; i++) {
        total_score += students[i].score;
        if (students[i].score > max_score) max_score = students[i].score;
        if (students[i].score < min_score) min_score = students[i].score;
    }
    fprintf(file, "Average Score: %.2f\n", (float)total_score / num_students);
    fprintf(file, "Max Score: %d\n", max_score);
    fprintf(file, "Min Score: %d\n", min_score);

    fclose(file);
}