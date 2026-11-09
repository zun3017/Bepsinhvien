const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/demo-data.js'),'utf8'),context);
const file=path.join(__dirname,'../js/menu-planner.js');
if(fs.existsSync(file))vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
const D=context.window.Demo;

test('đi chợ chỉ tổng hợp món đang chọn, gồm món phụ và bỏ qua danh sách cũ',()=>{
  const s=D.seed();
  s.dailyMenus[s.day]=[['tofusandwich'],['tofurice','greensoup'],['tomatorice']];
  D.repairMenu(s); // Rendering must not replace the user's chosen day.
  const rows=D.shopping(s);
  assert.ok(!rows.some(i=>i.key==='egg'||i.key==='chicken'));
  assert.equal(rows.find(i=>i.key==='tofu').need,5);
  assert.equal(rows.find(i=>i.key==='rice').need,200);
  assert.equal(rows.find(i=>i.key==='greens').need,1);
  s.confirmed=true;
  D.checkout(s,rows.reduce((n,i)=>n+i.cost,0));
  assert.equal(s.fridge.find(i=>i.key==='egg').qty,6);
  assert.ok(!s.logs.at(-1).dishIds.includes('bread'));
});

test('bỏ món cuối cùng không lấy lại món cũ; ngày trống có danh sách trống',()=>{
  const s=D.seed();
  s.dailyMenus[s.day]=[['bread'],['tofurice'],[]];
  D.removeDishFromMeal(s,s.day,0,'bread');
  D.repairMenu(s);
  assert.equal(D.getDayMealDishes(s,s.day,0).length,0);
  assert.ok(!D.shopping(s).some(i=>i.key==='egg'||i.key==='bread'));
  s.dailyMenus[s.day]=[];
  D.repairMenu(s);
  assert.equal(D.menu(s).length,0);
  assert.equal(D.shopping(s).length,0);
});

test('chỉ tính các bữa đang bật và giữ đúng chỉ số bữa khi đổi món',()=>{
  const s=D.newPlan(500000,10,2);
  s.mealSlots=[1,2];
  s.dailyMenus[s.day]=[['bread'],['tofurice'],['tomatorice']];
  assert.ok(!D.shopping(s).some(i=>i.key==='egg'||i.key==='bread'));
  const legacy=D.newPlan(500000,10,2);legacy.mealSlots=[1,2];
  D.replaceDishInMeal(legacy,legacy.day,2,'eggrice','tomatorice');
  assert.deepEqual(Array.from(D.menu(legacy),d=>d.id),['chicken','tomatorice']);
});
test('tìm món không dấu theo tên và nguyên liệu, đúng buổi ăn',()=>{
  assert.equal(typeof D.candidates,'function');
  const s=D.newPlan(500000,10,3);
  assert.ok(D.candidates(s,0,'banh mi').length>=2);
  assert.ok(D.candidates(s,1,'dau hu').every(d=>d.needs.tofu));
  assert.ok(D.candidates(s,0).every(d=>d.meal==='Bữa sáng'));
});
test('loại nguyên liệu kiêng và món ngày hôm trước, kể cả lịch sử tên cũ',()=>{
  const s=D.seed();s.excluded=['egg'];
  const pool=D.candidates(s,1);
  assert.ok(pool.length);
  assert.ok(pool.every(d=>!d.needs.egg&&d.id!=='chicken'));
  s.preferences=['Ăn chay'];
  assert.ok(D.candidates(s,1).every(d=>!d.needs.chicken));
});
test('xếp món tận dụng kho còn hạn trước, báo đủ và thiếu theo lượng',()=>{
  const s=D.newPlan(500000,10,3);
  s.fridge=[{id:'a',key:'rice',qty:200,expiry:1},{id:'b',key:'egg',qty:2,expiry:1},{id:'c',key:'tomato',qty:2,expiry:0}];
  const stock=D.stockMatch(s,D.dish('eggrice'));
  assert.equal(stock.have.length,2);
  assert.equal(stock.missing.length,1);
  assert.equal(stock.missing[0].key,'tomato');
  assert.ok(D.stockMatch(s,D.candidates(s,1)[0]).have.length>0);
});
test('gợi ý không trùng trong ngày, thiếu ứng viên để trống, không phá dữ liệu đã chốt chi',()=>{
  const s=D.newPlan(500000,10,3);
  D.suggestMenu(s);
  assert.equal(new Set(D.menu(s).map(d=>d.id)).size,3);
  s.excluded=Object.keys(D.ingredients);
  assert.equal(D.candidates(s,1).length,0);
  D.suggestMenu(s);
  assert.equal(D.menuReady(s),false);
  s.checkedOut=true;
  assert.throws(()=>D.chooseDish(s,0,'bread'));
});
test('chọn đúng các buổi ăn và ngăn chọn món bị loại',()=>{
  const s=D.newPlan(500000,10,2);s.mealSlots=[1,2];
  assert.equal(D.menu(s)[0].id,s.selected[1]);
  D.chooseDish(s,2,'tofurice');
  assert.equal(s.selected[2],'tofurice');
  s.excluded=['tofu'];
  assert.throws(()=>D.chooseDish(s,2,'tofurice'));
});
test('lưu mã món và buổi ăn sau mua sắm, loại món đó khỏi ngày tiếp theo',()=>{
  const s=D.newPlan(500000,10,2);s.mealSlots=[1,2];
  D.suggestMenu(s);const ids=D.menu(s).map(d=>d.id);
  s.confirmed=true;D.checkout(s,20000);
  assert.deepEqual(Array.from(s.logs[0].dishIds),Array.from(ids));
  assert.deepEqual(Array.from(s.logs[0].mealSlots),[1,2]);
  D.advance(s);D.suggestMenu(s);
  assert.ok(D.menu(s).every(d=>!ids.includes(d.id)));
  assert.equal(D.menuReady(s),true);
});
test('sửa gợi ý cũ nhưng giữ món tự chọn khi bữa khác không có ứng viên',()=>{
  const s=D.newPlan(500000,10,3);s.excluded=['rice'];
  D.suggestMenu(s);D.chooseDish(s,0,'bread');
  assert.equal(typeof D.repairMenu,'function');
  D.repairMenu(s);
  assert.equal(s.selected[0],'bread');
  assert.equal(s.unfilled.length,2);
  const old=D.seed();D.repairMenu(old);
  assert.ok(D.menu(old).every(d=>!['chicken','eggrice','tofusandwich'].includes(d.id)));
});
