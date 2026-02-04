// 알약 식별용 데이터베이스 (모양/색상/각인)
const PILL_DATABASE = [
  { name: "타이레놀", ingredient: "아세트아미노펜", shape: "round", color: "white", imprint: "G4", strength: "500mg" },
  { name: "타이레놀", ingredient: "아세트아미노펜", shape: "oval", color: "white", imprint: "TYLENOL", strength: "650mg" },
  { name: "이부프로펜", ingredient: "이부프로펜", shape: "oval", color: "white", imprint: "IB", strength: "200mg" },
  { name: "이부프로펜", ingredient: "이부프로펜", shape: "round", color: "white", imprint: "600", strength: "600mg" },
  { name: "아스피린", ingredient: "아스피린", shape: "round", color: "white", imprint: "81", strength: "81mg" },
  { name: "아스피린", ingredient: "아스피린", shape: "round", color: "white", imprint: "BAYER", strength: "325mg" },
  { name: "오메프라졸", ingredient: "오메프라졸", shape: "capsule", color: "white", imprint: "OME", strength: "20mg" },
  { name: "오메프라졸", ingredient: "오메프라졸", shape: "capsule", color: "pink", imprint: "OME20", strength: "20mg" },
  { name: "로라타딘", ingredient: "로라타딘", shape: "round", color: "white", imprint: "10", strength: "10mg" },
  { name: "메트포르민", ingredient: "메트포르민", shape: "oval", color: "white", imprint: "500", strength: "500mg" },
  { name: "메트포르민", ingredient: "메트포르민", shape: "round", color: "white", imprint: "850", strength: "850mg" },
  { name: "리시노프릴", ingredient: "리시노프릴", shape: "round", color: "white", imprint: "LIS", strength: "10mg" },
  { name: "아토르바스타틴", ingredient: "아토르바스타틴", shape: "oval", color: "white", imprint: "ATOR", strength: "20mg" },
  { name: "오메가3", ingredient: "오메가3", shape: "capsule", color: "yellow", imprint: "OM3", strength: "1000mg" },
  { name: "비타민D", ingredient: "콜레칼시페롤", shape: "oval", color: "yellow", imprint: "D3", strength: "2000IU" },
  { name: "비타민D", ingredient: "콜레칼시페롤", shape: "capsule", color: "white", imprint: "D", strength: "5000IU" },
  { name: "아모시실린", ingredient: "아모시실린", shape: "capsule", color: "white", imprint: "AMX", strength: "500mg" },
  { name: "알프라졸람", ingredient: "알프라졸람", shape: "oval", color: "white", imprint: "0.5", strength: "0.5mg" },
  { name: "알프라졸람", ingredient: "알프라졸람", shape: "oval", color: "white", imprint: "1", strength: "1mg" },
  { name: "암로디핀", ingredient: "암로디핀", shape: "round", color: "white", imprint: "AML", strength: "5mg" },
  { name: "로사르탄", ingredient: "로사르탄", shape: "oval", color: "white", imprint: "LOS", strength: "50mg" },
  { name: "암피실린", ingredient: "암피실린", shape: "capsule", color: "white", imprint: "AMP", strength: "500mg" },
  { name: "세파렉신", ingredient: "세파렉신", shape: "capsule", color: "white", imprint: "CEF", strength: "500mg" },
  { name: "시메티딘", ingredient: "시메티딘", shape: "round", color: "white", imprint: "CIM", strength: "200mg" },
  { name: "레보플록사신", ingredient: "레보플록사신", shape: "oval", color: "white", imprint: "LEV", strength: "500mg" },
  { name: "오메가3", ingredient: "오메가3", shape: "capsule", color: "orange", imprint: "FISH", strength: "1200mg" },
  { name: "멜라토닌", ingredient: "멜라토닌", shape: "round", color: "white", imprint: "3", strength: "3mg" },
  { name: "가바펜틴", ingredient: "가바펜틴", shape: "capsule", color: "white", imprint: "GAB", strength: "300mg" },
  { name: "설파메톡사졸", ingredient: "설파메톡사졸", shape: "oval", color: "white", imprint: "SMZ", strength: "400mg" },
  { name: "나프록센", ingredient: "나프록센", shape: "oval", color: "white", imprint: "NAP", strength: "500mg" },
  { name: "클로피도그렐", ingredient: "클로피도그렐", shape: "round", color: "pink", imprint: "75", strength: "75mg" },
];

