/**
 * 행정안전부 전국약국표준데이터 CSV → pharmacy-data.js 변환
 * 공공데이터포털(data.go.kr)에서 "전국약국표준데이터" 검색 후 CSV 다운로드
 * 사용: node scripts/convert-pharmacy-standard-csv.js [CSV경로]
 * CSV 경로 미지정 시: ./전국약국표준데이터.csv 또는 Downloads 폴더 검색
 */
const fs = require('fs');
const path = require('path');

const defaultPaths = [
  path.join(__dirname, '../전국약국표준데이터.csv'),
  path.join(process.env.USERPROFILE || process.env.HOME || '', 'Downloads', '전국약국표준데이터.csv'),
  path.join(process.env.USERPROFILE || process.env.HOME || '', 'Downloads', '약국.csv'),
];
const csvPath = process.argv[2] || defaultPaths.find(p => fs.existsSync(p));
const outPath = path.join(__dirname, '../pharmacy-data.js');

if (!csvPath || !fs.existsSync(csvPath)) {
  console.error('CSV 파일을 찾을 수 없습니다.');
  console.error('사용법: node scripts/convert-pharmacy-standard-csv.js [CSV경로]');
  console.error('공공데이터포털 https://www.data.go.kr 에서 "전국약국표준데이터" 검색 후 CSV 다운로드');
  process.exit(1);
}

let text;
try {
  const buf = fs.readFileSync(csvPath);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    text = buf.slice(3).toString('utf-8');
  } else {
    try {
      text = new (require('util').TextDecoder)('euc-kr').decode(buf);
    } catch (_) {
      text = buf.toString('utf-8');
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
    else if ((c === ',' || c === '\t') && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else current += c;
  }
  result.push(current.trim());
  return result;
}

const lines = text.split(/\r?\n/).filter(l => l.trim());
const headers = parseCSVLine(lines[0]).map(h => (h || '').trim());
const rows = lines.slice(1).map(line => {
  const vals = parseCSVLine(line);
  const obj = {};
  headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
  return obj;
});

// 컬럼명 매핑 (다양한 형식 지원)
const nameKeys = ['사업장명', 'bplc_nm', '약국명', 'dutyName', '업소명'];
const addrKeys = ['소재지주소', 'lctn_addr', '소재지', 'dutyAddr', '주소', '도로명전체주소'];
const telKeys = ['소재지전화번호', 'lctn_telno', '전화번호', 'dutyTel1', '대표전화'];

function getVal(row, keys) {
  for (const k of keys) {
    const v = row[k];
    if (v && String(v).trim()) return String(v).trim();
  }
  return '';
}

const items = rows
  .filter(row => {
    const name = getVal(row, nameKeys);
    const addr = getVal(row, addrKeys);
    return name && addr;
  })
  .map(row => ({
    dutyName: getVal(row, nameKeys),
    dutyAddr: getVal(row, addrKeys),
    dutyTel1: getVal(row, telKeys) || '-',
    dutyTime1s: '', dutyTime1c: '', dutyTime2s: '', dutyTime2c: '',
    dutyTime3s: '', dutyTime3c: '', dutyTime4s: '', dutyTime4c: '',
    dutyTime5s: '', dutyTime5c: '', dutyTime6s: '', dutyTime6c: '',
    dutyTime7s: '', dutyTime7c: '', dutyTime8s: '', dutyTime8c: '',
  }));

const js = `// 전국 약국 데이터 (행정안전부 표준데이터 CSV 변환, ${new Date().toISOString().slice(0, 10)})\nconst PHARMACY_DATA = ${JSON.stringify(items, null, 0)};\n`;
fs.writeFileSync(outPath, js, 'utf8');
console.log('Created', outPath, 'with', items.length, 'pharmacies');
