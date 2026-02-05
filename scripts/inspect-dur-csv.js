const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const docs = process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'Documents') : '';
const kakaoDir = path.join(docs, '카카오톡 받은 파일');
const file = 'DUR 통합검색 성분리스트_251223(임부금기).csv';
const p = path.join(kakaoDir, file);
const buf = fs.readFileSync(p);
let txt = iconv.decode(buf, 'euc-kr');
if (txt.includes('\uFFFD')) txt = buf.toString('utf8');
const lines = txt.split(/\r?\n/);
for (let i = 0; i < 15; i++) {
  console.log(i + ':', lines[i]?.substring(0, 150));
}
