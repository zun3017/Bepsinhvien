/* Quy tắc chọn món dùng chung cho tìm kiếm, gợi ý và xác nhận. */
(function(){
  'use strict';
  const D=window.Demo;
  const more=[
    ['eggporridge','Cháo trứng','Bữa sáng',9000,20,{rice:60,egg:1},'Nấu gạo với nước đến mềm. Đánh trứng, khuấy vào cháo và đun đến chín kỹ.','Cháo hoa sánh mịn quyện trứng gà béo ngậy, món ăn sáng hoặc ăn nhẹ dễ tiêu hóa và ấm bụng.','egg','chính'],
    ['tofuporridge','Cháo đậu hũ rau cải','Bữa sáng',8000,20,{rice:60,tofu:1,greens:1},'Nấu gạo thành cháo. Thêm đậu hũ và rau đã sơ chế, đun chín rồi nêm vừa ăn.','Cháo thanh đạm thuần chay với đậu hũ bùi bùi và rau cải xanh ngọt mát, rất tốt cho hệ tiêu hóa.','tofu','chính'],
    ['chickenporridge','Cháo gà','Bữa sáng',14000,25,{rice:60,chicken:80},'Luộc gà chín kỹ rồi xé nhỏ. Nấu gạo thành cháo, thêm thịt gà và nêm vừa ăn.','Cháo ức gà bổ dưỡng thơm lừng, cung cấp đạm nạc dồi dào giúp hồi phục năng lượng nhanh chóng.','chicken','chính'],
    ['tomatobread','Bánh mì trứng cà chua','Bữa sáng',10000,12,{bread:1,egg:1,tomato:1},'Xào cà chua mềm, thêm trứng và đảo chín kỹ. Kẹp vào bánh mì.','Bánh mì giòn rụm kẹp trứng sốt cà chua chua ngọt sánh mịn, bữa sáng thơm ngon chỉ 10 phút.','egg','chính'],
    ['tofuveg','Cơm đậu hũ xào rau cải','Bữa chính',13000,20,{rice:100,tofu:2,greens:1},'Nấu cơm. Áp chảo đậu hũ, thêm rau cải đã rửa và xào chín.','Đậu hũ áp chảo vàng ươm xào nhanh cùng rau cải ngọt giòn, món chay thanh nhiệt nhiều chất xơ.','tofu','mặn'],
    ['chickentomato','Cơm gà sốt cà chua','Bữa chính',22000,25,{rice:100,chicken:150,tomato:2},'Nấu cơm. Làm chín kỹ gà, thêm cà chua và đun thành sốt.','Ức gà mềm ngọt ngập trong sốt cà chua đậm đà, cung cấp lượng đạm cao cho người vận động nhiều.','chicken','mặn'],
    ['eggtofu','Cơm đậu hũ hấp trứng','Bữa chính',15000,20,{rice:100,tofu:1,egg:1},'Nấu cơm. Đánh trứng với đậu hũ cắt nhỏ, hấp đến chín hoàn toàn.','Trứng hấp đậu hũ mềm mịn như lụa, vị thanh bùi tan ngay trong miệng, thích hợp cho bữa tối nhẹ nhàng.','tofu','mặn'],
    ['tomatorice','Cơm cà chua đậu hũ áp chảo','Bữa chính',12000,20,{rice:100,tomato:1,tofu:1},'Nấu cơm với cà chua đã sơ chế. Áp chảo đậu hũ và dùng cùng cơm.','Cơm nóng ăn kèm đậu hũ rán giòn và cà chua chín mọng, thanh đạm tiết kiệm mà vẫn tròn vị.','tofu','mặn'],
    ['cucumberrice','Cơm đậu hũ dưa leo','Bữa chính',12000,15,{rice:100,tofu:2,cucumber:1},'Nấu cơm, áp chảo đậu hũ. Rửa sạch và cắt dưa leo, dùng kèm.','Đậu hũ chiên vàng giòn rụm chấm nước tương ăn kèm dưa leo thanh mát giải ngấy hiệu quả.','tofu','mặn'],
    ['eggveg','Cơm trứng cuộn rau cải','Bữa chính',14000,20,{rice:100,egg:2,greens:1},'Nấu cơm. Làm chín rau, trộn với trứng rồi chiên cuộn đến chín kỹ.','Trứng cuộn rau cải xanh đẹp mắt, vị béo thơm của trứng hòa quyện vị ngọt tự nhiên của rau.','egg','mặn']
  ];
  more.forEach(([id,name,meal,cost,time,needs,recipe,desc,mainIng,cat])=>{
    if(!D.dish(id)){
      D.dishes.push({id,name,meal,cost,time,needs,recipe,desc:desc||'Món ăn gia đình dễ nấu, nguyên liệu tươi ngon vừa túi tiền sinh viên.',mainIngredient:mainIng||'other',category:cat||'mặn',image:meal==='Bữa sáng'?'breakfast.jpg':'dinner.jpg',tag:'Món mẫu dễ nấu'});
    }
  });

  const normalize=text=>String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
  const slots=s=>s.mealSlots||Array.from({length:s.meals},(_,i)=>i);

  function getMainIngredient(d){
    if(d.mainIngredient) return d.mainIngredient;
    if(!d.needs) return 'other';
    if(d.needs.beef) return 'beef';
    if(d.needs.chicken) return 'chicken';
    if(d.needs.pork) return 'pork';
    if(d.needs.shrimp) return 'shrimp';
    if(d.needs.tofu) return 'tofu';
    if(d.needs.egg) return 'egg';
    if(d.needs.greens) return 'greens';
    return 'other';
  }

  function allowed(d,s){
    if(!d) return false;
    const excluded=s.excluded||[];
    if(Object.keys(d.needs).some(k=>excluded.includes(k))) return false;
    const prefs=s.preferences||[];
    if(prefs.includes('Ăn chay') && (d.needs.chicken || d.needs.pork || d.needs.beef || d.needs.shrimp)) return false;
    if(prefs.includes('Không trứng') && d.needs.egg) return false;
    if(prefs.includes('Không hải sản') && d.needs.shrimp) return false;
    if(prefs.includes('Không thịt bò') && d.needs.beef) return false;
    if(prefs.includes('Không thịt heo') && d.needs.pork) return false;
    if(prefs.includes('Không thịt gà') && d.needs.chicken) return false;
    return true;
  }

  function yesterday(d,s,dayOffset){
    const aliases={bread:'Bánh mì trứng',chicken:'Cơm gà',eggrice:'Cơm trứng',tofurice:'Cơm đậu hũ'};
    const targetDay=(dayOffset!==undefined?dayOffset:s.day)-1;
    if(targetDay<1) return false;
    const foundLog=s.logs.filter(l=>l.day===targetDay).some(l=>(l.dishIds||[]).includes(d.id)||l.names.some(n=>normalize(n)===normalize(d.name)||n===aliases[d.id]));
    if(foundLog) return true;
    if(s.dailyMenus&&s.dailyMenus[targetDay]){
      const raw = s.dailyMenus[targetDay];
      const dayDishes = Array.isArray(raw) ? raw.flat() : Object.values(raw).flat();
      if(dayDishes.includes(d.id)) return true;
    }
    return false;
  }

  function getRecentMainIngredients(s, targetDay, lookback = 2){
    const recent = new Set();
    const curDay = targetDay !== undefined ? targetDay : s.day;
    const startDay = Math.max(1, curDay - lookback);
    for(let d = startDay; d < curDay; d++){
      if(s.dailyMenus && s.dailyMenus[d]){
        const raw = s.dailyMenus[d];
        const ids = Array.isArray(raw) ? raw.flat() : Object.values(raw).flat();
        const dayDishes = ids.map(id => D.dish(id)).filter(Boolean);
        dayDishes.forEach(dish => {
          const main = getMainIngredient(dish);
          if(main !== 'other' && main !== 'greens') recent.add(main);
        });
      } else {
        const log = s.logs.find(l => l.day === d);
        if(log && log.dishIds){
          log.dishIds.map(id => D.dish(id)).filter(Boolean).forEach(dish => {
            const main = getMainIngredient(dish);
            if(main !== 'other' && main !== 'greens') recent.add(main);
          });
        }
      }
    }
    return recent;
  }

  function stockMatch(s,d){
    if(!d || !d.needs) return {have:[],missing:[],score:0};
    const have=[],missing=[];let matchScore=0;let expiringBoost=0;
    const keys=Object.keys(d.needs);
    keys.forEach(k=>{
      const available=D.usable(s,k);
      const need=d.needs[k];
      if(available>0){
        const usedQty=Math.min(available,need);
        have.push({key:k,qty:usedQty});
        matchScore+=usedQty/need;
        const isExpiring=s.fridge.some(i=>i.key===k&&i.expiry>=s.day&&i.expiry<=s.day+1);
        if(isExpiring) expiringBoost+=3.0; // Ưu tiên rất cao cho nguyên liệu sắp hết hạn trong tủ
        else expiringBoost+=0.8;
      }
      if(available<need){
        missing.push({key:k,qty:need-available});
      }
    });
    const score=(keys.length ? (matchScore/keys.length) : 0) + expiringBoost;
    return {have,missing,score};
  }

  function candidates(s,slot,query='',stockOnly=false,targetDay,allowSide=false){
    const terms=normalize(query).trim().split(/\s+/);
    const isBreakfast = slot === 0;
    const isSnack = s.meals === 4 && slot === 2;
    const recentMains = (targetDay && targetDay > 1) ? getRecentMainIngredients(s, targetDay, 2) : new Set();

    return D.dishes.filter(d=>{
      if(!allowed(d,s)) return false;
      if(yesterday(d,s,targetDay)) return false;
      if(isBreakfast && d.meal !== 'Bữa sáng') return false;
      if(!isBreakfast && !isSnack && d.meal === 'Bữa sáng') return false;
      if(!allowSide && d.meal === 'Món phụ') return false;
      if(stockOnly && stockMatch(s,d).have.length===0) return false;
      if(query && !terms.every(t=>normalize(d.name+' '+Object.keys(d.needs).map(k=>(D.ingredients[k]&&D.ingredients[k].name)||'').join(' ')).includes(t))) return false;
      return true;
    }).sort((a,b)=>{
      // Quy tắc 1: Không ăn cùng 1 nguyên liệu chính trong 2 - 3 ngày liên tiếp
      const aMainRecent = recentMains.has(getMainIngredient(a));
      const bMainRecent = recentMains.has(getMainIngredient(b));
      if(aMainRecent !== bMainRecent) return aMainRecent ? 1 : -1;

      // Quy tắc 2: Ưu tiên nguyên liệu có sẵn trong tủ lạnh (nhất là sắp hết hạn)
      const stockDiff = stockMatch(s,b).score - stockMatch(s,a).score;
      if(Math.abs(stockDiff) > 0.05) return stockDiff;

      // Quy tắc 3: Khẩu vị & Dinh dưỡng
      const prefs = s.preferences || [];
      if(prefs.includes('Nhiều rau')){
        const aVeg = !!(a.needs.greens||a.needs.cucumber||a.needs.tomato);
        const bVeg = !!(b.needs.greens||b.needs.cucumber||b.needs.tomato);
        if(aVeg !== bVeg) return bVeg ? 1 : -1;
      }
      return a.cost - b.cost;
    });
  }

  function chooseDish(s,slot,id){
    if(s.checkedOut)throw Error('Ngày này đã cập nhật. Hãy chuyển sang ngày tiếp theo.');
    if(!slots(s).includes(slot)||!candidates(s,slot).some(d=>d.id===id))throw Error('Món không phù hợp buổi ăn, nguyên liệu kiêng hoặc đã ăn hôm trước.');
    if(slots(s).some(i=>i!==slot&&!(s.unfilled||[]).includes(i)&&s.selected[i]===id))throw Error('Món này đã có trong một bữa hôm nay. Hãy chọn món khác.');
    s.selected[slot]=id;s.unfilled=(s.unfilled||[]).filter(i=>i!==slot);s.confirmed=false;
    if(!s.dailyMenus) s.dailyMenus={};
    if(!s.dailyMenus[s.day]) s.dailyMenus[s.day] = [];
    s.dailyMenus[s.day][slot] = [id];
  }

  function suggestMenu(s,targetDay){
    if(s.checkedOut && targetDay===s.day) return;
    const used=new Set();
    const curSlots = slots(s);
    const dayNum = targetDay || s.day;
    const result = [];
    const dailyAllowance = s.days ? Math.floor(s.budget / s.days) : 0;
    const hasGenerousBudget = dailyAllowance >= 60000;

    curSlots.forEach(slot=>{
      const pool = candidates(s,slot,'',false,dayNum);
      const mainDish = pool.find(item=>!used.has(item.id));
      if(mainDish){
        used.add(mainDish.id);
        const mealDishes = [mainDish.id];

        // Nếu ngân sách dồi dào và là bữa chính (trưa hoặc tối): tự động gợi ý thêm 1 món canh hoặc món xào
        if(hasGenerousBudget && (slot === 1 || (s.meals === 4 ? slot === 3 : slot === 2))){
          const sidePool = D.dishes.filter(d => 
            (d.meal === 'Món phụ' || d.category === 'canh' || d.category === 'rau') &&
            allowed(d,s) && !used.has(d.id) &&
            getMainIngredient(d) !== getMainIngredient(mainDish)
          ).sort((a,b)=>stockMatch(s,b).score - stockMatch(s,a).score);

          if(sidePool.length > 0){
            mealDishes.push(sidePool[0].id);
            used.add(sidePool[0].id);
          }
        }
        result[slot] = mealDishes;
      }
    });

    if(!targetDay || targetDay === s.day){
      if(!Array.isArray(s.selected)) s.selected = [];
      curSlots.forEach(slot => {
        if(result[slot] && result[slot][0]){
          s.selected[slot] = result[slot][0];
        }
      });
      s.unfilled = curSlots.filter(slot => !result[slot]);
      s.confirmed = false;
    }
    if(!s.dailyMenus) s.dailyMenus={};
    s.dailyMenus[dayNum] = [...result];
    return result;
  }

  function generateMultiDayPlan(s){
    if(!s.dailyMenus) s.dailyMenus={};
    const dailyAllowance = s.days ? Math.floor(s.budget / s.days) : 0;

    for(let d=1; d<=s.days; d++){
      if(d === 1 && s.meals === 4 && s.preferences.includes('Nhiều rau') && s.preferences.includes('Ăn chay')){
        // Match template ngày 1 mẫu 88.000đ
        s.dailyMenus[1] = [['eggfriedtomato'], ['tofurice2'], ['tofusandwich2'], ['eggrice2']];
      } else {
        suggestMenu(s, d);
      }
    }
    if(s.dailyMenus[s.day]){
      s.selected = slots(s).map(i => {
        const val = s.dailyMenus[s.day][i];
        return Array.isArray(val) ? val[0] : val;
      });
    }
  }

  const menuReady=s=>slots(s).every(i=>!(s.unfilled||[]).includes(i)&&candidates(s,i).some(d=>d.id===s.selected[i]))&&new Set(D.menu(s).map(d=>d?d.id:'')).size===s.meals;

  function repairMenu(s){
    if(s.checkedOut)return false;
    const before=JSON.stringify([s.selected,s.unfilled||[]]),used=new Set(),unfilled=[];
    slots(s).forEach(slot=>{
      const pool=candidates(s,slot);
      const current=!(s.unfilled||[]).includes(slot)&&pool.find(d=>d.id===s.selected[slot]&&!used.has(d.id));
      const next=current||pool.find(d=>!used.has(d.id));
      if(next){s.selected[slot]=next.id;used.add(next.id);}else unfilled.push(slot);
    });
    s.unfilled=unfilled;
    const changed=before!==JSON.stringify([s.selected,s.unfilled]);
    if(changed)s.confirmed=false;
    return changed;
  }

  Object.assign(D,{slots,allowed,yesterday,stockMatch,candidates,chooseDish,suggestMenu,generateMultiDayPlan,menuReady,repairMenu,getMainIngredient,getRecentMainIngredients});
})();
