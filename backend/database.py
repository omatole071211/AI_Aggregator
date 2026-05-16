import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.sqlite')
if os.environ.get('VERCEL'):
    DB_PATH = '/tmp/database.sqlite'

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt TEXT NOT NULL,
            summary TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            interaction_id INTEGER,
            model_name TEXT NOT NULL,
            response_text TEXT,
            word_count INTEGER,
            response_time REAL,
            FOREIGN KEY (interaction_id) REFERENCES interactions (id)
        )
    ''')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully.")
