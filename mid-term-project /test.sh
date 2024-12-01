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