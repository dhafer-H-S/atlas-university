\documentclass[a4paper,12pt]{article}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{hyperref}

% Set up syntax highlighting for C code
\lstset{
    language=C,
    basicstyle=\ttfamily\small,
    keywordstyle=\color{blue}\bfseries,
    stringstyle=\color{red},
    commentstyle=\color{green!60!black},
    backgroundcolor=\color{gray!10},
    numbers=left,
    numberstyle=\tiny,
    stepnumber=1,
    frame=single,
    breaklines=true,
    tabsize=4,
    showstringspaces=false,
    captionpos=b
}

\title{Mid-Term Project Report}
\author{Dhafer Hamza Sfaxi}
\date{\today}

\begin{document}

\maketitle

\tableofcontents

\newpage

\section{Introduction}
This report describes a student grading system implemented in C. The system reads student data and answer keys from input files, calculates grades based on their answers, and generates output files containing grades and grading statistics. The program is designed with modularity, scalability, and robustness in mind.

\section{Project Overview}
The program processes data from two input files:
\begin{itemize}
    \item \textbf{cards.txt:} Contains student data, including name, TC number, ID number, booklet type, and answers.
    \item \textbf{AnswerKeys.txt:} Contains answer keys for multiple booklet types.
\end{itemize}

It outputs the following:
\begin{itemize}
    \item \textbf{GradesTest.txt:} Detailed grades for each student.
    \item \textbf{statistics.txt:} Summarizes statistics, such as the number of students per booklet type and question-wise performance.
\end{itemize}

\section{Source Code}
\subsection{\texttt{functions.c}}
This file contains the core logic of the program.

\subsubsection{\texttt{read\_students\_file}}
\begin{lstlisting}[caption={Reading student data from file}]
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

        // Extract name
        strncpy(students[*num_students].name, line, 20);
        students[*num_students].name[20] = '\0'; // Null-terminate the string
        printf("Name: %s\n", students[*num_students].name);

        // Extract TC number
        strncpy(students[*num_students].tc_number, line + 20, 12);
        students[*num_students].tc_number[12] = '\0'; // Null-terminate the string
        printf("TC Number: %s\n", students[*num_students].tc_number);

        // Extract ID number
        strncpy(students[*num_students].id_number, line + 32, 9);
        students[*num_students].id_number[9] = '\0'; // Null-terminate the string
        printf("ID Number: %s\n", students[*num_students].id_number);

        // Extract booklet type
        students[*num_students].booklet_type = line[41];
        printf("Booklet Type: %c\n", students[*num_students].booklet_type);

        // Extract answers (starting from index 42)
        strncpy(students[*num_students].answers, line + 42, MAX_QUESTIONS);
        students[*num_students].answers[MAX_QUESTIONS] = '\0'; // Null-terminate
        printf("Answers: %s\n", students[*num_students].answers);

        (*num_students)++;
    }

    printf("Total students read: %d\n", *num_students);
    fclose(file);
}
\end{lstlisting}

\subsubsection{\texttt{read\_answer\_key\_file}}
\begin{lstlisting}[caption={Reading answer keys from file}]
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
\end{lstlisting}

\subsubsection{\texttt{calculate\_grades}}
\begin{lstlisting}[caption={Calculating grades for each student}]
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
        students[i].score = correct_answers * 102 / MAX_QUESTIONS; // 102 is the max score
        printf("Student %d Score: %d\n", i + 1, students[i].score);
    }
}
\end{lstlisting}

\subsubsection{\texttt{write\_grades\_file}}
\begin{lstlisting}[caption={Writing student grades to file}]
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
\end{lstlisting}

\subsection{\texttt{main.c}}
\begin{lstlisting}[caption={Main function for processing student grading system}]
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
\end{lstlisting}

\section{Conclusion}
This project demonstrates a structured approach to processing and grading student data. The modularity of the functions allows for easy extension, debugging, and maintenance. The program can be adapted for other grading systems with minimal changes.

\end{document}
