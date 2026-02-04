/**
 * 심야약국.csv (EUC-KR) → NIGHT_PHARMACY JS 데이터 변환
 * 사용: node scripts/convert-night-pharmacy.js [CSV경로]
 */
const fs = require('fs');
const path = require('path');

const defaultPath = path.join(process.env.USERPROFILE || '', 'Downloads', '심야약국.csv');
const csvPath = process.argv[2] || defaultPath;
const outPath = path.join(__dirname, '../night-pharmacy-data.js');

if (!fs.existsSync(csvPath)) {
  console.error('파일을 찾을 수 없습니다:', csvPath);
  process.exit(1);
}

let text;
try {
  const buf = fs.readFileSync(csvPath);
  // EUC-KR/CP949 디코딩 (Node 18+ TextDecoder 또는 iconv-lite)
  try {
    const { TextDecoder } = require('util');
    text = new TextDecoder('euc-kr').decode(buf);
  } catch (_) {
    try {
      const iconv = require('iconv-lite');
      text = iconv.decode(buf, 'euc-kr');
    } catch (e) {
      console.error('iconv-lite 필요: npm install iconv-lite');
      process.exit(1);
    }
  }
} catch (e) {
  console.error('파일 읽기 실패:', e.message);
  process.exit(1);
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQuotes = !inQuotes;
    else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else current += c;
  }
  result.push(current.trim());
  return result;
}

const lines = text.split(/\r?\n/).filter(l => l.trim());
const headerLine = lines[0];
if (headerLine.includes('갱신일') || headerLine.includes('데이터')) {
  lines.shift(); // 메타 행 제거
}
const headers = parseCSVLine(lines[0]);
const rows = lines.slice(1).map(line => {
  const vals = parseCSVLine(line);
  const obj = {};
  headers.forEach((h, i) => { obj[(h || '').trim()] = (vals[i] || '').trim(); });
  return obj;
});

// 헤더: 약국명, 전화번호, 대표주소, 상세주소, 월요일~공휴일
const colMap = {
  name: ['약국명', '약국명'],
  tel: ['전화번호', '대표전화'],
  addr: ['대표주소', '주소'],
  addr2: ['상세주소', '상세주소'],
  mon: ['월요일', '월'],
  tue: ['화요일', '화'],
  wed: ['수요일', '수'],
  thu: ['목요일', '목'],
  fri: ['금요일', '금'],
  sat: ['토요일', '토'],
  sun: ['일요일', '일'],
  holiday: ['공휴일', '공휴일']
};

const data = rows
  .filter(r => {
    const n = (r['약국명'] || '').trim();
    return n && n.length > 0;
  })
  .map(r => {
    const get = (keys) => {
      for (const k of keys) {
        const v = r[k];
        if (v !== undefined && v !== null && String(v).trim()) return String(v).trim();
      }
      return '';
    };
    return {
      name: get(colMap.name),
      tel: get(colMap.tel),
      addr: get(colMap.addr),
      addr2: get(colMap.addr2),
      mon: get(colMap.mon),
      tue: get(colMap.tue),
      wed: get(colMap.wed),
      thu: get(colMap.thu),
      fri: get(colMap.fri),
      sat: get(colMap.sat),
      sun: get(colMap.sun),
      holiday: get(colMap.holiday)
    };
  })
  .filter(p => p.name);

const js = `// 심야운영약국 데이터 (E-GEN·대한약사회, ${new Date().toISOString().slice(0,10)} 갱신)
// generated from ${path.basename(csvPath)}
const NIGHT_PHARMACY = ${JSON.stringify(data, null, 0)};
`;

fs.writeFileSync(outPath, js, 'utf8');
console.log('Created', outPath, 'with', data.length, 'pharmacies');
