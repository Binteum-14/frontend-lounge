import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultView.css';

import mocaImg from '../../assets/images/ResultMoca.png'; 
import bagImg from '../../assets/images/MCMBag.png';      

const ResultView = ({ onGoToLounge }) => {
  const navigate = useNavigate(); 

  const handleGoToBagDetail = () => {
    navigate('/bag-detail');
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
            <ul className="profile-list">
              <li><span className="checkbox-icon">☑</span> 실용성을 가장 중요하게 생각합니다.</li>
              <li><span className="checkbox-icon">☑</span> 한번 사면 오래 사용하는 타입입니다.</li>
              <li><span className="checkbox-icon">☑</span> 출퇴근 + 여행 겸용을 선호합니다.</li>
              <li><span className="checkbox-icon">☑</span> 수납력을 중요하게 생각합니다.</li>
            </ul>
          </div>
        </div>

        <div className="result-card recommend-card">
          <h3 className="card-title">AI가 고객님께 이 제품을 추천하는 이유</h3>
          <ul className="recommend-reasons">
            <li><span className="reason-icon">💼</span> 여행과 출퇴근 모두 활용 가능한 실용적인 크기</li>
            <li><span className="reason-icon">🧥</span> 오래 사용 가능한 클래식한 디자인</li>
            <li><span className="reason-icon">👜</span> 넉넉한 수납력과 다양한 포켓 구성</li>
            <li><span className="reason-icon">🤎</span> 고객님의 스타일과 가장 높은 적합도</li>
          </ul>

          <div 
            className="recommend-product-area clickable-bag-area" 
            onClick={handleGoToBagDetail}
            style={{ cursor: 'pointer' }}
          >
            <div className="match-circle-wrapper">
              <div className="match-score-circle">
                <span className="match-label">AI 적합도</span>
                <span className="match-percent">96%</span>
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
              <img src={bagImg} alt="Recommended MCM Bag" className="recommend-bag-img" />
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