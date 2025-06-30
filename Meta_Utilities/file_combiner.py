#!/usr/bin/env python3
"""
MHFA Project File Combiner
Combines all source files from the MHFA registration project into a single text file.
"""

import os
from pathlib import Path
from datetime import datetime

def get_file_list():
    """
    Returns the list of files to combine based on your project structure.
    """
    files = {
        'root': [
            '.env.local',
            '.gitignore',
            'components.json',
            'eslint.config.mjs',
            'Handoff.md',
            'middleware.ts',
            'next-env.d.ts',
            'next.config.ts',
            'package-lock.json',
            'package.json',
            'postcss.config.js',
            'postcss.config.mjs',
            'README.md',
            'tailwind.config.js',
            'tsconfig.json',
            'vercel.json'
        ],
        'app': [
            'app/admin/login/page.tsx',
            'app/admin/page.tsx',
            'app/api/events/[id]/route.ts',
            'app/api/events/route.ts',
            'app/api/test-auth/route.ts',
            'app/api/test-db/route.ts',
            'app/globals.css',
            'app/layout.tsx',
            'app/page.tsx',
            'app/test-events/page.tsx'
        ],
        'components': [
            'components/event-card.tsx',
            'components/training-filter.tsx',
            'components/ui/button.tsx',
            'components/ui/card.tsx',
            'components/ui/dialog.tsx',
            'components/ui/language-toggle.tsx',
            'components/ui/logo-header.tsx'
        ],
        'lib': [
            'lib/auth-simple.ts',
            'lib/constants.ts',
            'lib/db/redis-client.ts',
            'lib/db/seed.ts',
            'lib/hooks/useEventFilter.ts',
            'lib/i18n/translations.ts',
            'lib/i18n/useTranslation.ts',
            'lib/sample-data-generator.ts',
            'lib/sample-data.ts',
            'lib/types.ts',
            'lib/utils.ts'
        ]
    }
    return files

def is_text_file(file_path):
    """
    Check if a file is likely a text file based on its extension.
    """
    text_extensions = {
        '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.css', '.scss',
        '.html', '.htm', '.xml', '.yml', '.yaml', '.toml', '.ini', '.conf',
        '.config', '.gitignore', '.env', '.mjs', '.local'
    }
    
    file_path = Path(file_path)
    
    # Check extension
    if file_path.suffix.lower() in text_extensions:
        return True
    
    # Check if it's a config file without extension
    if file_path.name in ['.gitignore', '.env.local', 'Dockerfile', 'README']:
        return True
    
    return False

def should_include_file(file_path):
    """
    Determine if a file should be included in the combined output.
    """
    file_path = Path(file_path)
    
    # Skip binary files
    if not is_text_file(file_path):
        return False
    
    # Skip large files that are typically not source code
    skip_files = {
        'package-lock.json',  # Too large and not source code
        'Current.png',        # Binary file
        'favicon.ico'         # Binary file
    }
    
    if file_path.name in skip_files:
        return False
    
    return True

def read_file_safely(file_path):
    """
    Safely read a file with different encoding attempts.
    """
    encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252']
    
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            continue
        except Exception as e:
            return f"Error reading file: {str(e)}"
    
    return "Could not read file with any encoding"

