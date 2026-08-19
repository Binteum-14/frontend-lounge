import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postDiagnosis } from '../../api'; 
import './ResultView.css';

import mocaImg from '../../assets/images/ResultMoca.png'; 

const ResultView = ({ onGoToLounge, surveyAnswers }) => {
  const navigate = useNavigate(); 

  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const [dotCount, setDotCount] = useState(1);

  
  useEffect(() => {
    if (diagnosisResult) return; 

    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1); 
    }, 500);

    return () => clearInterval(interval);
  }, [diagnosisResult]);

  const loadingDots = '.'.repeat(dotCount);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const surveyQuestions = [
          ['가격이 부담돼요.', '나에게 어울리지 모르겠어요.', '다른 브랜드와 비교중이에요.'],
          ['전혀 영향 없음', '상관 없음', '보통', '영향을 많이 받는 편', '매우 큰 영향을 받음'],
          ['전혀 고민 안함', '고민 안함', '보통', '고민함', '매우 고민함'],
          ['한달에 1회 이상', '2~3개월에 1회', '가끔씩 떠남', '거의 가지 않는다'],
          ['거의 매일', '주 3~5회', '주 1~2회', '특별한 날만'],
          ['학교, 회사', '집', '야외 활동', '이동 시간이 많은편'],
          ['매일 출근, 등교할때', '친구, 연인과의 약속이나 모임', '여행이나 특별한 이벤트', '특별한 목적없이 소장용']
        ];

        const formattedAnswers = Object.entries(surveyAnswers).map(([qNo, selectedOptionText]) => {
          const qIdx = Number(qNo) - 1;
          const options = surveyQuestions[qIdx] || [];
          const answerIndex = options.indexOf(selectedOptionText);
          const answerNo = answerIndex !== -1 ? answerIndex + 1 : 1;

          return {
            questionNo: Number(qNo),
            answerNo: answerNo
          };
        });

        const response = await postDiagnosis({ answers: formattedAnswers });
        
        if (response.isSuccess) {
          setDiagnosisResult(response.result); 
        }
      } catch (error) {
        console.error("진단 결과를 불러오는 데 실패했습니다.", error);
      }
    };

    if (surveyAnswers && Object.keys(surveyAnswers).length > 0) {
      fetchResult();
    }
  }, [surveyAnswers]);

  const topProduct = diagnosisResult?.products?.[0];

  const handleGoToBagDetail = () => {
    navigate('/bag-detail', { 
      state: { products: diagnosisResult?.products } 
    });
  };

  return (
    <div className="result-container">
      <div className="result-header-area">
        <span className="party-icon">🎉</span>
        <h1 className="result-main-title">BOARDING COMPLETE</h1>
        <span className="party-icon">🎉</span>
      </div>
      <p className="result-sub-title">고객님의 여행 준비가 완료되었습니다.</p>

      <div className="result-content-grid">
        
        <div className="result-left-section">
          <div className="result-moca-wrapper">
            <img src={mocaImg} alt="AI Moca" className="result-moca-img" />
          </div>

          <div className="result-card profile-card">
            <h3 className="card-title">AI 여행 프로필</h3>
            {diagnosisResult ? (
              <ul className="profile-list">
                {diagnosisResult.resultSummary
                  .split('.')
                  .map(sentence => sentence.trim())
                  .filter(sentence => sentence.length > 0)
                  .map((sentence, index) => (
                    <li key={index}>
                      <span className="checkbox-icon">✓</span>
                      {sentence}.
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="profile-summary-text" style={{ fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                AI가 프로필을 분석 중입니다{loadingDots}
              </p>
            )}
          </div>
        </div>

        <div className="result-card recommend-card">
          <h3 className="card-title">AI가 고객님께 이 제품을 추천하는 이유</h3>
          
          {topProduct ? (
            <ul className="recommend-reasons">
              {topProduct.recommendationReason
                .split('.')
                .map(sentence => sentence.trim())
                .filter(sentence => sentence.length > 0)
                .map((sentence, index) => (
                  <li key={index}>
                    <span className="reason-icon">💼</span> 
                    {sentence}.
                  </li>
                ))}
            </ul>
          ) : (
            <ul className="recommend-reasons">
              <li>
                <span className="reason-icon">💼</span> 
                추천 이유를 불러오는 중입니다{loadingDots}
              </li>
            </ul>
          )}

          <div 
            className="recommend-product-area clickable-bag-area" 
            onClick={handleGoToBagDetail}
            style={{ cursor: 'pointer' }}
          >
            <div className="match-circle-wrapper">
              <div className="match-score-circle">
                <span className="match-label">AI 적합도</span>
                <span className="match-percent" style={{ fontSize: '24px' }}>
                  {topProduct ? `${topProduct.matchScore}%` : loadingDots}
                </span>
              </div>
              <button 
                type="button" 
                className="heart-btn-floating" 
                onClick={(e) => { e.stopPropagation(); }} 
              >
                🤍
              </button>
            </div>

            <div className="product-img-wrapper">
              {topProduct ? (
                <img 
                  src={topProduct.imageUrl} 
                  alt={topProduct.name} 
                  className="recommend-bag-img" 
                />
              ) : (
                <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '14px' }}>
                  가방 불러오는 중{loadingDots}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="result-footer-btn-area">
        <button type="button" className="goto-lounge-btn" onClick={onGoToLounge}>
          오너 라운지로 입장하기
        </button>
      </div>
    </div>
  );
};

export default ResultView;