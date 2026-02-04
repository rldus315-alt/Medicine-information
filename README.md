# 의약품 정보 웹사이트 (Pharma Info)

의약품 검색, 약물 상호작용 검사, 알약 식별, 내 복용약 관리 기능을 제공하는 웹 애플리케이션입니다.

## 기능

- **의약품 검색**: 한국 의약품 5,600+건 로컬 DB + e약은요 공공API + OpenFDA 연동
- **상세 정보**: 효능·효과, 사용법, 주의사항, 부작용, 상호작용, 보관법 등
- **약물 상호작용 검사**: 복용 중인 약 2개 이상 입력 시 상호작용 가능성 검사
- **알약 식별**: 모양, 색상, 각인(문자/숫자)으로 알약 검색
- **내 복용약**: 로컬 저장소에 복용 약 목록 저장, 알레르기·상호작용 검사 연동

## 실행 방법

```bash
# 정적 파일 서버로 실행 (예: Python)
cd pharma-info
python -m http.server 8080

# 또는 Node.js (npx)
npx serve .
```

브라우저에서 `http://localhost:8080` 접속

## 기술 스택

- HTML5, CSS3, Vanilla JavaScript
- 식품의약품안전처 의약품개요정보(e약은요) API (선택, config.js에 API 키 설정)
- 한국 의약품 로컬 DB (3,357건, merged_data: 효능·사용법·주의사항·부작용·보관법 포함)
- OpenFDA Drug Label API
- localStorage (내 복용약 저장)

## medicine_data.csv 적용 (데이터 갱신)

`medicine_data.csv`를 프로젝트 폴더로 복사한 뒤 변환:

```bash
node scripts/convert-csv.js medicine_data.csv
```

또는 `scripts/csv-path.txt`에 CSV 전체 경로를 한 줄로 적고 `node scripts/convert-csv.js` 실행 (한글 경로 인코딩 이슈 시).

## e약은요 API 사용 (선택사항)

공공데이터포털(https://www.data.go.kr)에서 '의약품개요정보(e약은요)' 활용신청 후 인증키를 발급받아 `config.js`의 `DATA_GO_KR_API_KEY`에 입력하면, 공식 의약품 상세정보를 실시간으로 조회할 수 있습니다. API 키 없이도 로컬 DB와 OpenFDA로 검색이 가능합니다.

## 주의사항

본 정보는 참고용이며, 의료 상담을 대체하지 않습니다. 약물 복용 관련 결정은 반드시 의사 또는 약사와 상담하세요.
