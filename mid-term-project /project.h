#ifndef PROJECT_H
#define PROJECT_H

#define MAX_STUDENTS 1000
#define MAX_QUESTIONS 50
#define MAX_NAME_LENGTH 21

typedef struct {
    char name[MAX_NAME_LENGTH];
    char tc_number[12];
    char id_number[9];
    char booklet_type;
    char answers[MAX_QUESTIONS + 1];
    int score;
} Student;

void read_students_file(const char *filename, Student students[], int *num_students);
void read_answer_key_file(const char *filename, char answer_keys[4][MAX_QUESTIONS + 1]);
void calculate_grades(Student students[], int num_students, char answer_keys[4][MAX_QUESTIONS + 1], int correct_counts[MAX_QUESTIONS]);
void write_grades_file(const char *filename, Student students[], int num_students);
void write_statistics_file(const char *filename, Student students[], int num_students, int correct_counts[MAX_QUESTIONS]);

#endif