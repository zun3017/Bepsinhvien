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
    tofu:{name:'Đậu hũ',unit:'miếng',pack:2,price:8000,life:2},
    pork:{name:'Thịt heo băm',unit:'g',pack:200,price:25000,life:2},
    beef:{name:'Thịt bò',unit:'g',pack:150,price:35000,life:2},
    shrimp:{name:'Tôm tươi',unit:'g',pack:150,price:30000,life:2}
  };
  const dishes = [
    {id:'bread',name:'Bánh mì trứng ốp la',meal:'Bữa sáng',category:'chính',mainIngredient:'egg',cost:10000,time:10,image:'breakfast.jpg',tag:'Dùng trứng có sẵn',needs:{bread:1,egg:1,cucumber:1},recipe:'Chiên trứng chín theo sở thích. Rửa dưa leo, cắt lát. Kẹp trứng và dưa leo vào bánh mì, dùng ngay.',desc:'Bữa sáng nhanh gọn từ bánh mì giòn kẹp trứng ốp la thơm béo và dưa leo thanh mát.'},
    {id:'chicken',name:'Cơm gà áp chảo & rau cải',meal:'Bữa trưa',category:'mặn',mainIngredient:'chicken',cost:23000,time:25,image:'lunch.jpg',tag:'Bữa chính đủ đầy',needs:{rice:100,chicken:150,greens:1},recipe:'Nấu cơm. Sơ chế gà riêng, ướp gia vị rồi áp chảo đến khi chín kỹ. Rửa rau và luộc chín. Dọn cùng cơm.',desc:'Bữa trưa đậm đà giàu đạm với ức gà áp chảo vàng óng cùng rau cải ngọt lành.'},
    {id:'eggrice',name:'Cơm trứng sốt cà chua',meal:'Bữa tối',category:'mặn',mainIngredient:'egg',cost:15000,time:15,image:'dinner.jpg',tag:'Tận dụng cà chua',needs:{rice:100,egg:2,tomato:2},recipe:'Nấu cơm. Rửa và cắt cà chua, xào mềm thành sốt. Cho trứng vào đảo đến khi chín. Nêm vừa ăn và dùng với cơm.',desc:'Bữa tối kinh điển ấm bụng, vị chua ngọt thanh nhẹ từ cà chua tươi quyện trứng béo mềm, nấu 15 phút.'},
    {id:'tofurice',name:'Cơm đậu hũ sốt cà chua',meal:'Bữa chính',category:'mặn',mainIngredient:'tofu',cost:14000,time:20,image:'dinner.jpg',tag:'Lựa chọn không thịt',needs:{rice:100,tofu:2,tomato:2},recipe:'Nấu cơm. Áp chảo đậu hũ, nấu cà chua thành sốt rồi cho đậu vào đun chín, nêm vừa ăn.',desc:'Đậu hũ áp chảo vàng giòn kết hợp sốt cà chua tươi đậm đà, thuần chay thanh đạm và giàu đạm thực vật.'},
    {id:'friedrice',name:'Cơm chiên trứng rau củ',meal:'Bữa chính',category:'chính',mainIngredient:'egg',cost:12000,time:15,image:'lunch.jpg',tag:'Dùng nguyên liệu có sẵn',needs:{rice:100,egg:1,greens:1},recipe:'Nấu cơm. Rửa, cắt nhỏ rau và làm chín. Đảo trứng chín rồi thêm cơm và rau, chiên nóng đều.',desc:'Cơm chiên hạt tơi vàng rụm kết hợp trứng béo và rau xanh giòn ngọt, vừa ngon vừa tiết kiệm.'},
    {id:'tofusandwich',name:'Bánh mì đậu hũ',meal:'Bữa sáng',category:'chính',mainIngredient:'tofu',cost:9000,time:10,image:'breakfast.jpg',tag:'Lựa chọn không thịt',needs:{bread:1,tofu:1,cucumber:1},recipe:'Áp chảo đậu hũ. Rửa và cắt dưa leo. Kẹp vào bánh mì, thêm gia vị vừa ăn.',desc:'Bánh mì giòn rụm kẹp đậu hũ rán thơm bùi và dưa leo thanh mát, lựa chọn ăn chay tiện lợi.'},
    {id:'eggfriedtomato',name:'Trứng chiên cà chua',meal:'Bữa sáng',category:'mặn',mainIngredient:'egg',cost:22000,time:15,image:'breakfast.jpg',tag:'Nhiều đạm tiết kiệm',needs:{egg:4,tomato:2},recipe:'Đánh đều 4 quả trứng với chút gia vị. Cắt lát 2 quả cà chua rồi chiên vàng cùng trứng.',desc:'Trứng chiên vàng mềm cùng cà chua chín mọng, cung cấp đạm dồi dào và năng lượng tích cực cho ngày mới.'},
    {id:'tofurice2',name:'Cơm đậu hũ sốt cà chua',meal:'Bữa chính',category:'mặn',mainIngredient:'tofu',cost:22000,time:20,image:'dinner.jpg',tag:'Lựa chọn không thịt',needs:{rice:150,tofu:2,tomato:2},recipe:'Nấu cơm. Áp chảo đậu hũ vàng giòn, nấu cà chua thành sốt đậm đà rồi cho đậu vào đun ngấm gia vị.',desc:'Đậu hũ áp chảo vàng giòn kết hợp sốt cà chua tươi đậm đà, thuần chay thanh đạm và giàu đạm thực vật.'},
    {id:'tofusandwich2',name:'Bánh mì đậu hũ dưa leo',meal:'Bữa sáng',category:'chính',mainIngredient:'tofu',cost:20000,time:10,image:'breakfast.jpg',tag:'Lựa chọn không thịt',needs:{bread:1,tofu:2,cucumber:1},recipe:'Áp chảo đậu hũ vàng thơm. Rửa và cắt dưa leo. Kẹp đậu hũ và dưa leo vào bánh mì cùng sốt tương bùi béo.',desc:'Bánh mì giòn rụm kẹp đậu hũ rán đậm vị và dưa leo thanh mát, lựa chọn ăn xế tiện lợi giàu năng lượng.'},
    {id:'eggrice2',name:'Cơm trứng sốt cà chua',meal:'Bữa tối',category:'mặn',mainIngredient:'egg',cost:24000,time:15,image:'dinner.jpg',tag:'Nhiều đạm thanh đạm',needs:{rice:150,egg:2,tomato:2},recipe:'Nấu cơm. Rửa và cắt cà chua, xào mềm thành sốt sánh mịn. Cho trứng vào đảo đều đến khi chín béo ngậy.',desc:'Bữa tối kinh điển ấm bụng, vị chua ngọt thanh nhẹ từ cà chua tươi quyện trứng béo mềm, nấu 15 phút.'},
    {id:'beefveg',name:'Cơm thịt bò xào rau cải',meal:'Bữa chính',category:'mặn',mainIngredient:'beef',cost:35000,time:20,image:'lunch.jpg',tag:'Nhiều đạm',needs:{rice:100,beef:150,greens:1},recipe:'Nấu cơm. Ướp thịt bò với tỏi và tiêu, xào nhanh trên lửa lớn cùng rau cải xanh.',desc:'Thịt bò mềm đậm vị xào nhanh cùng rau cải ngọt giòn, bổ sung sắt và protein phong phú.'},
    {id:'porksoup',name:'Cơm canh cải thịt heo băm',meal:'Bữa chính',category:'mặn',mainIngredient:'pork',cost:25000,time:20,image:'dinner.jpg',tag:'Bữa chính đậm đà',needs:{rice:100,pork:150,greens:1},recipe:'Nấu cơm. Xào thơm thịt băm rồi cho nước sôi vào, thả rau cải cắt khúc nấu chín tới.',desc:'Bát canh cải nấu thịt băm thanh ngọt tự nhiên kèm cơm nóng, dễ ăn và nhẹ bụng cho bữa tối.'},
    {id:'shrimptomato',name:'Cơm tôm rim cà chua',meal:'Bữa chính',category:'mặn',mainIngredient:'shrimp',cost:32000,time:20,image:'lunch.jpg',tag:'Hải sản tươi ngon',needs:{rice:100,shrimp:150,tomato:2},recipe:'Nấu cơm. Tôm lột vỏ xào săn với tỏi và sốt cà chua sánh mịn.',desc:'Tôm tươi rim sốt cà chua đậm đà, màu đỏ cam bắt mắt và giàu canxi.'},
    {id:'greensoup',name:'Canh rau cải đậu hũ',meal:'Món phụ',category:'canh',mainIngredient:'greens',cost:9000,time:12,image:'dinner.jpg',tag:'Món canh thanh mát',needs:{greens:1,tofu:1},recipe:'Đun sôi nước, thả đậu hũ cắt miếng vuông và rau cải vào nấu chín mềm, nêm gia vị thanh đạm.',desc:'Canh rau cải đậu hũ thanh mát, vị ngọt tự nhiên, rất thích hợp đi kèm các món mặn.'},
    {id:'tomatosoup',name:'Canh cà chua trứng mây',meal:'Món phụ',category:'canh',mainIngredient:'egg',cost:9000,time:10,image:'dinner.jpg',tag:'Món canh truyền thống',needs:{tomato:1,egg:1},recipe:'Xào cà chua mềm tạo màu, thêm nước đun sôi rồi từ từ khuấy trứng tạo vân mây vàng đẹp mắt.',desc:'Canh cà chua trứng chua ngọt dịu mát, ấm cúng và bổ dưỡng.'},
    {id:'stirgreens',name:'Rau cải xào tỏi',meal:'Món phụ',category:'rau',mainIngredient:'greens',cost:8000,time:8,image:'lunch.jpg',tag:'Món rau giòn ngọt',needs:{greens:1},recipe:'Phi thơm tỏi đập dập, cho rau cải vào xào nhanh trên lửa lớn để giữ màu xanh giòn ngọt.',desc:'Đĩa rau cải xào tỏi xanh mướt, giòn thơm, bổ sung chất xơ cho bữa cơm.'},
    {id:'cucumbersalad',name:'Dưa leo trộn chua ngọt',meal:'Món phụ',category:'phụ',mainIngredient:'cucumber',cost:6000,time:5,image:'breakfast.jpg',tag:'Món phụ thanh mát',needs:{cucumber:1},recipe:'Dưa leo rửa sạch, thái lát mỏng, trộn cùng chút đường, giấm và muối cho ngấm giòn.',desc:'Món dưa leo trộn giòn rụm chua thanh chống ngấy cực tốt cho các món thịt rán.'}
  ];
  function seed() {
    return {version:1,budget:500000,days:10,day:3,meals:3,area:'Quanh HCMUS — Nguyễn Văn Cừ',preferences:['Nhiều rau','Ăn chay','Không thịt bò'],nutrition:'Tiết kiệm',theme:'light',reminders:true,unit:'g',selected:['bread','chicken','eggrice'],favorites:[],confirmed:false,checkedOut:false,readNotifications:false,
      fridge:[{id:'f1',key:'egg',qty:6,expiry:14},{id:'f2',key:'tomato',qty:2,expiry:3},{id:'f3',key:'rice',qty:500,expiry:30},{id:'f4',key:'greens',qty:1,expiry:2}],
      logs:[{day:1,planned:50000,actual:47000,names:['Bánh mì trứng','Cơm gà','Cơm đậu hũ']},{day:2,planned:50000,actual:43000,names:['Bánh mì đậu hũ','Cơm trứng','Cơm gà']}],
      dailyMenus:{}
    };
  }
  const dish = id => dishes.find(d => d.id===id);
  const menu = (s,dayNum) => {
    if (dayNum && s.dailyMenus && s.dailyMenus[dayNum]) {
      const ids = s.dailyMenus[dayNum].flat();
      return ids.map(id=>dish(id)).filter(Boolean);
    }
    return (s.mealSlots||Array.from({length:s.meals},(_,i)=>i)).filter(i=>!(s.unfilled||[]).includes(i)).map(i=>dish(s.selected[i]));
  };
  function getDayMealDishes(s, dayNum, slot) {
    const day = dayNum || s.day;
    if (s.dailyMenus && s.dailyMenus[day] && s.dailyMenus[day][slot]) {
      const val = s.dailyMenus[day][slot];
      const ids = Array.isArray(val) ? val : [val];
      return ids.map(id => dish(id)).filter(Boolean);
    }
    const selId = s.selected && s.selected[slot];
    return selId && dish(selId) ? [dish(selId)] : [];
  }
  function addDishToMeal(s, dayNum, slot, dishId) {
    if (!s.dailyMenus) s.dailyMenus = {};
    const curSlots = s.mealSlots || Array.from({length: s.meals}, (_, i) => i);
    if (!s.dailyMenus[dayNum]) {
      s.dailyMenus[dayNum] = curSlots.map(i => [s.selected[i] || 'bread']);
    }
    if (!Array.isArray(s.dailyMenus[dayNum][slot])) {
      s.dailyMenus[dayNum][slot] = s.dailyMenus[dayNum][slot] ? [s.dailyMenus[dayNum][slot]] : [];
    }
    if (!s.dailyMenus[dayNum][slot].includes(dishId)) {
      s.dailyMenus[dayNum][slot].push(dishId);
    }
    if (dayNum === s.day) {
      if (!s.selected[slot] || s.selected[slot] === '') {
        s.selected[slot] = dishId;
      }
      if (s.unfilled) {
        s.unfilled = s.unfilled.filter(i => i !== slot);
      }
      s.confirmed = false;
    }
  }
  function removeDishFromMeal(s, dayNum, slot, dishId) {
    if (!s.dailyMenus || !s.dailyMenus[dayNum] || !s.dailyMenus[dayNum][slot]) return;
    if (!Array.isArray(s.dailyMenus[dayNum][slot])) {
      s.dailyMenus[dayNum][slot] = [s.dailyMenus[dayNum][slot]];
    }
    s.dailyMenus[dayNum][slot] = s.dailyMenus[dayNum][slot].filter(id => id !== dishId);
    if (s.dailyMenus[dayNum][slot].length > 0) {
      if (dayNum === s.day) s.selected[slot] = s.dailyMenus[dayNum][slot][0];
    } else {
      if (dayNum === s.day) {
        s.selected[slot] = '';
        if (!s.unfilled) s.unfilled = [];
        if (!s.unfilled.includes(slot)) s.unfilled.push(slot);
      }
    }
    if (dayNum === s.day) s.confirmed = false;
  }
  function replaceDishInMeal(s, dayNum, slot, oldDishId, newDishId) {
    if (!s.dailyMenus) s.dailyMenus = {};
    const curSlots = s.mealSlots || Array.from({length: s.meals}, (_, i) => i);
    if (!s.dailyMenus[dayNum]) {
      s.dailyMenus[dayNum] = curSlots.map(i => [s.selected[i] || 'bread']);
    }
    if (!Array.isArray(s.dailyMenus[dayNum][slot])) {
      s.dailyMenus[dayNum][slot] = s.dailyMenus[dayNum][slot] ? [s.dailyMenus[dayNum][slot]] : [];
    }
    const idx = s.dailyMenus[dayNum][slot].indexOf(oldDishId);
    if (idx !== -1) {
      s.dailyMenus[dayNum][slot][idx] = newDishId;
    } else {
      s.dailyMenus[dayNum][slot].push(newDishId);
    }
    if (dayNum === s.day) {
      s.selected[slot] = s.dailyMenus[dayNum][slot][0];
      s.confirmed = false;
    }
  }
  function summary(s,dayNum) {
    const spent=s.logs.reduce((n,l)=>n+l.actual,0), remaining=s.budget-spent, daysLeft=s.days-s.day+(s.checkedOut?0:1);
    const dayAllowance = s.days ? Math.floor(s.budget / s.days) : 0;
    const currentMenu = menu(s,dayNum);
    return {spent,remaining,daysLeft,allowance:daysLeft?Math.floor(remaining/daysLeft):0,dayAllowance,estimated:currentMenu.reduce((n,d)=>n+(d?d.cost:0),0)};
  }
  function newPlan(budget,days,meals,nutrition,preferences) {
    if (!Number.isSafeInteger(budget)||!Number.isSafeInteger(days)||days<1||days>365||budget<1||budget>100000000||budget/days<40000||![1,2,3,4].includes(meals)) throw Error('Nhập số tiền nguyên hợp lệ và từ 1–365 ngày. Ngân sách cần đạt 40.000đ/ngày theo phạm vi dự án.');
    const s=seed();
    Object.assign(s,{
      budget,
      days,
      meals,
      nutrition:nutrition||'Tiết kiệm',
      preferences:preferences||['Nhiều rau','Ăn chay','Không thịt bò'],
      day:1,
      logs:[],
      fridge:[],
      confirmed:false,
      checkedOut:false,
      dailyMenus:{}
    });
    return s;
  }
  const usable=(s,key)=>s.fridge.filter(i=>i.key===key&&i.expiry>=s.day).reduce((n,i)=>n+i.qty,0);
  function shopping(s) {
    const needs={}; menu(s).forEach(d=>{if(d&&d.needs)Object.entries(d.needs).forEach(([k,q])=>needs[k]=(needs[k]||0)+q);});
    return Object.entries(needs).map(([key,need])=>{const have=usable(s,key),buy=Math.max(0,need-have),info=ingredients[key]||{name:key,unit:'g',pack:100,price:10000},packs=Math.ceil(buy/info.pack);return {key,need,have,buy,packs,bought:packs*info.pack,cost:packs*info.price,...info};});
  }
  function checkout(s,actual,quantities) {
    if(!s.confirmed) throw Error('Hãy xác nhận thực đơn trước khi cập nhật mua sắm.');
    if(s.checkedOut) throw Error('Ngày này đã cập nhật mua sắm. Hãy chuyển sang ngày tiếp theo.');
    if(!Number.isSafeInteger(actual)||actual<0||actual>summary(s).remaining) throw Error('Tiền thực chi phải là số nguyên từ 0 đến ngân sách còn lại.');
    const list=shopping(s);
    list.forEach(i=>{const q=quantities?.[i.key]??i.bought;if(!Number.isFinite(q)||q<0||q+i.have<i.need) throw Error('Lượng mua chưa đủ cho thực đơn: '+i.name+'.');});
    list.forEach(i=>{
      const q=quantities?.[i.key]??i.bought;
      if(q>0) s.fridge.push({id:'p'+s.day+i.key+Date.now(),key:i.key,qty:q,expiry:s.day+i.life-1});
      let needed=i.need;
      s.fridge.filter(f=>f.key===i.key&&f.expiry>=s.day).sort((a,b)=>a.expiry-b.expiry).forEach(f=>{const used=Math.min(f.qty,needed);f.qty-=used;needed-=used;});
    });
    s.fridge=s.fridge.filter(i=>i.qty>0);
    s.logs.push({day:s.day,planned:summary(s).estimated,actual,names:menu(s).map(d=>d?d.name:'Món mẫu'),dishIds:menu(s).map(d=>d?d.id:'bread'),mealSlots:(s.mealSlots||Array.from({length:s.meals},(_,i)=>i)).slice()});s.checkedOut=true;
  }
  function advance(s) {
    if(!s.checkedOut) throw Error('Hãy cập nhật mua sắm và thực chi trước khi kết thúc ngày.');
    if(s.day>=s.days) throw Error('Đã đến ngày cuối kế hoạch. Xem kết quả tại Lịch sử & Thống kê.');
    s.day++;s.confirmed=false;s.checkedOut=false;s.readNotifications=false;
  }
  window.Demo={ingredients,dishes,seed,dish,menu,summary,newPlan,usable,shopping,checkout,advance,getDayMealDishes,addDishToMeal,removeDishFromMeal,replaceDishInMeal};
})();
