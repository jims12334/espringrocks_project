import os
import glob
import re

directory = r'c:\Users\User\Downloads\espringrocks_project\frontend\src'
target_string = 'http://127.0.0.1:8000/api'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if target_string in content:
                print(f'Replacing in {filepath}')
                
                # Check if we need to add the import API_BASE
                needs_import = False
                if 'API_BASE' not in content:
                    needs_import = True
                
                # replace literal URLs
                new_content = re.sub(r'[\'\"]http://127\.0\.0\.1:8000/api/?(.*?)[\'\"]', r'`${API_BASE}/\1`', content)
                
                # For already templated strings: `http://127.0.0.1:8000/api/${id}`
                new_content = re.sub(r'`http://127\.0\.0\.1:8000/api/?(.*?)`', r'`${API_BASE}/\1`', new_content)
                
                if new_content != content:
                    if needs_import:
                        # find depth to root
                        rel_path = os.path.relpath(directory, root)
                        if rel_path == '.':
                            import_path = './utils/api'
                        else:
                            # calculate ../ for each dir
                            depth = len(os.path.relpath(root, directory).split(os.sep))
                            prefix = '../' * depth
                            import_path = f'{prefix}utils/api'
                        
                        import_stmt = f'import {{ API_BASE }} from \'{import_path}\';\n'
                        # add after last import
                        lines = new_content.split('\n')
                        last_import = 0
                        for i, line in enumerate(lines):
                            if line.startswith('import '):
                                last_import = i
                        lines.insert(last_import + 1, import_stmt)
                        new_content = '\n'.join(lines)

                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
