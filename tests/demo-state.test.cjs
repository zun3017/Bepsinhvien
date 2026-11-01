const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const sandbox = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/demo-data.js'), 'utf8'), sandbox);
const D = sandbox.window.Demo;
test('ngân sách và số ngày mẫu nhất quán', () => {
  const s = D.seed();
  assert.equal(D.summary(s).remaining, 410000);
  assert.equal(D.summary(s).daysLeft, 8);
  assert.equal(D.summary(s).allowance, 51250);
});
test('không tạo kế hoạch với dữ liệu âm, rỗng hoặc dưới ngưỡng dự án', () => {
  for (const [n,x] of [[-1,10], [0,1], [500000,0], [500000,1.5], [39000,1], [NaN,10]]) {
    assert.throws(() => D.newPlan(n,x,3));
  }
  assert.equal(D.summary(D.newPlan(500000,10,3)).allowance,50000);
});
test('hàng hết hạn bị loại khỏi tồn kho sử dụng được', () => {
  const s = D.seed();
  const list = D.shopping(s);
  const expired = s.fridge.find(i => i.expiry < s.day);
  assert.ok(expired);
  assert.equal(D.usable(s,expired.key),0);
  assert.ok(list.every(i => i.buy >= 0));
});
test('cập nhật mua sắm một lần, tiêu thụ nguyên liệu và chuyển ngày có điều kiện', () => {
  const s = D.seed();
  assert.throws(() => D.checkout(s,45000));
  s.confirmed = true;
  assert.throws(() => D.checkout(s,Infinity));
  assert.throws(() => D.checkout(s,-1));
  assert.throws(() => D.checkout(s,500000));
  D.checkout(s,48000);
  assert.equal(D.summary(s).remaining,362000);
  assert.equal(D.summary(s).daysLeft,7);
  assert.equal(D.summary(s).allowance,51714);
  assert.equal(D.usable(s,'egg'),3);
  assert.equal(D.usable(s,'rice'),300);
  assert.equal(D.usable(s,'chicken'),50);
  assert.equal(s.fridge.find(i=>i.key==='greens'&&i.expiry<s.day).qty,1);
  assert.equal(s.logs.length,3);
  assert.throws(() => D.checkout(s,48000));
  D.advance(s);
  assert.equal(s.day,4);
  assert.equal(s.checkedOut,false);
  assert.equal(D.summary(s).daysLeft,7);
  assert.throws(() => D.advance(s));
});
test('mua chưa đủ không làm thay đổi ngân sách hoặc tủ lạnh', () => {
  const s=D.seed();s.confirmed=true;const before=JSON.stringify(s);
  assert.throws(()=>D.checkout(s,10000,{chicken:0}));
  assert.equal(JSON.stringify(s),before);
});
test('không chuyển vượt ngày cuối và không tiêu thụ kho hết hạn', () => {
  const s = D.newPlan(40000,1,1);
  s.confirmed=true;
  D.checkout(s,10000);
  const expired = s.fridge.find(i => i.expiry < s.day);
  assert.equal(expired,undefined);
  assert.throws(() => D.advance(s));
});
