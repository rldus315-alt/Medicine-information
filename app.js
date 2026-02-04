// 한글 띄어쓰기 보정 (의약품 정보용)
function addSpacing(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/\|/g, ' | ')
    .replace(/\(/g, ' (')
    .replace(/\)/g, ') ')
    .replace(/·/g, ' · ')
    .replace(/~/g, ' ~ ')
    .replace(/\/\s*/g, ' / ')
    .replace(/에사용|에복용|시에복용/g, (m) => m.includes('시에') ? m.slice(0, 3) + ' 복용' : m.slice(0, 1) + ' ' + m.slice(1))
    .replace(/을복용|를복용|을사용|를사용/g, (m) => (m[0] === '을' ? '을 ' : '를 ') + (m.includes('복용') ? '복용' : '사용'))
    .replace(/이약은|이약을|이약이|이약에/g, (m) => m.slice(0, 1) + ' ' + m.slice(1))
    .replace(/환자는이약|환자는이약을/g, '환자는 이 약을')
    .replace(/의젖먹이|의영아|의소아/g, (m) => '의 ' + m.slice(1))
    .replace(/및성인|및만|및취침|및수유|및유아|및소아/g, (m) => '및 ' + m.slice(1))
    .replace(/이상및/g, '이상 및 ')
    .replace(/의사또는약사와상의/g, '의사 또는 약사와 상의')
    .replace(/의사또는약사/g, '의사 또는 약사')
    .replace(/약사와상의/g, '약사와 상의')
    .replace(/([가-힣])또는([가-힣])/g, '$1 또는 $2')
    .replace(/([가-힣])및([가-힣])/g, '$1 및 $2')
    .replace(/(\d+)(세|개월)(이상|미만)/g, '$1$2 $3')
    .replace(/(\d+)(시간|일|회)(이상)/g, '$1$2 $3')
    .replace(/만(\d+)(세|개월)/g, '만 $1$2')
    .replace(/(\d)(회|일|병)(\d)/g, '$1$2 $3')
    .replace(/(\d)(회|일)([가-힣정])/g, '$1$2 $3')
    .replace(/([가-힣])([은는])(\d)/g, '$1$2 $3')
    .replace(/식후에복용|식간에복용/g, (m) => m.slice(0, 3) + ' 복용')
    .replace(/복용간격은(\d)/g, '복용간격은 $1')
    .replace(/복용하기전에|사용하기전에/g, (m) => m.slice(0, -3) + '기 전에')
    .replace(/습기와빛을피해/g, '습기와 빛을 피해')
    .replace(/습기와빛/g, '습기와 빛')
    .replace(/빛을피해/g, '빛을 피해')
    .replace(/피해실온|피해보관/g, (m) => '피해 ' + m.slice(2))
    .replace(/실온에서보관/g, '실온에서 보관')
    .replace(/어린이의손이닿지않는/g, '어린이의 손이 닿지 않는')
    .replace(/손이닿지않는/g, '손이 닿지 않는')
    .replace(/않는곳에/g, '않는 곳에')
    .replace(/곳에보관/g, '곳에 보관')
    .replace(/할경우/g, '할 경우')
    .replace(/없을경우/g, '없을 경우')
    .replace(/경우보호자/g, '경우 보호자')
    .replace(/(\d개월)정도/g, '$1 정도')
    .replace(/복용을즉각중지하고/g, '복용을 즉각 중지하고')
    .replace(/복용을즉각/g, '복용을 즉각')
    .replace(/정해진용법과용량을잘지키십시오/g, '정해진 용법과 용량을 잘 지키십시오')
    .replace(/정해진용법과용량을잘지키/g, '정해진 용법과 용량을 잘 지키')
    .replace(/보호자의지도감독하에/g, '보호자의 지도 감독 하에')
    .replace(/에게투여|하에투여/g, (m) => m.slice(0, 2) + ' ' + m.slice(2))
    .replace(/식사와식사/g, '식사와 식사')
    .replace(/때사이/g, '때 사이')
    .replace(/복용하여도증상의개선이없을/g, '복용하여도 증상의 개선이 없을')
    .replace(/복용하지마십시오/g, '복용하지 마십시오')
    .replace(/젖먹이는이약을/g, '젖먹이는 이 약을')
    .replace(/약은식욕/g, '약은 식욕')
    .replace(/식욕감퇴/g, '식욕 감퇴')
    .replace(/임신하고있을가능성이있는/g, '임신하고 있을 가능성이 있는')
    .replace(/있는여성/g, '있는 여성')
    .replace(/나트륨제한식이를하는/g, '나트륨 제한 식이를 하는')
    .replace(/하는사람은/g, '하는 사람은')
    .replace(/으로합니다/g, '으로 합니다')
    .replace(/(회|일)(\d)(정)/g, '$1 $2$3')
    .replace(/독성표피괴사용해/g, '독성 표피 괴사 용해')
    .replace(/(\d)(mL|mg|g)([^\d\s.,/])/g, '$1$2 $3')
    .replace(/\s+/g, ' ')
    .trim();
}

