#include <stdio.h>
#include <string.h>

#define MAX_STUDENTS 1000
#define MAX_QUESTIONS 100

typedef struct {
    char id[10];
    char name[50];
    char answers[MAX_QUESTIONS + 1];
    int correct_count;
} Student;

void exercise1(const char *filename) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        perror("Error opening file");
        return;
    }

    // Answer Key
    const char *answer_key = "AABACADBDDDCDCACADCBCBBDBACDDDBCBBCBDACAABACACCCBBA";

    Student students[MAX_STUDENTS];
    int student_count = 0;

    printf("ID\tCorrect Answers\n");

    // Read the file
    while (fscanf(file, "%s %s %s",
                  students[student_count].id,
                  students[student_count].name,
                  students[student_count].answers) == 3) {
        // Calculate correct answers
        int correct_count = 0;
        for (int i = 0; i < MAX_QUESTIONS; i++) {
            if (students[student_count].answers[i] == answer_key[i]) {
                correct_count++;
            }
        }
        students[student_count].correct_count = correct_count;

        // Print result
        printf("%s\t%d\n", students[student_count].id, correct_count);

        student_count++;
    }

    fclose(file);
}
