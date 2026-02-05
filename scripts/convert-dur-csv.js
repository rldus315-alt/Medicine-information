/**
 * DUR 통합검색 성분리스트 CSV → dur-data.js 생성
 * 식품의약품안전처 고시 2025.12.23 기준
 */
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const docs = process.env.USERPROFILE ? path.join(process.env.USERPROFILE, 'Documents') : '';
const kakaoDir = path.join(docs, '카카오톡 받은 파일');

function loadCsv(filename) {
  const p = path.join(kakaoDir, filename);
  if (!fs.existsSync(p)) return [];
  let buf = fs.readFileSync(p);
  let txt = iconv.decode(buf, 'euc-kr');
  if (txt.includes('\uFFFD')) txt = buf.toString('utf8');
  return txt.replace(/^\uFEFF/, '').split(/\r?\n/);
}

function parseCsvRow(line) {
  const out = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') inQ = !inQ;
    else if (c === ',' && !inQ) { out.push(cur.trim().replace(/^"|"$/g, '')); cur = ''; }
    else cur += c;
  }
  out.push(cur.trim().replace(/^"|"$/g, ''));
  return out;
}

function findHeaderRow(lines, pattern) {
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    if (pattern.test(lines[i])) return i;
  }
  return -1;
}

function extractIngredient(s) {
  if (!s || typeof s !== 'string') return '';
  let v = s.trim();
  const m = v.match(/^\([^)]+\)\s*(.+)$/);
  if (m) v = m[1].trim();
  v = v.replace(/\s*\d+\.?\d*\s*(mg|mcg|μg|g|mL|IU|%)\s*$/i, '').trim();
  if (!v || /^\d+$|연번|규정|성분이란|약사법/.test(v)) return '';
  return v;
}

const result = {};

// 병용금기: 연번,유효성분'1',유효성분'2',비고,상세정보
const contraLines = loadCsv('DUR 통합검색 성분리스트_251223(병용금기).csv');
const contraIdx = findHeaderRow(contraLines, /연번|유효성분/);
if (contraIdx >= 0) {
  const pairs = [];
  for (let i = contraIdx + 1; i < contraLines.length; i++) {
    const row = parseCsvRow(contraLines[i]);
    const a = extractIngredient(row[1] || '');
    const b = extractIngredient(row[2] || '');
    if (a && b && a.length < 50 && b.length < 50 && !/유효성분|연번/.test(a) && !/유효성분|연번/.test(b)) pairs.push({ a, b, note: (row[4] || '').trim() });
  }
  result.contraindicationPairs = pairs;
  console.log('contraindication:', pairs.length, 'pairs');
}

// 임부금기: 연번,성분명,임부금기(등급),비고,상세정보 (header at line 6)
const pregLines = loadCsv('DUR 통합검색 성분리스트_251223(임부금기).csv');
const pregIdx = findHeaderRow(pregLines, /연번.*성분명|성분명.*등급/);
if (pregIdx >= 0) {
  const set = new Set();
  for (let i = pregIdx + 1; i < pregLines.length; i++) {
    const row = parseCsvRow(pregLines[i]);
    const ing = extractIngredient(row[1] || '');
    if (ing) set.add(ing);
    const en = (row[1] || '').trim();
    if (en && /^[a-zA-Z]/.test(en) && en.length < 40) set.add(en);
  }
  result.pregnancy = [...set].filter(Boolean).sort();
  console.log('pregnancy:', result.pregnancy.length);
}

// 노인주의: 연번,성분명(국문),성분명(영문),제형,비고
const elderLines = loadCsv('DUR 통합검색 성분리스트_251223(노인주의).csv');
const elderIdx = findHeaderRow(elderLines, /연번|성분명/);
if (elderIdx >= 0) {
  const set = new Set();
  for (let i = elderIdx + 1; i < elderLines.length; i++) {
    const row = parseCsvRow(elderLines[i]);
    [row[1], row[2]].forEach(c => { const v = extractIngredient(c || ''); if (v) set.add(v); });
  }
  result.elderly = [...set].filter(Boolean).sort();
  console.log('elderly:', result.elderly.length);
}

