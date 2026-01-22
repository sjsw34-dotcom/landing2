import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // 구글 시트 웹 앱 URL 가져오기 (환경 변수에서)
    const webAppUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;
    
    if (!webAppUrl) {
      return NextResponse.json(
        { success: false, message: '구글 시트 웹 앱 URL이 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    
    // 구글 시트로 데이터 전송
    const response = await fetch(webAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // 응답 텍스트로 먼저 받기 (JSON이 아닐 수 있음)
    const responseText = await response.text();
    let result;
    
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      // JSON 파싱 실패 시 (구글 시트 웹 앱이 HTML을 반환한 경우)
      console.error('Response parse error:', parseError);
      console.error('Response text:', responseText);
      // 응답이 성공적으로 받아졌다면 (상태 코드 200) 성공으로 간주
      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: '주문이 성공적으로 접수되었습니다.',
          orderNumber: `ORD-${Date.now()}`,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('구글 시트 응답 파싱 실패');
      }
    }
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '주문이 성공적으로 접수되었습니다.',
        orderNumber: result.orderNumber,
        timestamp: result.timestamp
      });
    } else {
      return NextResponse.json(
        { success: false, message: result.message || '데이터 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
