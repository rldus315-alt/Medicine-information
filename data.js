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
