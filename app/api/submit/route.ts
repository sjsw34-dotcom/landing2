import { NextRequest, NextResponse } from 'next/server';
import { sendKakaoMessage } from '@/app/lib/solapi';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const webAppUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL ||
      'https://script.google.com/macros/s/AKfycbz8-v1YCs-ZqtRp64lYBNaHYNlJ9X7vonUfFhMM0cB0p_ftxp3Ei5K5nKDlgbSW5kCYsw/exec';

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

    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        const orderNumber = `ORD-${Date.now()}`;
        // 카카오 메시지 발송 (비동기, 실패해도 주문은 성공 처리)
        if (data.phone) {
          sendKakaoMessage({
            to: data.phone,
            customerName: data.people?.[0]?.name ?? '고객',
            productName: data.productName,
            orderNumber,
            price: data.totalPrice,
          }).catch((err) => console.error('[Kakao] 발송 오류:', err));
        }
        return NextResponse.json({
          success: true,
          message: '주문이 성공적으로 접수되었습니다.',
          orderNumber,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('구글 시트 응답 파싱 실패');
      }
    }

    if (result.success) {
      const orderNumber = result.orderNumber;
      // 카카오 메시지 발송 (비동기, 실패해도 주문은 성공 처리)
      if (data.phone) {
        sendKakaoMessage({
          to: data.phone,
          customerName: data.people?.[0]?.name ?? '고객',
          productName: data.productName,
          orderNumber,
          price: data.totalPrice,
        }).catch((err) => console.error('[Kakao] 발송 오류:', err));
      }
      return NextResponse.json({
        success: true,
        message: '주문이 성공적으로 접수되었습니다.',
        orderNumber,
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
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json(
      {
        success: false,
        message: `서버 오류가 발생했습니다: ${errorMessage}`,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
