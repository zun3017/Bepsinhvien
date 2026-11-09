"""Loopback server for demo identities and allowlisted frontend files.

Uses only Python's standard library; not a production deployment server.
The larger FastAPI application in plan/ is a separate implementation milestone.
"""
import argparse
import json
import mimetypes
import os
from http.cookies import SimpleCookie, CookieError
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

from backend.demo_accounts import DemoAccounts, SESSION_SECONDS

ROOT = Path(__file__).resolve().parent
COOKIE = 'bep_demo_session'
PAGES = {'index.html', 'login.html', 'dashboard.html'}
ASSETS = {'css', 'js', 'assets'}


def create_server(port=8000, database_path=None):
    # Dedicated database, never the future real-user/application database.
    path = Path(database_path or os.environ.get('DEMO_ACCOUNTS_DB', 'var/demo-accounts.sqlite3'))
    if not path.is_absolute():
        path = ROOT / path
    path = path.resolve()
    if path == ROOT or any(path.is_relative_to(ROOT / folder) for folder in ASSETS):
        raise ValueError('Database phải nằm ngoài thư mục public css/js/assets.')
    store = DemoAccounts(path)

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass  # Do not log cookies or profile data.

        def send(self, status, body, content_type='application/json; charset=utf-8', cookie=None):
            self.send_response(status)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Referrer-Policy', 'same-origin')
            if cookie:
                self.send_header('Set-Cookie', cookie)
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)

        def json(self, status, data, cookie=None):
            self.send(status, json.dumps(data, ensure_ascii=False).encode(), cookie=cookie)

        def token(self):
            try:
                cookies = SimpleCookie(self.headers.get('Cookie', ''))
                return cookies[COOKIE].value if COOKIE in cookies else ''
            except CookieError:
                return ''

        def api(self):
            if urlsplit(self.path).path != '/api/demo/account':
                return self.json(404, {'error': 'Không tìm thấy API.'})
            if self.command != 'GET':
                origin = 'http://127.0.0.1:' + str(self.server.server_port)
                if self.headers.get('Origin') != origin or self.headers.get('X-Bep-Request') != '1':
                    return self.json(403, {'error': 'Yêu cầu không hợp lệ.'})
            token = self.token()
            if self.command == 'POST':
                account, new_token = store.start(token)
                cookie = (f'{COOKIE}={new_token}; Path=/; HttpOnly; SameSite=Strict; '
                          f'Max-Age={SESSION_SECONDS}') if new_token else None
                return self.json(200, {'account': account}, cookie)
            if self.command == 'DELETE':
                store.logout(token)
                return self.json(200, {'ok': True},
                                 f'{COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
            account = store.get(token)
            if not account:
                return self.json(401, {'error': 'Chưa có phiên. Hãy vào bằng tài khoản demo.'})
            if self.command == 'PATCH':
                try:
                    length = int(self.headers.get('Content-Length', '0'))
                    if not 0 < length <= 2048:
                        raise ValueError('Yêu cầu quá lớn hoặc trống.')
                    data = json.loads(self.rfile.read(length))
                    if not isinstance(data, dict):
                        raise ValueError('Yêu cầu không hợp lệ.')
                    account = store.rename(token, data.get('display_name'))
                except (ValueError, UnicodeError) as exc:
                    return self.json(400, {'error': str(exc)})
            elif self.command != 'GET':
                return self.json(405, {'error': 'Phương thức không được hỗ trợ.'})
            self.json(200, {'account': account})

        def dispatch(self):
            # Prevent DNS rebinding. Open the exact loopback URL printed at startup.
            expected = '127.0.0.1:' + str(self.server.server_port)
            if self.headers.get('Host') != expected:
                return self.json(403, {'error': 'Chỉ chấp nhận địa chỉ loopback của ứng dụng.'})
            if urlsplit(self.path).path.startswith('/api/'):
                try:
                    return self.api()
                except Exception:
                    return self.json(500, {'error': 'Không truy cập được database tài khoản.'})
            if self.command not in ('GET', 'HEAD'):
                return self.json(405, {'error': 'Phương thức không được hỗ trợ.'})
            relative = unquote(urlsplit(self.path).path).lstrip('/') or 'index.html'
            target = (ROOT / relative).resolve()
            public = (relative in PAGES or (target != ROOT and target.is_relative_to(ROOT) and
                      target.relative_to(ROOT).parts[0] in ASSETS))
            if not public or not target.is_file() or target == path:
                return self.json(404, {'error': 'Không tìm thấy tài nguyên.'})
            self.send(200, target.read_bytes(), mimetypes.guess_type(str(target))[0] or
                      'application/octet-stream')

        do_GET = dispatch
        do_HEAD = dispatch
        do_POST = dispatch
        do_PATCH = dispatch
        do_DELETE = dispatch

    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    server.daemon_threads = True
    return server


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    server = create_server(args.port)
    print(f'Bep Sinh Vien: http://127.0.0.1:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
