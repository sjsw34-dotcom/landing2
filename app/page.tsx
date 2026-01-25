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
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [currentReview, setCurrentReview] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    question: string;
    people: Array<{
      name: string;
      birthDate: string;
      birthTime: string;
      calendarType: string;
      gender: string;
    }>;
  }>({
    email: '',
    question: '',
    people: Array(4).fill(null).map(() => ({
      name: '',
      birthDate: '',
      birthTime: '',
      calendarType: '',
      gender: ''
    }))
  });

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
    if (showModal || showPrivacyNotice || showPrivacyPolicy || showTerms) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showPrivacyNotice, showPrivacyPolicy, showTerms]);

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

  // 폼 데이터 업데이트 핸들러
  const handleInputChange = (field: string, value: string, personIndex?: number) => {
    if (personIndex !== undefined) {
      setFormData(prev => ({
        ...prev,
        people: prev.people.map((person, idx) => 
          idx === personIndex ? { ...person, [field]: value } : person
        )
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // 폼 제출 핸들러 (가상 결제 처리)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 폼 유효성 검사
      const peopleData = formData.people.slice(0, numberOfPeople);
      const hasEmptyFields = peopleData.some(person => 
        !person.name || !person.birthDate || !person.birthTime || !person.calendarType || !person.gender
      ) || !formData.email;

      if (hasEmptyFields) {
        alert('모든 필수 항목을 입력해주세요.');
        setIsSubmitting(false);
        return;
      }

      // 가상 결제 완료 처리 (실제로는 토스 링크페이 연동)
      // 결제 완료 메시지 표시
      const confirmPayment = confirm(
        `결제를 진행하시겠습니까?\n\n` +
        `인원수: ${numberOfPeople}명\n` +
        `결제금액: ₩${currentPricing.price.toLocaleString()}\n\n` +
        `[가상 결제 모드]\n` +
        `실제 결제는 진행되지 않으며, 테스트를 위해 가상으로 결제 완료 처리됩니다.`
      );

      if (!confirmPayment) {
        setIsSubmitting(false);
        return;
      }

      // 결제 완료 처리 중 메시지
      alert('결제가 완료되었습니다!\n\n주문 정보를 저장하는 중입니다...');

      const submitData = {
        email: formData.email,
        question: formData.question || '',
        numberOfPeople: numberOfPeople,
        totalPrice: currentPricing.price,
        people: peopleData.map(person => ({
          name: person.name,
          birthDate: person.birthDate,
          birthTime: person.birthTime,
          calendarType: person.calendarType,
          gender: person.gender
        }))
      };

      // API로 데이터 전송
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // 성공 메시지 표시
        alert(
          `✅ 주문이 완료되었습니다!\n\n` +
          `주문번호: ${result.orderNumber}\n` +
          `제출일시: ${result.timestamp}\n\n` +
          `분석서는 24시간 이내에 이메일로 발송됩니다.\n` +
          `구글 시트에 주문 정보가 저장되었습니다.`
        );
        
        // 모달 닫기
        setShowModal(false);
        
        // 폼 초기화
        setFormData({
          email: '',
          question: '',
          people: Array(4).fill(null).map(() => ({
            name: '',
            birthDate: '',
            birthTime: '',
            calendarType: '',
            gender: ''
          }))
        });
        setNumberOfPeople(1);
      } else {
        alert(`주문 처리 중 오류가 발생했습니다.\n\n오류 메시지: ${result.message || '알 수 없는 오류'}\n\n다시 시도해주세요.`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(
        `주문 처리 중 오류가 발생했습니다.\n\n` +
        `오류 내용: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n\n` +
        `브라우저 콘솔을 확인하시거나 다시 시도해주세요.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 인원 수 변경 시 폼 데이터 유지 (추가 인원만 초기화)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      people: Array(4).fill(null).map((_, idx) => 
        idx < numberOfPeople ? (prev.people[idx] || {
          name: '',
          birthDate: '',
          birthTime: '',
          calendarType: '',
          gender: ''
        }) : {
          name: '',
          birthDate: '',
          birthTime: '',
          calendarType: '',
          gender: ''
        }
      )
    }));
  }, [numberOfPeople]);

  return (
    <div className="bg-white text-slate-800">
      {/* Hero Section (공감) */}
      <section className="gradient-bg min-h-[100vh] sm:min-h-[90vh] lg:min-h-[80vh] flex items-center justify-center text-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* 마스코트 - Hero 섹션 */}
        <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 opacity-30 sm:opacity-40 pointer-events-none">
          <img
            src="/images/hero/promo (1).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-4xl w-full animate-fade-in relative z-10">
          <p className="text-accent font-semibold tracking-widest mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm md:text-base">FATE THERAPY</p>
          <h1 className="serif text-[1.75rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl text-white sm:leading-[1.4] mb-6 sm:mb-10 md:mb-12 px-2 font-bold">
            결정을 내려야 하는데<br />
            <span className="text-accent drop-shadow-lg sm:gold-text">확신이 서지 않을 때가 있습니다</span>
          </h1>
          <div className="space-y-3 sm:space-y-5 md:space-y-6 text-white text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold px-2">
            <p>💼 이직? 💍 결혼? 💰 투자?</p>
            <p>지금이 정말 맞는 타이밍일까요?</p>
            <p className="pt-4 sm:pt-8 md:pt-10 text-white font-bold italic text-sm sm:text-lg md:text-xl lg:text-2xl leading-relaxed">&ldquo;당신의 고민은 운명의 흐름을 읽지 못했기 때문일지 모릅니다.&rdquo;</p>
          </div>
          <div className="mt-8 sm:mt-12 md:mt-14 lg:mt-16 flex flex-col items-center gap-4 sm:gap-6 md:gap-7">
            <button
              onClick={() => setShowPrivacyNotice(true)}
              className="bg-accent hover:bg-accent/90 active:scale-95 text-slate-900 px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-7 rounded-full text-base sm:text-xl md:text-2xl font-bold transition-all shadow-2xl hover:scale-105 w-full sm:w-auto max-w-sm md:max-w-md"
            >
              ✨ 무료 사주 미리보기
            </button>
            <i className="fas fa-chevron-down text-accent animate-bounce text-xl sm:text-3xl md:text-4xl"></i>
          </div>
        </div>
      </section>

      {/* Expert Section (가치 제시) */}
      <section className="py-12 sm:py-20 md:py-24 lg:py-28 bg-slate-50 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-14 lg:gap-16 items-center">
            {/* 전문가 프로필 이미지 영역 */}
            <div className="relative max-w-sm mx-auto md:max-w-none">
              <div className="aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-slate-200 shadow-xl">
                <img
                  src="/images/hero/license.jpg"
                  alt="명리심리상담사 자격증"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-white p-4 sm:p-6 md:p-7 rounded-xl shadow-lg border border-slate-200">
                <p className="text-xl sm:text-3xl md:text-4xl font-bold text-slate-900">15년</p>
                <p className="text-xs sm:text-base md:text-lg text-slate-600 font-medium mt-1">명리 심리학 연구</p>
              </div>
            </div>

            {/* 전문가 소개 텍스트 영역 */}
            <div className="mt-6 md:mt-0">
              <p className="text-xs sm:text-base md:text-lg text-slate-600 mb-3 sm:mb-5 md:mb-6 font-medium text-center md:text-left">🎓 전문가 인증</p>
              <h2 className="serif text-2xl sm:text-4xl md:text-5xl mb-5 sm:mb-7 md:mb-8 text-center md:text-left text-slate-900 leading-[1.4] font-bold">
                3,000명의 인생 전환점을<br />
                <span className="text-accent">함께 해온 데이터의 힘</span>
              </h2>
              <p className="text-slate-700 leading-relaxed mb-6 sm:mb-9 md:mb-10 text-sm sm:text-lg md:text-xl font-medium text-center md:text-left">
                단순한 길흉화복을 점치는 것이 아닙니다. 명리심리상담사 1급 전문가가 당신의 타고난 기질과 다가올 운의 흐름을 과학적으로 분석하여 최적의 선택 시기를 제안합니다.
              </p>
              <ul className="space-y-3 sm:space-y-5">
                <li className="flex items-center gap-3 md:gap-5">
                  <i className="fas fa-check-circle text-accent text-lg sm:text-2xl md:text-3xl flex-shrink-0"></i>
                  <span className="text-sm sm:text-lg md:text-xl text-slate-800 font-semibold">명리심리상담사 1급</span>
                </li>
                <li className="flex items-center gap-3 md:gap-5">
                  <i className="fas fa-check-circle text-accent text-lg sm:text-2xl md:text-3xl flex-shrink-0"></i>
                  <span className="text-sm sm:text-lg md:text-xl text-slate-800 font-semibold">가족심리상담사 1급</span>
                </li>
                <li className="flex items-center gap-3 md:gap-5">
                  <i className="fas fa-check-circle text-accent text-lg sm:text-2xl md:text-3xl flex-shrink-0"></i>
                  <span className="text-sm sm:text-lg md:text-xl text-slate-800 font-semibold">사주명리학 15년 심층 연구</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Value Section (구체적 가치) */}
      <section className="py-12 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 bg-white relative overflow-hidden">
        {/* 마스코트 - Value 섹션 */}
        <div className="absolute top-0 left-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 opacity-35 sm:opacity-45 pointer-events-none">
          <img
            src="/images/hero/promo (2).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-16 md:mb-20 relative z-10">
          <h2 className="serif text-2xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 md:mb-7 text-slate-900 px-4 font-bold leading-[1.4]">📖 운명테라피가 드리는<br />100페이지 인생 지도</h2>
          <p className="text-slate-700 text-sm sm:text-lg md:text-xl px-4 font-medium">이 분석서를 읽는 것만으로도 당신의 앞날이 선명해집니다.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 md:gap-10 relative z-10">
          <div className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-slate-200 card-shadow hover:translate-y-[-5px] transition-transform active:scale-95 bg-white">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 sm:mb-6 md:mb-7 text-xl sm:text-2xl md:text-3xl">
              <i className="fas fa-star"></i>
            </div>
            <h3 className="font-bold text-lg sm:text-2xl md:text-3xl mb-3 sm:mb-5 md:mb-6 text-slate-900">⭐ 인생 황금기 포착</h3>
            <p className="text-slate-800 leading-relaxed text-sm sm:text-lg md:text-xl font-medium">언제 도전해야 성과가 극대화되는지, 언제 인내하며 씨앗을 뿌려야 하는지 명확히 짚어드립니다.</p>
          </div>
          <div className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-slate-200 card-shadow hover:translate-y-[-5px] transition-transform active:scale-95 bg-white">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 sm:mb-6 md:mb-7 text-xl sm:text-2xl md:text-3xl">
              <i className="fas fa-coins"></i>
            </div>
            <h3 className="font-bold text-lg sm:text-2xl md:text-3xl mb-3 sm:mb-5 md:mb-6 text-slate-900">💰 재물운의 흐름</h3>
            <p className="text-slate-800 leading-relaxed text-sm sm:text-lg md:text-xl font-medium">당신의 그릇에 맞는 재산 증식 방법과 주의해야 할 투자 손실 시기를 상세히 분석합니다.</p>
          </div>
          <div className="p-6 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl border border-slate-200 card-shadow hover:translate-y-[-5px] transition-transform active:scale-95 sm:col-span-2 lg:col-span-1 bg-white">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-4 sm:mb-6 md:mb-7 text-xl sm:text-2xl md:text-3xl">
              <i className="fas fa-heart"></i>
            </div>
            <h3 className="font-bold text-lg sm:text-2xl md:text-3xl mb-3 sm:mb-5 md:mb-6 text-slate-900">❤️ 인연과 관계</h3>
            <p className="text-slate-800 leading-relaxed text-sm sm:text-lg md:text-xl font-medium">당신을 돕는 귀인과 조심해야 할 악연, 그리고 건강한 관계 유지를 위한 맞춤 조언을 담았습니다.</p>
          </div>
        </div>
      </section>

      {/* Differentiation (차별화) */}
      <section className="py-12 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 bg-slate-900 text-white relative overflow-hidden">
        {/* 마스코트 - Differentiation 섹션 */}
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 opacity-30 sm:opacity-40 pointer-events-none">
          <img
            src="/images/hero/promo (3).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="serif text-2xl sm:text-4xl md:text-5xl text-center mb-10 sm:mb-16 md:mb-20 px-4 font-bold leading-[1.4]">✨ 왜 <span className="text-accent italic">운명테라피</span>여야 할까요?</h2>
          <div className="grid md:grid-cols-2 gap-0 border border-slate-700 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-slate-800/50">
              <p className="text-slate-300 font-bold mb-6 md:mb-9 uppercase tracking-widest text-xs sm:text-base md:text-lg">❌ 기존 대면 상담</p>
              <ul className="space-y-4 md:space-y-6">
                <li className="flex items-start gap-3 md:gap-5">
                  <i className="fas fa-times-circle mt-1 text-slate-300 text-base md:text-xl flex-shrink-0"></i>
                  <span className="text-slate-200 text-sm sm:text-lg md:text-xl font-medium">15만원 이상의 높은 비용</span>
                </li>
                <li className="flex items-start gap-3 md:gap-5">
                  <i className="fas fa-times-circle mt-1 text-slate-300 text-base md:text-xl flex-shrink-0"></i>
                  <span className="text-slate-200 text-sm sm:text-lg md:text-xl font-medium">상담 후 잊혀지는 휘발성 정보</span>
                </li>
                <li className="flex items-start gap-3 md:gap-5">
                  <i className="fas fa-times-circle mt-1 text-slate-300 text-base md:text-xl flex-shrink-0"></i>
                  <span className="text-slate-200 text-sm sm:text-lg md:text-xl font-medium">부적 강매나 불안 조장</span>
                </li>
              </ul>
            </div>
            <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-slate-800 relative">
              <div className="absolute top-0 right-0 p-2 sm:p-4 md:p-5 bg-accent text-slate-900 text-[10px] sm:text-sm md:text-base font-bold uppercase tracking-tighter">RECOMMENDED</div>
              <p className="text-accent font-bold mb-5 sm:mb-7 md:mb-9 uppercase tracking-widest text-xs sm:text-base md:text-lg mt-8 sm:mt-0">✅ 운명테라피 (PDF)</p>
              <ul className="space-y-4 sm:space-y-6 md:space-y-7">
                <li className="flex items-start gap-3 md:gap-5">
                  <i className="fas fa-check-circle mt-1 text-accent text-base sm:text-xl md:text-2xl flex-shrink-0"></i>
                  <span className="font-semibold text-sm sm:text-lg md:text-xl text-white">100페이지 분량의 압도적 체계성</span>
                </li>
                <li className="flex items-start gap-3 md:gap-5">
                  <i className="fas fa-check-circle mt-1 text-accent text-base sm:text-xl md:text-2xl flex-shrink-0"></i>
                  <span className="font-semibold text-sm sm:text-lg md:text-xl text-white">영구 보관 가능한 나만의 인생 지도</span>
                </li>
                <li className="flex items-start gap-3 md:gap-5">
                  <i className="fas fa-check-circle mt-1 text-accent text-base sm:text-xl md:text-2xl flex-shrink-0"></i>
                  <span className="font-semibold text-sm sm:text-lg md:text-xl text-white">강매 없는 순수 학술적 분석</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proof (신뢰 구축) */}
      <section className="py-12 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="serif text-2xl sm:text-4xl md:text-5xl text-center mb-10 sm:mb-16 md:mb-20 text-slate-900 px-4 font-bold leading-[1.4]">💬 먼저 인생 지도를 받으신 분들의 기록</h2>

          {/* 후기 슬라이더 */}
          <div className="relative min-h-[340px] sm:min-h-[280px] md:min-h-[260px]">
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
                <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl md:rounded-2xl card-shadow border border-slate-200">
                  <div className="flex items-center gap-1 sm:gap-2 text-amber-400 mb-4 sm:mb-6 md:mb-7">
                    <i className="fas fa-star text-base sm:text-xl md:text-2xl"></i>
                    <i className="fas fa-star text-base sm:text-xl md:text-2xl"></i>
                    <i className="fas fa-star text-base sm:text-xl md:text-2xl"></i>
                    <i className="fas fa-star text-base sm:text-xl md:text-2xl"></i>
                    <i className="fas fa-star text-base sm:text-xl md:text-2xl"></i>
                  </div>
                  <p className="text-slate-800 leading-relaxed mb-4 sm:mb-6 md:mb-7 font-semibold italic text-sm sm:text-lg md:text-xl">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p className="text-xs sm:text-base md:text-lg text-slate-600 font-medium">— {review.author}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 인디케이터 */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`h-2 sm:h-3 rounded-full transition-all ${
                  currentReview === index
                    ? 'bg-accent w-8 sm:w-10'
                    : 'bg-slate-300 hover:bg-slate-400 w-2 sm:w-3'
                }`}
                aria-label={`후기 ${index + 1}번으로 이동`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sample (투명성) */}
      <section className="py-12 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        {/* 마스코트 - Sample 섹션 */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 opacity-35 sm:opacity-45 pointer-events-none">
          <img
            src="/images/hero/promo (4).png"
            alt="마스코트"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-14 md:mb-16 lg:mb-20">
            <h2 className="serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-7 text-slate-900 px-4 font-bold leading-[1.4]">
              📄 실제 분석서는<br /> 이렇게 제공됩니다
            </h2>
            <p className="text-slate-700 text-sm sm:text-lg md:text-xl px-4 font-medium">
              100페이지에 달하는 정밀한 분석 내용을 미리 확인해보세요
            </p>
          </div>

          {/* 분석서 샘플 이미지와 구성 요소를 나란히 배치 */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* 분석서 샘플 이미지 영역 */}
            <div className="relative">
              <div className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-slate-200 overflow-hidden">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-slate-100">
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
              <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-accent/10 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
            </div>

            {/* 분석서 주요 구성 요소 - 오른쪽에 배치 */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6">
              <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-7 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-5">
                  <i className="fas fa-chart-pie text-amber-600 text-xl sm:text-3xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 text-xs sm:text-lg md:text-xl text-center">📊 오행 균형 그래프</h3>
                <p className="text-[11px] sm:text-base text-slate-500 leading-relaxed text-center flex-grow">타고난 기질과 성향 분석</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-7 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-5">
                  <i className="fas fa-calendar-alt text-blue-600 text-xl sm:text-3xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 text-xs sm:text-lg md:text-xl text-center">📅 10년 대운 분석</h3>
                <p className="text-[11px] sm:text-base text-slate-500 leading-relaxed text-center flex-grow">인생 전환점 시기 포착</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-7 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-5">
                  <i className="fas fa-moon text-rose-600 text-xl sm:text-3xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 text-xs sm:text-lg md:text-xl text-center">🌙 월별 정밀 운세</h3>
                <p className="text-[11px] sm:text-base text-slate-500 leading-relaxed text-center flex-grow">상세한 월별 가이드</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-7 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-5">
                  <i className="fas fa-prescription text-green-600 text-xl sm:text-3xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 sm:mb-3 text-xs sm:text-lg md:text-xl text-center">💊 맞춤 처방전</h3>
                <p className="text-[11px] sm:text-base text-slate-500 leading-relaxed text-center flex-grow">개인별 최적화 조언</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing (정당한 대가) */}
      <section id="pricing" className="py-12 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 bg-slate-50 flex justify-center">
        <div className="max-w-2xl w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-6 sm:p-10 md:p-12 lg:p-14 text-center text-white">
            <p className="text-accent uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold text-xs sm:text-base md:text-lg mb-3 sm:mb-5">⏰ LIMITED OFFER</p>
            <h2 className="serif text-xl sm:text-3xl md:text-4xl mb-3 sm:mb-5 leading-[1.4]">🎯 운명테라피 인생 지도</h2>
            <p className="text-slate-200 text-sm sm:text-lg md:text-xl mb-5 sm:mb-8 font-medium">15년 전문성을 담은 100페이지 분석서</p>

            {/* 카운트다운 타이머 */}
            <div className="bg-slate-800/50 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-7 border border-accent/20">
              <p className="text-accent text-xs sm:text-base md:text-lg font-bold mb-2 sm:mb-4">⏱️ 특별 할인 마감까지</p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <div className="bg-slate-900/80 rounded-lg md:rounded-xl p-2 sm:p-4">
                  <div className="text-xl sm:text-3xl md:text-4xl font-bold text-accent">{timeLeft.days}</div>
                  <div className="text-[10px] sm:text-sm md:text-base text-slate-400 mt-0.5 sm:mt-2">일</div>
                </div>
                <div className="bg-slate-900/80 rounded-lg md:rounded-xl p-2 sm:p-4">
                  <div className="text-xl sm:text-3xl md:text-4xl font-bold text-accent">{timeLeft.hours}</div>
                  <div className="text-[10px] sm:text-sm md:text-base text-slate-400 mt-0.5 sm:mt-2">시간</div>
                </div>
                <div className="bg-slate-900/80 rounded-lg md:rounded-xl p-2 sm:p-4">
                  <div className="text-xl sm:text-3xl md:text-4xl font-bold text-accent">{timeLeft.minutes}</div>
                  <div className="text-[10px] sm:text-sm md:text-base text-slate-400 mt-0.5 sm:mt-2">분</div>
                </div>
                <div className="bg-slate-900/80 rounded-lg md:rounded-xl p-2 sm:p-4">
                  <div className="text-xl sm:text-3xl md:text-4xl font-bold text-accent">{timeLeft.seconds}</div>
                  <div className="text-[10px] sm:text-sm md:text-base text-slate-400 mt-0.5 sm:mt-2">초</div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-10 md:p-12 lg:p-14 text-center">
            {/* 희소성 강조 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl md:rounded-2xl p-3 sm:p-5 mb-5 sm:mb-8">
              <p className="text-amber-800 font-bold text-xs sm:text-base md:text-lg">
                <i className="fas fa-fire text-amber-500 mr-1 sm:mr-2"></i>
                이번 달 잔여 상담 가능 인원: <span className="text-lg sm:text-2xl md:text-3xl">12명</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 mb-5 sm:mb-8 md:mb-10">
              <span className="text-slate-300 line-through text-base sm:text-2xl md:text-3xl">₩99,000</span>
              <span className="text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 italic">₩39,000</span>
            </div>
            <p className="text-sm sm:text-lg md:text-xl text-slate-700 mb-6 sm:mb-10 font-medium">
              1인 기준 · 추가 인원 시 더 큰 할인! 🎉
            </p>

            <ul className="text-left space-y-3 sm:space-y-5 mb-8 sm:mb-12 text-slate-800 max-w-lg mx-auto">
              <li className="flex items-center gap-3 sm:gap-4">
                <i className="fas fa-check text-green-500 text-base sm:text-xl md:text-2xl flex-shrink-0"></i>
                <span className="text-sm sm:text-lg md:text-xl font-semibold">📄 100페이지 심층 PDF 분석서</span>
              </li>
              <li className="flex items-center gap-3 sm:gap-4">
                <i className="fas fa-check text-green-500 text-base sm:text-xl md:text-2xl flex-shrink-0"></i>
                <span className="text-sm sm:text-lg md:text-xl font-semibold">🎯 11가지 핵심 영역 완전 분석</span>
              </li>
              <li className="flex items-center gap-3 sm:gap-4">
                <i className="fas fa-check text-green-500 text-base sm:text-xl md:text-2xl flex-shrink-0"></i>
                <span className="text-sm sm:text-lg md:text-xl font-semibold">♾️ 평생 소장 및 무제한 열람</span>
              </li>
              <li className="flex items-center gap-3 sm:gap-4">
                <i className="fas fa-check text-green-500 text-base sm:text-xl md:text-2xl flex-shrink-0"></i>
                <span className="text-sm sm:text-lg md:text-xl font-semibold">✅ 불만족 시 100% 환불 (3일 이내)</span>
              </li>
            </ul>
            <button
              onClick={() => setShowPrivacyNotice(true)}
              className="w-full bg-slate-900 text-white py-4 sm:py-6 md:py-7 rounded-2xl text-base sm:text-xl md:text-2xl font-bold hover:bg-slate-800 active:scale-98 transition-all shadow-lg"
            >
              🚀 내 인생 지도 확인하기
            </button>
            <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-slate-500 italic font-medium">
              ⚠️ {currentMonth}월 {lastDayOfMonth}일 이후 정상가 99,000원으로 환원됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 보장 배지 섹션 */}
      <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 md:gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mb-3 sm:mb-5 md:mb-6">
                <i className="fas fa-shield-check text-green-600 text-xl sm:text-3xl md:text-4xl"></i>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 sm:mb-3 text-sm sm:text-lg md:text-xl">✅ 100% 환불 보장</h3>
              <p className="text-xs sm:text-base md:text-lg text-slate-700 font-medium">3일 이내 무조건 환불</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-3 sm:mb-5 md:mb-6">
                <i className="fas fa-lock text-blue-600 text-xl sm:text-3xl md:text-4xl"></i>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 sm:mb-3 text-sm sm:text-lg md:text-xl">🔒 보안 결제</h3>
              <p className="text-xs sm:text-base md:text-lg text-slate-700 font-medium">SSL 암호화 보호</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-purple-50 rounded-full flex items-center justify-center mb-3 sm:mb-5 md:mb-6">
                <i className="fas fa-user-shield text-purple-600 text-xl sm:text-3xl md:text-4xl"></i>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 sm:mb-3 text-sm sm:text-lg md:text-xl">🛡️ 개인정보 보호</h3>
              <p className="text-xs sm:text-base md:text-lg text-slate-700 font-medium">철저한 비밀 보장</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-amber-50 rounded-full flex items-center justify-center mb-3 sm:mb-5 md:mb-6">
                <i className="fas fa-certificate text-amber-600 text-xl sm:text-3xl md:text-4xl"></i>
              </div>
              <h3 className="font-bold text-slate-900 mb-1 sm:mb-3 text-sm sm:text-lg md:text-xl">🏅 전문가 인증</h3>
              <p className="text-xs sm:text-base md:text-lg text-slate-700 font-medium">국가 자격증 보유</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="serif text-3xl sm:text-4xl md:text-5xl text-center mb-12 sm:mb-16 md:mb-20 text-slate-900 px-4 font-bold leading-[1.5]">
            <span className="mr-2">❓</span>자주 묻는 질문
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <details className="bg-white rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 card-shadow cursor-pointer group border border-slate-200">
              <summary className="font-bold text-base sm:text-lg md:text-xl text-slate-900 list-none flex items-center justify-between gap-4">
                <span>📅 분석서는 언제 받을 수 있나요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform flex-shrink-0 text-lg sm:text-xl"></i>
              </summary>
              <p className="mt-5 sm:mt-6 text-slate-800 leading-relaxed text-base sm:text-lg md:text-xl font-medium">
                결제 후 24시간 이내에 입력하신 이메일로 PDF 파일이 발송됩니다.<br />
                명절이나 주말의 경우 소요 시간이 다소 길어질 수 있습니다.
              </p>
            </details>

            <details className="bg-white rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 card-shadow cursor-pointer group border border-slate-200">
              <summary className="font-bold text-base sm:text-lg md:text-xl text-slate-900 list-none flex items-center justify-between gap-4">
                <span>💰 환불 정책은 어떻게 되나요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform flex-shrink-0 text-lg sm:text-xl"></i>
              </summary>
              <p className="mt-5 sm:mt-6 text-slate-800 leading-relaxed text-base sm:text-lg md:text-xl font-medium">
                분석서를 받으신 후 3일 이내 불만족 시 100% 환불해드립니다.<br />
                단, 환불 사유를 간단히 작성해 주시면 서비스 개선에 참고하겠습니다.
              </p>
            </details>

            <details className="bg-white rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 card-shadow cursor-pointer group border border-slate-200">
              <summary className="font-bold text-base sm:text-lg md:text-xl text-slate-900 list-none flex items-center justify-between gap-4">
                <span>⏰ 출생 시간을 모르는 경우에도 가능한가요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform flex-shrink-0 text-lg sm:text-xl"></i>
              </summary>
              <p className="mt-5 sm:mt-6 text-slate-800 leading-relaxed text-base sm:text-lg md:text-xl font-medium">
                출생 시간을 모르시는 경우 '시간 미상'으로 선택하시면 됩니다.<br />
                생시를 모르셔도 괜찮습니다. 사주 분석에서는 태어난 날을 가장 중요한 요소 중 하나이니 걱정하지 않으셔도 됩니다!.
              </p>
            </details>

            <details className="bg-white rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 card-shadow cursor-pointer group border border-slate-200">
              <summary className="font-bold text-base sm:text-lg md:text-xl text-slate-900 list-none flex items-center justify-between gap-4">
                <span>🔬 정말 과학적인 분석인가요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform flex-shrink-0 text-lg sm:text-xl"></i>
              </summary>
              <p className="mt-5 sm:mt-6 text-slate-800 leading-relaxed text-base sm:text-lg md:text-xl font-medium">
                사주명리학은 동양 철학과 통계학이 결합된 학문입니다.<br />
                10년간 3,000명 이상의 상담 데이터를 기반으로 패턴을 분석하여 제공합니다.
              </p>
            </details>

            <details className="bg-white rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 card-shadow cursor-pointer group border border-slate-200">
              <summary className="font-bold text-base sm:text-lg md:text-xl text-slate-900 list-none flex items-center justify-between gap-4">
                <span>🔒 개인정보는 안전한가요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform flex-shrink-0 text-lg sm:text-xl"></i>
              </summary>
              <p className="mt-5 sm:mt-6 text-slate-800 leading-relaxed text-base sm:text-lg md:text-xl font-medium">
                모든 개인정보는 SSL 암호화되어 저장되며, 분석 목적 외에는 절대 사용되지 않습니다.<br />
                분석 완료 후 10일 이내 모든 정보는 자동 삭제됩니다.
              </p>
            </details>

            <details className="bg-white rounded-xl md:rounded-2xl p-6 sm:p-7 md:p-8 card-shadow cursor-pointer group border border-slate-200">
              <summary className="font-bold text-base sm:text-lg md:text-xl text-slate-900 list-none flex items-center justify-between gap-4">
                <span>💳 추가 비용이 발생하나요?</span>
                <i className="fas fa-chevron-down text-accent group-open:rotate-180 transition-transform flex-shrink-0 text-lg sm:text-xl"></i>
              </summary>
              <p className="mt-5 sm:mt-6 text-slate-800 leading-relaxed text-base sm:text-lg md:text-xl font-medium">
                39,000원 결제 후 추가 비용은 일체 발생하지 않습니다.<br />
                부적 구매나 추가 상담 권유는 절대 하지 않습니다.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 text-slate-500 text-center border-t border-slate-800 pb-24 md:pb-16">
        <div className="max-w-5xl mx-auto">
          <h3 className="serif text-lg sm:text-2xl md:text-3xl text-white mb-4 sm:mb-6 md:mb-8 italic opacity-50 font-bold">✨ 운명테라피</h3>
          <p className="text-xs sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-10 md:mb-12 px-4">
            우리는 당신의 삶이 더 선명해지기를 바랍니다.<br />
            통계와 철학의 힘으로 당신의 오늘과 내일을 응원합니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-10 mb-6 sm:mb-10 md:mb-12 text-[11px] sm:text-sm md:text-base font-medium uppercase tracking-widest px-4">
            <button onClick={() => setShowTerms(true)} className="hover:text-white transition-colors cursor-pointer min-h-[44px] flex items-center">📜 이용약관</button>
            <button onClick={() => setShowPrivacyPolicy(true)} className="hover:text-white transition-colors cursor-pointer min-h-[44px] flex items-center">🔒 개인정보처리방침</button>
            <button onClick={() => setShowModal(true)} className="hover:text-white transition-colors cursor-pointer min-h-[44px] flex items-center">💰 환불규정</button>
          </div>
          <p className="text-[9px] sm:text-xs md:text-sm opacity-30">© 2026 FATE THERAPY. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* 개인정보 수집 및 이용 동의 공지 창 */}
      {showPrivacyNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6 animate-modal-bg" onClick={() => setShowPrivacyNotice(false)}>
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-5 sm:p-6 md:p-7 flex items-center justify-between rounded-t-2xl md:rounded-t-3xl z-10">
              <h2 className="serif text-lg sm:text-xl md:text-2xl text-slate-900 font-bold">🔒 개인정보 수집 및 이용 안내</h2>
              <button onClick={() => setShowPrivacyNotice(false)} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0">
                <i className="fas fa-times text-slate-400 text-xl sm:text-2xl"></i>
              </button>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-5 sm:p-6 mb-7 sm:mb-8 rounded-r-xl">
                <p className="text-blue-800 font-semibold text-base sm:text-lg md:text-xl mb-2 sm:mb-3">⚠️ 중요 안내</p>
                <p className="text-blue-700 text-sm sm:text-base md:text-lg leading-relaxed">
                  본 서비스 이용을 위해 아래 개인정보 수집 및 이용에 대한 동의가 필요합니다.<br />
                  동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-7 mb-8 sm:mb-10">
                <div className="border border-slate-200 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-7 bg-slate-50">
                  <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-slate-900 mb-4 sm:mb-5">1. 수집하는 개인정보 항목</h3>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1 text-lg flex-shrink-0">•</span>
                      <span><strong>필수항목:</strong> 이름, 생년월일, 생시, 음력/양력 구분, 성별, 이메일 주소</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1 text-lg flex-shrink-0">•</span>
                      <span><strong>선택항목:</strong> 궁금한 점 (서비스 개선을 위한 의견)</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-7 bg-slate-50">
                  <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-slate-900 mb-4 sm:mb-5">2. 개인정보의 수집 및 이용 목적</h3>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-slate-700">
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1 text-lg flex-shrink-0">•</span>
                      <span>사주명리 분석서 작성 및 제공</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1 text-lg flex-shrink-0">•</span>
                      <span>분석서 PDF 파일 이메일 발송</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1 text-lg flex-shrink-0">•</span>
                      <span>서비스 이용 및 결제 처리</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-accent mt-1 text-lg flex-shrink-0">•</span>
                      <span>고객 문의 및 불만 처리</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-7 bg-slate-50">
                  <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-slate-900 mb-4 sm:mb-5">3. 개인정보의 보유 및 이용 기간</h3>
                  <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed">
                    수집된 개인정보는 분석서 제공 완료 후 <strong className="text-slate-900">6개월</strong>간 보관되며, 이후 자동으로 파기됩니다. 단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관됩니다.
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-7 bg-slate-50">
                  <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-slate-900 mb-4 sm:mb-5">4. 개인정보의 제3자 제공</h3>
                  <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed">
                    당사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 결제 처리를 위해 결제 대행사에 최소한의 정보(이름, 이메일)가 제공될 수 있습니다.
                  </p>
                </div>

                <div className="border border-red-200 rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-7 bg-red-50">
                  <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-red-900 mb-4 sm:mb-5">5. 개인정보 처리 거부 권리</h3>
                  <p className="text-sm sm:text-base md:text-lg text-red-800 leading-relaxed">
                    귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 서비스 이용이 불가능합니다.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
                <button
                  onClick={() => {
                    setShowPrivacyNotice(false);
                    setShowPrivacyPolicy(true);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl font-bold transition-all text-base sm:text-lg md:text-xl min-h-[56px]"
                >
                  전체 약관 보기
                </button>
                <button
                  onClick={() => {
                    setShowPrivacyNotice(false);
                    setShowModal(true);
                  }}
                  className="flex-1 bg-accent hover:bg-accent/90 text-slate-900 py-4 sm:py-5 md:py-6 rounded-xl md:rounded-2xl font-bold transition-all shadow-lg text-base sm:text-lg md:text-xl min-h-[56px]"
                >
                  동의하고 계속하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 개인정보 처리방침 모달 */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-modal-bg" onClick={() => setShowPrivacyPolicy(false)}>
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl z-10">
              <h2 className="serif text-xl sm:text-2xl text-slate-900 font-bold">개인정보 처리방침</h2>
              <button onClick={() => setShowPrivacyPolicy(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0">
                <i className="fas fa-times text-slate-400 text-xl"></i>
              </button>
            </div>

            <div className="p-6 sm:p-8 text-sm sm:text-base text-slate-700 leading-relaxed space-y-6">
              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제1조 (개인정보의 처리 목적)</h3>
                <p className="mb-2">운명테라피는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>사주명리 분석서 작성 및 제공</li>
                  <li>서비스 이용 및 결제 처리</li>
                  <li>고객 문의 및 불만 처리</li>
                  <li>서비스 개선 및 신규 서비스 개발</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제2조 (개인정보의 처리 및 보유기간)</h3>
                <p className="mb-2">운명테라피는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <p className="mb-2"><strong>보유기간:</strong> 분석서 제공 완료 후 6개월 (단, 관련 법령에 따라 보관이 필요한 경우 해당 기간)</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제3조 (처리하는 개인정보의 항목)</h3>
                <p className="mb-2">운명테라피는 다음의 개인정보 항목을 처리하고 있습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>필수항목:</strong> 이름, 생년월일, 생시, 음력/양력 구분, 성별, 이메일 주소</li>
                  <li><strong>선택항목:</strong> 궁금한 점</li>
                  <li><strong>자동 수집 항목:</strong> IP주소, 쿠키, 접속 로그 등</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제4조 (개인정보의 제3자 제공)</h3>
                <p className="mb-2">운명테라피는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>정보주체가 사전에 동의한 경우</li>
                  <li>결제 처리를 위한 결제 대행사 제공 (최소한의 정보만 제공)</li>
                  <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제5조 (개인정보의 파기)</h3>
                <p className="mb-2">운명테라피는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                <p className="mb-2"><strong>파기 방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제6조 (정보주체의 권리·의무 및 행사방법)</h3>
                <p className="mb-2">정보주체는 다음과 같은 권리를 행사할 수 있습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>개인정보 열람 요구</li>
                  <li>개인정보 정정·삭제 요구</li>
                  <li>개인정보 처리정지 요구</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제7조 (개인정보의 안전성 확보조치)</h3>
                <p className="mb-2">운명테라피는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                  <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                  <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제8조 (개인정보 보호책임자)</h3>
                <p className="mb-2">운명테라피는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                <p className="mb-2"><strong>개인정보 보호책임자</strong><br />
                이메일: privacy@fatetherapy.com<br />
                연락처: (운영 시간: 평일 09:00 ~ 18:00)</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제9조 (개인정보 처리방침 변경)</h3>
                <p>이 개인정보 처리방침은 2026년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowPrivacyPolicy(false);
                    setShowPrivacyNotice(true);
                  }}
                  className="w-full bg-accent hover:bg-accent/90 text-slate-900 py-4 rounded-xl font-bold transition-all shadow-lg text-base sm:text-lg"
                >
                  돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이용약관 모달 */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-modal-bg" onClick={() => setShowTerms(false)}>
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl z-10">
              <h2 className="serif text-xl sm:text-2xl text-slate-900 font-bold">이용약관</h2>
              <button onClick={() => setShowTerms(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors flex-shrink-0">
                <i className="fas fa-times text-slate-400 text-xl"></i>
              </button>
            </div>

            <div className="p-6 sm:p-8 text-sm sm:text-base text-slate-700 leading-relaxed space-y-6">
              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제1조 (목적)</h3>
                <p>이 약관은 운명테라피(이하 "회사")가 제공하는 사주명리 분석서 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제2조 (정의)</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>"서비스"란 회사가 제공하는 사주명리 분석서 작성 및 제공 서비스를 의미합니다.</li>
                  <li>"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                  <li>"분석서"란 이용자가 제공한 정보를 바탕으로 작성된 사주명리 분석 PDF 파일을 의미합니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제3조 (약관의 게시와 개정)</h3>
                <p className="mb-2">회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
                <p>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정된 약관은 서비스 화면에 공지하거나 기타의 방법으로 이용자에게 공지합니다.</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제4조 (서비스의 제공)</h3>
                <p className="mb-2">회사는 다음과 같은 서비스를 제공합니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>사주명리 분석서 작성 및 제공</li>
                  <li>분석서 PDF 파일 이메일 발송</li>
                  <li>서비스 관련 고객 지원</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제5조 (서비스 이용 요금)</h3>
                <p className="mb-2">서비스 이용 요금은 다음과 같습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>1인 기준: 39,000원 (정상가 99,000원)</li>
                  <li>2인 기준: 70,000원 (정상가 198,000원)</li>
                  <li>3인 기준: 100,000원 (정상가 297,000원)</li>
                  <li>4인 기준: 125,000원 (정상가 396,000원)</li>
                </ul>
                <p className="mt-2">할인 가격은 한정 기간 동안 제공되며, 기간 종료 후 정상가로 환원될 수 있습니다.</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제6조 (결제 및 환불)</h3>
                <p className="mb-2"><strong>결제:</strong> 서비스 이용 요금은 선불로 결제되며, 결제 완료 후 분석서 작성이 시작됩니다.</p>
                <p className="mb-2"><strong>환불:</strong> 분석서를 받으신 후 3일 이내 불만족 시 100% 환불해드립니다. 환불 요청은 이메일을 통해 접수할 수 있습니다.</p>
                <p><strong>환불 불가 사항:</strong> 분석서 제공 완료 후 3일이 경과한 경우, 이용자의 귀책사유로 인한 서비스 미이용 등</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제7조 (서비스 이용 시간)</h3>
                <p>분석서는 결제 완료 후 영업일 기준 24시간 이내에 제공됩니다. 명절이나 주말의 경우 소요 시간이 다소 길어질 수 있습니다.</p>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제8조 (이용자의 의무)</h3>
                <p className="mb-2">이용자는 다음 행위를 하여서는 안 됩니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>타인의 개인정보를 도용하거나 부정하게 사용하는 행위</li>
                  <li>서비스의 안정적 운영을 방해하는 행위</li>
                  <li>분석서를 무단으로 복제, 배포, 판매하는 행위</li>
                  <li>기타 관련 법령에 위반되는 행위</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제9조 (면책사항)</h3>
                <p className="mb-2">회사는 다음의 경우에 대해 책임을 지지 않습니다:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 중단</li>
                  <li>이용자의 귀책사유로 인한 서비스 이용 장애</li>
                  <li>분석서의 내용에 대한 개인적 해석 및 적용에 따른 결과</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3">제10조 (분쟁의 해결)</h3>
                <p>회사와 이용자 간에 발생한 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-4">본 약관은 2026년 1월 1일부터 시행됩니다.</p>
                <button
                  onClick={() => setShowTerms(false)}
                  className="w-full bg-accent hover:bg-accent/90 text-slate-900 py-4 rounded-xl font-bold transition-all shadow-lg text-base sm:text-lg"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                          name={`name-${index}`}
                          placeholder="실명을 입력해주세요"
                          value={formData.people[index]?.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value, index)}
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
                            name={`birthDate-${index}`}
                            value={formData.people[index]?.birthDate || ''}
                            onChange={(e) => handleInputChange('birthDate', e.target.value, index)}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white"
                            required
                          />
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium text-slate-700 mb-2">생시 *</label>
                          <input
                            type="time"
                            name={`birthTime-${index}`}
                            value={formData.people[index]?.birthTime || ''}
                            onChange={(e) => handleInputChange('birthTime', e.target.value, index)}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white"
                            required
                          />
                        </div>
                      </div>

                      {/* 음력/양력 & 성별 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="text-left">
                          <label className="block text-sm font-medium text-slate-700 mb-2">음력/양력 *</label>
                          <select 
                            name={`calendarType-${index}`}
                            value={formData.people[index]?.calendarType || ''}
                            onChange={(e) => handleInputChange('calendarType', e.target.value, index)}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white" 
                            required
                          >
                            <option value="">선택</option>
                            <option value="solar">양력</option>
                            <option value="lunar">음력</option>
                            <option value="leap">윤달</option>
                          </select>
                        </div>
                        <div className="text-left">
                          <label className="block text-sm font-medium text-slate-700 mb-2">성별 *</label>
                          <select 
                            name={`gender-${index}`}
                            value={formData.people[index]?.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value, index)}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base bg-white" 
                            required
                          >
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
                    name="email"
                    placeholder="분석서를 받으실 이메일"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base"
                    required
                  />
                </div>

                {/* 궁금한 점 */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-slate-700 mb-2">궁금한 점 (선택)</label>
                  <textarea
                    name="question"
                    placeholder="평소 궁금한 내용을 적어주세요&#10;예: 올해 이직 운세, 재물운, 건강운 등"
                    rows={4}
                    value={formData.question}
                    onChange={(e) => handleInputChange('question', e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-base resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent/90 active:scale-98 text-slate-900 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '처리 중...' : `₩${currentPricing.price.toLocaleString()} 결제하고 인생 지도 받기`}
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
        <div className="fixed bottom-20 sm:bottom-24 md:bottom-8 left-3 sm:left-6 md:left-8 right-3 sm:right-auto bg-white rounded-xl md:rounded-2xl shadow-2xl p-3 sm:p-5 border border-slate-200 max-w-sm md:max-w-md animate-fade-in z-40">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-check text-green-600 text-base sm:text-2xl"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-base md:text-lg font-bold text-slate-800 truncate">
                🎉 {['서울 강남구', '부산 해운대구', '경기 성남시', '인천 연수구', '대구 수성구'][Math.floor(Math.random() * 5)]} {['김', '이', '박', '최', '정'][Math.floor(Math.random() * 5)]}OO님
              </p>
              <p className="text-[10px] sm:text-sm text-slate-500 mt-0.5 sm:mt-1">방금 인생 지도를 신청했습니다</p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA */}
      <div className="sticky-cta p-3 sm:p-5 md:hidden safe-area-inset-bottom">
        <button onClick={() => setShowPrivacyNotice(true)} className="w-full bg-slate-900 text-white py-3.5 sm:py-5 rounded-xl font-bold shadow-xl active:scale-98 transition-transform text-sm sm:text-lg min-h-[52px]">
          🚀 1인 ₩39,000부터 시작하기
        </button>
      </div>
    </div>
  );
}
