/**
 * 공공데이터 약국 API에서 데이터 수집 → pharmacy-data.js 생성
 * 시·도별 + 시·군·구별 페이지네이션으로 최대한 수집 (약 2만~3만 건 목표)
 * Node에서 실행. 사용: node scripts/fetch-pharmacy-api.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.PHARMACY_API_KEY || '88454fe0566a8c47e542a90d926c8ed71893ff9402d7c05a9aa600c64abbfcbf';
const BASE = 'https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire';

const SIDO_SIGUGUN = {
  "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  "부산광역시": ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
  "대구광역시": ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
  "인천광역시": ["강화군", "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "옹진군", "중구"],
  "광주광역시": ["광산구", "남구", "동구", "북구", "서구"],
  "대전광역시": ["대덕구", "동구", "서구", "유성구", "중구"],
  "울산광역시": ["남구", "동구", "북구", "중구", "울주군"],
  "세종특별자치시": [],
  "경기도": ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
  "강원특별자치도": ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
  "충청북도": ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "진천군", "청원군", "청주시", "충주시", "증평군"],
  "충청남도": ["공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
  "전북특별자치도": ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
  "전라남도": ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
  "경상북도": ["경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
  "경상남도": ["거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
  "제주특별자치도": ["서귀포시", "제주시"]
};

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

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const MAX_TOTAL = parseInt(process.env.MAX_PHARMACIES || '25000', 10);

async function main() {
  const seen = new Set();
  const all = [];

  let done = false;
  for (const [sido, sigugunList] of Object.entries(SIDO_SIGUGUN)) {
    if (done) break;
    const targets = sigugunList.length > 0 ? sigugunList.map(sg => sg) : [''];
    for (const sigugun of targets) {
      if (done) break;
      const label = sigugun ? `${sido} ${sigugun}` : sido;
      let pageNo = 1;
      let hasMore = true;
      let first = true;
      while (hasMore) {
        try {
          const items = await fetchRegion(sido, sigugun, pageNo);
          for (const item of items) {
            const key = (item.dutyName || '') + '|' + (item.dutyAddr || '');
            if (!seen.has(key) && item.dutyName) {
              seen.add(key);
              all.push(item);
            }
          }
          if (items.length < 100) hasMore = false;
          else pageNo++;
          if (all.length >= MAX_TOTAL) { hasMore = false; done = true; }
          if (items.length > 0) {
            if (first) { process.stdout.write(`${label}: ${items.length}`); first = false; }
            else process.stdout.write(` +${items.length}`);
          }
        } catch (e) {
          process.stdout.write(` err: ${e.message}`);
          hasMore = false;
    }
    await sleep(200);
      }
      if (!first) process.stdout.write('\n');
    }
  }

  const outPath = path.join(__dirname, '../pharmacy-data.js');
  const js = `// 전국 약국 데이터 (공공데이터 API 수집, ${new Date().toISOString().slice(0, 10)})\nconst PHARMACY_DATA = ${JSON.stringify(all, null, 0)};\n`;
  fs.writeFileSync(outPath, js, 'utf8');
  console.log('Created', outPath, 'with', all.length, 'pharmacies');
}

main().catch(e => { console.error(e); process.exit(1); });
