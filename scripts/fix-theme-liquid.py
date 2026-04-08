#!/usr/bin/env python3
"""
TechAuraz theme.liquid Structural Repair Script
"""

import os
import shutil
import sys

# Force UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

THEME_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'layout', 'theme.liquid')

def main():
    print(f"Reading: {THEME_FILE}")
    
    # Restore from backup if it exists (so we work with original)
    backup = THEME_FILE + '.backup'
    if os.path.exists(backup):
        shutil.copy2(backup, THEME_FILE)
        print("Restored from backup for clean run")
    
    with open(THEME_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    total = len(lines)
    print(f"Total lines: {total}")
    
    # Backup
    shutil.copy2(THEME_FILE, backup)
    print(f"Backup saved")
    
    # STEP 1: Remove duplicate head block (lines 332-523, 0-indexed: 331-522)
    line_332 = lines[331].strip() if len(lines) > 331 else ''
    print(f"Line 332 starts with: {repr(line_332[:30])}")
    
    if '</title>' in line_332:
        print("Confirmed duplicate at line 332")
        before_dup = lines[:331]
        after_dup = lines[523:]
        lines = before_dup + after_dup
        print(f"Removed {523-331} duplicate lines. New total: {len(lines)}")
    else:
        print(f"WARNING: Line 332 = {repr(line_332[:50])}. Searching for duplicate...")
        # Search for the second occurrence of </title>
        found_first = False
        dup_start = None
        dup_end = None
        for i, line in enumerate(lines):
            if '</title>' in line.strip():
                if found_first:
                    dup_start = i
                    print(f"Found duplicate </title> at line {i+1}")
                    break
                found_first = True
        
        if dup_start:
            # Find the end of duplicate - look for the product-card CSS link after the dup
            for i in range(dup_start, min(dup_start + 250, len(lines))):
                if 'techauraz-product-card.css' in lines[i]:
                    # Go back to find the start of this conditional
                    for j in range(i, max(i-5, dup_start), -1):
                        if 'template.name' in lines[j] and 'index' in lines[j]:
                            dup_end = j
                            break
                    break
            
            if dup_end:
                before_dup = lines[:dup_start]
                after_dup = lines[dup_end:]
                lines = before_dup + after_dup
                print(f"Removed lines {dup_start+1}-{dup_end}. New total: {len(lines)}")
    
    # STEP 2: Find insertion point for body structure
    insert_idx = None
    for i, line in enumerate(lines):
        if 'ta-animations-2026' in line:
            insert_idx = i + 1
            print(f"Found insertion point at line {i+1}")
            break
    
    if insert_idx is None:
        for i, line in enumerate(lines):
            if 'strict-origin-when-cross-origin' in line:
                insert_idx = i + 1
                print(f"Fallback insertion point at line {i+1}")
                break
    
    if insert_idx is None:
        print("ERROR: No insertion point found")
        return
    
    body_lines = [
        '',
        '</head>',
        '<body class="gradient">',
        '',
        '  <a class="skip-to-content-link button visually-hidden" href="#MainContent">',
        "    {{ 'accessibility.skip_to_text' | t }}",
        '  </a>',
        '',
        "  {% sections 'header-group' %}",
        '',
        '  <main id="MainContent" class="content-for-layout focus-none" role="main" tabindex="-1">',
        '    {{ content_for_layout }}',
        '  </main>',
        '',
        "  {% sections 'footer-group' %}",
        '',
    ]
    
    lines = lines[:insert_idx] + body_lines + lines[insert_idx:]
    print(f"Inserted body structure. New total: {len(lines)}")
    
    # STEP 3: Fix ending
    for i, line in enumerate(lines):
        if 'ta-sticky-atc' in line:
            lines[i] = '{% render "ta-a11y-seo" %}'
            print(f"Removed ta-sticky-atc at line {i+1}")
            break
    
    # STEP 4: Fix closing tags
    for i in range(len(lines) - 1, max(len(lines) - 10, 0), -1):
        stripped = lines[i].strip()
        if '</body>' in stripped:
            lines[i] = '</body>'
            if '</html>' in stripped:
                lines.insert(i + 1, '</html>')
            print(f"Fixed closing tags at line {i+1}")
            break
    
    # Write
    result = '\n'.join(lines)
    with open(THEME_FILE, 'w', encoding='utf-8') as f:
        f.write(result)
    
    print(f"\nDONE: theme.liquid repaired ({len(lines)} lines)")

if __name__ == '__main__':
    main()