// 복약 안내문 픽토그램 (키워드 → 아이콘)
const MED_PICTOGRAMS = [
  { id: 'alcohol', keywords: /음주|알코올|술|세\s*잔\s*이상|음주\s*금지/i, label: '음주 금지', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10h8l-2 10h-4L12 10z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="22" x2="24" y2="22" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="8" x2="26" y2="24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { id: 'pregnancy', keywords: /임신|수유|임부|젖먹이|수유부|임신부/i, label: '임신·수유 주의', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 20q4 4 8 0" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="16" cy="24" rx="6" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' },
  { id: 'child', keywords: /어린이|영아|소아|유아|아동|손이\s*닿지|손\s*닿지/i, label: '어린이 손 닿지 않는 곳', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="11" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 18v4h8v-4" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="26" x2="22" y2="26" stroke="currentColor" stroke-width="1.5"/><path d="M8 10l3-3M24 10l-3-3" stroke="currentColor" stroke-width="1"/></svg>' },
  { id: 'light', keywords: /직사광선|빛\s*피해|빛을\s*피해|광선|햇빛/i, label: '빛 피하기', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="6" x2="16" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="22" x2="16" y2="26" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="16" x2="10" y2="16" stroke="currentColor" stroke-width="1.5"/><line x1="22" y1="16" x2="26" y2="16" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="10" x2="12" y2="12" stroke="currentColor" stroke-width="1"/><line x1="22" y1="10" x2="20" y2="12" stroke="currentColor" stroke-width="1"/><line x1="10" y1="22" x2="12" y2="20" stroke="currentColor" stroke-width="1"/><line x1="22" y1="22" x2="20" y2="20" stroke="currentColor" stroke-width="1"/></svg>' },
  { id: 'moisture', keywords: /습기|습기와|습한|젖은/i, label: '습기 피하기', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8c-4 4-8 8-8 12 0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' },
  { id: 'cold', keywords: /냉장|냉동|저온|2~8|2\s*~\s*8/i, label: '냉장 보관', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10" y="8" width="12" height="16" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="14" x2="22" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="14" y1="10" x2="14" y2="22" stroke="currentColor" stroke-width="1"/><line x1="18" y1="10" x2="18" y2="22" stroke="currentColor" stroke-width="1"/></svg>' },
  { id: 'food', keywords: /식후|식사\s*후|식사와|밥\s*먹고|음식과/i, label: '식후 복용', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="16" cy="18" rx="6" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 18v-6c0-1 1-2 2-2h8c1 0 2 1 2 2v6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="12" x2="12" y2="14" stroke="currentColor" stroke-width="1"/><line x1="16" y1="12" x2="16" y2="14" stroke="currentColor" stroke-width="1"/><line x1="20" y1="12" x2="20" y2="14" stroke="currentColor" stroke-width="1"/></svg>' },
  { id: 'empty', keywords: /공복|식전|식사\s*전|빈\s*속/i, label: '공복 복용', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/></svg>' },
  { id: 'bedtime', keywords: /취침|잠들기\s*전|취침\s*전|밤에|자기\s*전/i, label: '취침 전 복용', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l2-2 2 2" fill="none" stroke="currentColor" stroke-width="1"/><path d="M22 10l2-2 2 2" fill="none" stroke="currentColor" stroke-width="1"/></svg>' },
  { id: 'drive', keywords: /운전|기계\s*조작|차량\s*운전|졸음/i, label: '운전·기계조작 주의', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 18l2-4h12l2 4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="11" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="21" cy="20" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="14" x2="24" y2="14" stroke="currentColor" stroke-width="1"/></svg>' },
  { id: 'consult', keywords: /의사|약사|상의|상담|문의|진료/i, label: '의사·약사 상담', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 24c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 14l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' },
  { id: 'dosage', keywords: /용법|용량|복용\s*방법|정해진|잘\s*지키/i, label: '용법·용량 준수', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="14" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M16 10v2M16 18v2M14 16h-2M18 16h2" stroke="currentColor" stroke-width="1.5"/><path d="M14 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' },
  { id: 'interaction', keywords: /상호작용|다른\s*약|함께\s*복용|중복\s*복용|다른\s*의약품/i, label: '약물 상호작용', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="11" cy="14" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="21" cy="14" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="13.5" y1="14" x2="18.5" y2="14" stroke="currentColor" stroke-width="1.5"/><path d="M11 18l2 2M21 18l-2 2" fill="none" stroke="currentColor" stroke-width="1"/></svg>' },
  { id: 'warning', keywords: /금지|주의|경고|위험|즉시|중지|중단/i, label: '주의', svg: '<svg viewBox="0 0 32 32" class="pictogram-svg pictogram-warning"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8v10M16 21v1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
];

function getPictogramsForText(text) {
  if (!text || typeof text !== 'string') return [];
  const raw = String(text).replace(/\s+/g, ' ');
  return MED_PICTOGRAMS.filter(p => p.keywords.test(raw)).map(p => ({ id: p.id, label: p.label, svg: p.svg }));
}

function renderPictograms(pictograms) {
  if (!pictograms || pictograms.length === 0) return '';
  return `<div class="med-guide-pictograms">${pictograms.map(p => `
    <span class="pictogram-item" title="${p.label}">${p.svg}<span class="pictogram-label">${p.label}</span></span>
  `).join('')}</div>`;
}

// 복약 안내문 생성 (열람·인쇄용)
function generateMedicationGuide(source, drug) {
  const fmt = (t) => (t && t.trim()) ? addSpacing(String(t).trim()).replace(/\n/g, '<br>') : '-';
  let name = '', company = '', ingredient = '', sections = [];

  if (source === 'eyak') {
    const d = drug;
    name = d.itemName || '-';
    company = d.entpName || '-';
    ingredient = '-';
    sections = [
      { title: '효능·효과', data: d.efcyQesitm },
      { title: '사용법', data: d.useMethodQesitm },
      { title: '주의사항 (경고)', data: d.atpnWarnQesitm },
      { title: '주의사항', data: d.atpnQesitm },
      { title: '약물·음식 상호작용', data: d.intrcQesitm },
      { title: '부작용', data: d.seQesitm },
      { title: '보관법', data: d.depositMethodQesitm },
    ].filter(s => s.data && s.data.trim());
  } else if (source === 'korean') {
    const d = drug;
    name = d.name || '-';
    company = d.company || '-';
    ingredient = d.ingredient || '-';
    let ext = d.efcyQesitm || d.useMethodQesitm || d.atpnQesitm ? d : null;
    if (!ext && typeof DRUG_EXTENDED_INFO !== 'undefined') {
      const extInfo = DRUG_EXTENDED_INFO[d.name] || DRUG_EXTENDED_INFO[d.ingredient];
      if (extInfo) ext = { ...d, ...extInfo };
    }
    sections = [
      { title: '효능·효과', data: (ext && ext.efcyQesitm) || '' },
      { title: '사용법', data: (ext && ext.useMethodQesitm) || '' },
      { title: '주의사항 (경고)', data: (ext && ext.atpnWarnQesitm) || '' },
      { title: '주의사항', data: (ext && ext.atpnQesitm) || '' },
      { title: '약물·음식 상호작용', data: (ext && ext.intrcQesitm) || '' },
      { title: '부작용', data: (ext && ext.seQesitm) || '' },
      { title: '보관법', data: (ext && ext.depositMethodQesitm) || '' },
    ].filter(s => s.data && s.data.trim());
    if (sections.length === 0 && ingredient) {
      sections = [{ title: '주성분', data: ingredient }];
    }
  } else {
    const d = drug;
    name = d.openfda?.brand_name?.[0] || d.openfda?.generic_name?.[0] || '-';
    company = '-';
    ingredient = d.openfda?.generic_name?.[0] || '-';
    sections = [
      { title: '효능·효과', data: d.indications_and_usage?.[0] || d.purpose?.[0] || '' },
      { title: '용법·용량', data: d.dosage_and_administration?.[0] || '' },
      { title: '주의사항', data: d.warnings?.[0] || d.precautions?.[0] || '' },
      { title: '부작용', data: d.adverse_reactions?.[0] || '' },
      { title: '금기', data: d.contraindications?.[0] || '' },
      { title: '약물 상호작용', data: d.drug_interactions?.[0] || '' },
      { title: '임신·수유', data: d.pregnancy_or_breast_feeding?.[0] || '' },
    ].filter(s => s.data && s.data.trim());
  }

  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  const pictogramTitles = /주의사항|경고|사용법|보관법|상호작용|부작용|금기|임신|수유|용법|용량/i;
  const sectionHtml = sections.map(s => {
    const showPictograms = pictogramTitles.test(s.title) && s.data;
    const pictos = showPictograms ? getPictogramsForText(s.data) : [];
    const pictoHtml = renderPictograms(pictos);
    return `
    <div class="med-guide-block">
      <h4>${s.title}</h4>
      ${pictoHtml}
      <p>${fmt(s.data)}</p>
    </div>
  `;
  }).join('');

  return `
    <div class="med-guide-print">
      <div class="med-guide-title">복약 안내문</div>
      <div class="med-guide-meta">작성일: ${dateStr}</div>
      <div class="med-guide-drug-name">${name}</div>
      <div class="med-guide-info">
        <p><strong>제조·판매:</strong> ${company}</p>
        ${ingredient && ingredient !== '-' ? `<p><strong>주성분:</strong> ${fmt(ingredient)}</p>` : ''}
      </div>
      <hr>
      ${sectionHtml}
      <div class="med-guide-footer">
        <p>※ 본 안내문은 참고용이며, 의료 상담을 대체하지 않습니다. 복용 방법·용량은 처방에 따르고, 궁금한 점은 의사 또는 약사에게 문의하세요.</p>
      </div>
    </div>
  `;
}

function showMedicationGuide() {
  if (!currentDetailDrug) return;
  const body = document.getElementById('medGuideBody');
  const overlay = document.getElementById('medGuideOverlay');
  if (!body || !overlay) return;
  body.innerHTML = generateMedicationGuide(currentDetailDrug.source, currentDetailDrug.data);
  overlay.classList.add('visible');
}

function hideMedicationGuide() {
  const overlay = document.getElementById('medGuideOverlay');
  if (overlay) overlay.classList.remove('visible');
}

function printMedicationGuide() {
  const body = document.getElementById('medGuideBody');
  if (!body || !body.innerHTML.trim()) return;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <title>복약 안내문 - 인쇄</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Noto Sans KR', sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; color: #1e3a2f; }
        .med-guide-print { }
        .med-guide-title { font-size: 18px; font-weight: 700; color: #059669; margin-bottom: 8px; }
        .med-guide-meta { font-size: 12px; color: #4a6b5d; margin-bottom: 16px; }
        .med-guide-drug-name { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .med-guide-info p { font-size: 14px; line-height: 1.6; margin-bottom: 6px; }
        .med-guide-block { margin-top: 16px; }
        .med-guide-block h4 { font-size: 14px; color: #059669; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #bbd4c8; }
        .med-guide-pictograms { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .pictogram-item { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border: 1px solid #bbd4c8; border-radius: 6px; font-size: 11px; background: #f0fdf4; }
        .pictogram-svg { width: 20px; height: 20px; flex-shrink: 0; color: #059669; }
        .pictogram-svg.pictogram-warning { color: #d97706; }
        .pictogram-label { color: #4a6b5d; }
        .med-guide-block p { font-size: 13px; line-height: 1.7; }
        hr { border: none; border-top: 1px solid #bbd4c8; margin: 16px 0; }
        .med-guide-footer { font-size: 11px; color: #4a6b5d; margin-top: 24px; padding-top: 12px; border-top: 1px solid #bbd4c8; }
      </style>
    </head>
    <body>${body.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// OpenFDA API Base
const FDA_API = 'https://api.fda.gov/drug/label.json';
// e약은요 API (공공데이터포털)
const EYAK_API = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';
const CORS_PROXIES = [
  (u) => 'https://corsproxy.io/?url=' + encodeURIComponent(u),
  (u) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u)
];

// e약은요 API 호출 (API 키 필요)
async function fetchEyakApi(itemName) {
  const apiKey = (typeof DATA_GO_KR_API_KEY !== 'undefined' && DATA_GO_KR_API_KEY) ? DATA_GO_KR_API_KEY.trim() : '';
  if (!apiKey) return null;
  const url = `${EYAK_API}?serviceKey=${encodeURIComponent(apiKey)}&itemName=${encodeURIComponent(itemName)}&numOfRows=20&pageNo=1&type=json`;
  const tryFetch = async (targetUrl) => {
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    if (data.header?.resultCode !== '00' && data.header?.resultCode !== '0') return null;
    let items = data.body?.items;
    if (!items) return [];
    if (!Array.isArray(items)) items = items ? [items] : [];
    return items;
  };
  try {
    return await tryFetch(url);
  } catch (e) {
    for (const toProxyUrl of CORS_PROXIES) {
      try {
        return await tryFetch(toProxyUrl(url));
      } catch (_) { continue; }
    }
    return null;
  }
}

// CORS 우회 - 직접 요청 실패 시 프록시 사용
async function fetchFDA(url) {
  const tryFetch = async (targetUrl) => {
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error(res.statusText);
    const text = await res.text();
    const data = JSON.parse(text);
    if (data.error) {
      if (data.error.message && data.error.message.includes('No matches')) return { results: [] };
      throw new Error(data.error.message || 'API 오류');
    }
    return data;
  };
  try {
    return await tryFetch(url);
  } catch (e) {
    for (const toProxyUrl of CORS_PROXIES) {
      try {
        return await tryFetch(toProxyUrl(url));
      } catch (_) { continue; }
    }
    throw e;
  }
}

// DOM
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('.nav-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const viewDetail = document.getElementById('viewDetail');
const detailContent = document.getElementById('detailContent');
const backBtn = document.getElementById('backBtn');
let currentDetailDrug = null; // { source, data } - 복약 안내문 생성용

// Navigation
navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const viewName = btn.dataset.view;
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    views.forEach(v => {
      v.classList.remove('active');
      v.classList.add('hidden');
      if (v.id === `view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`) {
        v.classList.add('active');
        v.classList.remove('hidden');
      }
    });
  });
});

// 한글 → 영문 변환
function toSearchTerms(query) {
  const q = query.trim().replace(/"/g, '').toLowerCase();
  const mapped = KOREAN_TO_ENGLISH[q];
  if (mapped) return mapped.split(/\s+/);
  return [q];
}

// 검색어 확장 (타이레놀 → acetaminophen, Tylenol 등)
function getExpandedSearchTerms(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [query];
  if (typeof SEARCH_TERM_ALIASES !== 'undefined') {
    const aliases = SEARCH_TERM_ALIASES[q] || SEARCH_TERM_ALIASES[query.trim()];
    if (aliases) return [...new Set([q, ...aliases.map(a => (a + '').toLowerCase())])];
  }
  const mapped = KOREAN_TO_ENGLISH[q];
  if (mapped) return [q, ...mapped.split(/\s+/)];
  return [q];
}

// 검색어와 품목명 매칭 점수 (높을수록 정확한 일치)
function getRelevanceScore(d, query) {
  const q = (query || '').trim().toLowerCase();
  const name = (d.name || '').trim().toLowerCase();
  const nameEn = (d.nameEn || '').toLowerCase();
  const ingredient = (d.ingredient || '').toLowerCase();
  const company = (d.company || '').toLowerCase();
  const category = (d.category || '').toLowerCase();
  const efcy = (d.efcyQesitm || '').toLowerCase();
  if (!q || !name) return 0;
  // 품목명 정확 일치 > 품목명 시작 일치 > 품목명 포함 > 영문명/성분/업체/분류/효능
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (nameEn === q) return 50;
  if (nameEn.startsWith(q) || nameEn.includes(q)) return 40;
  if (ingredient.includes(q)) return 30;
  if (company.includes(q) || category.includes(q)) return 20;
  if (efcy.includes(q)) return 15;
  return 10;
}

// 한국 의약품 로컬 검색 - 원본 검색어 매칭 우선, 확장 검색어는 보조
function searchKoreanDrugs(query) {
  if (!KOREAN_DRUG_DATABASE) return [];
  const qOriginal = (query || '').trim().toLowerCase();
  const terms = getExpandedSearchTerms(query);
  const seen = new Map();
  const matchedByOriginal = new Set(); // 원본 검색어로 매칭된 항목

  // 1단계: 원본 검색어로만 검색 (품목명/분류/주성분/효능)
  if (qOriginal) {
    KOREAN_DRUG_DATABASE.forEach(d => {
      const name = (d.name || '').toLowerCase();
      const nameEn = (d.nameEn || '').toLowerCase();
      const company = (d.company || '').toLowerCase();
      const ingredient = (d.ingredient || '').toLowerCase();
      const category = (d.category || '').toLowerCase();
      const efcy = (d.efcyQesitm || '').toLowerCase();
      const match = name.includes(qOriginal) || nameEn.includes(qOriginal) ||
        company.includes(qOriginal) || ingredient.includes(qOriginal) || category.includes(qOriginal) || efcy.includes(qOriginal);
      if (match) {
        const key = (d.name || '') + '|' + (d.company || '');
        if (!seen.has(key)) {
          seen.set(key, d);
          matchedByOriginal.add(key);
        }
      }
    });
  }

  // 2단계: 확장 검색어로 추가 검색 (acetaminophen 등 - 원본으로 매칭 안 된 것만)
  for (const t of terms) {
    if (!t || t.length < 1) continue;
    const ql = (t + '').toLowerCase();
    KOREAN_DRUG_DATABASE.forEach(d => {
      const key = (d.name || '') + '|' + (d.company || '');
      if (matchedByOriginal.has(key)) return; // 이미 원본으로 매칭됨 → 스킵
      const name = (d.name || '').toLowerCase();
      const nameEn = (d.nameEn || '').toLowerCase();
      const company = (d.company || '').toLowerCase();
      const ingredient = (d.ingredient || '').toLowerCase();
      const category = (d.category || '').toLowerCase();
      const efcy = (d.efcyQesitm || '').toLowerCase();
      const match = name.includes(ql) || nameEn.includes(ql) || company.includes(ql) ||
        ingredient.includes(ql) || category.includes(ql) || efcy.includes(ql);
      if (match && !seen.has(key)) seen.set(key, d);
    });
  }

  const list = Array.from(seen.values());
  list.sort((a, b) => {
    const keyA = (a.name || '') + '|' + (a.company || '');
    const keyB = (b.name || '') + '|' + (b.company || '');
    const origA = matchedByOriginal.has(keyA) ? 1 : 0;
    const origB = matchedByOriginal.has(keyB) ? 1 : 0;
    if (origA !== origB) return origB - origA; // 원본 매칭 우선
    return getRelevanceScore(b, qOriginal) - getRelevanceScore(a, qOriginal);
  });
  return list.slice(0, 30);
}

// 품목명 정확 일치 시 PILL_DATABASE 결과를 최상단에 추가 (타이레놀 등)
function prependPriorityPillMatches(results, query) {
  if (typeof PILL_DATABASE === 'undefined') return results;
  const ql = (query || '').trim().toLowerCase();
  if (!ql) return results;
  // 검색어에 해당하는 품목명 목록 (타이레놀, tylenol, acetaminophen → 타이레놀)
  const drugNamesToPrepend = new Set();
  drugNamesToPrepend.add(ql);
  if (typeof SEARCH_TERM_ALIASES !== 'undefined') {
    const aliases = SEARCH_TERM_ALIASES[ql] || SEARCH_TERM_ALIASES[query?.trim()];
    if (aliases) aliases.forEach(a => drugNamesToPrepend.add((a + '').toLowerCase()));
  }
  const pillMatches = PILL_DATABASE.filter(p => drugNamesToPrepend.has((p.name || '').toLowerCase()));
  if (pillMatches.length === 0) return results;
  const existingNames = new Set(results.map(r => ((r.data && r.data.name) || '').toLowerCase()));
  const toPrepend = [];
  for (const p of pillMatches) {
    const pName = (p.name || '').toLowerCase();
    if (!existingNames.has(pName)) {
      toPrepend.push({ source: 'korean', data: { name: p.name, ingredient: p.ingredient, category: p.strength ? `[알약] ${p.strength}` : '[알약]' } });
      existingNames.add(pName);
    }
  }
  return toPrepend.concat(results);
}

// Search - e약은요 API(키 있을 때) → 로컬 DB → OpenFDA 순으로 검색
async function searchDrugs(query) {
  if (!query.trim()) return;
  searchResults.innerHTML = '<div class="loading">검색 중...</div>';
  const q = query.trim();

  // 1) e약은요 API (config.js에 API 키 설정 시)
  const apiKey = (typeof DATA_GO_KR_API_KEY !== 'undefined' && DATA_GO_KR_API_KEY) ? DATA_GO_KR_API_KEY.trim() : '';
  if (apiKey) {
    try {
      const eyakItems = await fetchEyakApi(q);
      if (eyakItems && eyakItems.length > 0) {
        const scored = eyakItems.map(d => ({
          source: 'eyak',
          data: d,
          score: (d.itemName || '').toLowerCase() === q.toLowerCase() ? 100 :
            (d.itemName || '').toLowerCase().startsWith(q.toLowerCase()) ? 80 :
            (d.itemName || '').toLowerCase().includes(q.toLowerCase()) ? 60 : 40
        }));
        scored.sort((a, b) => b.score - a.score);
        let eyakResults = scored.map(x => ({ source: x.source, data: x.data }));
        eyakResults = prependPriorityPillMatches(eyakResults, q);
        renderSearchResults(eyakResults);
        return;
      }
    } catch (_) { /* fallback */ }
  }

  // 2) 로컬 한국 의약품 DB + PILL_DATABASE (품목명 정확 일치 시 알약 DB 최상단)
  if (typeof KOREAN_DRUG_DATABASE !== 'undefined') {
    const koreanResults = searchKoreanDrugs(q);
    let finalResults = koreanResults.map(d => ({ source: 'korean', data: d }));
    finalResults = prependPriorityPillMatches(finalResults, q);
    if (finalResults.length > 0) {
      renderSearchResults(finalResults);
      return;
    }
  }

  // 3) OpenFDA API (영문 검색)
  const terms = toSearchTerms(q);
  let results = [];
  for (const term of terms) {
    try {
      const url = `${FDA_API}?search=${encodeURIComponent(term)}&limit=20`;
      const data = await fetchFDA(url);
      results = Array.isArray(data.results) ? data.results : [];
      if (results.length > 0) break;
    } catch (_) { continue; }
  }
  try {
    if (results.length === 0) {
      searchResults.innerHTML = '<p class="error">검색 결과가 없습니다. 다른 검색어로 시도해 보세요 (예: 타이레놀, 게보린, 판콜, tylenol)</p>';
      return;
    }
    let fdaResults = results.map(d => ({ source: 'fda', data: d }));
    fdaResults = prependPriorityPillMatches(fdaResults, q);
    renderSearchResults(fdaResults);
  } catch (err) {
    searchResults.innerHTML = `<p class="error">검색 실패: ${err.message}</p>`;
  }
}

function renderSearchResults(results) {
  searchResults.innerHTML = results.map((item, i) => {
    if (item.source === 'eyak') {
      const d = item.data;
      const name = d.itemName || '-';
      const efcy = addSpacing((d.efcyQesitm || '').substring(0, 100));
      return `
        <div class="drug-card" data-id="${i}" data-source="eyak">
          <h3>${name}</h3>
          <p>${d.entpName || ''}</p>
          ${efcy ? `<p class="drug-desc">${efcy}${(d.efcyQesitm || '').length > 100 ? '...' : ''}</p>` : ''}
        </div>
      `;
    }
    if (item.source === 'korean') {
      const d = item.data;
      const name = d.name || '-';
      const ingredient = addSpacing((d.ingredient || '-').substring(0, 80));
      const category = d.category || '';
      return `
        <div class="drug-card" data-id="${i}" data-source="korean">
          <h3>${name}</h3>
          <p>성분: ${ingredient}${(d.ingredient || '').length > 80 ? '...' : ''}</p>
          ${category ? `<p class="drug-category">${addSpacing(category)}</p>` : ''}
        </div>
      `;
    }
    const drug = item.data;
    const brand = drug.openfda?.brand_name?.[0] || '-';
    const generic = drug.openfda?.generic_name?.[0] || '-';
    const purpose = drug.purpose?.[0]?.substring(0, 80) || drug.indications_and_usage?.[0]?.substring(0, 80) || '';
    return `
      <div class="drug-card" data-id="${i}" data-source="fda">
        <h3>${brand}</h3>
        <p>성분: ${generic}</p>
        ${purpose ? `<p>${purpose}...</p>` : ''}
      </div>
    `;
  }).join('');
  document.querySelectorAll('.drug-card').forEach(card => {
    card.addEventListener('click', () => {
      const item = results[parseInt(card.dataset.id)];
      showDetail(item.source, item.data);
    });
  });
}

function addToMyMedications(name) {
  if (!name || !name.trim()) return;
  if (!myMedications.includes(name.trim())) {
    myMedications.push(name.trim());
    saveMedications();
  }
}

function showDetail(source, drug) {
  currentDetailDrug = { source, data: drug };
  const drugName = source === 'eyak' ? (drug.itemName || '') : source === 'korean' ? (drug.name || '') : (drug.openfda?.brand_name?.[0] || drug.openfda?.generic_name?.[0] || '');
  const addToMedBtn = drugName ? `<button class="btn btn-primary add-to-med-btn" data-name="${(drugName + '').replace(/"/g, '&quot;')}">💊 내 복용약에 저장</button>` : '';
  const medGuideBtn = `<button class="btn btn-secondary add-to-med-btn med-guide-btn" type="button">📋 복약 안내문</button>`;

  if (source === 'eyak') {
    const d = drug;
    const imgHtml = d.itemImage ? `<img src="${d.itemImage}" alt="${d.itemName}" class="drug-image" onerror="this.style.display='none'">` : '';
    const sections = [
      { title: '효능·효과', data: d.efcyQesitm },
      { title: '사용법', data: d.useMethodQesitm },
      { title: '주의사항 (경고)', data: d.atpnWarnQesitm },
      { title: '주의사항', data: d.atpnQesitm },
      { title: '약물·음식 상호작용', data: d.intrcQesitm },
      { title: '부작용', data: d.seQesitm },
      { title: '보관법', data: d.depositMethodQesitm },
    ].filter(s => s.data && s.data.trim());
    detailContent.innerHTML = `
      <div class="detail-section">
        <div class="detail-actions">${addToMedBtn}${medGuideBtn}</div>
        ${imgHtml}
        <h3>기본 정보</h3>
        <p><strong>제품명:</strong> ${d.itemName || '-'}</p>
        <p><strong>업체명:</strong> ${d.entpName || '-'}</p>
        ${d.itemSeq ? `<p><strong>품목기준코드:</strong> ${d.itemSeq}</p>` : ''}
      </div>
      ${sections.map(s => `
        <div class="detail-section">
          <h3>${s.title}</h3>
          <p>${addSpacing(s.data).replace(/\n/g, '<br>')}</p>
        </div>
      `).join('')}
      <p class="detail-source">출처: 식품의약품안전처 의약품개요정보(e약은요)</p>
    `;
  } else if (source === 'korean') {
    const d = drug;
    const imgHtml = d.image ? `<img src="${d.image}" alt="${d.name}" class="drug-image" onerror="this.style.display='none'">` : '';
    let ext = d.efcyQesitm || d.useMethodQesitm || d.atpnQesitm || d.intrcQesitm || d.seQesitm || d.depositMethodQesitm ? d : null;
    if (!ext && typeof DRUG_EXTENDED_INFO !== 'undefined') {
      const extInfo = DRUG_EXTENDED_INFO[d.name] || DRUG_EXTENDED_INFO[d.ingredient];
      if (extInfo) ext = { ...d, ...extInfo };
    }
    const hasExtended = ext && (ext.efcyQesitm || ext.useMethodQesitm || ext.atpnQesitm || ext.intrcQesitm || ext.seQesitm || ext.depositMethodQesitm);
    if (hasExtended) {
      const sections = [
        { title: '효능·효과', data: ext.efcyQesitm },
        { title: '사용법', data: ext.useMethodQesitm },
        { title: '주의사항 (경고)', data: ext.atpnWarnQesitm },
        { title: '주의사항', data: ext.atpnQesitm },
        { title: '약물·음식 상호작용', data: ext.intrcQesitm },
        { title: '부작용', data: ext.seQesitm },
        { title: '보관법', data: ext.depositMethodQesitm },
      ].filter(s => s.data && s.data.trim());
      detailContent.innerHTML = `
        <div class="detail-section">
          <div class="detail-actions">${addToMedBtn}${medGuideBtn}</div>
          ${imgHtml}
          <h3>기본 정보</h3>
          <p><strong>제품명:</strong> ${d.name || '-'}</p>
          ${d.nameEn ? `<p><strong>품목 영문명:</strong> ${d.nameEn}</p>` : ''}
          <p><strong>업체명:</strong> ${d.company || '-'}</p>
          <p><strong>전문/일반:</strong> ${d.type || '-'}</p>
          <p><strong>주성분:</strong> ${addSpacing((d.ingredient || '-').replace(/\|/g, ' / '))}</p>
          ${d.category ? `<p><strong>분류:</strong> ${addSpacing(d.category)}</p>` : ''}
        </div>
        ${sections.map(s => `
          <div class="detail-section">
            <h3>${s.title}</h3>
            <p>${addSpacing(s.data).replace(/\n/g, '<br>')}</p>
          </div>
        `).join('')}
        <p class="detail-source">출처: ${ext === d ? '식품의약품안전처 의약품개요정보(e약은요) merged' : '식품의약품안전처 의약품통합정보시스템(의약품안전나라)'}</p>
      `;
    } else {
      detailContent.innerHTML = `
        <div class="detail-section">
          <div class="detail-actions">${addToMedBtn}${medGuideBtn}</div>
          ${imgHtml}
          <h3>기본 정보</h3>
          <p><strong>품목명:</strong> ${d.name || '-'}</p>
          ${d.nameEn ? `<p><strong>품목 영문명:</strong> ${d.nameEn}</p>` : ''}
          <p><strong>업체명:</strong> ${d.company || '-'}</p>
          <p><strong>전문/일반:</strong> ${d.type || '-'}</p>
        </div>
        <div class="detail-section">
          <h3>주성분</h3>
          <p>${addSpacing((d.ingredient || '정보 없음').replace(/\//g, ' / '))}</p>
        </div>
        ${d.category ? `
        <div class="detail-section">
          <h3>분류</h3>
          <p>${addSpacing(d.category)}</p>
        </div>
        ` : ''}
        <p class="detail-source">출처: 식품의약품안전처 의약품통합정보시스템</p>
      `;
    }
  } else {
    const brand = drug.openfda?.brand_name?.[0] || '알 수 없음';
    const generic = drug.openfda?.generic_name?.[0] || '-';
    const sections = [
      { title: '효능·효과', data: drug.indications_and_usage?.[0] || drug.purpose?.[0] || '정보 없음' },
      { title: '용법·용량', data: drug.dosage_and_administration?.[0] || drug.dosage_and_administration?.[0] || '정보 없음' },
      { title: '주의사항', data: drug.warnings?.[0] || drug.precautions?.[0] || '정보 없음' },
      { title: '부작용', data: drug.adverse_reactions?.[0] || '정보 없음' },
      { title: '금기', data: drug.contraindications?.[0] || '정보 없음' },
      { title: '약물 상호작용', data: drug.drug_interactions?.[0] || '정보 없음' },
      { title: '임신·수유', data: drug.pregnancy_or_breast_feeding?.[0] || '정보 없음' },
    ];
    detailContent.innerHTML = `
      <div class="detail-section">
        <div class="detail-actions">${addToMedBtn}${medGuideBtn}</div>
        <h3>기본 정보</h3>
        <p><strong>상품명:</strong> ${brand}</p>
        <p><strong>성분명:</strong> ${generic}</p>
      </div>
      ${sections.map(s => `
        <div class="detail-section">
          <h3>${s.title}</h3>
          <p>${s.data.substring(0, 1500)}${s.data.length > 1500 ? '...' : ''}</p>
        </div>
      `).join('')}
    `;
  }
  detailContent.querySelectorAll('.add-to-med-btn').forEach(btn => {
    if (btn.dataset.name) {
      btn.addEventListener('click', () => {
        addToMyMedications(btn.dataset.name);
        btn.textContent = '✓ 저장됨';
        btn.disabled = true;
      });
    }
  });
  detailContent.querySelectorAll('.med-guide-btn').forEach(btn => {
    btn.addEventListener('click', showMedicationGuide);
  });
  document.getElementById('viewSearch').classList.remove('active');
  document.getElementById('viewSearch').classList.add('hidden');
  viewDetail.classList.add('active');
  viewDetail.classList.remove('hidden');
}

backBtn.addEventListener('click', () => {
  viewDetail.classList.remove('active');
  viewDetail.classList.add('hidden');
  document.getElementById('viewSearch').classList.add('active');
  document.getElementById('viewSearch').classList.remove('hidden');
});

// 복약 안내문 모달
const medGuideOverlay = document.getElementById('medGuideOverlay');
const medGuidePrintBtn = document.getElementById('medGuidePrintBtn');
const medGuideCloseBtn = document.getElementById('medGuideCloseBtn');
if (medGuideOverlay) {
  medGuideOverlay.addEventListener('click', (e) => { if (e.target === medGuideOverlay) hideMedicationGuide(); });
}
if (medGuideCloseBtn) medGuideCloseBtn.addEventListener('click', hideMedicationGuide);
if (medGuidePrintBtn) medGuidePrintBtn.addEventListener('click', printMedicationGuide);

// 최근 검색어 저장 (최대 10개)
const RECENT_SEARCHES_KEY = 'medicine_recent_searches';
function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch (_) { return []; }
}
function saveRecentSearch(term) {
  if (!term || !term.trim()) return;
  const recent = getRecentSearches().filter(t => t !== term);
  recent.unshift(term.trim());
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, 10)));
}

// 인기 검색어 (DB에서 자주 검색되는 품목 샘플)
const POPULAR_TERMS = ['타이레놀', '게보린', '판콜', '아스피린', '이부프로펜', '오메가3', '비타민D', '우루사', '뮤코팜'];

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (q) { saveRecentSearch(q); searchDrugs(q); }
});
searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const q = searchInput.value.trim();
    if (q) { saveRecentSearch(q); searchDrugs(q); }
  }
});

// 한글 초성 (ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ)
const CHOSUNG = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
function getChosung(ch) {
  const c = ch.charCodeAt(0);
  if (c >= 0xAC00 && c <= 0xD7A3) return CHOSUNG[Math.floor((c - 0xAC00) / 588)];
  if (CHOSUNG.includes(ch)) return ch;
  return null;
}
function chosungMatch(str, query) {
  if (!str || !query) return false;
  const q = query.trim();
  if (!CHOSUNG.includes(q[0])) return false;
  const strChosung = str.split('').map(c => getChosung(c)).filter(Boolean).join('');
  return strChosung.indexOf(q) === 0 || strChosung.includes(q);
}

function getDrugSuggestions(query) {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const qChosung = q.length === 1 && CHOSUNG.includes(q);
  const sources = [];
  if (typeof PILL_DATABASE !== 'undefined') {
    PILL_DATABASE.forEach(p => sources.push({ name: p.name, ingredient: p.ingredient }));
  }
  POPULAR_TERMS.forEach(t => sources.push({ name: t }));
  if (typeof KOREAN_DRUG_DATABASE !== 'undefined') {
    KOREAN_DRUG_DATABASE.forEach(d => sources.push({ name: d.name, nameEn: d.nameEn, ingredient: d.ingredient, efcyQesitm: d.efcyQesitm }));
  }
  const matches = [];
  const seen = new Set();
  for (const s of sources) {
    const name = (s.name || '').toLowerCase();
    const nameEn = (s.nameEn || '').toLowerCase();
    const ingredient = (s.ingredient || '').toLowerCase();
    const efcy = (s.efcyQesitm || '').toLowerCase();
    const match = name.includes(q) || nameEn.includes(q) || ingredient.includes(q) || efcy.includes(q) ||
      chosungMatch(name, q) || (qChosung && getChosung(name[0]) === q);
    if (match && name && !seen.has(name)) {
      seen.add(name);
      let score = name === q ? 100 : name.startsWith(q) ? 80 : name.includes(q) ? 60 : chosungMatch(name, q) ? 50 : 40;
      if (POPULAR_TERMS.includes(s.name)) score += 15;
      matches.push({ name: s.name, score });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 8).map(m => ({ name: m.name }));
}

// 검색어 추천 (자동완성 - 초성/부분일치, 정확·시작일치 우선)
function initAutocomplete() {
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (!searchSuggestions) return;
  let suggestTimeout = null;

  searchSuggestions.classList.remove('visible');
  searchSuggestions.innerHTML = '';

  function getQuickTerms() {
    const recent = getRecentSearches();
    const combined = [...recent];
    POPULAR_TERMS.forEach(t => { if (!combined.includes(t)) combined.push(t); });
    return combined.slice(0, 10);
  }

  function showSuggestions(items, isQuickTerms = false) {
    if (!items.length) {
      searchSuggestions.classList.remove('visible');
      searchSuggestions.innerHTML = '';
      return;
    }
    // 빈 입력 시 추천 검색어(인기/최근) 절대 표시 안 함
    if (isQuickTerms && !searchInput.value.trim()) {
      searchSuggestions.classList.remove('visible');
      searchSuggestions.innerHTML = '';
      return;
    }
    if (isQuickTerms) {
      searchSuggestions.innerHTML = '<div class="suggestion-header">추천 검색어</div>' + items.map(term => `
        <div class="suggestion-item suggestion-quick" data-name="${(term || '').replace(/"/g, '&quot;')}">${term || '-'}</div>
      `).join('');
    } else {
      searchSuggestions.innerHTML = items.map(d => `
        <div class="suggestion-item" data-name="${(d.name || '').replace(/"/g, '&quot;')}">${d.name || '-'}</div>
      `).join('');
    }
    searchSuggestions.classList.add('visible');
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const term = el.dataset.name;
        if (!term) return;
        searchInput.value = term;
        searchSuggestions.classList.remove('visible');
        searchSuggestions.innerHTML = '';
        saveRecentSearch(term);
        searchDrugs(term);
      });
    });
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(suggestTimeout);
    const q = searchInput.value.trim();
    if (!q) {
      searchSuggestions.classList.remove('visible');
      searchSuggestions.innerHTML = '';
      return;
    }
    suggestTimeout = setTimeout(() => showSuggestions(getDrugSuggestions(q)), 120);
  });

  searchInput.addEventListener('focus', () => {
    const q = searchInput.value.trim();
    if (q) {
      showSuggestions(getDrugSuggestions(q));
    } else {
      searchSuggestions.classList.remove('visible');
      searchSuggestions.innerHTML = '';
    }
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => searchSuggestions.classList.remove('visible'), 200);
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchSuggestions.classList.remove('visible');
      searchInput.blur();
    }
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAutocomplete);
} else {
  initAutocomplete();
}

// Interaction Checker
const interactionDrugInput = document.getElementById('interactionDrugInput');
const addDrugBtn = document.getElementById('addDrugBtn');
const interactionDrugList = document.getElementById('interactionDrugList');
const checkInteractionBtn = document.getElementById('checkInteractionBtn');
const interactionResult = document.getElementById('interactionResult');

let interactionDrugs = [];

addDrugBtn.addEventListener('click', () => {
  const name = interactionDrugInput.value.trim();
  if (name && !interactionDrugs.includes(name)) {
    interactionDrugs.push(name);
    renderInteractionList();
    interactionDrugInput.value = '';
  }
});

// 상호작용 검사 - 의약품 입력 자동완성
function initInteractionAutocomplete() {
  const interactionSuggestions = document.getElementById('interactionSuggestions');
  if (!interactionSuggestions || !interactionDrugInput) return;
  let interactionSuggestTimeout = null;
  interactionSuggestions.classList.remove('visible');
  interactionSuggestions.innerHTML = '';

  function showInteractionSuggestions(items) {
    if (!items.length) {
      interactionSuggestions.classList.remove('visible');
      interactionSuggestions.innerHTML = '';
      return;
    }
    interactionSuggestions.innerHTML = items.map(d => `
      <div class="suggestion-item" data-name="${(d.name || '').replace(/"/g, '&quot;')}">${d.name || '-'}</div>
    `).join('');
    interactionSuggestions.classList.add('visible');
    interactionSuggestions.querySelectorAll('.suggestion-item').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const term = el.dataset.name;
        if (!term) return;
        interactionSuggestions.classList.remove('visible');
        interactionSuggestions.innerHTML = '';
        if (!interactionDrugs.includes(term)) {
          interactionDrugs.push(term);
          renderInteractionList();
        }
        interactionDrugInput.value = '';
      });
    });
  }

  interactionDrugInput.addEventListener('input', () => {
    clearTimeout(interactionSuggestTimeout);
    const q = interactionDrugInput.value.trim();
    if (!q) {
      interactionSuggestions.classList.remove('visible');
      interactionSuggestions.innerHTML = '';
      return;
    }
    interactionSuggestTimeout = setTimeout(() => showInteractionSuggestions(getDrugSuggestions(q)), 120);
  });
  interactionDrugInput.addEventListener('focus', () => {
    const q = interactionDrugInput.value.trim();
    if (q) showInteractionSuggestions(getDrugSuggestions(q));
    else {
      interactionSuggestions.classList.remove('visible');
      interactionSuggestions.innerHTML = '';
    }
  });
  interactionDrugInput.addEventListener('blur', () => {
    setTimeout(() => interactionSuggestions.classList.remove('visible'), 200);
  });
  interactionDrugInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const name = interactionDrugInput.value.trim();
      if (name && !interactionDrugs.includes(name)) {
        interactionDrugs.push(name);
        renderInteractionList();
        interactionDrugInput.value = '';
        interactionSuggestions.classList.remove('visible');
      }
    } else if (e.key === 'Escape') {
      interactionSuggestions.classList.remove('visible');
      interactionDrugInput.blur();
    }
  });
}
initInteractionAutocomplete();

function renderInteractionList() {
  interactionDrugList.innerHTML = interactionDrugs.map((d, i) => `
    <span class="drug-tag">${d} <button data-i="${i}">×</button></span>
  `).join('');
  interactionDrugList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      interactionDrugs.splice(parseInt(btn.dataset.i), 1);
      renderInteractionList();
    });
  });
}