def combine_files(base_directory, output_file=None):
    """
    Combine all project files into a single text file.
    
    Args:
        base_directory (str): Base directory of the MHFA project
        output_file (str): Output file path (optional)
    """
    base_path = Path(base_directory)
    
    if not base_path.exists():
        print(f"Error: Directory '{base_directory}' does not exist.")
        return
    
    # Get file list
    file_structure = get_file_list()
    
    # Create output file name if not provided
    if output_file is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"mhfa_project_combined_{timestamp}.txt"
    
    output_path = Path(output_file)
    
    # Statistics
    total_files = 0
    included_files = 0
    skipped_files = []
    
    print(f"Combining MHFA project files into: {output_path}")
    print("=" * 70)
    
    with open(output_path, 'w', encoding='utf-8') as outfile:
        # Write header
        outfile.write("MHFA REGISTRATION PROJECT - COMBINED SOURCE FILES\n")
        outfile.write("=" * 70 + "\n")
        outfile.write(f"Generated on: {datetime.now().isoformat()}\n")
        outfile.write(f"Base directory: {base_directory}\n")
        outfile.write("=" * 70 + "\n\n")
        
        # Process each directory
        for directory, files in file_structure.items():
            outfile.write(f"\n{'=' * 20} {directory.upper()} DIRECTORY {'=' * 20}\n\n")
            
            dir_file_count = 0
            
            for relative_file_path in files:
                total_files += 1
                full_file_path = base_path / relative_file_path
                
                if not full_file_path.exists():
                    skipped_files.append(f"{relative_file_path} (not found)")
                    continue
                
                if not should_include_file(full_file_path):
                    skipped_files.append(f"{relative_file_path} (binary/excluded)")
                    continue
                
                print(f"Processing: {relative_file_path}")
                
                # Write file header
                outfile.write(f"\n{'-' * 60}\n")
                outfile.write(f"FILE: {relative_file_path}\n")
                outfile.write(f"SIZE: {full_file_path.stat().st_size} bytes\n")
                outfile.write(f"MODIFIED: {datetime.fromtimestamp(full_file_path.stat().st_mtime).isoformat()}\n")
                outfile.write(f"{'-' * 60}\n\n")
                
                # Read and write file content
                content = read_file_safely(full_file_path)
                outfile.write(content)
                
                # Add separator
                outfile.write(f"\n\n{'=' * 60}\n")
                outfile.write(f"END OF FILE: {relative_file_path}\n")
                outfile.write(f"{'=' * 60}\n\n")
                
                included_files += 1
                dir_file_count += 1
            
            outfile.write(f"\n--- End of {directory} directory ({dir_file_count} files) ---\n\n")
        
        # Write summary
        outfile.write(f"\n{'=' * 70}\n")
        outfile.write("COMBINATION SUMMARY\n")
        outfile.write(f"{'=' * 70}\n")
        outfile.write(f"Total files processed: {total_files}\n")
        outfile.write(f"Files included: {included_files}\n")
        outfile.write(f"Files skipped: {len(skipped_files)}\n")
        
        if skipped_files:
            outfile.write(f"\nSkipped files:\n")
            for skipped in skipped_files:
                outfile.write(f"  - {skipped}\n")
        
        outfile.write(f"\nGeneration completed: {datetime.now().isoformat()}\n")
    
    # Print completion summary
    print(f"\nCombination completed!")
    print(f"Output file: {output_path.absolute()}")
    print(f"Total files processed: {total_files}")
    print(f"Files included: {included_files}")
    print(f"Files skipped: {len(skipped_files)}")
    print(f"Combined file size: {output_path.stat().st_size:,} bytes")
    
    if skipped_files:
        print(f"\nSkipped files:")
        for skipped in skipped_files[:10]:  # Show first 10
            print(f"  - {skipped}")
        if len(skipped_files) > 10:
            print(f"  ... and {len(skipped_files) - 10} more")

def main():
    """Main function to run the file combiner."""
    
    # Base directory of the MHFA project
    base_directory = r"C:\Users\nathan.lannan\mhfa-registration"
    
    print("MHFA Registration Project File Combiner")
    print("=" * 50)
    print(f"Source directory: {base_directory}")
    print("This will combine all source files into a single text file.")
    print("Binary files and large dependency files will be skipped.")
    print()
    
    # Ask for confirmation
    response = input("Continue? (y/N): ").strip().lower()
    if response not in ['y', 'yes']:
        print("Operation cancelled.")
        return
    
    # Combine files
    combine_files(base_directory)

if __name__ == "__main__":
    main()