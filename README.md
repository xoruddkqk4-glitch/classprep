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

## [2026-09-09 20:20] 업데이트 이력 (Commit ID: 7647220)
- **수정 내용**:
  - `.agents` 규정 및 커밋 워크플로우 적용
  - `index.html` 프론트엔드 UI 복구 및 반응형 웹 디자인 개선 (날짜 피커, 준비물 카드 grid, 배지 상태 표시)
  - Git 저장소 초기화 및 Remote URL (`https://github.com/xoruddkqk4-glitch/classprep`) 연동
- **검증 결과**: `Code.gs` 백엔드 로직 검증 및 `index.html` 구문 및 스크립트 바인딩 확인 완료

## [2026-09-09 20:23] 업데이트 이력 (Commit ID: dcb0262)
- **수정 내용**:
  - `Code.gs`: Apps Script 내 HTML 파일명 대소문자(`index`/`Index`/`index.html`) 유연 처리 및 예외 핸들링 추가
  - `index.html`: 프론트엔드 HTML/CSS/JS 코드 정상 반영
- **검증 결과**: Apps Script `createHtmlOutputFromFile` 파일 매칭 예외 해결 확인

## [2026-09-09 20:56] 업데이트 이력 (Commit ID: a1d66b3)
- **수정 내용**:
  - `.agents`: `/git-commit` 수신 시에만 커밋/푸시를 실행하는 엄격 규칙 제정 및 범용화 적용
  - `Code.gs`: `CacheService` 5분 캐싱, `DailyNotes` O(1) Map 매핑 및 8자리 숫자 날짜(`20260910`) 정규화 파싱 구현
  - `index.html`: UI 개편 (단축 날짜 버튼, 카드 내 SMS 초간결 복사 기능, 학급별 고정 1x3 행 그리드 위치 고정, 텍스트 가운데 정렬)
- **검증 결과**: 수동 검증 및 구문 체킹 완료, 정상 동작 확인

## [2026-09-10 09:38] 업데이트 이력 (Commit ID: 8cc057b)
- **수정 내용**:
  - `index.html`: 기본 준비물 상태(포트폴리오 O, 필기도구 O, 디벗 X, 교과서 X, 기타 X) 이외 카드에 파스텔 빨간색 배경(`alert-bg`, `#fee2e2`) 조건부 시각 강조 구현
  - `index.html`: 클라이언트 메모리 캐싱(`clientCache`), 백그라운드 사전 로딩(`prefetchNearbyDates`), `🔄 새로고침` 버튼 신설로 날짜 이동 0초 지연 및 실시간 동기화 지원
  - `Code.gs`: `WeeklyTemplate` 1시간 캐싱, `getRange` 필요 영역 최적화, `forceRefresh` 매개변수 지원으로 백엔드 조회 속도 단축
  - `.agents`: 프로젝트 규칙 및 커밋 워크플로우 적용
- **검증 결과**: 구문 체킹 및 프론트엔드/백엔드 데이터 매핑 검증 완료



