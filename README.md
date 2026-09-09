# 🎒 세문영 수업준비물 알림 (ClassPrep)

Google Apps Script(GAS) 및 구글 스프레드시트 기반의 학급/요일별 수업 준비물 자동 안내 웹 어플리케이션입니다.

## 📌 주요 기능
- **요일 및 시간표 연동**: `WeeklyTemplate` 시트에 등록된 요일/학급/교시 시간표 뼈대 자동 조회
- **일자별 준비물 동기화**: `DailyNotes` 시트에서 선택한 날짜의 세부 준비물 (포트폴리오, 필기도구, 디벗, 교과서, 기타) 자동 매핑
- **표시값 자동 변환**: 시트 상의 `1` 값을 화면 표시용 `O` 로 자동 변환 (`formatVal` 함수)
- **반응형 웹 UI**: 모바일 및 데스크톱 환경에 최적화된 카드 UI 및 날짜 탐색 기능 (이전/오늘/다음)

## 📁 프로젝트 구조
- `Code.gs`: Google Apps Script 백엔드 로직 (`doGet`, `getClassData`, `formatVal`)
- `index.html`: 프론트엔드 사용자 인터페이스 (HTML/CSS/JS)
- `.agents/`: Agent 실행 규칙 및 커밋/질의 스킬 정의

## 🚀 사용법 (Google Apps Script 배포)
1. 구글 스프레드시트에 확장 프로그램 > Apps Script 메뉴 생성
2. `Code.gs` 및 `index.html` 코드를 각각 반영
3. **배포** > **새 배포** > 유형: 웹 앱 (액세스 권한: 모든 사용자)으로 설정하여 URL 발급

---

## [2026-09-09 20:20] 업데이트 이력 (Commit ID: 1471034)
- **수정 내용**:
  - `.agents` 규정 및 커밋 워크플로우 적용
  - `index.html` 프론트엔드 UI 복구 및 반응형 웹 디자인 개선 (날짜 피커, 준비물 카드 grid, 배지 상태 표시)
  - Git 저장소 초기화 및 Remote URL (`https://github.com/xoruddkqk4-glitch/classprep`) 연동
- **검증 결과**: `Code.gs` 백엔드 로직 검증 및 `index.html` 구문 및 스크립트 바인딩 확인 완료
