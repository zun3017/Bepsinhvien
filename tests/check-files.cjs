// Kiểm tra các tài nguyên và liên kết file nội bộ không bị thiếu.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
let checked=0;
for(const name of ['index.html','login.html','dashboard.html']) {
  const source=fs.readFileSync(path.join(root,name),'utf8');
  for(const [,value] of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if(value.startsWith('#')||/^https?:/.test(value))continue;
    const localPath=value.split(/[?#]/)[0];
    assert.ok(fs.existsSync(path.join(root,localPath)),`${name}: thiếu ${value}`);
    checked++;
  }
}
for(const file of fs.readdirSync(path.join(root,'css'))) {
  const source=fs.readFileSync(path.join(root,'css',file),'utf8');
  for(const [,url] of source.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
    assert.ok(fs.existsSync(path.join(root,'css',url)),`${file}: thiếu ${url}`);
    checked++;
  }
}
console.log(`Đã kiểm tra ${checked} liên kết tài nguyên nội bộ, không thiếu file.`);
