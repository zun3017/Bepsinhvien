(function(){
  'use strict';
  const A=window.UI;
  const $=s=>document.querySelector(s);
  function setOpen(open){$('#chat-panel').hidden=!open;$('#chat-toggle').setAttribute('aria-expanded',open);if(open)$('#chat-input').focus();else $('#chat-toggle').focus();}
  function message(text,type){const el=document.createElement('div');el.className='message '+type;el.textContent=text;$('#chat-messages').append(el);$('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;}
  function respond(text){message(text,'user');const normalized=text.toLocaleLowerCase('vi-VN');
    if(/chi|mua|\d/.test(normalized)&&!/phút/.test(normalized)){
      const match=normalized.match(/(\d[\d.,\s]*)(k|nghìn|ngàn|đ|dong|đồng)?/);let amount=match?Number(match[1].replace(/\D/g,'')):0;if(match&&['k','nghìn','ngàn'].includes(match[2]))amount*=1000;
      if(amount>0&&Number.isSafeInteger(amount)){message('Kịch bản mẫu nhận diện số tiền '+A.money(amount)+'. Bạn có thể điền vào ô thực chi rồi kiểm tra trước khi lưu.','assistant');const button=document.createElement('button');button.className='chat-fill';button.textContent='Điền '+A.money(amount)+' vào thực chi';button.onclick=()=>{if(A.state.checkedOut)return A.toast('Ngày này đã cập nhật chi tiêu.');A.go('shopping');$('#actual-spent').value=amount;setOpen(false);$('#actual-spent').focus();A.toast('Đã điền số tiền mẫu. Chưa ghi nhận cho tới khi bạn bấm Cập nhật.');};$('#chat-messages').append(button);}
      else message('Bạn có thể thử: “Hôm nay tôi chi 48.000đ”. Trong bản demo, Bếp chỉ nhận diện số tiền theo mẫu, chưa dùng AI.','assistant');
    }else if(/thay|gà/.test(normalized)){message('Gợi ý mẫu: thử đậu hũ thay cho thịt gà. Mở Thực đơn hôm nay rồi chọn Đổi món khác để xem lựa chọn cơm đậu hũ. Giá và công thức vẫn là dữ liệu minh họa.','assistant');}
    else if(/tủ|trứng|nhanh|nấu|còn/.test(normalized)){const usable=A.state.fridge.filter(i=>i.expiry>=A.state.day);message(usable.length?'Trong tủ lạnh mẫu còn dùng được: '+usable.map(i=>Demo.ingredients[i.key].name+' '+A.qty(i.qty,Demo.ingredients[i.key].unit)).join(', ')+'.\nKịch bản gợi ý: nếu có trứng và cà chua, xem món cơm trứng sốt cà chua ở Thực đơn hôm nay. Đây là câu trả lời mẫu, chưa tính công thức theo kho thực tế.':'Tủ lạnh mẫu đang trống hoặc chỉ còn đồ hết hạn. Thêm nguyên liệu ở mục Tủ lạnh để xem trạng thái. Đây là phản hồi theo kịch bản, chưa có AI.','assistant');}
    else message('Bếp đang ở chế độ trình diễn. Bạn có thể thử các câu hỏi về nguyên liệu còn lại, thay thịt gà hoặc nhập “Hôm nay tôi chi 48.000đ”. AI thật sẽ được nối sau.','assistant');
    $('#chat-messages').scrollTop=$('#chat-messages').scrollHeight;
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#chat-toggle').onclick=()=>setOpen($('#chat-panel').hidden);$('#chat-close').onclick=()=>setOpen(false);
    $('#chat-form').onsubmit=e=>{e.preventDefault();const input=$('#chat-input'),text=input.value.trim();if(!text)return;respond(text);input.value='';input.focus();};
    document.querySelectorAll('[data-chat]').forEach(b=>b.onclick=()=>respond(b.dataset.chat));
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#chat-panel').hidden)setOpen(false);});
})();
