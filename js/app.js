(function(){
  'use strict';
  const paths={
    bowl:'M3 11h18c-1 6-4 9-9 9s-8-3-9-9ZM6 7h12M9 3v2m6-2v2',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    plan:'M8 4H5v17h14V4h-3M8 2h8v5H8zM8 12h8m-8 4h5',
    utensils:'M4 3v6c0 2 4 2 4 0V3M6 3v18m12-18c-5 5-5 10 0 10V3Zm0 10v8',
    cart:'M2 3h3l3 12h11l3-9H6M9 20h.01M18 20h.01',
    fridge:'M5 2h14v20H5zM5 10h14M8 5v2m0 6v4',
    chart:'M4 3v18h17M9 17v-5m5 5V8m5 9V4',
    leaf:'M20 3c-9-2-16 1-16 8 0 5 5 8 9 5 4-2 6-6 7-13ZM4 21l11-12',
    arrow:'M4 12h16m-6-6 6 6-6 6',
    external:'M14 3h7v7M10 14 21 3M10 3H3v18h18v-7',
    menu:'M4 6h16M4 12h16M4 18h16',
    bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    settings:'m10 2-.7 3-2 .9-2.8-.9-2 3.5 2.2 2.1v2.8L2.5 16l2 3.5 2.8-.9 2 .9.7 3h4l.7-3 2-.9 2.8.9 2-3.5-2.2-2.1v-2.8L21.5 8l-2-3.5-2.8.9-2-.9L14 2Zm2 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6',
    chevron:'m7 10 5 5 5-5',
    calendar:'M4 5h16v16H4zM8 2v6m8-6v6M4 11h16m-11 4h.01m4 0h.01m-4 3h.01',
    wallet:'M20 7H4V4h15v3M4 7v14h17V7Zm12 5h5v5h-5z',
    clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-15v5l3 2',
    help:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 8c0-4 7-3 6 1-.3 2-3 2-3 5m0 3h.01',
    chat:'M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0ZM7 11h.01m5 0h.01m5 0h.01',
    chef:'M7 15a5 5 0 1 1 1-9 5 5 0 0 1 8 0 5 5 0 1 1 1 9v6H7Zm0 2h10',
    close:'m6 6 12 12M6 18 18 6',
    send:'m22 2-7 20-4-9L2 9l20-7ZM11 13l6-6',
    plus:'M12 4v16M4 12h16',
    check:'m5 12 4 4L19 6',
    heart:'M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 1 9 8 15 7-6 12-11 8-15Z',
    swap:'M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4',
    copy:'M8 8h13v13H8zM16 8V3H3v13h5',
    pin:'M19 9c0 6-7 13-7 13S5 15 5 9a7 7 0 0 1 14 0Zm-7-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    info:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-11v6m0-10h.01',
    trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
    download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    user:'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM3 22v-3c0-7 18-7 18 0v3',
    logout:'M9 3H3v18h6m5-14 5 5-5 5M8 12h13',
    sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-6v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1',
    box:'m3 6 9-4 9 4v13l-9 3-9-3V6Zm0 0 9 4 9-4M12 10v12'
  };
  const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.bowl}"/></svg>`;
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>new Intl.NumberFormat('vi-VN').format(n)+'đ';
  const qty=(n,unit)=>unit==='g'&&window.UI?.state.unit==='kg'?(Number((n/1000).toFixed(3)).toLocaleString('vi-VN')+' kg'):(Number(n).toLocaleString('vi-VN')+' '+unit);
  const key='bep-sinh-vien-demo-v1';let state=Demo.seed(),storage=true,storageReset=false;
  try{
    const raw=localStorage.getItem(key);if(raw){const s=JSON.parse(raw);if(!valid(s)) throw Error('invalid');state=s;}
    localStorage.setItem(key,JSON.stringify(state));
  }catch(e){if(e.message==='invalid'||e instanceof SyntaxError){storageReset=true;try{localStorage.removeItem(key);}catch{storage=false;}}else storage=false;}
  function valid(s){return s&&s.version===1&&validMenuOptions(s)&&Number.isSafeInteger(s.budget)&&s.budget>0&&s.budget<=100000000&&Number.isInteger(s.days)&&s.days>=1&&s.days<=365&&Number.isInteger(s.day)&&s.day>=1&&s.day<=s.days&&[1,2,3,4].includes(s.meals)&&typeof s.name==='string'&&s.name.length<=60&&typeof s.area==='string'&&s.area.length<=100&&['light','dark'].includes(s.theme)&&Array.isArray(s.preferences)&&s.preferences.every(v=>typeof v==='string')&&Array.isArray(s.selected)&&s.selected.every(id=>Demo.dish(id))&&Array.isArray(s.favorites)&&s.favorites.every(id=>Demo.dish(id))&&Array.isArray(s.logs)&&s.logs.every(l=>Number.isInteger(l.day)&&l.day>=1&&l.day<=s.day&&Number.isSafeInteger(l.actual)&&l.actual>=0&&Number.isSafeInteger(l.planned)&&l.planned>=0&&Array.isArray(l.names)&&l.names.every(n=>typeof n==='string'))&&s.logs.reduce((n,l)=>n+l.actual,0)<=s.budget&&Array.isArray(s.fridge)&&s.fridge.every(i=>Demo.ingredients[i.key]&&typeof i.id==='string'&&Number.isFinite(i.qty)&&i.qty>0&&Number.isInteger(i.expiry));}
  function validMenuOptions(s){return (s.mealSlots===undefined||(Array.isArray(s.mealSlots)&&s.mealSlots.length===s.meals&&new Set(s.mealSlots).size===s.meals&&s.mealSlots.every(i=>[0,1,2,3].includes(i))))&&(s.excluded===undefined||(Array.isArray(s.excluded)&&s.excluded.every(k=>Object.hasOwn(Demo.ingredients,k))))&&(s.unfilled===undefined||(Array.isArray(s.unfilled)&&s.unfilled.every(i=>[0,1,2,3].includes(i))));}
  const tabs=[['overview','grid','Tổng quan'],['setup','plan','Thiết lập kế hoạch'],['menu','utensils','Thực đơn hôm nay'],['shopping','cart','Đi chợ & Cửa hàng'],['fridge','fridge','Tủ lạnh tồn kho'],['history','chart','Lịch sử & Thống kê']];
  const UI=window.UI={state,tab:'overview',tabs,icon,esc,money,qty,storage,filter:'all'};
  UI.icons=(root=document)=>root.querySelectorAll('[data-icon]').forEach(el=>{el.outerHTML=icon(el.dataset.icon);});
  UI.save=()=>{document.documentElement.dataset.theme=UI.state.theme;try{localStorage.setItem(key,JSON.stringify(UI.state));}catch{UI.storage=false;}UI.header();};
  let toastTimer;UI.toast=message=>{const el=document.querySelector('#toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,5000);};
  UI.header=()=>{const s=UI.state;document.querySelector('#header-name').textContent=s.name;document.querySelector('#header-avatar').textContent=s.name.trim().split(/\s+/).slice(-2).map(n=>n[0]).join('').toUpperCase()||'SV';document.querySelector('#notification-dot').hidden=!!s.readNotifications||!s.reminders;};
  UI.closeMenu=()=>{document.querySelector('#sidebar').classList.remove('open');document.querySelector('#sidebar-overlay').hidden=true;document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');};
  UI.go=(tab,focus=false)=>{if(!tabs.some(t=>t[0]===tab))tab='overview';const changed=UI.tab!==tab;UI.tab=tab;try{history.replaceState(null,'','#'+tab);}catch{}document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===tab);if(b.dataset.tab===tab)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});const label=tabs.find(t=>t[0]===tab)[2];document.querySelector('#breadcrumb-current').textContent=label;document.title=label+' · Bếp Sinh Viên';UI.closeMenu();UI.render();if(changed)window.scrollTo(0,0);if(focus)document.querySelector('#main').focus({preventScroll:true});};
  UI.confirm=(title,message)=>new Promise(resolve=>{const d=document.querySelector('#confirm-dialog');document.querySelector('#confirm-title').textContent=title;document.querySelector('#confirm-message').textContent=message;document.querySelector('#confirm-ok').onclick=()=>d.close('yes');document.querySelector('#confirm-cancel').onclick=()=>d.close('no');d.onclose=()=>resolve(d.returnValue==='yes');d.returnValue='';d.showModal();});
  UI.openDrawer=(title,html)=>{document.querySelector('#drawer-title').textContent=title;document.querySelector('#drawer-content').innerHTML=html;const d=document.querySelector('#drawer');if(!d.open)d.showModal();};
  UI.closeDrawer=()=>document.querySelector('#drawer').close();
  UI.download=(filename,text)=>{const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  UI.guide=()=>UI.openDrawer('Từ ngân sách đến bữa ăn',`<p>Quy trình 8 bước của dự án. Trong bản demo, các bước sử dụng dữ liệu và phép tính mẫu trên trình duyệt.</p>${[
    ['Nhập kế hoạch','Đặt tổng ngân sách N, số ngày X, số bữa và sở thích.'],['Tính định mức','Chia số tiền còn lại cho số ngày còn lại.'],['Xem gợi ý món ăn','Tham khảo các món và nguyên liệu trong kịch bản mẫu.'],['Chốt thực đơn','Đổi món nếu muốn, sau đó xác nhận lựa chọn.'],['Tính nguyên liệu cần mua','Trừ nguyên liệu còn dùng được trong tủ lạnh, bỏ qua đồ hết hạn.'],['Chọn nơi mua','So sánh các cửa hàng với giá minh họa.'],['Cập nhật sau mua sắm','Nhập số tiền và lượng mua thực tế. Demo trừ nguyên liệu nấu ăn và giữ phần dư.'],['Kết thúc ngày','Chuyển ngày để cập nhật hạn dùng và định mức mới.']
  ].map(([t,p],i)=>`<div class="guide-step"><span>${i+1}</span><div><strong>${t}</strong><p>${p}</p></div></div>`).join('')}<div class="hint">Thông tin nhóm 7 thành viên và liên hệ sẽ được bổ sung khi có dữ liệu chính thức.</div>`);
  UI.settings=()=>{const s=UI.state;UI.openDrawer('Cài đặt của bạn',`<form id="settings-form"><label class="field">Giao diện<select name="theme"><option value="light" ${s.theme==='light'?'selected':''}>Sáng</option><option value="dark" ${s.theme==='dark'?'selected':''}>Tối</option></select></label><label class="field">Khu vực sinh sống<select name="area"><option ${s.area.includes('Nguyễn')?'selected':''}>Quanh HCMUS — Nguyễn Văn Cừ</option><option ${s.area.includes('Thủ')?'selected':''}>Quanh HCMUS — Thủ Đức</option></select></label><label class="field">Chế độ ăn mặc định<select name="diet"><option value="normal" ${!s.preferences.includes('Ăn chay')?'selected':''}>Ăn thông thường</option><option value="veggie" ${s.preferences.includes('Ăn chay')?'selected':''}>Ăn chay (lựa chọn mẫu không thịt)</option></select><small>Khẩu vị và dị ứng chi tiết ở mục Thiết lập kế hoạch.</small></label><label class="field">Hiển thị khối lượng<select name="unit"><option value="g" ${s.unit!=='kg'?'selected':''}>Gram (g)</option><option value="kg" ${s.unit==='kg'?'selected':''}>Kilogram (kg)</option></select></label><label class="toggle-row"><span>Nhắc nhở trong demo<small>Hiện thông báo nguyên liệu và thực chi trong ứng dụng.</small></span><input name="reminders" type="checkbox" ${s.reminders?'checked':''}></label><button class="btn primary">Lưu cài đặt</button></form><hr style="width:100%;border:0;border-top:1px solid var(--line)"><div><h3>Bắt đầu lại buổi demo</h3><p>Khôi phục kế hoạch, ngân sách và tủ lạnh mẫu ban đầu.</p><button class="btn danger mt" id="reset-demo">Khôi phục dữ liệu demo</button></div>`);document.querySelector('#settings-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);Object.assign(s,{theme:f.get('theme'),area:f.get('area'),unit:f.get('unit'),reminders:f.has('reminders')});s.preferences=s.preferences.filter(p=>p!=='Ăn chay');if(f.get('diet')==='veggie'){s.preferences.push('Ăn chay');if(!s.checkedOut){s.selected=['tofusandwich','tofurice','tofurice'];s.confirmed=false;}}UI.save();UI.closeDrawer();UI.render();UI.toast('Đã lưu cài đặt trên bản demo.');};document.querySelector('#reset-demo').onclick=async()=>{UI.closeDrawer();if(await UI.confirm('Khôi phục dữ liệu demo?','Thao tác này thay toàn bộ dữ liệu trên trình duyệt bằng kịch bản ban đầu.')){UI.state=Demo.seed();UI.filter='all';UI.save();UI.go('overview');UI.toast('Đã khôi phục kế hoạch mẫu.');}};};
  UI.profile=()=>{UI.openDrawer('Tài khoản cá nhân',`<div class="hint">Tài khoản minh họa. Chưa kết nối xác thực.</div><form id="profile-form"><label class="field">Tên hiển thị<input name="name" value="${esc(UI.state.name)}" required maxlength="60"></label><label class="field">Email minh họa<input value="sinhvien@example.com" readonly></label><label class="field">Số điện thoại<input placeholder="Chưa có thông tin" disabled><small>Sẽ bổ sung khi kết nối hồ sơ tài khoản.</small></label><button class="btn primary">Lưu tên hiển thị</button></form><button class="btn" disabled>Đổi mật khẩu · Chưa kết nối</button><a class="btn danger" href="login.html">${icon('logout')} Thoát bản demo</a><small>Thoát đưa về màn hình đăng nhập; dữ liệu demo vẫn được giữ trên trình duyệt.</small>`);document.querySelector('#profile-form').onsubmit=e=>{e.preventDefault();const name=new FormData(e.target).get('name').trim();if(!name){UI.toast('Hãy nhập tên hiển thị.');return;}UI.state.name=name;UI.save();UI.closeDrawer();UI.render();UI.toast('Đã lưu tên hiển thị.');};};
  UI.support=()=>UI.openDrawer('Hỗ trợ & phản hồi',`<div class="ingredient-symbol">${icon('chat')}</div><h3>Kênh Zalo đang chờ bổ sung</h3><p>Nhóm chưa cung cấp địa chỉ Zalo chính thức. Khi có liên hệ, nút này sẽ mở kênh hỗ trợ của nhóm.</p><label class="field">Phản hồi về cửa hàng hoặc giá<textarea id="support-note" maxlength="1000" placeholder="Ví dụ: giá rau tại cửa hàng đã thay đổi…"></textarea></label><button class="btn primary" id="support-download">${icon('download')} Tải phản hồi để gửi sau</button><small>Phản hồi chỉ được tải thành file, chưa gửi cho ai.</small>`);
  document.addEventListener('click',e=>{
    const go=e.target.closest('[data-go]');if(go)UI.go(go.dataset.go,true);
    const tab=e.target.closest('[data-tab]');if(tab)UI.go(tab.dataset.tab,true);
    const drawer=e.target.closest('[data-drawer]');if(drawer)({settings:UI.settings,profile:UI.profile,guide:UI.guide}[drawer.dataset.drawer])();
    if(e.target.closest('#support-download')){const text=document.querySelector('#support-note').value.trim();if(!text)return UI.toast('Hãy nhập nội dung phản hồi.');UI.download('phan-hoi-cua-hang.txt',text);UI.toast('Đã tạo file phản hồi, chưa gửi đi.');}
    if(!e.target.closest('#notifications')&&!e.target.closest('#notifications-btn')){document.querySelector('#notifications').hidden=true;document.querySelector('#notifications-btn').setAttribute('aria-expanded','false');}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){UI.closeMenu();document.querySelector('#notifications').hidden=true;document.querySelector('#notifications-btn').setAttribute('aria-expanded','false');}});
  document.addEventListener('DOMContentLoaded',()=>{
    document.documentElement.dataset.theme=state.theme;
    document.querySelector('#main-nav').innerHTML=tabs.map(([id,ic,label])=>`<button class="nav-item" data-tab="${id}">${icon(ic)}<span>${label}</span></button>`).join('');UI.icons();UI.header();
    const menuClose=document.createElement('button');menuClose.className='icon-btn sidebar-close';menuClose.setAttribute('aria-label','Đóng menu');menuClose.innerHTML=icon('close');menuClose.onclick=()=>{UI.closeMenu();document.querySelector('#menu-toggle').focus();};document.querySelector('#sidebar').prepend(menuClose);
    document.querySelector('#menu-toggle').onclick=()=>{const open=document.querySelector('#sidebar').classList.toggle('open');document.querySelector('#sidebar-overlay').hidden=!open;document.querySelector('#menu-toggle').setAttribute('aria-expanded',open);if(open)document.querySelector('.nav-item.active').focus();};
    document.querySelector('#sidebar-overlay').onclick=UI.closeMenu;
    document.querySelector('#drawer-close').onclick=UI.closeDrawer;
    for(const d of document.querySelectorAll('dialog'))d.addEventListener('click',e=>{if(e.target!==d)return;const b=d.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)d.close();});
    document.querySelector('#support-btn').onclick=UI.support;
    document.querySelector('#notifications-btn').onclick=()=>{const el=document.querySelector('#notifications');el.hidden=!el.hidden;document.querySelector('#notifications-btn').setAttribute('aria-expanded',!el.hidden);if(!el.hidden){UI.state.readNotifications=true;UI.save();el.innerHTML=`<h3>Thông báo của Bếp</h3>${!UI.state.reminders?'<p class="mt">Bạn đã tắt nhắc nhở. Bật lại trong Cài đặt.</p>':UI.state.fridge.filter(i=>i.expiry<=UI.state.day+1).map(i=>`<div class="notification-item"><strong>${esc(Demo.ingredients[i.key].name)} ${i.expiry<UI.state.day?'đã hết hạn':'nên dùng sớm'}</strong><p>${i.expiry<UI.state.day?'Loại khỏi nguyên liệu có thể dùng.':'Ưu tiên sử dụng trong thực đơn.'}</p></div>`).join('')+`<div class="notification-item"><strong>${UI.state.checkedOut?'Đã cập nhật chi tiêu':'Đừng quên cập nhật thực chi'}</strong><p>Ngày ${UI.state.day} của kế hoạch mẫu.</p></div>`}`;}};
    UI.go(location.hash.slice(1)||'overview');if(storageReset)UI.toast('Dữ liệu lưu cũ không hợp lệ, đã dùng lại dữ liệu mẫu.');
  });
  window.addEventListener('hashchange',()=>UI.go(location.hash.slice(1),true));
})();