function normalizeDrugName(name) {
  return name.toLowerCase().replace(/\s/g, '');
}

checkInteractionBtn.addEventListener('click', () => {
  if (interactionDrugs.length < 2) {
    interactionResult.innerHTML = '<p class="warning">2개 이상의 약을 추가해 주세요.</p>';
    return;
  }
  const found = [];
  for (let i = 0; i < interactionDrugs.length; i++) {
    for (let j = i + 1; j < interactionDrugs.length; j++) {
      const d1 = normalizeDrugName(interactionDrugs[i]);
      const d2 = normalizeDrugName(interactionDrugs[j]);
      for (const [drug, interactions] of Object.entries(INTERACTION_DATABASE)) {
        const drugNorm = normalizeDrugName(drug);
        const match1 = drugNorm.includes(d1) || d1.includes(drugNorm);
        const match2 = interactions.some(int => {
          const intNorm = normalizeDrugName(int);
          return intNorm.includes(d2) || d2.includes(intNorm);
        });
        if (match1 && match2) found.push(`${interactionDrugs[i]} ↔ ${interactionDrugs[j]}: 상호작용 가능`);
      }
    }
  }
  if (found.length > 0) {
    interactionResult.innerHTML = '<p class="danger"><strong>⚠️ 상호작용 주의:</strong></p>' + [...new Set(found)].map(f => `<p>• ${f}</p>`).join('');
  } else {
    interactionResult.innerHTML = '<p class="success">등록된 데이터에서 알려진 상호작용이 없습니다. 전문가 상담을 권장합니다.</p>';
  }
});

