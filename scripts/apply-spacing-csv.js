/**
 * 띄어쓰기_9차_홍재성.csv의 수정된 띄어쓰기로 korean-drugs.js 업데이트
 * CSV: EUC-KR 인코딩, 품목명으로 매칭
 */
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const docs = path.join(process.env.USERPROFILE || '', 'Documents');
const kakaoDir = path.join(docs, '카카오톡 받은 파일');
const spacingCsvPath = path.join(kakaoDir, '띄어쓰기_9차_홍재성.csv');
const drugsJsPath = path.join(__dirname, '../korean-drugs.js');

// 인자로 CSV 경로 지정 가능
const csvPath = process.argv[2] || spacingCsvPath;

if (!fs.existsSync(csvPath)) {
  console.error('CSV not found:', csvPath);
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

// CSV 읽기 (EUC-KR 시도 후 UTF-8)
let csvText;
try {
  const buf = fs.readFileSync(csvPath);
  csvText = iconv.decode(buf, 'euc-kr');
  if (csvText.includes('�') || !/[\uAC00-\uD7A3]/.test(csvText)) {
    csvText = buf.toString('utf8');
  }
} catch (e) {
  csvText = fs.readFileSync(csvPath, 'utf8');
}

const lines = csvText.split(/\r?\n/).filter(l => l.trim());
const headers = parseCSVLine(lines[0]);
const rows = lines.slice(1).map(line => {
  const vals = parseCSVLine(line);
  const obj = {};
  headers.forEach((h, i) => { obj[(h || '').trim()] = (vals[i] || '').trim(); });
  return obj;
});

// 품목명 → 수정된 필드 맵
const fieldMap = {
  '이 약의 효능은 무엇입니까?': 'efcyQesitm',
  '이 약은 어떻게 사용합니까?': 'useMethodQesitm',
  '이 약을 사용하기 전에 반드시 알아야 할 내용은 무엇입니가?': 'atpnWarnQesitm',
  '이 약의 사용상 주의사항은 무엇입니까?': 'atpnQesitm',
  '이 약을 사용하는 동안 주의해야 할 약 또는 음식은 무엇입니까?': 'intrcQesitm',
  '이 약은 어떤 이상반응이 나타날 수 있습니까?': 'seQesitm',
  '이 약은 어떻게 보관해야 합니까?': 'depositMethodQesitm',
};

// 헤더에 실제로 있는 컬럼만 사용
const csvColToJs = {};
for (const [csvCol, jsField] of Object.entries(fieldMap)) {
  const found = headers.find(h => (h || '').trim() === csvCol);
  if (found !== undefined) csvColToJs[csvCol] = jsField;
}

const correctionsByPumok = new Map();
for (const r of rows) {
  const name = (r['품목명'] || r['제품명'] || '').trim();
  if (!name) continue;
  const rec = {};
  for (const [csvCol, jsField] of Object.entries(csvColToJs)) {
    const val = (r[csvCol] || '').trim();
    if (val) rec[jsField] = val;
  }
  if (Object.keys(rec).length) correctionsByPumok.set(name, rec);
}

console.log('CSV rows:', rows.length, '| corrections by 품목명:', correctionsByPumok.size);
console.log('CSV columns used:', Object.keys(csvColToJs));

// korean-drugs.js 읽기
const jsContent = fs.readFileSync(drugsJsPath, 'utf8');
const match = jsContent.match(/const KOREAN_DRUG_DATABASE = (\[[\s\S]*\]);/);
if (!match) {
  console.error('Could not parse korean-drugs.js');
  process.exit(1);
}

let drugs;
try {
  drugs = JSON.parse(match[1]);
} catch (e) {
  console.error('JSON parse error:', e.message);
  process.exit(1);
}

let updated = 0;
for (const d of drugs) {
  const name = (d.name || '').trim();
  const rec = correctionsByPumok.get(name);
  if (!rec) continue;
  for (const [jsField, val] of Object.entries(rec)) {
    if (d[jsField] !== val) {
      d[jsField] = val;
      updated++;
    }
  }
}

const newJs = `// 한국 의약품 데이터 (식품의약품안전처 + e약은요 merged)
// spacing corrections applied from ${path.basename(csvPath)}
const KOREAN_DRUG_DATABASE = ${JSON.stringify(drugs, null, 0)};
`;

fs.writeFileSync(drugsJsPath, newJs, 'utf8');
console.log('Updated', updated, 'fields across', drugs.length, 'drugs');
console.log('Written:', drugsJsPath);