// 수유주의
const bfLines = loadCsv('DUR 통합검색 성분리스트_251223(수유주의).csv');
const bfIdx = findHeaderRow(bfLines, /연번|성분명/);
if (bfIdx >= 0) {
  const set = new Set();
  for (let i = bfIdx + 1; i < bfLines.length; i++) {
    const row = parseCsvRow(bfLines[i]);
    const v = extractIngredient(row[1] || row[2] || '');
    if (v) set.add(v);
  }
  result.breastfeeding = [...set].filter(Boolean).sort();
  console.log('breastfeeding:', result.breastfeeding.length);
}

// 연령금기: 연번,성분명,연령기준,제형,상세정보
const ageLines = loadCsv('DUR 통합검색 성분리스트_251223(연령금기).csv');
const ageIdx = findHeaderRow(ageLines, /연번.*성분명|성분명.*연령/);
if (ageIdx >= 0) {
  const set = new Set();
  for (let i = ageIdx + 1; i < ageLines.length; i++) {
    const row = parseCsvRow(ageLines[i]);
    const v = extractIngredient(row[1] || '');
    if (v) set.add(v);
  }
  result.age = [...set].filter(Boolean).sort();
  console.log('age:', result.age.length);
}

// 용량주의: 연번,성분명(국문),성분명(영문),제형,...
const dosageLines = loadCsv('DUR 통합검색 성분리스트_251223(용량주의).csv');
const dosageIdx = findHeaderRow(dosageLines, /연번|성분명|1일 최대/);
if (dosageIdx >= 0) {
  const set = new Set();
  for (let i = dosageIdx + 1; i < dosageLines.length; i++) {
    const row = parseCsvRow(dosageLines[i]);
    [row[1], row[2]].forEach(c => { const v = extractIngredient(c || ''); if (v) set.add(v); });
  }
  result.dosage = [...set].filter(Boolean).sort();
  console.log('dosage:', result.dosage.length);
}

// 효능중복: 성분명 추출 (구분1,구분2,구분3 구조 - 성분명(국문) 컬럼)
const effLines = loadCsv('DUR 통합검색 성분리스트_251223(효능중복).csv');
const effIdx = findHeaderRow(effLines, /성분명|계열명|효능군/);
const efficacyGroups = {};
if (effIdx >= 0) {
  const headers = parseCsvRow(effLines[effIdx]);
  const ingCol = headers.findIndex(h => /성분명|국문/.test(h || ''));
  const groupCol = headers.findIndex(h => /효능군|계열명|구분/.test(h || ''));
  for (let i = effIdx + 1; i < effLines.length; i++) {
    const row = parseCsvRow(effLines[i]);
    const ing = extractIngredient(row[ingCol] >= 0 ? row[ingCol] : row[Math.max(ingCol, 5)] || '');
    const grp = (groupCol >= 0 ? row[groupCol] : '') || 'default';
    if (ing && grp && !/^[\d,]+$/.test(ing)) {
      const key = grp.replace(/\([^)]*\)/g, '').trim().substring(0, 30) || 'default';
      if (!efficacyGroups[key]) efficacyGroups[key] = [];
      if (!efficacyGroups[key].includes(ing)) efficacyGroups[key].push(ing);
    }
  }
  result.efficacyGroups = efficacyGroups;
  console.log('efficacy:', Object.keys(efficacyGroups).length, 'groups');
}

const outPath = path.join(__dirname, '../dur-data.js');
const js = `// DUR 통합검색 성분리스트 (식품의약품안전처 고시 2025.12.23 기준)
// scripts/convert-dur-csv.js로 생성
const DUR_PREGNANCY = ${JSON.stringify(result.pregnancy || [])};
const DUR_BREASTFEEDING = ${JSON.stringify(result.breastfeeding || [])};
const DUR_ELDERLY = ${JSON.stringify(result.elderly || [])};
const DUR_AGE = ${JSON.stringify(result.age || [])};
const DUR_DOSAGE = ${JSON.stringify(result.dosage || [])};
const DUR_CONTRAINDICATION_PAIRS = ${JSON.stringify(result.contraindicationPairs || [])};
const DUR_EFFICACY_GROUPS = ${JSON.stringify(result.efficacyGroups || {})};
`;
fs.writeFileSync(outPath, js, 'utf8');
console.log('Written', outPath);