// Pill Identifier
const pillShape = document.getElementById('pillShape');
const pillColor = document.getElementById('pillColor');
const pillImprint = document.getElementById('pillImprint');
const identifyPillBtn = document.getElementById('identifyPillBtn');
const pillResults = document.getElementById('pillResults');

identifyPillBtn.addEventListener('click', () => {
  const shape = pillShape.value;
  const color = pillColor.value;
  const imprint = pillImprint.value.trim().toUpperCase();
  if (!shape && !color && !imprint) {
    pillResults.innerHTML = '<p class="warning">모양, 색상, 각인 중 하나 이상을 선택해 주세요.</p>';
    return;
  }
  const matches = PILL_DATABASE.filter(p => {
    const shapeMatch = !shape || p.shape === shape;
    const colorMatch = !color || p.color === color;
    const imprintMatch = !imprint || p.imprint.toUpperCase() === imprint;
    return shapeMatch && colorMatch && imprintMatch;
  });
  const shapeLabels = { round: '원형', oval: '타원형', capsule: '캡슐형', rectangle: '사각형', diamond: '다이아몬드', hexagon: '육각형', octagon: '팔각형', triangle: '삼각형' };
  const colorLabels = { white: '흰색', yellow: '노란색', orange: '주황색', red: '빨간색', pink: '분홍색', blue: '파란색', green: '초록색', brown: '갈색', gray: '회색' };
  if (matches.length === 0) {
    pillResults.innerHTML = '<p class="warning">검색 조건에 맞는 알약이 없습니다. 조건을 완화하거나 다른 각인을 입력해 보세요.</p>';
    return;
  }
  pillResults.innerHTML = matches.map(p => `
    <div class="drug-card pill-card">
      <h3>${p.name}</h3>
      <p>성분: ${p.ingredient} | ${p.strength}</p>
      <p class="pill-meta">모양: ${shapeLabels[p.shape] || p.shape} / 색: ${colorLabels[p.color] || p.color} / 각인: ${p.imprint}</p>
    </div>
  `).join('');
});

