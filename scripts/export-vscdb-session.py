import sqlite3
import os
import json
import sys

def export_vscdb_session():
    appdata = os.environ.get('APPDATA', '')
    db_path = os.path.join(appdata, 'Antigravity IDE', 'User', 'globalStorage', 'state.vscdb')
    if not os.path.exists(db_path):
        db_path = os.path.join(appdata, 'Antigravity', 'User', 'globalStorage', 'state.vscdb')
        
    if not os.path.exists(db_path):
        return None
        
    try:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        keys = [
            'antigravityUnifiedStateSync.oauthToken',
            'antigravityUnifiedStateSync.userStatus',
            'antigravity.profileUrl'
        ]
        session_data = {}
        for k in keys:
            c.execute("SELECT value FROM ItemTable WHERE key = ?", (k,))
            row = c.fetchone()
            if row and row[0]:
                session_data[k] = row[0]
        conn.close()
        return session_data
    except Exception as e:
        print("Export error:", e, file=sys.stderr)
        return None

if __name__ == '__main__':
    data = export_vscdb_session()
    print("Found keys:", list(data.keys()) if data else "None")

