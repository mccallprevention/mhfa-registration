#!/usr/bin/env python3
"""
File Name Collector Script
Collects all file names from the specified directory and saves them to various formats.
"""

import os
import json
from pathlib import Path
from datetime import datetime

def collect_file_names(base_directory_path):
    """
    Collect file names from specific directories within the MHFA registration project.
    
    Args:
        base_directory_path (str): Base path to the mhfa-registration directory
    
    Returns:
        list: List of file information dictionaries
    """
    
    base_directory = Path(base_directory_path)
    
    # Check if base directory exists
    if not base_directory.exists():
        print(f"Error: Directory '{base_directory_path}' does not exist.")
        return []
    
    if not base_directory.is_dir():
        print(f"Error: '{base_directory_path}' is not a directory.")
        return []
    
    file_list = []
    
    # Directories to exclude (case-insensitive)
    excluded_dirs = {'.next', 'node_modules', '.git', '__pycache__', '.vscode', 'dist', 'build'}
    
    # Specific directories to scan recursively
    target_dirs = ['app', 'components', 'lib']
    
    try:
        # 1. Collect files from root directory only (not subdirectories)
        print(f"Scanning root directory: {base_directory}")
        for file_path in base_directory.iterdir():
            if file_path.is_file():
                file_list.append({
                    'name': file_path.name,
                    'full_path': str(file_path),
                    'relative_path': file_path.name,
                    'directory': 'root',
                    'size': file_path.stat().st_size,
                    'extension': file_path.suffix,
                    'modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
                })
        
        # 2. Collect files from specific target directories recursively
        for target_dir in target_dirs:
            target_path = base_directory / target_dir
            
            if target_path.exists() and target_path.is_dir():
                print(f"Scanning directory: {target_path}")
                
                # Recursively scan target directory
                for file_path in target_path.rglob('*'):
                    if file_path.is_file():
                        # Check if any parent directory is in excluded list
                        should_exclude = False
                        for parent in file_path.parents:
                            if parent.name.lower() in excluded_dirs:
                                should_exclude = True
                                break
                        
                        if not should_exclude:
                            file_list.append({
                                'name': file_path.name,
                                'full_path': str(file_path),
                                'relative_path': str(file_path.relative_to(base_directory)),
                                'directory': target_dir,
                                'size': file_path.stat().st_size,
                                'extension': file_path.suffix,
                                'modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
                            })
            else:
                print(f"Warning: Target directory '{target_dir}' not found in {base_directory}")
    
    except PermissionError as e:
        print(f"Permission denied accessing some files: {e}")
    except Exception as e:
        print(f"Error collecting files: {e}")
        return []
    
    return file_list

def save_file_list(file_list, directory_path):
    """
    Save the file list to various formats.
    
    Args:
        file_list (list): List of file information dictionaries
        directory_path (str): Original directory path (for naming output files)
    """
    
    if not file_list:
        print("No files to save.")
        return
    
    # Create output directory
    output_dir = Path("file_lists")
    output_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_name = f"mhfa_project_files_{timestamp}"
    
    # Save as text file - organized by directory
    txt_file = output_dir / f"{base_name}.txt"
    with open(txt_file, 'w', encoding='utf-8') as f:
        f.write(f"Files collected from: {directory_path}\n")
        f.write(f"Collection date: {datetime.now().isoformat()}\n")
        f.write(f"Total files: {len(file_list)}\n")
        f.write("-" * 70 + "\n\n")
        
        # Group files by directory
        files_by_dir = {}
        for file_info in file_list:
            dir_name = file_info['directory']
            if dir_name not in files_by_dir:
                files_by_dir[dir_name] = []
            files_by_dir[dir_name].append(file_info)
        
        # Write files organized by directory
        for dir_name in ['root', 'app', 'components', 'lib']:
            if dir_name in files_by_dir:
                f.write(f"=== {dir_name.upper()} DIRECTORY ===\n")
                for file_info in sorted(files_by_dir[dir_name], key=lambda x: x['relative_path'].lower()):
                    f.write(f"{file_info['relative_path']}\n")
                f.write("\n")
    
    print(f"File list saved to: {txt_file}")
    
    # Save as JSON with full details
    json_file = output_dir / f"{base_name}.json"
    output_data = {
        'project': 'mhfa-registration',
        'base_directory': directory_path,
        'collection_date': datetime.now().isoformat(),
        'total_files': len(file_list),
        'directories_scanned': ['root (files only)', 'app (recursive)', 'components (recursive)', 'lib (recursive)'],
        'excluded_directories': ['.next', 'node_modules', '.git', '__pycache__', '.vscode', 'dist', 'build'],
        'files': sorted(file_list, key=lambda x: (x['directory'], x['relative_path'].lower()))
    }
    
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"Detailed file info saved to: {json_file}")
    
    # Save as CSV
    csv_file = output_dir / f"{base_name}.csv"
    with open(csv_file, 'w', encoding='utf-8') as f:
        f.write("Directory,Name,Relative Path,Full Path,Size (bytes),Extension,Modified Date\n")
        for file_info in sorted(file_list, key=lambda x: (x['directory'], x['relative_path'].lower())):
            f.write(f'"{file_info["directory"]}",')
            f.write(f'"{file_info["name"]}",')
            f.write(f'"{file_info["relative_path"]}",')
            f.write(f'"{file_info["full_path"]}",')
            f.write(f'{file_info["size"]},')
            f.write(f'"{file_info["extension"]}",')
            f.write(f'"{file_info["modified"]}"\n')
    
    print(f"CSV file saved to: {csv_file}")

