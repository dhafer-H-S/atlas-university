#!/usr/bin/env python3
"""
Convert a .key (Keynote) file to .pdf using Apple Keynote via AppleScript.
This preserves all formatting, images, animations layout, and content exactly.

Usage:
    python3 convert_key_to_pdf.py                           # converts "final pptx.key"
    python3 convert_key_to_pdf.py path/to/file.key          # converts specified file
    python3 convert_key_to_pdf.py input.key output.pdf      # custom output path
"""

import subprocess
import os
import sys


def convert_key_to_pdf(key_file: str, output_file: str = None) -> None:
    key_file = os.path.abspath(key_file)

    if not os.path.exists(key_file):
        print(f"Error: File not found: {key_file}")
        sys.exit(1)

    if output_file is None:
        output_file = os.path.splitext(key_file)[0] + ".pdf"
    output_file = os.path.abspath(output_file)

    print(f"Converting: {key_file}")
    print(f"Output:     {output_file}")

    applescript = f"""
    tell application "Keynote"
        set theDoc to open POSIX file "{key_file}"
        delay 2
        export theDoc to POSIX file "{output_file}" as PDF with properties {{PDF image quality:Best}}
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
        convert_key_to_pdf(sys.argv[1], sys.argv[2])
    elif len(sys.argv) == 2:
        convert_key_to_pdf(sys.argv[1])
    else:
        # Default: convert the Keynote file in the same directory as this script
        script_dir = os.path.dirname(os.path.abspath(__file__))
        default_input = os.path.join(script_dir, "final pptx.key")
        convert_key_to_pdf(default_input)
