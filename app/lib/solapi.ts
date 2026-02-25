import { createHmac } from 'crypto';

const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY;
const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET;
const SOLAPI_KAKAO_PF_ID = process.env.SOLAPI_KAKAO_PF_ID;
const SOLAPI_KAKAO_TEMPLATE_ID = process.env.SOLAPI_KAKAO_TEMPLATE_ID;

function getAuthHeader(): string {
  if (!SOLAPI_API_KEY || !SOLAPI_API_SECRET) {
    throw new Error('SOLAPI_API_KEY 또는 SOLAPI_API_SECRET이 설정되지 않았습니다.');
  }
  const date = new Date().toISOString();
  const salt = Math.random().toString(36).substring(2, 15);
  const signature = createHmac('sha256', SOLAPI_API_SECRET)
    .update(date + salt)
    .digest('hex');
  return `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`;
}

export interface KakaoMessageOptions {
  to: string;          // 고객 전화번호
  customerName: string;
  productName: string;
  orderNumber: string;
  price: number;
}

/**
 * Solapi를 통해 카카오 채널 메시지를 발송합니다.
 * - SOLAPI_KAKAO_TEMPLATE_ID가 설정된 경우: 알림톡(ATA) - 사전 승인 템플릿 사용
 * - 미설정 시: 친구톡(FTA) - 자유 형식 (채널 친구 대상)
 */
export async function sendKakaoMessage(options: KakaoMessageOptions): Promise<void> {
  const { to, customerName, productName, orderNumber, price } = options;

  if (!SOLAPI_KAKAO_PF_ID) {
    console.warn('[Kakao] SOLAPI_KAKAO_PF_ID가 설정되지 않아 메시지 발송을 건너뜁니다.');
    return;
  }

  // 전화번호 정규화 (하이픈 제거, 국내 형식 확인)
  const phone = to.replace(/-/g, '').replace(/\s/g, '');

  // 카카오 옵션 구성 (알림톡 or 친구톡)
  const kakaoOptions: Record<string, unknown> = {
    pfId: SOLAPI_KAKAO_PF_ID,
  };

  if (SOLAPI_KAKAO_TEMPLATE_ID) {
    // 알림톡: 변수 없는 고정 텍스트 템플릿
    kakaoOptions.templateId = SOLAPI_KAKAO_TEMPLATE_ID;
  } else {
    // 친구톡: 자유 형식 텍스트 (채널 친구 전용)
    kakaoOptions.text =
      `안녕하세요, ${customerName}님! 운명테라피입니다 🙏\n\n` +
      `✅ 주문이 정상 접수되었습니다.\n\n` +
      `📋 주문 정보\n` +
      `• 상품: ${productName}\n` +
      `• 결제금액: ${price.toLocaleString()}원\n` +
      `• 주문번호: ${orderNumber}\n\n` +
      `분석서는 영업일 3~5일 내에 입력하신 이메일로 발송됩니다.\n` +
      `궁금한 점은 채널톡으로 편하게 문의해 주세요!`;
  }

  const body = {
    message: {
      to: phone,
      kakaoOptions,
    },
  };

  const response = await fetch('https://api.solapi.com/messages/v4/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    // 발송 실패는 주문 자체를 실패시키지 않도록 에러 로그만 남김
    console.error('[Kakao] 메시지 발송 실패:', JSON.stringify(result));
  } else {
    console.log('[Kakao] 메시지 발송 성공:', result?.messageId ?? result);
  }
}
