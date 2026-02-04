/**
 * 공공데이터 약국 API에서 데이터 수집 → pharmacy-data.js 생성
 * Node에서 실행 (CORS 없음). 사용: node scripts/fetch-pharmacy-api.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.PHARMACY_API_KEY || '88454fe0566a8c47e542a90d926c8ed71893ff9402d7c05a9aa600c64abbfcbf';
const BASE = 'https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire';

const SIDO_LIST = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시',
  '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', '전라남도',
  '경상북도', '경상남도', '제주특별자치도'
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseXmlItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const getVal = (str, key) => {
    const m = str.match(new RegExp(`<${key}>([^<]*)</${key}>`));
    return m ? m[1].trim() : '';
  };
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    items.push({
      dutyName: getVal(block, 'dutyName'),
      dutyAddr: getVal(block, 'dutyAddr'),
      dutyTel1: getVal(block, 'dutyTel1'),
      dutyTime1s: getVal(block, 'dutyTime1s'), dutyTime1c: getVal(block, 'dutyTime1c'),
      dutyTime2s: getVal(block, 'dutyTime2s'), dutyTime2c: getVal(block, 'dutyTime2c'),
      dutyTime3s: getVal(block, 'dutyTime3s'), dutyTime3c: getVal(block, 'dutyTime3c'),
      dutyTime4s: getVal(block, 'dutyTime4s'), dutyTime4c: getVal(block, 'dutyTime4c'),
      dutyTime5s: getVal(block, 'dutyTime5s'), dutyTime5c: getVal(block, 'dutyTime5c'),
      dutyTime6s: getVal(block, 'dutyTime6s'), dutyTime6c: getVal(block, 'dutyTime6c'),
      dutyTime7s: getVal(block, 'dutyTime7s'), dutyTime7c: getVal(block, 'dutyTime7c'),
      dutyTime8s: getVal(block, 'dutyTime8s'), dutyTime8c: getVal(block, 'dutyTime8c'),
    });
  }
  return items;
}

async function fetchRegion(sido, sigugun, pageNo) {
  const params = new URLSearchParams({
    serviceKey: API_KEY,
    Q0: sido,
    pageNo: String(pageNo),
    numOfRows: '100'
  });
  if (sigugun) params.set('Q1', sigugun);
  const url = BASE + '?' + params.toString();
  const xml = await fetchUrl(url);
  return parseXmlItems(xml);
}

async function main() {
  const all = [];
  for (const sido of SIDO_LIST) {
    process.stdout.write(`Fetching ${sido}... `);
    try {
      const items = await fetchRegion(sido, '', 1);
      all.push(...items);
      console.log(items.length);
    } catch (e) {
      console.log('err:', e.message);
    }
    await new Promise(r => setTimeout(r, 300));
  }
  const outPath = path.join(__dirname, '../pharmacy-data.js');
  const js = `// 전국 약국 데이터 (공공데이터 API 수집, ${new Date().toISOString().slice(0,10)})
const PHARMACY_DATA = ${JSON.stringify(all, null, 0)};
`;
  fs.writeFileSync(outPath, js, 'utf8');
  console.log('Created', outPath, 'with', all.length, 'pharmacies');
}

main().catch(e => { console.error(e); process.exit(1); });
