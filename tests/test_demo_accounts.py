"""Integration tests use isolated temporary SQLite files and real HTTP requests."""
import http.client
import json
import sqlite3
import tempfile
import threading
import unittest
from pathlib import Path

from backend.demo_accounts import DemoAccounts
from run_local import create_server


class DemoAccountTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / 'separate-demo.sqlite3'
        self.server = create_server(0, self.path)
        self.origin = f'http://127.0.0.1:{self.server.server_port}'
        self.worker = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.worker.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.worker.join()
        self.temp.cleanup()

    def request(self, method='GET', path='/api/demo/account', cookie='', body=None, origin=None):
        conn = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        headers = {'Cookie': cookie, 'Origin': origin or self.origin,
                   'X-Bep-Request': '1', 'Content-Type': 'application/json'}
        conn.request(method, path, json.dumps(body) if body is not None else None, headers)
        response = conn.getresponse()
        status, cookie = response.status, response.getheader('Set-Cookie')
        payload = response.read()
        conn.close()
        return status, cookie, payload

    def enter(self):
        status, cookie, body = self.request('POST')
        self.assertEqual(status, 200)
        self.assertIn('HttpOnly', cookie)
        self.assertIn('SameSite=Strict', cookie)
        return cookie.split(';')[0], json.loads(body)['account']

    def test_session_isolation_persistence_and_logout(self):
        cookie1, account1 = self.enter()
        cookie2, account2 = self.enter()
        self.assertNotEqual(account1['id'], account2['id'])
        status, _, _ = self.request('PATCH', cookie=cookie1, body={'display_name': 'Bếp của An'})
        self.assertEqual(status, 200)
        # A fresh repository instance reads persisted identity, not in-memory seed.
        self.assertEqual(DemoAccounts(self.path).get(cookie1.split('=')[1])['display_name'], 'Bếp của An')
        self.assertEqual(json.loads(self.request(cookie=cookie2)[2])['account'], account2)
        self.assertEqual(json.loads(self.request('POST', cookie=cookie1)[2])['account']['id'], account1['id'])
        self.assertEqual(self.request('DELETE', cookie=cookie1)[0], 200)
        self.assertEqual(self.request(cookie=cookie1)[0], 401)
        self.assertEqual(self.request(cookie=cookie2)[0], 200)
        with sqlite3.connect(self.path) as db:
            tokens = [row[0] for row in db.execute('SELECT token_hash FROM demo_sessions')]
        self.assertNotIn(cookie2.split('=')[1], tokens)

    def test_invalid_requests_and_expiry(self):
        self.assertEqual(self.request()[0], 401)
        self.assertEqual(self.request('POST', origin='https://other.example')[0], 403)
        cookie, _ = self.enter()
        for value in ['', ' ' * 3, 'x' * 61, None, 15]:
            self.assertEqual(self.request('PATCH', cookie=cookie, body={'display_name': value})[0], 400)
        self.assertEqual(self.request('PATCH', cookie=cookie, body=['wrong shape'])[0], 400)
        with sqlite3.connect(self.path) as db:
            db.execute('UPDATE demo_sessions SET expires_at=0')
        self.assertEqual(self.request(cookie=cookie)[0], 401)

    def test_private_files_are_not_served(self):
        for path in ['/var/demo-accounts.sqlite3', '/backend/demo_accounts.py', '/run_local.py',
                     '/.git/config', '/.env', '/plan/02-architecture-and-code.md',
                     '/css/../var/demo-accounts.sqlite3', '/assets/%2e%2e/run_local.py']:
            self.assertEqual(self.request(path=path)[0], 404, path)
        self.assertEqual(self.request(path='/login.html')[0], 200)
        self.assertEqual(self.request(path='/js/demo-account.js')[0], 200)


if __name__ == '__main__':
    unittest.main()
