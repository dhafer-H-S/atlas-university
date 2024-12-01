#include <stdio.h>
#include <string.h>
#include "project.h"

int main() {
    Student students[MAX_STUDENTS];
    char answer_keys[4][MAX_QUESTIONS + 1];
    int num_students = 0;
    int correct_counts[MAX_QUESTIONS] = {0};

    // File names
    const char *students_file = "cards.txt";
    const char *answer_key_file = "AnswerKeys.txt";
    const char *grades_file = "GradesTest.txt";
    const char *statistics_file = "statistics.txt";

    // Read input files
    read_students_file(students_file, students, &num_students);
    read_answer_key_file(answer_key_file, answer_keys);

    // Calculate grades
    calculate_grades(students, num_students, answer_keys, correct_counts);

    // Write output files
    write_grades_file(grades_file, students, num_students);
    write_statistics_file(statistics_file, students, num_students, correct_counts);

    printf("Processing complete. Files generated: %s, %s\n", grades_file, statistics_file);

    return 0;
}