'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [showNotification, setShowNotification] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      text: "남편 이직 문제로 고민이 많았는데, 100페이지에 달하는 정교한 분석 내용을 보고 확신을 얻었습니다. 단순히 잘된다가 아니라 '왜' 지금이 시기인지 설명해 주어 신뢰가 갔습니다.",
      author: "강남구 김OO 님"
    },
    {
      text: "사주카페 가면 금방 잊어버리고 나오는데, 이건 PDF로 받으니 두고두고 읽어볼 수 있어서 좋아요. 제 인생의 10년 흐름을 한눈에 보게 된 느낌입니다.",
      author: "부산시 박OO 님"
    },
    {
      text: "결혼 적령기인데 언제 좋은 인연을 만날 수 있을지 궁금했어요. 분석서에서 구체적인 시기와 어떤 사람을 만나야 하는지까지 알려줘서 도움이 많이 되었습니다.",
      author: "서울 송파구 이OO 님"
    },
    {
      text: "사업을 시작하려고 하는데 타이밍이 맞는지 고민이었습니다. 재물운 분석을 보고 확신을 갖고 시작할 수 있었고, 지금 잘 되고 있어요. 정말 감사합니다!",
      author: "경기 수원시 최OO 님"
    },
    {
      text: "아이 둘의 사주까지 함께 봤는데, 각자의 성향과 어떻게 키워야 할지 방향을 잡을 수 있었어요. 가족 모두 분석받길 정말 잘했다고 생각합니다.",
      author: "인천 연수구 정OO 님"
    }
  ];

  const priceTable = [
    { people: 1, price: 39000, originalPrice: 99000, discount: 60 },
    { people: 2, price: 70000, originalPrice: 198000, discount: 65 },
    { people: 3, price: 100000, originalPrice: 297000, discount: 66 },
    { people: 4, price: 125000, originalPrice: 396000, discount: 68 },
  ];

  const currentPricing = priceTable[numberOfPeople - 1];

  // 현재 월의 마지막 날 계산
  const getEndOfMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    // 다음 달의 0일 = 현재 달의 마지막 날
    return new Date(year, month + 1, 0, 23, 59, 59);
  };

  const endOfMonth = getEndOfMonth();
  const currentMonth = endOfMonth.getMonth() + 1; // 1-12
  const lastDayOfMonth = endOfMonth.getDate();

  useEffect(() => {
    const targetDate = getEndOfMonth().getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 3000);

    const recurringNotification = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 15000);

    return () => {
      clearTimeout(notificationTimer);
      clearInterval(recurringNotification);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(reviewInterval);
  }, [reviews.length]);

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-800">
      {/* Hero Section (공감) */}
      <section className="gradient-bg min-h-[100vh] sm:min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-20 relative overflow-hidden">
        {/* 마스코트 - Hero 섹션 */}
        <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 opacity-40 sm:opacity-50 pointer-events-none">
          <img
            src="/images/hero/promo (1).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-3xl w-full animate-fade-in relative z-10">
          <p className="text-accent font-medium tracking-widest mb-4 text-xs sm:text-sm">FATE THERAPY</p>
          <h1 className="serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-6 sm:mb-8 px-2">
            결정을 내려야 하는데<br />
            <span className="gold-text">확신이 서지 않을 때가 있습니다</span>
          </h1>
          <div className="space-y-3 sm:space-y-4 text-slate-300 text-base sm:text-lg md:text-xl font-light px-2">
            <p>이직? 결혼? 투자?</p>
            <p>지금이 정말 맞는 타이밍일까요?</p>
            <p className="pt-4 sm:pt-6 text-white font-medium italic text-sm sm:text-base">&ldquo;당신의 고민은 운명의 흐름을 읽지 못했기 때문일지 모릅니다.&rdquo;</p>
          </div>
          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4 sm:gap-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-accent hover:bg-accent/90 active:scale-95 text-slate-900 px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-lg font-bold transition-all shadow-2xl hover:scale-105 w-full sm:w-auto max-w-xs"
            >
              무료 사주 미리보기
            </button>
            <i className="fas fa-chevron-down text-accent animate-bounce text-xl sm:text-2xl"></i>
          </div>
        </div>
      </section>

      {/* Expert Section (가치 제시) */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* 전문가 프로필 이미지 영역 */}
            <div className="relative max-w-sm mx-auto md:max-w-none">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-slate-200">
                <img
                  src="/images/hero/license.jpg"
                  alt="명리심리상담사 자격증"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-3 sm:p-4 rounded-lg shadow-md border border-slate-200">
                <p className="text-xl sm:text-2xl font-bold text-slate-800">15년</p>
                <p className="text-xs text-slate-500">명리 심리학 연구</p>
              </div>
            </div>
            
            {/* 전문가 소개 텍스트 영역 */}
            <div className="mt-8 md:mt-0">
              <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">전문가 인증</p>
              <h2 className="serif text-2xl sm:text-3xl mb-4 sm:mb-6 text-center md:text-left text-slate-900 leading-tight">
                3,000명의 인생 전환점을<br />
                <span className="text-accent">함께 해온 데이터의 힘</span>
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
                단순한 길흉화복을 점치는 것이 아닙니다. 명리심리상담사 1급 전문가가 당신의 타고난 기질과 다가올 운의 흐름을 과학적으로 분석하여 최적의 선택 시기를 제안합니다.
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-accent text-base sm:text-lg"></i>
                  <span className="text-sm sm:text-base text-slate-700">명리심리상담사 1급</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-accent text-base sm:text-lg"></i>
                  <span className="text-sm sm:text-base text-slate-700">가족심리상담사 1급</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-accent text-base sm:text-lg"></i>
                  <span className="text-sm sm:text-base text-slate-700">사주명리학 15년 심층 연구</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Value Section (구체적 가치) */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
        {/* 마스코트 - Value 섹션 */}
        <div className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 opacity-35 sm:opacity-45 pointer-events-none">
          <img
            src="/images/hero/promo (2).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-5xl mx-auto text-center mb-10 sm:mb-16 relative z-10">
          <h2 className="serif text-2xl sm:text-3xl mb-3 sm:mb-4 text-slate-900 px-4">운명테라피가 드리는<br />100페이지 인생 지도</h2>
          <p className="text-slate-500 text-sm sm:text-base px-4">이 분석서를 읽는 것만으로도 당신의 앞날이 선명해집니다.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 card-shadow hover:translate-y-[-5px] transition-transform active:scale-95">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mb-4 sm:mb-6 text-lg sm:text-xl">
              <i className="fas fa-star"></i>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">인생 황금기 포착</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">언제 도전해야 성과가 극대화되는지, 언제 인내하며 씨앗을 뿌려야 하는지 명확히 짚어드립니다.</p>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 card-shadow hover:translate-y-[-5px] transition-transform active:scale-95">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 sm:mb-6 text-lg sm:text-xl">
              <i className="fas fa-coins"></i>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">재물운의 흐름</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">당신의 그릇에 맞는 재산 증식 방법과 주의해야 할 투자 손실 시기를 상세히 분석합니다.</p>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl border border-slate-100 card-shadow hover:translate-y-[-5px] transition-transform active:scale-95 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 mb-4 sm:mb-6 text-lg sm:text-xl">
              <i className="fas fa-heart"></i>
            </div>
            <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4">인연과 관계</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">당신을 돕는 귀인과 조심해야 할 악연, 그리고 건강한 관계 유지를 위한 맞춤 조언을 담았습니다.</p>
          </div>
        </div>
      </section>

      {/* Differentiation (차별화) */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-slate-900 text-white relative overflow-hidden">
        {/* 마스코트 - Differentiation 섹션 */}
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 opacity-30 sm:opacity-40 pointer-events-none">
          <img
            src="/images/hero/promo (3).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="serif text-2xl sm:text-3xl text-center mb-10 sm:mb-16 px-4">왜 <span className="text-accent italic">운명테라피</span>여야 할까요?</h2>
          <div className="grid md:grid-cols-2 gap-0 border border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10 bg-slate-800/50">
              <p className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-sm">기존 대면 상담</p>
              <ul className="space-y-5">
                <li className="flex items-start gap-3 text-slate-400">
                  <i className="fas fa-times-circle mt-1"></i>
                  <span>15만원 이상의 높은 비용</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <i className="fas fa-times-circle mt-1"></i>
                  <span>상담 후 잊혀지는 휘발성 정보</span>
                </li>
                <li className="flex items-start gap-3 text-slate-400">
                  <i className="fas fa-times-circle mt-1"></i>
                  <span>부적 강매나 불안 조장</span>
                </li>
              </ul>
            </div>
            <div className="p-6 sm:p-8 lg:p-10 bg-slate-800 relative">
              <div className="absolute top-0 right-0 p-2 sm:p-3 bg-accent text-slate-900 text-[10px] sm:text-xs font-bold uppercase tracking-tighter">RECOMMENDED</div>
              <p className="text-accent font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs sm:text-sm">운명테라피 (PDF)</p>
              <ul className="space-y-4 sm:space-y-5">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle mt-1 text-accent"></i>
                  <span className="font-medium text-base sm:text-lg">100페이지 분량의 압도적 체계성</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle mt-1 text-accent"></i>
                  <span className="font-medium text-sm sm:text-base">영구 보관 가능한 나만의 인생 지도</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle mt-1 text-accent"></i>
                  <span className="font-medium text-sm sm:text-base">강매 없는 순수 학술적 분석</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proof (신뢰 구축) */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="serif text-2xl sm:text-3xl text-center mb-10 sm:mb-16 text-slate-900 px-4">먼저 인생 지도를<br /> 받으신 분들의 기록</h2>

          {/* 후기 슬라이더 */}
          <div className="relative min-h-[280px] sm:min-h-[240px]">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`absolute w-full transition-all duration-700 ease-in-out ${
                  index === currentReview
                    ? 'opacity-100 translate-y-0'
                    : index < currentReview
                    ? 'opacity-0 -translate-y-full'
                    : 'opacity-0 translate-y-full'
                }`}
              >
                <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl card-shadow border border-slate-100">
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-4 font-medium italic text-sm sm:text-base">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">— {review.author}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 인디케이터 */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentReview === index
                    ? 'bg-accent w-8'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`후기 ${index + 1}번으로 이동`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sample (투명성) */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* 마스코트 - Sample 섹션 */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 opacity-35 sm:opacity-45 pointer-events-none">
          <img
            src="/images/hero/promo (4).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="serif text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 text-slate-900 px-4">
              실제 분석서는<br /> 이렇게 제공됩니다
            </h2>
            <p className="text-slate-600 text-sm sm:text-base px-4">
              100페이지에 달하는 정밀한 분석 내용을 미리 확인해보세요
            </p>
          </div>
          
          {/* 분석서 샘플 이미지와 구성 요소를 나란히 배치 */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
            {/* 분석서 샘플 이미지 영역 */}
            <div className="relative">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-slate-200 overflow-hidden">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src="/videos/saju report.gif"
                    alt="100페이지 정밀 분석서 샘플"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                  {/* 오버레이 그라데이션 효과 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
              
              {/* 장식 요소 */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-20 h-20 sm:w-24 sm:h-24 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-20 h-20 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
            </div>

            {/* 분석서 주요 구성 요소 - 오른쪽에 배치 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-chart-pie text-amber-600 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm sm:text-base text-center">오행 균형 그래프</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-center flex-grow">타고난 기질과 성향 분석</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-calendar-alt text-blue-600 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm sm:text-base text-center">10년 대운 분석</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-center flex-grow">인생 전환점 시기 포착</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-rose-50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-moon text-rose-600 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm sm:text-base text-center">월별 정밀 운세</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-center flex-grow">상세한 월별 가이드</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <i className="fas fa-prescription text-green-600 text-xl sm:text-2xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 text-sm sm:text-base text-center">맞춤 처방전</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-center flex-grow">개인별 최적화 조언</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing (정당한 대가) */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-slate-50 flex justify-center">
        <div className="max-w-xl w-full bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-6 sm:p-10 lg:p-12 text-center text-white">
            <p className="text-accent uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-xs sm:text-sm mb-3 sm:mb-4">LIMITED OFFER</p>
            <h2 className="serif text-2xl sm:text-3xl mb-3 sm:mb-4">운명테라피 인생 지도</h2>
            <p className="text-slate-400 text-base sm:text-lg mb-4 sm:mb-6">15년 전문성을 담은 100페이지 분석서</p>

            {/* 카운트다운 타이머 */}
            <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-accent/20">
              <p className="text-accent text-xs sm:text-sm font-bold mb-2 sm:mb-3">특별 할인 마감까지</p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="bg-slate-900/80 rounded-lg p-2 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{timeLeft.days}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">일</div>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-2 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{timeLeft.hours}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">시간</div>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-2 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{timeLeft.minutes}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">분</div>
                </div>
                <div className="bg-slate-900/80 rounded-lg p-2 sm:p-3">
                  <div className="text-2xl sm:text-3xl font-bold text-accent">{timeLeft.seconds}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">초</div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-10 lg:p-12 text-center">
            {/* 희소성 강조 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6">
              <p className="text-amber-800 font-bold text-xs sm:text-sm">
                <i className="fas fa-fire text-amber-500 mr-1 sm:mr-2"></i>
                이번 달 잔여 상담 가능 인원: <span className="text-lg sm:text-xl">12명</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <span className="text-slate-300 line-through text-lg sm:text-2xl">₩99,000</span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 italic">₩39,000</span>
            </div>
            <p className="text-sm text-slate-600 mb-6 sm:mb-8">
              1인 기준 · 추가 인원 시 더 큰 할인!
            </p>

            <ul className="text-left space-y-3 sm:space-y-4 mb-8 sm:mb-10 text-slate-600">
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-green-500 text-sm sm:text-base"></i>
                <span className="text-sm sm:text-base">100페이지 심층 PDF 분석서</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-green-500 text-sm sm:text-base"></i>
                <span className="text-sm sm:text-base">11가지 핵심 영역 완전 분석</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-green-500 text-sm sm:text-base"></i>
                <span className="text-sm sm:text-base">평생 소장 및 무제한 열람</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="fas fa-check text-green-500 text-sm sm:text-base"></i>
                <span className="text-sm sm:text-base">불만족 시 100% 환불 (7일 이내)</span>
              </li>
            </ul>
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold hover:bg-slate-800 active:scale-98 transition-all shadow-lg"
            >
              내 인생 지도 확인하기
            </button>
            <p className="mt-6 text-sm text-slate-400 italic">
              * {currentMonth}월 {lastDayOfMonth}일 이후 정상가 99,000원으로 환원됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 보장 배지 섹션 */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-shield-check text-green-600 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">100% 환불 보장</h3>
              <p className="text-xs sm:text-sm text-slate-500">7일 이내 무조건 환불</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-lock text-blue-600 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">보안 결제</h3>
              <p className="text-xs sm:text-sm text-slate-500">SSL 암호화 보호</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-user-shield text-purple-600 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">개인정보 보호</h3>
              <p className="text-xs sm:text-sm text-slate-500">철저한 비밀 보장</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-50 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <i className="fas fa-certificate text-amber-600 text-xl sm:text-2xl"></i>
              </div>
              <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 text-sm sm:text-base">전문가 인증</h3>
              <p className="text-xs sm:text-sm text-slate-500">국가 자격증 보유</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="serif text-2xl sm:text-3xl text-center mb-10 sm:mb-16 text-slate-900 px-4">자주 묻는 질문</h2>
          <div className="space-y-3 sm:space-y-4">
            <details className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 card-shadow cursor-pointer group">
              <summary className="font-bold text-base sm:text-lg text-slate-800 list-none flex items-center justify-between gap-4">
                <span>분석서는 언제 받을 수 있나요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform flex-shrink-0"></i>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                결제 후 영업일 기준 3~5일 이내에 입력하신 이메일로 PDF 파일이 발송됩니다.
                명절이나 주말의 경우 소요 시간이 다소 길어질 수 있습니다.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 card-shadow cursor-pointer group">
              <summary className="font-bold text-lg text-slate-800 list-none flex items-center justify-between">
                <span>환불 정책은 어떻게 되나요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                분석서를 받으신 후 7일 이내 불만족 시 100% 환불해드립니다.
                단, 환불 사유를 간단히 작성해 주시면 서비스 개선에 참고하겠습니다.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 card-shadow cursor-pointer group">
              <summary className="font-bold text-lg text-slate-800 list-none flex items-center justify-between">
                <span>출생 시간을 모르는 경우에도 가능한가요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                출생 시간을 모르시는 경우 '시간 미상'으로 선택하시면 됩니다.
                다만, 시(時)주가 없어 분석의 정확도가 다소 낮아질 수 있습니다.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 card-shadow cursor-pointer group">
              <summary className="font-bold text-lg text-slate-800 list-none flex items-center justify-between">
                <span>정말 과학적인 분석인가요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                사주명리학은 동양 철학과 통계학이 결합된 학문입니다.
                15년간 3,000명 이상의 상담 데이터를 기반으로 패턴을 분석하여 제공합니다.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 card-shadow cursor-pointer group">
              <summary className="font-bold text-lg text-slate-800 list-none flex items-center justify-between">
                <span>개인정보는 안전한가요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                모든 개인정보는 SSL 암호화되어 저장되며, 분석 목적 외에는 절대 사용되지 않습니다.
                분석 완료 후 6개월 이내 모든 정보는 자동 삭제됩니다.
              </p>
            </details>

            <details className="bg-white rounded-2xl p-6 card-shadow cursor-pointer group">
              <summary className="font-bold text-lg text-slate-800 list-none flex items-center justify-between">
                <span>추가 비용이 발생하나요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                39,000원 결제 후 추가 비용은 일체 발생하지 않습니다.
                부적 구매나 추가 상담 권유는 절대 하지 않습니다.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 sm:py-16 px-4 sm:px-6 text-slate-500 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="serif text-lg sm:text-xl text-white mb-4 sm:mb-6 italic opacity-50 font-bold">운명테라피</h3>
          <p className="text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 px-4">
            우리는 당신의 삶이 더 선명해지기를 바랍니다.<br />
            통계와 철학의 힘으로 당신의 오늘과 내일을 응원합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6 sm:mb-8 text-[10px] sm:text-xs font-medium uppercase tracking-widest px-4">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">환불규정</a>
          </div>
          <p className="text-[9px] sm:text-[10px] opacity-30">© 2026 FATE THERAPY. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* 입력 폼 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4 animate-modal-bg" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between rounded-t-none sm:rounded-t-3xl z-10">
              <h2 className="serif text-lg sm:text-2xl text-slate-900">당신의 사주를 입력해 주세요</h2>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0">
                <i className="fas fa-times text-slate-400 text-xl"></i>
              </button>
            </div>

            <div className="p-4 sm:p-8">
              {/* 인원 선택 */}
              <div className="mb-6 sm:mb-8">
                <div className="text-center mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">분석 인원 선택</label>
                  <p className="text-xs text-slate-500">인원이 많을수록 할인율이 높아집니다</p>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {priceTable.map((item) => (
                    <button
                      key={item.people}
                      type="button"
                      onClick={() => setNumberOfPeople(item.people)}
                      className={`py-3 sm:py-4 rounded-xl font-bold transition-all ${
                        numberOfPeople === item.people
                          ? 'bg-accent text-slate-900 shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <div className="text-lg sm:text-xl">{item.people}인</div>
                      <div className="text-xs sm:text-sm mt-1">{item.discount}%</div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl text-center border border-amber-200">
                  <p className="text-slate-600 text-sm mb-1">
                    <span className="line-through text-slate-400 text-xs sm:text-sm">₩{currentPricing.originalPrice.toLocaleString()}</span>
                    <i className="fas fa-arrow-right text-accent mx-2 text-xs"></i>
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">₩{currentPricing.price.toLocaleString()}</span>
                  </p>
                  <p className="text-xs text-amber-700 font-medium">
                    ₩{(currentPricing.originalPrice - currentPricing.price).toLocaleString()} 절약!
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                {/* 기본 정보 입력 */}
                {[...Array(numberOfPeople)].map((_, index) => (
                  <div key={index} className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-center sm:justify-start gap-2">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 bg-accent text-slate-900 rounded-full flex items-center justify-center text-sm sm:text-base font-bold">
                        {index + 1}
                      </span>
                      {index === 0 ? '본인 정보' : `${index + 1}번째 인원 정보`}
                    </h3>

                    <div className="space-y-4">
                      {/* 이름 */}
                      <div className="text-left">
                        <label className="block text-sm font-medium text-slate-700 mb-2">이름 *</label>
                        <input
                          type="text"
                          placeholder="실명을 입력해주세요"
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white"
                          required
                        />
                      </div>

                      {/* 생년월일 & 생시 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-left">
                          <label className="block text-sm font-medium text-slate-700 mb-2">생년월일 *</label>
                          <input
                            type="date"
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white"
                            required
                          />
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium text-slate-700 mb-2">생시 *</label>
                          <input
                            type="time"
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white"
                            required
                          />
                        </div>
                      </div>

                      {/* 음력/양력 & 성별 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-left">
                          <label className="block text-sm font-medium text-slate-700 mb-2">음력/양력 *</label>
                          <select className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white" required>
                            <option value="">선택</option>
                            <option value="solar">양력</option>
                            <option value="lunar">음력</option>
                            <option value="leap">윤달</option>
                          </select>
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium text-slate-700 mb-2">성별 *</label>
                          <select className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white" required>
                            <option value="">선택</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 이메일 주소 */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-700 mb-2">이메일 주소 *</label>
                  <input
                    type="email"
                    placeholder="분석서를 받으실 이메일"
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base"
                    required
                  />
                </div>

                {/* 궁금한 점 */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-700 mb-2">궁금한 점 (선택)</label>
                  <textarea
                    placeholder="평소 궁금한 내용을 적어주세요&#10;예: 올해 이직 운세, 재물운, 건강운 등"
                    rows={4}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 active:scale-98 text-slate-900 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all shadow-lg"
                >
                  ₩{currentPricing.price.toLocaleString()} 결제하고 인생 지도 받기
                </button>

                <p className="text-xs sm:text-sm text-slate-500 mt-4 text-center">
                  <i className="fas fa-lock mr-1"></i>
                  SSL 보안 결제 · 개인정보는 암호화되어 안전하게 보관됩니다
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 실시간 구매 알림 팝업 */}
      {showNotification && (
        <div className="fixed bottom-20 sm:bottom-24 left-4 sm:left-6 right-4 sm:right-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 border border-slate-200 max-w-sm animate-fade-in z-40">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check text-green-600 text-lg sm:text-xl"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {['서울 강남구', '부산 해운대구', '경기 성남시', '인천 연수구', '대구 수성구'][Math.floor(Math.random() * 5)]} {['김', '이', '박', '최', '정'][Math.floor(Math.random() * 5)]}OO님
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">방금 인생 지도를 신청했습니다</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA */}
      <div className="sticky-cta p-3 sm:p-4 md:hidden">
        <button onClick={() => setShowModal(true)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl active:scale-98 transition-transform text-sm sm:text-base">
          1인 ₩39,000부터 시작하기
        </button>
      </div>
    </div>
  );
}
