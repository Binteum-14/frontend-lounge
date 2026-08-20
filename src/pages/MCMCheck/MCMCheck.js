import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import './MCMCheck.css';
import bgImage from '../../assets/images/MCMCheckBackground.png';
import loadingMocaImg from '../../assets/images/LoadingMoca.png'; 
import mocaImg from '../../assets/images/AIMocaCheck.png';

import ResultView from './ResultView'; 

const surveyQuestions = [
  {
    id: 1,
    question: '럭셔리 구매를 망설이는 가장 큰 이유가 무엇인가요?',
    options: [
      '가격이 부담돼요.',
      '나에게 어울리지 모르겠어요.',
      '다른 브랜드와 비교중이에요.',
    ],
  },
  {
    id: 2,
    question: '가격이 구매 결정에 얼마나 영향력을 주나요?',
    options: [
      '전혀 영향 없음',
      '상관 없음',
      '보통',
      '영향을 많이 받는 편',
      '매우 큰 영향을 받음',
    ],
  },
  {
    id: 3,
    question: '구매 전 제품 활용성을 얼마나 고민하시나요?',
    options: [
      '전혀 고민 안함',
      '고민 안함',
      '보통',
      '고민함',
      '매우 고민함',
    ],
  },
  {
    id: 4,
    question: '평소 여행을 얼마나 자주 떠나는 편인가요?',
    options: [
      '한달에 1회 이상',
      '2~3개월에 1회',
      '가끔씩 떠남',
      '거의 가지 않는다',
    ],
  },
  {
    id: 5,
    question: '일주일에 외출은 어느 정도 하나요?',
    options: [
      '거의 매일',
      '주 3~5회',
      '주 1~2회',
      '특별한 날만',
    ],
  },
  {
    id: 6,
    question: '평소 가장 많은 시간을 보내는 곳은 어디인가요?',
    options: [
      '학교, 회사',
      '집',
      '야외 활동',
      '이동 시간이 많은편',
    ],
  },
  {
    id: 7,
    question: '럭셔리 제품을 많이 활용하는 순간은 언제인가요?',
    options: [
      '매일 출근, 등교할때',
      '친구, 연인과의 약속이나 모임',
      '여행이나 특별한 이벤트',
      '특별한 목적없이 소장용',
    ],
  },
];

const McmCheck = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false); 

  const currentQ = surveyQuestions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / surveyQuestions.length) * 100);

  const handleSelectOption = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: option,
    });
  };

  const handleNext = () => {
    if (!selectedAnswers[currentQ.id]) {
      alert('답변을 선택해주세요!');
      return;
    }

    if (currentIndex < surveyQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true); // 분석 완료 후 바로 결과 화면으로 이동
      }, 2500);
    }
  };

  if (isAnalyzing) {
    return (
      <div
        className="mcm-check-container"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div
          className="mcm-header-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          MCM LOUNGE
        </div>

        <div
          className="mcm-check-box"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img
            src={loadingMocaImg}
            alt="AI Moca 분석 중"
            className="moca-loading-img"
          />

          <h2 className="moca-loading-title">
            AI Moca가 분석 중이에요
          </h2>

          <p className="moca-loading-text">
            고객님의 답변을 바탕으로
            <br />
            가장 잘 어울리는 스타일을 찾고 있어요.
          </p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <ResultView
        onGoToLounge={() => navigate('/owner-lounge')}
        surveyAnswers={selectedAnswers}
      />
    );
  }

  return (
    <div className="mcm-check-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div 
        className="mcm-header-logo" 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
      >
        MCM LOUNGE
      </div>
      <div className="mcm-check-box">
        <div className="mcm-content-grid">
          <div className="mcm-left-panel">
            <div className="moca-speech-bubble" style={{ fontSize: '15px' }}>
              <p className="moca-hello" style={{ fontSize: '16px' }}>안녕하세요.</p>
              <p className="moca-name" style={{ fontSize: '18px' }}><strong>AI Moca</strong> 입니다.</p>
              <p className="moca-desc" style={{ fontSize: '14px', lineHeight: '1.5' }}>몇 가지 질문을 통해<br />당신의 구매 장벽을 진단하고<br />최적의 스타일을 추천해 드릴게요.</p>
            </div>
            <div className="moca-character-wrapper">
              <img src={mocaImg} alt="AI Moca" className="moca-img" />
            </div>
            <div className="moca-security-notice">
              <ShieldCheck size={26} className="security-icon" />
              <span>모든 정보는 안전하게 보호됩니다.<br />안심하고 답변해주세요.</span>
            </div>
          </div>
          <div className="mcm-right-panel">
            <div className="survey-top-info">
              <span className="q-counter">Q {currentIndex + 1} / {surveyQuestions.length}</span>
              <span className="q-percent">{progressPercent}% COMPLETE</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <h2 className="survey-question-text">{currentQ.question}</h2>
            <div className="survey-options-list">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === option;
                return (
                  <button 
                    key={idx} 
                    type="button" 
                    className={`survey-option-btn ${isSelected ? 'selected' : ''}`} 
                    onClick={() => handleSelectOption(option)}
                    style={{ fontSize: '16px', padding: '14px 18px' }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="survey-footer">
              <button type="button" className="survey-next-btn" onClick={handleNext}>
                {currentIndex === surveyQuestions.length - 1 ? '완료' : '다음'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default McmCheck;