def print_summary(file_list):
    """Print a summary of collected files."""
    if not file_list:
        print("No files found.")
        return
    
    print(f"\n=== MHFA PROJECT FILE COLLECTION SUMMARY ===")
    print(f"Total files found: {len(file_list)}")
    
    # Group by directory
    dirs = {}
    for file_info in file_list:
        dir_name = file_info['directory']
        dirs[dir_name] = dirs.get(dir_name, 0) + 1
    
    print(f"\nFiles by directory:")
    for dir_name in ['root', 'app', 'components', 'lib']:
        if dir_name in dirs:
            print(f"  {dir_name}: {dirs[dir_name]} files")
    
    # Group by extension
    extensions = {}
    for file_info in file_list:
        ext = file_info['extension'].lower() if file_info['extension'] else 'No extension'
        extensions[ext] = extensions.get(ext, 0) + 1
    
    print(f"\nFiles by extension:")
    for ext, count in sorted(extensions.items(), key=lambda x: x[1], reverse=True):
        print(f"  {ext}: {count} files")
    
    # Show total size
    total_size = sum(file_info['size'] for file_info in file_list)
    size_mb = total_size / (1024 * 1024)
    print(f"\nTotal size: {total_size:,} bytes ({size_mb:.2f} MB)")
    
    print(f"\nExcluded directories: .next, node_modules, .git, __pycache__, .vscode, dist, build")

def main():
    """Main function to run the file collector."""
    
    # Directory to scan
    directory_path = r"C:\Users\nathan.lannan\mhfa-registration"
    
    print(f"Collecting files from MHFA Registration project: {directory_path}")
    print("Scanning directories: root (files only), app, components, lib")
    print("Excluding: .next, node_modules, .git, __pycache__, .vscode, dist, build")
    print("=" * 70)
    
    # Collect files from specific directories
    file_list = collect_file_names(directory_path)
    
    if file_list:
        # Print summary
        print_summary(file_list)
        
        # Save to all formats
        save_file_list(file_list, directory_path)
        
        # Print organized file list preview
        print(f"\n=== FILE LIST PREVIEW (Organized by Directory) ===")
        
        # Group files by directory for preview
        files_by_dir = {}
        for file_info in file_list:
            dir_name = file_info['directory']
            if dir_name not in files_by_dir:
                files_by_dir[dir_name] = []
            files_by_dir[dir_name].append(file_info)
        
        # Show preview for each directory
        for dir_name in ['root', 'app', 'components', 'lib']:
            if dir_name in files_by_dir:
                files_in_dir = files_by_dir[dir_name]
                print(f"\n{dir_name.upper()} ({len(files_in_dir)} files):")
                
                # Show first 5 files in each directory
                for i, file_info in enumerate(sorted(files_in_dir, key=lambda x: x['relative_path'].lower())[:5]):
                    print(f"  {file_info['relative_path']}")
                
                if len(files_in_dir) > 5:
                    print(f"  ... and {len(files_in_dir) - 5} more files")
    
    print(f"\nScript completed. Check the 'file_lists' directory for output files.")

if __name__ == "__main__":
    main()