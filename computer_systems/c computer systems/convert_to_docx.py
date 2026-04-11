#!/usr/bin/env python3
"""
Convert a .pages file to .docx using Apple Pages via AppleScript.
This preserves all formatting, images, and content exactly.

Usage:
    python3 convert_to_docx.py                          # converts "final repport.pages"
    python3 convert_to_docx.py path/to/file.pages       # converts specified file
    python3 convert_to_docx.py input.pages output.docx  # custom output path
"""

import subprocess
import os
import sys


def convert_pages_to_docx(pages_file: str, output_file: str = None) -> None:
    pages_file = os.path.abspath(pages_file)

    if not os.path.exists(pages_file):
        print(f"Error: File not found: {pages_file}")
        sys.exit(1)

    if output_file is None:
        output_file = os.path.splitext(pages_file)[0] + ".docx"
    output_file = os.path.abspath(output_file)

    print(f"Converting: {pages_file}")
    print(f"Output:     {output_file}")

    applescript = f"""
    tell application "Pages"
        set theDoc to open POSIX file "{pages_file}"
        delay 2
        export theDoc to POSIX file "{output_file}" as Microsoft Word
        close theDoc saving no
    end tell
    """

    result = subprocess.run(
        ["osascript", "-e", applescript],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(f"AppleScript error:\n{result.stderr.strip()}")
        sys.exit(1)

    if os.path.exists(output_file):
        size_kb = os.path.getsize(output_file) / 1024
        print(f"Done! Output file: {output_file} ({size_kb:.1f} KB)")
    else:
        print("Conversion may have failed — output file not found.")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) == 3:
        convert_pages_to_docx(sys.argv[1], sys.argv[2])
    elif len(sys.argv) == 2:
        convert_pages_to_docx(sys.argv[1])
    else:
        # Default: convert the report in the same directory as this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        default_input = os.path.join(script_dir, "final repport.pages")
        convert_pages_to_docx(default_input)
