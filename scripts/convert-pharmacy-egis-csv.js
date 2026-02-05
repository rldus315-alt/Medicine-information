/**
 * 약국정보서비스(2025.12) CSV → pharmacy-data.js 변환/병합
 * 컬럼: 기관ID, 약국명, ..., 도로명주소, 전화번호, ..., 좌표(X), 좌표(Y)
 * 사용: node scripts/convert-pharmacy-egis-csv.js [CSV경로]
 */
const fs = require('fs');
const path = require('path');

let csvPath = process.argv[2];
if (!csvPath) {
  const pathFile = path.join(__dirname, '../pharmacy-csv-path.txt');
  if (fs.existsSync(pathFile)) {
    csvPath = fs.readFileSync(pathFile, 'utf8').trim().split(/\r?\n/)[0];
  }
}
if (!csvPath || !fs.existsSync(csvPath)) {
  console.error('CSV 파일을 찾을 수 없습니다.');
  console.error('pharmacy-csv-path.txt에 CSV 전체 경로를 한 줄로 적거나, 인자로 경로를 전달하세요.');
  process.exit(1);
}

let text;
try {
  const buf = fs.readFileSync(csvPath);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    text = buf.slice(3).toString('utf-8');
  } else {
    try {
      const iconv = require('iconv-lite');
      text = iconv.decode(buf, 'euc-kr');
    } catch (_) {
      try {
        text = new (require('util').TextDecoder)('euc-kr').decode(buf);
      } catch (e2) {
        text = buf.toString('utf-8');
      }
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
const headers = parseCSVLine(lines[0]);
const rows = lines.slice(1).map(line => {
  const vals = parseCSVLine(line);
  const obj = {};
  headers.forEach((h, i) => { obj[i] = (vals[i] || '').trim(); obj[(h || '').trim()] = (vals[i] || '').trim(); });
  return obj;
});

// 약국정보서비스 CSV 컬럼 인덱스 (0-based): 1=약국명, 10=도로명주소, 11=전화번호
// 또는 헤더명: 약국명칭, 도로명주소, 전화번호
const items = rows
  .filter(row => {
    const name = (row[1] || row['약국명칭'] || row['약국명'] || '').trim();
    const addr = (row[10] || row['도로명주소'] || row['소재지주소'] || row[11] || '').trim();
    return name && addr && !name.startsWith('JDQ');
  })
  .map(row => {
    const name = (row[1] || row['약국명칭'] || row['약국명'] || '').trim();
    const addr = (row[10] || row['도로명주소'] || row['소재지주소'] || row[11] || '').trim();
    const tel = (row[11] || row['전화번호'] || row[12] || '').trim() || '-';
    return {
      dutyName: name,
      dutyAddr: addr.replace(/^"|"$/g, ''),
      dutyTel1: tel,
      dutyTime1s: '', dutyTime1c: '', dutyTime2s: '', dutyTime2c: '',
      dutyTime3s: '', dutyTime3c: '', dutyTime4s: '', dutyTime4c: '',
      dutyTime5s: '', dutyTime5c: '', dutyTime6s: '', dutyTime6c: '',
      dutyTime7s: '', dutyTime7c: '', dutyTime8s: '', dutyTime8c: '',
    };
  });

// 기존 pharmacy-data.js와 병합 (중복 제거)
const outPath = path.join(__dirname, '../pharmacy-data.js');
let existing = [];
try {
  const existingJs = fs.readFileSync(outPath, 'utf8');
  const m = existingJs.match(/const PHARMACY_DATA = (\[[\s\S]*?\]);/);
  if (m) existing = JSON.parse(m[1]);
} catch (_) {}

const seen = new Set(existing.map(p => (p.dutyName || '') + '|' + (p.dutyAddr || '')));
let added = 0;
for (const item of items) {
  const key = (item.dutyName || '') + '|' + (item.dutyAddr || '');
  if (!seen.has(key)) {
    seen.add(key);
    existing.push(item);
    added++;
  }
}

const js = `// 전국 약국 데이터 (약국정보서비스 2025.12 + 기존, ${new Date().toISOString().slice(0, 10)})\nconst PHARMACY_DATA = ${JSON.stringify(existing, null, 0)};\n`;
fs.writeFileSync(outPath, js, 'utf8');
console.log('Created', outPath, 'with', existing.length, 'pharmacies (added', added, 'from CSV)');
