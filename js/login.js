'use strict';
let registering=false;
function setAuthMode(value){
  registering=value;
  document.querySelector('#name-field').hidden=!value;
  document.querySelector('#auth-name').required=value;
  document.querySelector('#login-tab').classList.toggle('active',!value);
  document.querySelector('#register-tab').classList.toggle('active',value);
  document.querySelector('#login-tab').setAttribute('aria-pressed',!value);
  document.querySelector('#register-tab').setAttribute('aria-pressed',value);
  document.querySelector('#auth-title').textContent=value?'Bắt đầu căn bếp của bạn.':'Chào mừng về Bếp.';
  document.querySelector('#auth-submit').textContent=value?'Xem giao diện sau đăng ký':'Xem giao diện sau đăng nhập';
}
document.querySelector('#login-tab').onclick=()=>setAuthMode(false);
document.querySelector('#register-tab').onclick=()=>setAuthMode(true);
document.querySelector('#auth-form').onsubmit=e=>{
  e.preventDefault();
  document.querySelector('#auth-password').value='';
  document.querySelector('#auth-status').textContent='Đây là biểu mẫu minh họa. Chọn “Vào bằng tài khoản demo” bên dưới để tiếp tục.';
};

const params = new URLSearchParams(location.search);
if(params.get('tab')==='register' || params.get('source')==='propose' || params.get('action')==='propose'){
  setAuthMode(true);
  const descEl = document.querySelector('#auth-description');
  if(descEl) descEl.textContent='Đăng ký tài khoản để tự đề xuất ý tưởng món ăn và lưu trữ kế hoạch của bạn.';
}

document.querySelector('#demo-enter').onclick = async e => {
  const button = e.currentTarget;
  button.disabled = true;
  const status = document.querySelector('#auth-status');
  status.textContent = 'Đang mở căn bếp của bạn…';
  try {
    await DemoAccount.request('POST');
    location.href = 'dashboard.html';
  } catch (error) {
    status.textContent = error.message;
    button.disabled = false;
  }
};
