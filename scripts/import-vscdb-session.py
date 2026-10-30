import sqlite3
import os
import json
import sys

def import_vscdb_session(json_path):
    if not os.path.exists(json_path):
        print(f"File not found: {json_path}", file=sys.stderr)
        return False
        
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    appdata = os.environ.get('APPDATA', '')
    targets = [
        os.path.join(appdata, 'Antigravity IDE', 'User', 'globalStorage', 'state.vscdb'),
        os.path.join(appdata, 'Antigravity', 'User', 'globalStorage', 'state.vscdb')
    ]
    
    success = False
    for db_path in targets:
        if os.path.exists(db_path):
            try:
                conn = sqlite3.connect(db_path)
                c = conn.cursor()
                for k, v in data.items():
                    c.execute("INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)", (k, v))
                conn.commit()
                conn.close()
                success = True
            except Exception as e:
                print(f"Error importing into {db_path}: {e}", file=sys.stderr)
                
    return success

if __name__ == '__main__':
    if len(sys.argv) > 1:
        res = import_vscdb_session(sys.argv[1])
        print("Import success:", res)
    else:
        print("Usage: import-vscdb-session.py <path_to_json>")

