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
  if (!q || !name) return 0;
  // 품목명 정확 일치 > 품목명 시작 일치 > 품목명 포함 > 영문명/성분/업체/분류
  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (nameEn === q) return 50;
  if (nameEn.startsWith(q) || nameEn.includes(q)) return 40;
  if (ingredient.includes(q)) return 30;
  if (company.includes(q) || category.includes(q)) return 20;
  return 10;
}

// 한국 의약품 로컬 검색 - 원본 검색어 매칭 우선, 확장 검색어는 보조
function searchKoreanDrugs(query) {
  if (!KOREAN_DRUG_DATABASE) return [];
  const qOriginal = (query || '').trim().toLowerCase();
  const terms = getExpandedSearchTerms(query);
  const seen = new Map();
  const matchedByOriginal = new Set(); // 원본 검색어로 매칭된 항목

  // 1단계: 원본 검색어로만 검색 (타이레놀 → 품목명에 타이레놀 포함된 것 우선)
  if (qOriginal) {
    KOREAN_DRUG_DATABASE.forEach(d => {
      const name = (d.name || '').toLowerCase();
      const nameEn = (d.nameEn || '').toLowerCase();
      const company = (d.company || '').toLowerCase();
      const ingredient = (d.ingredient || '').toLowerCase();
      const category = (d.category || '').toLowerCase();
      const match = name.includes(qOriginal) || nameEn.includes(qOriginal) ||
        company.includes(qOriginal) || ingredient.includes(qOriginal) || category.includes(qOriginal);
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
      const match = name.includes(ql) || nameEn.includes(ql) || company.includes(ql) ||
        ingredient.includes(ql) || category.includes(ql);
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
      const efcy = (d.efcyQesitm || '').substring(0, 100);
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
      const ingredient = (d.ingredient || '-').substring(0, 80);
      const category = d.category || '';
      return `
        <div class="drug-card" data-id="${i}" data-source="korean">
          <h3>${name}</h3>
          <p>성분: ${ingredient}${(d.ingredient || '').length > 80 ? '...' : ''}</p>
          ${category ? `<p class="drug-category">${category}</p>` : ''}
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

function showDetail(source, drug) {
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
        ${imgHtml}
        <h3>기본 정보</h3>
        <p><strong>제품명:</strong> ${d.itemName || '-'}</p>
        <p><strong>업체명:</strong> ${d.entpName || '-'}</p>
        ${d.itemSeq ? `<p><strong>품목기준코드:</strong> ${d.itemSeq}</p>` : ''}
      </div>
      ${sections.map(s => `
        <div class="detail-section">
          <h3>${s.title}</h3>
          <p>${s.data.replace(/\n/g, '<br>')}</p>
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
          ${imgHtml}
          <h3>기본 정보</h3>
          <p><strong>제품명:</strong> ${d.name || '-'}</p>
          ${d.nameEn ? `<p><strong>품목 영문명:</strong> ${d.nameEn}</p>` : ''}
          <p><strong>업체명:</strong> ${d.company || '-'}</p>
          <p><strong>전문/일반:</strong> ${d.type || '-'}</p>
          <p><strong>주성분:</strong> ${(d.ingredient || '-').replace(/\|/g, ' / ')}</p>
          ${d.category ? `<p><strong>분류:</strong> ${d.category}</p>` : ''}
        </div>
        ${sections.map(s => `
          <div class="detail-section">
            <h3>${s.title}</h3>
            <p>${s.data.replace(/\n/g, '<br>')}</p>
          </div>
        `).join('')}
        <p class="detail-source">출처: ${ext === d ? '식품의약품안전처 의약품개요정보(e약은요) merged' : '식품의약품안전처 의약품통합정보시스템(의약품안전나라)'}</p>
      `;
    } else {
      detailContent.innerHTML = `
        <div class="detail-section">
          ${imgHtml}
          <h3>기본 정보</h3>
          <p><strong>품목명:</strong> ${d.name || '-'}</p>
          ${d.nameEn ? `<p><strong>품목 영문명:</strong> ${d.nameEn}</p>` : ''}
          <p><strong>업체명:</strong> ${d.company || '-'}</p>
          <p><strong>전문/일반:</strong> ${d.type || '-'}</p>
        </div>
        <div class="detail-section">
          <h3>주성분</h3>
          <p>${(d.ingredient || '정보 없음').replace(/\//g, ' / ')}</p>
        </div>
        ${d.category ? `
        <div class="detail-section">
          <h3>분류</h3>
          <p>${d.category}</p>
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

// 검색어 추천 (자동완성 - 초성/부분일치, 정확·시작일치 우선)
function initAutocomplete() {
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (!searchSuggestions) return;
  let suggestTimeout = null;

  searchSuggestions.classList.remove('visible');
  searchSuggestions.innerHTML = '';

  function getSuggestions(query) {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const qChosung = q.length === 1 && CHOSUNG.includes(q);
    const sources = [];
    if (typeof PILL_DATABASE !== 'undefined') {
      PILL_DATABASE.forEach(p => sources.push({ name: p.name, ingredient: p.ingredient, fromPill: true }));
    }
    POPULAR_TERMS.forEach(t => sources.push({ name: t, fromPill: true }));
    if (typeof KOREAN_DRUG_DATABASE !== 'undefined') {
      KOREAN_DRUG_DATABASE.forEach(d => sources.push({ name: d.name, nameEn: d.nameEn, ingredient: d.ingredient, fromPill: false }));
    }
    const matches = [];
    const seen = new Set();
    for (const s of sources) {
      const name = (s.name || '').toLowerCase();
      const nameEn = (s.nameEn || '').toLowerCase();
      const ingredient = (s.ingredient || '').toLowerCase();
      const match = name.includes(q) || nameEn.includes(q) || ingredient.includes(q) ||
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
      el.addEventListener('click', () => {
        const term = el.dataset.name;
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
    suggestTimeout = setTimeout(() => showSuggestions(getSuggestions(q)), 120);
  });

  searchInput.addEventListener('focus', () => {
    const q = searchInput.value.trim();
    if (q) {
      showSuggestions(getSuggestions(q));
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
    const imprintMatch = !imprint || p.imprint.toUpperCase().includes(imprint) || imprint.includes(p.imprint.toUpperCase());
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
