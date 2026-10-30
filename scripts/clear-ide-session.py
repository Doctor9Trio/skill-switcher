import sqlite3
import os
import sys

def clear_ide_session():
    appdata = os.environ.get('APPDATA', '')
    targets = [
        os.path.join(appdata, 'Antigravity IDE', 'User', 'globalStorage', 'state.vscdb'),
        os.path.join(appdata, 'Antigravity', 'User', 'globalStorage', 'state.vscdb')
    ]
    
    cleared_count = 0
    for db_path in targets:
        if os.path.exists(db_path):
            try:
                conn = sqlite3.connect(db_path)
                cursor = conn.cursor()
                keys_to_clear = [
                    'antigravityUnifiedStateSync.oauthToken',
                    'antigravityUnifiedStateSync.userStatus',
                    'antigravity.profileUrl'
                ]
                for key in keys_to_clear:
                    cursor.execute("DELETE FROM ItemTable WHERE key = ?", (key,))
                conn.commit()
                conn.close()
                cleared_count += 1
            except Exception as e:
                print(f"Error clearing {db_path}: {e}", file=sys.stderr)
                
    return cleared_count

if __name__ == '__main__':
    count = clear_ide_session()
    print(f"Cleared session from {count} database(s)")

