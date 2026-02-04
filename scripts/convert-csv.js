const fs = require('fs');
const path = require('path');

// medicine_data.csv / merged_data 경로 (카카오톡 받은 파일)
const docs = path.join(process.env.USERPROFILE || '', 'Documents');
const kakaoDir = path.join(docs, '카카오톡 받은 파일');
const medicineDataCsv = path.join(kakaoDir, 'medicine_data.csv');
const mergedCsv = path.join(kakaoDir, 'merged_data (1).csv');
const mergedLocal = path.join(__dirname, '../medicine_data.csv');
const localCsv = path.join(__dirname, '../filtered_data_normal.csv');
let csvPath = process.argv[2];
if (!csvPath) {
  const pathFile = path.join(__dirname, '../csv-path.txt');
  if (fs.existsSync(pathFile)) {
    csvPath = fs.readFileSync(pathFile, 'utf8').trim();
  }
}
csvPath = csvPath || (fs.existsSync(mergedLocal) ? mergedLocal : (fs.existsSync(medicineDataCsv) ? medicineDataCsv : (fs.existsSync(mergedCsv) ? mergedCsv : (fs.existsSync(localCsv) ? localCsv : medicineDataCsv))));
const outPath = path.join(__dirname, '../korean-drugs.js');

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

const csv = fs.readFileSync(csvPath, 'utf8');
const lines = csv.split(/\r?\n/).filter(l => l.trim());
const headers = parseCSVLine(lines[0]);
const rows = lines.slice(1).map(line => {
  const vals = parseCSVLine(line);
  const obj = {};
  headers.forEach((h, i) => { obj[h.trim()] = (vals[i] || '').trim(); });
  return obj;
});

// medicine_data / merged_data 형식: e약은요 상세 포함
const isMergedFormat = headers.some(h => (h || '').includes('이 약의 효능은 무엇입니까'));
const drugs = rows
  .filter(r => (r['품목명'] || r['제품명']))
  .map(r => {
    const name = r['제품명'] || r['품목명'] || '';
    const nameEn = r['품목 영문명'] || '';
    const company = r['업체명_y'] || r['업체명_x'] || r['업체명'] || '';
    const ingredient = r['주성분_y'] || r['주성분_x'] || r['주성분'] || '';
    const category = r['분류명'] || '';
    const image = (r['큰제품이미지'] && r['큰제품이미지'] !== '-') ? r['큰제품이미지'] : '';
    const type = r['전문일반구분'] || '';
    const base = { name, nameEn, company, ingredient, category, image, type };
    if (isMergedFormat) {
      base.efcyQesitm = r['이 약의 효능은 무엇입니까?'] || '';
      base.useMethodQesitm = r['이 약은 어떻게 사용합니까?'] || '';
      base.atpnWarnQesitm = r['이 약을 사용하기 전에 반드시 알아야 할 내용은 무엇입니가?'] || '';
      base.atpnQesitm = r['이 약의 사용상 주의사항은 무엇입니까?'] || '';
      base.intrcQesitm = r['이 약을 사용하는 동안 주의해야 할 약 또는 음식은 무엇입니까?'] || '';
      base.seQesitm = r['이 약은 어떤 이상반응이 나타날 수 있습니까?'] || '';
      base.depositMethodQesitm = r['이 약은 어떻게 보관해야 합니까?'] || '';
    }
    return base;
  });

const js = `// 한국 의약품 데이터 (식품의약품안전처 + e약은요 merged)
// generated from ${path.basename(csvPath)}
const KOREAN_DRUG_DATABASE = ${JSON.stringify(drugs, null, 0)};
`;

fs.writeFileSync(outPath, js, 'utf8');
console.log('Created', outPath, 'with', drugs.length, 'drugs');
if (isMergedFormat) console.log('(merged format: includes efficacy, usage, precautions, etc.)');
