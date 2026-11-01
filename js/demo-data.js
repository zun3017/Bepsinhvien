/* Dữ liệu và quy tắc mô phỏng độc lập với giao diện. Thay bằng API khi có backend. */
(function () {
  'use strict';
  const ingredients = {
    rice:{name:'Gạo',unit:'g',pack:500,price:10000,life:30},
    egg:{name:'Trứng gà',unit:'quả',pack:6,price:18000,life:14},
    tomato:{name:'Cà chua',unit:'quả',pack:2,price:6000,life:4},
    greens:{name:'Rau cải',unit:'bó',pack:1,price:7000,life:2},
    chicken:{name:'Ức gà',unit:'g',pack:200,price:20000,life:2},
    bread:{name:'Bánh mì',unit:'ổ',pack:1,price:4000,life:1},
    cucumber:{name:'Dưa leo',unit:'quả',pack:2,price:6000,life:4},
    tofu:{name:'Đậu hũ',unit:'miếng',pack:2,price:8000,life:2}
  };
  const dishes = [
    {id:'bread',name:'Bánh mì trứng ốp la',meal:'Bữa sáng',cost:10000,time:10,image:'breakfast.jpg',tag:'Dùng trứng có sẵn',needs:{bread:1,egg:1,cucumber:1},recipe:'Chiên trứng chín theo sở thích. Rửa dưa leo, cắt lát. Kẹp trứng và dưa leo vào bánh mì, dùng ngay.'},
    {id:'chicken',name:'Cơm gà áp chảo & rau cải',meal:'Bữa trưa',cost:23000,time:25,image:'lunch.jpg',tag:'Bữa chính đủ đầy',needs:{rice:100,chicken:150,greens:1},recipe:'Nấu cơm. Sơ chế gà riêng, ướp gia vị rồi áp chảo đến khi chín kỹ. Rửa rau và luộc chín. Dọn cùng cơm.'},
    {id:'eggrice',name:'Cơm trứng sốt cà chua',meal:'Bữa tối',cost:15000,time:15,image:'dinner.jpg',tag:'Tận dụng cà chua',needs:{rice:100,egg:2,tomato:2},recipe:'Nấu cơm. Rửa và cắt cà chua, xào mềm thành sốt. Cho trứng vào đảo đến khi chín. Nêm vừa ăn và dùng với cơm.'},
    {id:'tofurice',name:'Cơm đậu hũ sốt cà chua',meal:'Bữa chính',cost:14000,time:20,image:'dinner.jpg',tag:'Lựa chọn không thịt',needs:{rice:100,tofu:2,tomato:2},recipe:'Nấu cơm. Áp chảo đậu hũ, nấu cà chua thành sốt rồi cho đậu vào đun chín, nêm vừa ăn.'},
    {id:'friedrice',name:'Cơm chiên trứng rau củ',meal:'Bữa chính',cost:12000,time:15,image:'lunch.jpg',tag:'Dùng nguyên liệu có sẵn',needs:{rice:100,egg:1,greens:1},recipe:'Nấu cơm. Rửa, cắt nhỏ rau và làm chín. Đảo trứng chín rồi thêm cơm và rau, chiên nóng đều.'},
    {id:'tofusandwich',name:'Bánh mì đậu hũ',meal:'Bữa sáng',cost:9000,time:10,image:'breakfast.jpg',tag:'Lựa chọn không thịt',needs:{bread:1,tofu:1,cucumber:1},recipe:'Áp chảo đậu hũ. Rửa và cắt dưa leo. Kẹp vào bánh mì, thêm gia vị vừa ăn.'}
  ];
  function seed() {
    return {version:1,budget:500000,days:10,day:3,meals:3,name:'Minh Anh',area:'Quanh HCMUS — Nguyễn Văn Cừ',preferences:[],theme:'light',reminders:true,unit:'g',selected:['bread','chicken','eggrice'],favorites:[],confirmed:false,checkedOut:false,readNotifications:false,
      fridge:[{id:'f1',key:'egg',qty:6,expiry:14},{id:'f2',key:'tomato',qty:2,expiry:3},{id:'f3',key:'rice',qty:500,expiry:30},{id:'f4',key:'greens',qty:1,expiry:2}],
      logs:[{day:1,planned:50000,actual:47000,names:['Bánh mì trứng','Cơm gà','Cơm đậu hũ']},{day:2,planned:50000,actual:43000,names:['Bánh mì đậu hũ','Cơm trứng','Cơm gà']}]
    };
  }
  const dish = id => dishes.find(d => d.id===id);
  const menu = s => s.selected.slice(0,s.meals).map(dish);
  function summary(s) {
    const spent=s.logs.reduce((n,l)=>n+l.actual,0), remaining=s.budget-spent, daysLeft=s.days-s.day+(s.checkedOut?0:1);
    return {spent,remaining,daysLeft,allowance:daysLeft?Math.floor(remaining/daysLeft):0,estimated:menu(s).reduce((n,d)=>n+d.cost,0)};
  }
  function newPlan(budget,days,meals) {
    if (!Number.isSafeInteger(budget)||!Number.isSafeInteger(days)||days<1||days>365||budget<1||budget>100000000||budget/days<40000||![1,2,3].includes(meals)) throw Error('Nhập số tiền nguyên hợp lệ và từ 1–365 ngày. Ngân sách cần đạt 40.000đ/ngày theo phạm vi dự án.');
    const s=seed(); Object.assign(s,{budget,days,meals,day:1,logs:[],fridge:[]});return s;
  }
  const usable=(s,key)=>s.fridge.filter(i=>i.key===key&&i.expiry>=s.day).reduce((n,i)=>n+i.qty,0);
  function shopping(s) {
    const needs={}; menu(s).forEach(d=>Object.entries(d.needs).forEach(([k,q])=>needs[k]=(needs[k]||0)+q));
    return Object.entries(needs).map(([key,need])=>{const have=usable(s,key),buy=Math.max(0,need-have),info=ingredients[key],packs=Math.ceil(buy/info.pack);return {key,need,have,buy,packs,bought:packs*info.pack,cost:packs*info.price,...info};});
  }
  function checkout(s,actual,quantities) {
    if(!s.confirmed) throw Error('Hãy xác nhận thực đơn trước khi cập nhật mua sắm.');
    if(s.checkedOut) throw Error('Ngày này đã cập nhật mua sắm. Hãy chuyển sang ngày tiếp theo.');
    if(!Number.isSafeInteger(actual)||actual<0||actual>summary(s).remaining) throw Error('Tiền thực chi phải là số nguyên từ 0 đến ngân sách còn lại.');
    const list=shopping(s);
    // Kiểm tra toàn bộ trước khi thay đổi dữ liệu.
    list.forEach(i=>{const q=quantities?.[i.key]??i.bought;if(!Number.isFinite(q)||q<0||q+i.have<i.need) throw Error('Lượng mua chưa đủ cho thực đơn: '+i.name+'.');});
    list.forEach(i=>{
      const q=quantities?.[i.key]??i.bought;
      if(q>0) s.fridge.push({id:'p'+s.day+i.key+Date.now(),key:i.key,qty:q,expiry:s.day+i.life-1});
      let needed=i.need;
      s.fridge.filter(f=>f.key===i.key&&f.expiry>=s.day).sort((a,b)=>a.expiry-b.expiry).forEach(f=>{const used=Math.min(f.qty,needed);f.qty-=used;needed-=used;});
    });
    s.fridge=s.fridge.filter(i=>i.qty>0);
    s.logs.push({day:s.day,planned:summary(s).estimated,actual,names:menu(s).map(d=>d.name)});s.checkedOut=true;
  }
  function advance(s) {
    if(!s.checkedOut) throw Error('Hãy cập nhật mua sắm và thực chi trước khi kết thúc ngày.');
    if(s.day>=s.days) throw Error('Đã đến ngày cuối kế hoạch. Xem kết quả tại Lịch sử & Thống kê.');
    s.day++;s.confirmed=false;s.checkedOut=false;s.readNotifications=false;
  }
  window.Demo={ingredients,dishes,seed,dish,menu,summary,newPlan,usable,shopping,checkout,advance};
})();
