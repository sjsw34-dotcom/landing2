/**
 * 구글 시트 웹스크립트
 * 
 * 사용 방법:
 * 1. 구글 시트를 열고 확장 프로그램 > Apps Script 클릭
 * 2. 이 스크립트를 붙여넣기
 * 3. 배포 > 새 배포 > 유형: 웹 앱 선택
 * 4. 실행 사용자: 나, 액세스 권한: 모든 사용자로 설정
 * 5. 배포 후 웹 앱 URL을 복사하여 .env.local의 GOOGLE_SHEETS_WEB_APP_URL에 설정
 */

// 시트 이름 설정 (기본값: '주문내역')
const SHEET_NAME = '주문내역';

function doPost(e) {
  try {
    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 스프레드시트 열기 (스크립트가 연결된 시트)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // 헤더 추가
      sheet.appendRow([
        '제출일시',
        '이름',
        '생년월일',
        '생시',
        '음력/양력',
        '성별',
        '이메일',
        '궁금한 점',
        '인원수',
        '결제금액',
        '결제상태',
        '주문번호'
      ]);
      // 헤더 스타일링
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f0f0f0');
      headerRange.setFontSize(11);
    }
    
    // 현재 날짜/시간
    const now = new Date();
    const timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    
    // 주문번호 생성 (타임스탬프 기반)
    const orderNumber = 'ORD-' + now.getTime();
    
    // 각 인원 정보를 행으로 추가
    data.people.forEach((person, index) => {
      const row = [
        timestamp,                                    // 제출일시
        person.name || '',                            // 이름
        person.birthDate || '',                      // 생년월일
        person.birthTime || '',                      // 생시
        person.calendarType || '',                   // 음력/양력
        person.gender || '',                         // 성별
        index === 0 ? data.email : '',               // 이메일 (첫 번째 인원만)
        index === 0 ? (data.question || '') : '',    // 궁금한 점 (첫 번째 인원만)
        index === 0 ? data.numberOfPeople : '',      // 인원수 (첫 번째 인원만)
        index === 0 ? data.totalPrice : '',          // 결제금액 (첫 번째 인원만)
        '결제완료',                                    // 결제상태
        index === 0 ? orderNumber : ''               // 주문번호 (첫 번째 인원만)
      ];
      
      sheet.appendRow(row);
    });
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '데이터가 성공적으로 저장되었습니다.',
        orderNumber: orderNumber,
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '오류가 발생했습니다: ' + error.toString(),
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 테스트 함수 (스크립트 편집기에서 직접 실행 가능)
function testDoPost() {
  const testData = {
    email: 'test@example.com',
    question: '테스트 질문',
    numberOfPeople: 1,
    totalPrice: 39000,
    people: [
      {
        name: '테스트',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: 'solar',
        gender: 'male'
      }
    ]
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
