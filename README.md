# 토닥(to-DOC) | 의약품 정보 웹사이트

의약품 검색, 약물 상호작용 검사, 알약 식별, 내 복용약 관리, 근처 약국 검색, 건강정보 입력, 용어사전 등 의약품 관련 정보를 한곳에서 제공하는 웹 애플리케이션입니다.

## 기능

- **건강정보** (첫 화면): 기저 질환(당뇨·고혈압·신장·간·위장), 알레르기 이력, 임신·수유 여부 입력 → 약물 검색 시 개인 맞춤 경고 표시
- **의약품 검색**: 한국 의약품 3,357건 로컬 DB + e약은요 공공API + OpenFDA 연동
- **상세 정보**: 효능·효과, 사용법, 주의사항, 부작용, 상호작용, 보관법 등
- **복약 안내문**: 상세 화면에서 인쇄용 복약 안내문 생성 (픽토그램 포함)
- **개인 맞춤 경고**: 건강정보 기반 금기 약물 ⚠️ 주의 배지 및 상세 경고
- **약물 상호작용 검사**: 복용 중인 약 2개 이상 입력 시 상호작용 가능성 검사 (자동완성 지원)
- **알약 식별**: 모양, 색상, 각인(문자/숫자)으로 알약 검색
- **내 복용약**: 로컬 저장소에 복용 약 목록 저장(표 형식, 수정·삭제), 알레르기·상호작용 검사 연동
- **근처 약국**: E-GEN(국립중앙의료원)·대한약사회 데이터. 시·도/시·군·구 선택 또는 약국명 검색으로 약국 정보 조회 (주소, 전화번호, 영업시간). E-GEN 지도·일반검색·심야운영약국 링크 제공
- **용어사전**: 의학 용어를 쉬운 설명으로 검색·툴팁 표시

## 실행 방법

```bash
# 정적 파일 서버로 실행 (예: Python)
cd medicine_recommend
python -m http.server 8080

# 또는 Node.js (npx)
npx serve .
```

브라우저에서 `http://localhost:8080` 접속

## GitHub Pages 배포 (404 해결)

1. 저장소 **Settings** → **Pages** 이동
2. **Build and deployment** → **Source**를 **GitHub Actions**로 설정
3. `main` 브랜치에 푸시 시 자동 배포
4. 배포 후 `https://rldus315-alt.github.io/Medicine-information/` 에서 접속

## 기술 스택

- HTML5, CSS3, Vanilla JavaScript
- TOSS 스타일 UI (토스 블루 #0064FF, Pretendard 폰트)
- 식품의약품안전처 의약품개요정보(e약은요) API (선택)
- 국립중앙의료원 전국 약국정보조회 API (선택, 근처 약국 기능용)
- 한국 의약품 로컬 DB (3,357건, merged_data: 효능·사용법·주의사항·부작용·보관법 포함)
- OpenFDA Drug Label API
- localStorage (내 복용약, 건강정보 저장)

## medicine_data.csv 적용 (데이터 갱신)

`medicine_data.csv`를 프로젝트 폴더로 복사한 뒤 변환:

```bash
node scripts/convert-csv.js medicine_data.csv
```

또는 `scripts/csv-path.txt`에 CSV 전체 경로를 한 줄로 적고 `node scripts/convert-csv.js` 실행 (한글 경로 인코딩 이슈 시).

## e약은요 API 사용 (선택사항)

공공데이터포털(https://www.data.go.kr)에서 '의약품개요정보(e약은요)', '국립중앙의료원 전국 약국정보조회' 활용신청 후 인증키를 발급받아 `config.js`의 `DATA_GO_KR_API_KEY`에 입력하면, 의약품 상세정보와 근처 약국 검색을 사용할 수 있습니다. API 키 없이도 로컬 DB와 OpenFDA로 의약품 검색이 가능합니다.

## 주의사항

본 정보는 참고용이며, 의료 상담을 대체하지 않습니다. 약물 복용 관련 결정은 반드시 의사 또는 약사와 상담하세요.