// 의약품 상세 정보 (객관적 사실 데이터, 식품의약품안전처·의약품안전나라 기준)
const DRUG_EXTENDED_INFO = {
  "타이레놀": {
    efcyQesitm: "감기로 인한 발열 및 통증, 두통, 신경통, 근육통, 생리통, 염좌통, 치통, 관절통, 류머티양 통증에 사용됩니다.",
    useMethodQesitm: "성인: 1회 0.3~1.0g을 1일 3~4회 복용, 1일 최고 4,000mg까지. 어린이: 연령별 1회 30~400mg, 1일 3~4회. 첨부문서의 용법·용량을 준수하고, 충분한 물·음식과 함께 복용하십시오.",
    atpnQesitm: "1일 최대 4,000mg 초과 금지(간손상 위험). 매일 세 잔 이상 음주 시 의사·약사 상담. 감기약·두통약 등 다른 의약품에 아세트아미노펜이 포함될 수 있으므로 중복 복용하지 마십시오.",
    seQesitm: "쇽·아나필락시양 증상, 천식발작, 혈소판 감소, 피부발진, 스티븐스-존슨증후군, 독성표피괴사용해, 구역·구토·식욕부진 등이 나타날 수 있습니다. 이상 반응 시 복용 중단 후 의사·약사 상담.",
    depositMethodQesitm: "습기와 직사광선을 피해 실온에서 보관. 어린이 손이 닿지 않는 곳에 보관."
  },
  "아세트아미노펜": {
    efcyQesitm: "감기로 인한 발열 및 통증, 두통, 신경통, 근육통, 생리통, 염좌통, 치통, 관절통, 류머티양 통증에 사용됩니다.",
    useMethodQesitm: "성인: 1회 0.3~1.0g을 1일 3~4회 복용, 1일 최고 4,000mg까지. 어린이: 연령별 1회 30~400mg, 1일 3~4회. 첨부문서의 용법·용량을 준수하고, 충분한 물·음식과 함께 복용하십시오.",
    atpnQesitm: "1일 최대 4,000mg 초과 금지(간손상 위험). 매일 세 잔 이상 음주 시 의사·약사 상담. 감기약·두통약 등 다른 의약품에 아세트아미노펜이 포함될 수 있으므로 중복 복용하지 마십시오.",
    seQesitm: "쇽·아나필락시양 증상, 천식발작, 혈소판 감소, 피부발진, 스티븐스-존슨증후군, 독성표피괴사용해, 구역·구토·식욕부진 등이 나타날 수 있습니다. 이상 반응 시 복용 중단 후 의사·약사 상담.",
    depositMethodQesitm: "습기와 직사광선을 피해 실온에서 보관. 어린이 손이 닿지 않는 곳에 보관."
  }
};

// 영문 성분명 → 상호작용 DB용 한글/영문 매핑
const INGREDIENT_TO_INTERACTION_NAMES = {
  "Ibuprofen": ["이부프로펜", "ibuprofen"],
  "Aspirin": ["아스피린", "aspirin"],
  "Naproxen": ["나프록센", "naproxen"],
  "Warfarin": ["와파린", "warfarin"],
  "Metformin": ["메트포르민", "metformin"],
  "Omeprazole": ["오메프라졸", "omeprazole"],
  "Lisinopril": ["리시노프릴", "lisinopril"],
  "Amlodipine": ["암로디핀", "amlodipine"],
  "Losartan": ["로사르탄", "losartan"],
  "Atorvastatin": ["아토르바스타틴", "atorvastatin"],
  "Clopidogrel": ["클로피도그렐", "clopidogrel"],
  "Gabapentin": ["가바펜틴", "gabapentin"],
  "Alprazolam": ["알프라졸람", "alprazolam"],
  "Levofloxacin": ["레보플록사신", "levofloxacin"],
  "Amoxicillin": ["아모시실린", "amoxicillin"],
  "Ampicillin": ["암피실린", "ampicillin"],
  "Cimetidine": ["시메티딘", "cimetidine"],
};

// 제품명 → 상호작용 검사용 성분 매핑 (성분 함유 제품)
const DRUG_INTERACTION_INGREDIENTS = {
  "게보린": ["아스피린"],
  "어드빌": ["이부프로펜"],
  "누로펜": ["이부프로펜"],
  "이브": ["이부프로펜"],
  "부루펜": ["이부프로펜"],
  "아스피린정": ["아스피린"],
  "바이에르": ["아스피린"],
  "로시피린": ["아스피린"],
};

