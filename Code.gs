function doGet() {
  var htmlOutput;
  try {
    htmlOutput = HtmlService.createHtmlOutputFromFile('index');
  } catch (e) {
    try {
      htmlOutput = HtmlService.createHtmlOutputFromFile('Index');
    } catch (e2) {
      htmlOutput = HtmlService.createHtmlOutputFromFile('index.html');
    }
  }
  return htmlOutput
      .setTitle('수업준비물 안내')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * 시트의 날짜 문자열(예: 20260910, 2026.09.10, 2026-9-10 등)/Date 객체를 'yyyy-MM-dd' 정규 포맷으로 변환하는 함수
 */
function normalizeDateStr(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return Utilities.formatDate(val, "Asia/Seoul", "yyyy-MM-dd");
  }
  var str = String(val).trim();
  
  // 8자리 숫자 포맷 처리 (예: 20260910 -> 2026-09-10)
  if (/^\d{8}$/.test(str)) {
    return str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8);
  }
  
  // '2026. 09. 10.', '2026/9/10' 등의 구분자를 '-'로 정규화
  str = str.replace(/[\.\/]/g, '-').replace(/\s+/g, '');
  if (str.endsWith('-')) {
    str = str.slice(0, -1);
  }
  var parts = str.split('-');
  if (parts.length === 3) {
    var y = parts[0];
    var m = parts[1].length === 1 ? '0' + parts[1] : parts[1];
    var d = parts[2].length === 1 ? '0' + parts[2] : parts[2];
    if (y.length === 4) {
      return y + '-' + m + '-' + d;
    }
  }
  return str;
}

/**
 * 시트의 값(1, "1", "O", true 등)을 화면 및 복사 텍스트용 'O'로 변환하는 함수
 */
function formatVal(val) {
  if (val === null || val === undefined) return "-";
  var str = String(val).trim();
  if (str === "1" || str === "1.0" || str === "O" || str === "o" || str === "true" || str === "TRUE" || str === "⭕") {
    return "O";
  }
  if (str === "" || str === "0" || str === "0.0" || str === "-" || str === "false" || str === "FALSE") {
    return "-";
  }
  return str;
}

/**
 * 구글 시트 데이터 조회 함수 (성능 최적화, WeeklyTemplate 캐싱, 프리패치 및 강제 새로고침 지원)
 */
function getClassData(targetDateStr, forceRefresh) {
  if (!targetDateStr) {
    targetDateStr = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd");
  }
  targetDateStr = normalizeDateStr(targetDateStr);

  var cache = CacheService.getScriptCache();
  var cacheKey = "classdata_v5_" + targetDateStr;

  // forceRefresh가 false이고 캐시가 존재하면 즉시 캐시 반환 (초고속 응답)
  if (!forceRefresh) {
    var cached = cache.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // 캐시 파싱 실패 시 실시간 조회 진행
      }
    }
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var parts = targetDateStr.split('-');
  var targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
  var dayIndex = targetDate.getDay();
  var fullDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  var targetFullDay = fullDays[dayIndex];

  // 1. WeeklyTemplate 캐싱 (시간표 뼈대는 거의 변경되지 않으므로 1시간 캐싱하여 시트 접근 횟수 절감)
  var templateKey = "weekly_template_v1";
  var cachedTemplate = cache.get(templateKey);
  var templateRows = null;
  if (cachedTemplate && !forceRefresh) {
    try {
      templateRows = JSON.parse(cachedTemplate);
    } catch (e) {}
  }

  if (!templateRows) {
    templateRows = [];
    var templateSheet = ss.getSheetByName('WeeklyTemplate');
    if (templateSheet) {
      var tLastRow = templateSheet.getLastRow();
      if (tLastRow > 1) {
        templateRows = templateSheet.getRange(2, 1, tLastRow - 1, 3).getValues();
      }
    }
    try {
      cache.put(templateKey, JSON.stringify(templateRows), 3600); // 1시간 캐시
    } catch (e) {}
  }

  // 2. DailyNotes 시트 데이터 정규화 및 Map 구조 추출 (필요 영역만 getRange로 빠르게 읽기)
  var dailyMap = {};
  var notesSheet = ss.getSheetByName('DailyNotes');
  if (notesSheet) {
    var nLastRow = notesSheet.getLastRow();
    if (nLastRow > 1) {
      var nData = notesSheet.getRange(2, 1, nLastRow - 1, 7).getValues();
      for (var j = 0; j < nData.length; j++) {
        var rawDate = nData[j][0];
        var nDateStr = normalizeDateStr(rawDate);

        if (nDateStr === targetDateStr) {
          var nClass = String(nData[j][1]).trim();
          dailyMap[nClass] = {
            portfolio: formatVal(nData[j][2]),
            pen: formatVal(nData[j][3]),
            dibot: formatVal(nData[j][4]),
            textbook: formatVal(nData[j][5]),
            etc: formatVal(nData[j][6])
          };
        }
      }
    }
  }

  // 3. 시간표 뼈대와 매핑
  var targetClasses = [];
  for (var i = 0; i < templateRows.length; i++) {
    var rowDay = String(templateRows[i][0]).trim();
    if (rowDay === targetFullDay) {
      var className = String(templateRows[i][1]).trim();
      var note = dailyMap[className] || {};
      targetClasses.push({
        className: className,
        period: String(templateRows[i][2]).trim(),
        portfolio: note.portfolio || "-",
        pen: note.pen || "-",
        dibot: note.dibot || "-",
        textbook: note.textbook || "-",
        etc: note.etc || "-"
      });
    }
  }

  var result = {
    dateStr: targetDateStr,
    dayOfWeek: targetFullDay,
    classes: targetClasses
  };

  // 4. 캐시 저장 (5분)
  try {
    cache.put(cacheKey, JSON.stringify(result), 300);
  } catch (e) {}

  return result;
}