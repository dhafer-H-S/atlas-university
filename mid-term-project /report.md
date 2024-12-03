```latex
\documentclass{article}
\usepackage{listings}
\usepackage{graphicx}
\usepackage{geometry}
\geometry{a4paper, margin=1in}

\title{Mid-Term Project Report}
\author{}
\date{}

\begin{document}

\maketitle

\section{Introduction}

This report provides a comprehensive overview of the mid-term project, detailing the project structure, code implementation, and instructions on how to run the project. The project involves processing student grades based on their answers to a set of questions, calculating statistics, and generating output files.

\section{Project Files}

\begin{itemize}
    \item \texttt{output.txt}: Contains the output of running the project, including error messages and the contents of \texttt{GradesTest.txt} and \texttt{statistics.txt}.
    \item \texttt{project.h}: Header file containing constants, structures, and function prototypes.
    \item \texttt{statistics.txt}: Output file containing statistics about the grades.
    \item \texttt{test.sh}: Script to compile and run the project.
    \item \texttt{GradesTest.txt}: Contains the grades of the students after processing.
    \item \texttt{cards.txt}: Input file containing student IDs and their answers.
    \item \texttt{AnswerKeys.txt}: Input file containing the correct answers for the questions.
\end{itemize}

\section{How to Run the Project}

\subsection{Navigate to the Project Directory}

Open a terminal and navigate to the \texttt{mid-term-project} directory:

\begin{verbatim}
cd path/to/mid-term-project
\end{verbatim}

\subsection{Run the Script}

Execute the \texttt{test.sh} script to compile and run the project:

\begin{verbatim}
bash test.sh
\end{verbatim}

\section{Project Structure}

\begin{verbatim}
mid-term-project/
├── project.h
├── function.c
├── main.c
├── test.sh
├── cards.txt
├── AnswerKeys.txt
├── GradesTest.txt
└── statistics.txt
\end{verbatim}

\section{Code Overview}

\subsection{\texttt{project.h}}

The \texttt{project.h} file contains the necessary constants, structures, and function prototypes used throughout the project.

\begin{lstlisting}[language=C]
#ifndef PROJECT_H
#define PROJECT_H

#define MAX_QUESTIONS 50

typedef struct {
     char id[10];
     char answers[MAX_QUESTIONS + 1];
     int grade;
} Student;

void read_students_file(const char *filename, Student students[], int *num_students);
void read_answer_key_file(const char *filename, char answer_keys[4][MAX_QUESTIONS + 1]);
void calculate_grades(Student students[], int num_students, char answer_keys[4][MAX_QUESTIONS + 1], int correct_counts[MAX_QUESTIONS]);
void write_grades_file(const char *filename, Student students[], int num_students);
void write_statistics_file(const char *filename, Student students[], int num_students, int correct_counts[MAX_QUESTIONS]);

#endif
\end{lstlisting}

\subsection{\texttt{function.c}}

The \texttt{function.c} file implements the functions declared in \texttt{project.h}. Below is an example of the \texttt{write\_statistics\_file} function.

\begin{lstlisting}[language=C]
#include <stdio.h>
#include "project.h"

void write_statistics_file(const char *filename, Student students[], int num_students, int correct_counts[MAX_QUESTIONS]) {
     FILE *file = fopen(filename, "w");
     if (file == NULL) {
          perror("Error opening file");
          return;
     }

     fprintf(file, "Using Booklet A numbering:\n");
     fprintf(file, "Q    NoC\n");
     for (int i = 0; i < MAX_QUESTIONS; i++) {
          fprintf(file, "%03d  %d\n", i + 1, correct_counts[i]);
     }

     fclose(file);
}

void read_students_file(const char *filename, Student students[], int *num_students) {
     FILE *file = fopen(filename, "r");
     if (file == NULL) {
          perror("Error opening file");
          return;
     }

     while (fscanf(file, "%s %s", students[*num_students].id, students[*num_students].answers) != EOF) {
          (*num_students)++;
     }

     fclose(file);
}

void read_answer_key_file(const char *filename, char answer_keys[4][MAX_QUESTIONS + 1]) {
     FILE *file = fopen(filename, "r");
     if (file == NULL) {
          perror("Error opening file");
          return;
     }

     for (int i = 0; i < 4; i++) {
          fscanf(file, "%s", answer_keys[i]);
     }

     fclose(file);
}

void calculate_grades(Student students[], int num_students, char answer_keys[4][MAX_QUESTIONS + 1], int correct_counts[MAX_QUESTIONS]) {
     for (int i = 0; i < num_students; i++) {
          students[i].grade = 0;
          for (int j = 0; j < MAX_QUESTIONS; j++) {
               if (students[i].answers[j] == answer_keys[0][j]) {
                    students[i].grade++;
                    correct_counts[j]++;
               }
          }
     }
}

void write_grades_file(const char *filename, Student students[], int num_students) {
     FILE *file = fopen(filename, "w");
     if (file == NULL) {
          perror("Error opening file");
          return;
     }

     for (int i = 0; i < num_students; i++) {
          fprintf(file, "%s %d\n", students[i].id, students[i].grade);
     }

     fclose(file);
}
\end{lstlisting}

\subsection{\texttt{main.c}}

The \texttt{main.c} file contains the main function that orchestrates the reading of input files, calculating grades, and writing output files.

\begin{lstlisting}[language=C]
#include <stdio.h>
#include "project.h"

int main() {
     Student students[100];
     char answer_keys[4][MAX_QUESTIONS + 1];
     int correct_counts[MAX_QUESTIONS] = {0};
     int num_students = 0;

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
\end{lstlisting}

\subsection{\texttt{test.sh}}

The \texttt{test.sh} script compiles and runs the project, capturing the output in \texttt{output.txt}.

\begin{lstlisting}[language=bash]
#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Print the current working directory
echo "Current working directory: $(pwd)" > output.txt

# Check if the input files exist
if [ ! -f "cards.txt" ]; then
     echo "Error: cards.txt file not found!" >> output.txt
     exit 1
fi

if [ ! -f "AnswerKeys.txt" ]; then
     echo "Error: AnswerKeys.txt file not found!" >> output.txt
     exit 1
fi

# Compile the program
gcc main.c function.c -o project

# Run the program and redirect output to output.txt
./project >> output.txt

# Check outputs and append to output.txt
echo "Grades File:" >> output.txt
cat GradesTest.txt >> output.txt
echo >> output.txt
echo "Statistics File:" >> output.txt
cat statistics.txt >> output.txt
\end{lstlisting}

\section{Conclusion}

This project successfully processes student grades based on their answers, calculates statistics, and generates the necessary output files. The provided scripts and code files ensure that the project can be easily compiled and executed, making it a robust solution for grade processing and analysis.

\end{document}
```