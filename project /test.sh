#!/bin/bash

# Compile the program
gcc main.c function.c -o project

# Run the program
./project

# Check outputs
echo "Grades File:"
cat GradesTest.txt
echo
echo "Statistics File:"
cat statistics.txt