// My Medications
const medicationInput = document.getElementById('medicationInput');
const addMedicationBtn = document.getElementById('addMedicationBtn');
const medicationList = document.getElementById('medicationList');
const checkAllergyBtn = document.getElementById('checkAllergyBtn');
const checkMyInteractionsBtn = document.getElementById('checkMyInteractionsBtn');

let myMedications = JSON.parse(localStorage.getItem('myMedications') || '[]');

function saveMedications() {
  localStorage.setItem('myMedications', JSON.stringify(myMedications));
  renderMedicationList();
}

function renderMedicationList() {
  medicationList.innerHTML = myMedications.map((m, i) => `
    <span class="med-tag">${m} <button data-i="${i}">×</button></span>
  `).join('');
  medicationList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      myMedications.splice(parseInt(btn.dataset.i), 1);
      saveMedications();
    });
  });
}

addMedicationBtn.addEventListener('click', () => {
  const name = medicationInput.value.trim();
  if (name && !myMedications.includes(name)) {
    myMedications.push(name);
    saveMedications();
    medicationInput.value = '';
  }
});

// 내 복용약 입력 자동완성
function initMedicationAutocomplete() {
  const medicationSuggestions = document.getElementById('medicationSuggestions');
  if (!medicationSuggestions || !medicationInput) return;
  let medSuggestTimeout = null;
  medicationSuggestions.classList.remove('visible');
  medicationSuggestions.innerHTML = '';

  function showMedSuggestions(items) {
    if (!items.length) {
      medicationSuggestions.classList.remove('visible');
      medicationSuggestions.innerHTML = '';
      return;
    }
    medicationSuggestions.innerHTML = items.map(d => `
      <div class="suggestion-item" data-name="${(d.name || '').replace(/"/g, '&quot;')}">${d.name || '-'}</div>
    `).join('');
    medicationSuggestions.classList.add('visible');
    medicationSuggestions.querySelectorAll('.suggestion-item').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const term = el.dataset.name;
        if (!term) return;
        medicationSuggestions.classList.remove('visible');
        medicationSuggestions.innerHTML = '';
        if (!myMedications.includes(term)) {
          myMedications.push(term);
          saveMedications();
        }
        medicationInput.value = '';
      });
    });
  }

  medicationInput.addEventListener('input', () => {
    clearTimeout(medSuggestTimeout);
    const q = medicationInput.value.trim();
    if (!q) {
      medicationSuggestions.classList.remove('visible');
      medicationSuggestions.innerHTML = '';
      return;
    }
    medSuggestTimeout = setTimeout(() => showMedSuggestions(getDrugSuggestions(q)), 120);
  });
  medicationInput.addEventListener('focus', () => {
    const q = medicationInput.value.trim();
    if (q) showMedSuggestions(getDrugSuggestions(q));
    else {
      medicationSuggestions.classList.remove('visible');
      medicationSuggestions.innerHTML = '';
    }
  });
  medicationInput.addEventListener('blur', () => {
    setTimeout(() => medicationSuggestions.classList.remove('visible'), 200);
  });
}
initMedicationAutocomplete();