// 약물 상호작용 데이터 (주요 상호작용 - 한글/영문)
const INTERACTION_DATABASE = {
  "warfarin": ["아스피린", "이부프로펜", "naproxen", "나프록센", "비타민K"],
  "와파린": ["아스피린", "이부프로펜", "나프록센", "비타민K"],
  "아스피린": ["이부프로펜", "warfarin", "와파린", "메트포르민", "나프록센"],
  "이부프로펜": ["아스피린", "warfarin", "와파린", "오메프라졸", "리시노프릴"],
  "메트포르민": ["알코올", "조영제", "가바펜틴"],
  "리시노프릴": ["칼륨보충제", "이부프로펜", "나프록센"],
  "아토르바스타틴": ["그레이프프루트", "에리트로마이신"],
  "오메프라졸": ["클로피도그렐", "메토트렉세이트", "암피실린"],
  "알프라졸람": ["알코올", "오피오이드", "가바펜틴"],
  "아모시실린": ["메트로니다졸", "프로베네시드"],
  "암로디핀": ["그레이프프루트", "시메티딘"],
  "로사르탄": ["칼륨보충제", "이부프로펜"],
  "레보플록사신": ["알루미늄", "마그네슘", "철분"],
  "가바펜틴": ["알코올", "오피오이드", "알프라졸람"],
  "클로피도그렐": ["아스피린", "오메프라졸", "이부프로펜"],
  "나프록센": ["아스피린", "와파린", "이부프로펜"],
};

// 검색어 확장 (동의어) - 타이레놀↔acetaminophen↔Tylenol 등 동일 의약품 검색
const SEARCH_TERM_ALIASES = {
  "타이레놀": ["타이레놀", "tylenol", "acetaminophen", "아세트아미노펜"],
  "아세트아미노펜": ["아세트아미노펜", "acetaminophen", "tylenol", "타이레놀"],
  "acetaminophen": ["acetaminophen", "tylenol", "타이레놀", "아세트아미노펜"],
  "tylenol": ["tylenol", "acetaminophen", "타이레놀", "아세트아미노펜"],
  "이부프로펜": ["이부프로펜", "ibuprofen"],
  "ibuprofen": ["ibuprofen", "이부프로펜"],
  "아스피린": ["아스피린", "aspirin", "게보린"],
  "aspirin": ["aspirin", "아스피린", "게보린"],
  "게보린": ["게보린", "aspirin", "아스피린"],
  "오메프라졸": ["오메프라졸", "omeprazole"],
  "omeprazole": ["omeprazole", "오메프라졸"],
  "나프록센": ["나프록센", "naproxen"],
  "naproxen": ["naproxen", "나프록센"],
  "메트포르민": ["메트포르민", "metformin"],
  "metformin": ["metformin", "메트포르민"],
  "로라타딘": ["로라타딘", "loratadine"],
  "loratadine": ["loratadine", "로라타딘"],
};

// 한글 → 영문 검색 매핑 (OpenFDA API용)
const KOREAN_TO_ENGLISH = {
  "타이레놀": "tylenol acetaminophen",
  "아세트아미노펜": "acetaminophen",
  "이부프로펜": "ibuprofen",
  "아스피린": "aspirin",
  "게보린": "aspirin",
  "오메프라졸": "omeprazole",
  "로사르탄": "losartan",
  "메트포르민": "metformin",
  "리시노프릴": "lisinopril",
  "아토르바스타틴": "atorvastatin",
  "로라타딘": "loratadine",
  "세티리진": "cetirizine",
  "알프라졸람": "alprazolam",
  "아졸람": "alprazolam",
  "암로디핀": "amlodipine",
  "암피실린": "ampicillin",
  "아모시실린": "amoxicillin",
  "세파렉신": "cephalexin",
  "시메티딘": "cimetidine",
  "레보플록사신": "levofloxacin",
  "가바펜틴": "gabapentin",
  "설파메톡사졸": "sulfamethoxazole",
  "나프록센": "naproxen",
  "클로피도그렐": "clopidogrel",
  "와파린": "warfarin",
  "오메가3": "omega fish oil",
  "비타민d": "vitamin d",
  "콜레칼시페롤": "cholecalciferol",
  "멜라토닌": "melatonin",
  "두통약": "acetaminophen ibuprofen",
  "해열제": "acetaminophen",
  "소염제": "ibuprofen naproxen",
  "위장약": "omeprazole",
  "고혈압약": "amlodipine losartan lisinopril",
  "당뇨약": "metformin",
  "수면제": "melatonin",
};

// 알레르기 성분 매핑
const ALLERGY_INGREDIENTS = {
  "페니실린": ["아모시실린", "암피실린", "페녹시메틸페니실린", "amoxicillin", "ampicillin"],
  "설폰아마이드": ["설파메톡사졸", "설파살라진", "sulfamethoxazole"],
  "아스피린": ["살리실산", "NSAIDs", "이부프로펜", "나프록센"],
  "세팔로스포린": ["세파렉신", "세픽심", "cefalexin", "cefixime"],
};

