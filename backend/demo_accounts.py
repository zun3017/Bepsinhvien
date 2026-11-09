"""SQLite demo identities. No preset credentials or shared browser account."""
import hashlib
import secrets
import sqlite3
import time
import uuid
from contextlib import contextmanager
from pathlib import Path

SESSION_SECONDS = 7 * 24 * 60 * 60


class DemoAccounts:
    def __init__(self, path):
        self.path = Path(path).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.connect() as db:
            db.executescript('''
                CREATE TABLE IF NOT EXISTS demo_accounts (
                    id TEXT PRIMARY KEY,
                    display_name TEXT NOT NULL CHECK(length(display_name) BETWEEN 1 AND 60),
                    created_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS demo_sessions (
                    token_hash TEXT PRIMARY KEY,
                    account_id TEXT NOT NULL REFERENCES demo_accounts(id),
                    expires_at INTEGER NOT NULL
                );
            ''')

    @contextmanager
    def connect(self):
        db = sqlite3.connect(str(self.path), timeout=5)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys=ON')
        try:
            with db:
                yield db
        finally:
            db.close()

    @staticmethod
    def digest(token):
        return hashlib.sha256(token.encode()).hexdigest()

    def get(self, token):
        with self.connect() as db:
            row = db.execute('''SELECT a.id, a.display_name FROM demo_accounts a
                JOIN demo_sessions s ON s.account_id=a.id
                WHERE s.token_hash=? AND s.expires_at>?''',
                (self.digest(token), int(time.time()))).fetchone()
        return dict(row) if row else None

    def start(self, token=''):
        account = self.get(token) if token else None
        if account:
            return account, None
        account_id = uuid.uuid4().hex
        token = secrets.token_urlsafe(32)
        name = 'Bếp ' + account_id[:6].upper()
        now = int(time.time())
        with self.connect() as db:
            db.execute('DELETE FROM demo_sessions WHERE expires_at<=?', (now,))
            db.execute('INSERT INTO demo_accounts VALUES (?, ?, ?)', (account_id, name, now))
            db.execute('INSERT INTO demo_sessions VALUES (?, ?, ?)',
                       (self.digest(token), account_id, now + SESSION_SECONDS))
        return {'id': account_id, 'display_name': name}, token

    def rename(self, token, name):
        if not isinstance(name, str) or not 1 <= len(name.strip()) <= 60:
            raise ValueError('Tên phải có từ 1 đến 60 ký tự.')
        with self.connect() as db:
            result = db.execute('''UPDATE demo_accounts SET display_name=? WHERE id=(
                SELECT account_id FROM demo_sessions WHERE token_hash=? AND expires_at>?)''',
                (name.strip(), self.digest(token), int(time.time())))
            if not result.rowcount:
                return None
        return self.get(token)

    def logout(self, token):
        with self.connect() as db:
            db.execute('DELETE FROM demo_sessions WHERE token_hash=?', (self.digest(token),))