checkMyInteractionsBtn.addEventListener('click', () => {
  interactionDrugs = [...myMedications];
  renderInteractionList();
  document.querySelector('[data-view="interaction"]').click();
  setTimeout(() => checkInteractionBtn.click(), 100);
});

checkAllergyBtn.addEventListener('click', () => {
  if (myMedications.length === 0) {
    alert('먼저 복용 중인 약을 추가해 주세요.');
    return;
  }
  const allergy = prompt('알레르기가 있는 성분을 입력하세요 (예: 페니실린, 아스피린):');
  if (!allergy || !allergy.trim()) return;
  const allergyKey = Object.keys(ALLERGY_INGREDIENTS).find(k => k.toLowerCase().includes(allergy.toLowerCase()) || allergy.toLowerCase().includes(k.toLowerCase()));
  const group = allergyKey ? ALLERGY_INGREDIENTS[allergyKey] : null;
  if (!group) {
    const found = myMedications.filter(m => m.toLowerCase().includes(allergy.toLowerCase()) || allergy.toLowerCase().includes(m.toLowerCase()));
    if (found.length > 0) {
      alert(`⚠️ 알레르기 주의: "${found.join(', ')}"에 "${allergy}" 성분이 포함될 수 있습니다. 의사와 상담하세요.`);
    } else {
      alert('저장된 약 목록에서 해당 알레르기 성분이 발견되지 않았습니다. 등록된 알레르기 그룹: 페니실린, 설폰아마이드, 아스피린, 세팔로스포린');
    }
    return;
  }
  const found = myMedications.filter(m => group.some(g => m.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(m.toLowerCase())));
  if (found.length > 0) {
    alert(`⚠️ 알레르기 주의: ${found.join(', ')}에 ${allergyKey} 계열 성분이 포함될 수 있습니다. 반드시 의사와 상담하세요.`);
  } else {
    alert('저장된 약 목록에서 해당 알레르기 성분이 발견되지 않았습니다.');
  }
});

renderMedicationList();