// 개인별 금기 알림: 기저질환/알레르기/임신 → 주의 약물 성분
const CONTRAINDICATION_RULES = {
  "당뇨": {
    drugs: ["메트포르민", "metformin", "인슐린", "insulin", "설포닐우레아"],
    message: "당뇨 환자: 조영제 사용 시 메트포르민 중단 필요. 알코올과 함께 복용 주의."
  },
  "고혈압": {
    drugs: ["이부프로펜", "ibuprofen", "나프록센", "naproxen", "아스피린", "aspirin", "케토로락"],
    message: "고혈압 환자: NSAIDs(이부프로펜, 아스피린 등) 복용 시 혈압 상승·부종 가능. 의사 상담 권장."
  },
  "신장질환": {
    drugs: ["이부프로펜", "ibuprofen", "나프록센", "naproxen", "아스피린", "aspirin", "메트포르민", "가바펜틴"],
    message: "신장 질환: NSAIDs·메트포르민 등 신장 기능에 영향 가능. 반드시 의사 상담."
  },
  "간질환": {
    drugs: ["아세트아미노펜", "acetaminophen", "타이레놀", "이부프로펜", "스타틴"],
    message: "간 질환: 해열진통제·스타틴 등 간에 부담. 용량 조절·의사 상담 필요."
  },
  "위궤양": {
    drugs: ["이부프로펜", "ibuprofen", "나프록센", "naproxen", "아스피린", "aspirin"],
    message: "위궤양/위장 질환: NSAIDs 복용 시 위장 출혈 위험. 의사 상담 필요."
  },
  "임신": {
    drugs: ["이부프로펜", "ibuprofen", "나프록센", "naproxen", "아스피린", "aspirin", "와파린", "메트로니다졸", "리바로시반"],
    message: "임신 중: 해당 약물은 태아에 영향 가능. 반드시 산부인과·의사 상담."
  },
  "수유": {
    drugs: ["이부프로펜", "와파린", "메트로니다졸", "아스피린"],
    message: "수유 중: 일부 약물이 모유로 배출될 수 있음. 의사 상담 권장."
  }
};

// 시도/시군구 (약국 검색용)
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

// 용어 사전: 의학 용어 → 쉬운 설명
const MEDICAL_TERMS_DICTIONARY = {
  "항히스타민제": "알레르기 반응을 줄이는 약. 재채기, 가려움, 콧물, 두드러기 등에 사용됩니다.",
  "길항작용": "두 약이 서로 반대 효과를 내어, 약효가 줄어들거나 없어지는 현상.",
  "NSAIDs": "비스테로이드성 소염진통제. 이부프로펜, 아스피린, 나프록센 등. 통증·염증·열을 낮춥니다.",
  "진해거담제": "기침을 멈추고 가래를 배출하게 하는 약.",
  "위장장애": "위·장에 불편함. 속쓰림, 메스꺼움, 소화불량 등.",
  "부작용": "약을 복용할 때 생길 수 있는 원하지 않는 증상.",
  "금기": "절대 복용하면 안 되는 경우.",
  "상호작용": "여러 약을 함께 복용할 때 서로 영향을 주고받는 것.",
  "과민반응": "알레르기처럼 몸이 특정 물질에 비정상적으로 반응하는 것.",
  "아나필락시": "심한 알레르기 반응. 호흡곤란, 쇼크 등 위험할 수 있음.",
  "스티븐스-존슨증후군": "심한 피부·점막 반응. 발진, 물집, 고열 등. 즉시 의료 도움 필요.",
  "독성표피괴사용해": "심한 피부 괴사. 드물지만 위험한 부작용. 즉시 의료 도움 필요.",
  "혈소판": "피가 굳는 데 필요한 혈액 성분. 부족하면 출혈 위험.",
  "조영제": "CT·MRI 등 검사 시 주입하는 약. 신장에 부담을 줄 수 있음.",
  "과민증": "특정 물질에 알레르기나 이상 반응이 있는 상태.",
  "용법": "약을 어떻게 먹어야 하는지 (횟수, 시기, 양 등).",
  "용량": "한 번에, 하루에 먹어야 하는 약의 양.",
  "투여": "약을 먹이거나 주사하는 것.",
  "복용": "약을 먹는 것.",
  "경구": "입을 통해 (먹는 것).",
  "공복": "밥 먹기 전, 빈 속.",
  "식후": "밥 먹은 후.",
  "취침": "잠들기 전.",
  "진해": "기침을 멈추게 함.",
  "거담": "가래를 배출하게 함.",
  "해열": "열을 내림.",
  "진통": "통증을 줄임.",
  "소염": "염증을 가라앉힘.",
  "건위": "소화를 돕고 위를 편하게 함.",
  "소화제": "소화를 돕는 약.",
  "진정": "신경을 안정시키고 불안을 줄임.",
  "수유부": "젖을 먹이는 엄마.",
  "임부": "임신한 여성.",
  "젖먹이": "젖을 먹는 아기.",
  "영유아": "갓난아이부터 어린 아이.",
  "전문의약품": "의사 처방이 필요한 약.",
  "일반의약품": "약국에서 직접 살 수 있는 약.",
  "처방": "의사가 약을 지정해 주는 것.",
  "첨부문서": "약 상자에 들어 있는 설명서."
};
