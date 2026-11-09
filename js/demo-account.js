'use strict';
// Identity is loaded from the server. No embedded account or browser credential storage.
window.DemoAccount = {
  async request(method = 'GET', body) {
    if (location.protocol === 'file:') throw new Error('Hãy chạy python run_local.py và mở http://127.0.0.1:8000 để dùng tài khoản.');
    const response = await fetch('/api/demo/account', {
      method, credentials: 'same-origin',
      headers: {'Content-Type': 'application/json', 'X-Bep-Request': '1'},
      ...(body ? {body: JSON.stringify(body)} : {})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Không tải được tài khoản.');
    return data.account;
  }
};
