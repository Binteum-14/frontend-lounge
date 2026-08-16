import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BagDetailView.css';

import bagImg1 from '../../assets/images/MCMBag.png';
import bagImg2 from '../../assets/images/MCMBag2.png';
import bagImg3 from '../../assets/images/MCMBag3.png';
import bgImage from '../../assets/images/MCMCheckBackground.png';

const BagDetailView = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      title: "STARK SIDE STUDS\nBACKPACK IN VISETOS",
      image: bagImg1,
      homepageUrl: "https://kr.mcmworldwide.com/ko_KR/%EA%B0%80%EB%B0%A9/%EB%B0%B1%ED%8C%A9/stark-%EC%82%AC%EC%9D%B4%EB%93%9C-%EC%8A%A4%ED%84%B0%EB%93%9C-%EB%B9%84%EC%84%B8%ED%86%A0%EC%8A%A4-%EB%B0%B1%ED%8C%A9/MMKEAVE12CO001.html?cgid=bags-backpacks",
      specs: {
        storage: "★★★★★",
        utility: "★★★★★",
        travel: "★★★★★",
        commute: "★★★★☆",
        laptop: "◯",
        airline: "◯"
      },
      analysisText: "높은 수납력과 뛰어난 활용도를 갖춘 백팩으로, 학교·업무·여행 등 다양한 상황에 적합합니다. 노트북 수납이 가능해 출퇴근용으로 활용하기 좋으며, 기내용 사이즈로 여행 시에도 편리하게 사용할 수 있습니다. 다만 방수 기능은 제한적이므로 우천 시 주의가 필요합니다."
    },
    {
      id: 2,
      title: "Aren Visetos Drawstring Backpack", 
      image: bagImg2,
      homepageUrl: "https://kr.mcmworldwide.com/ko_KR/%EA%B0%80%EB%B0%A9/%EB%B0%B1%ED%8C%A9/aren-%EB%B9%84%EC%84%B8%ED%86%A0%EC%8A%A4-%EB%93%9C%EB%A1%9C%EC%9A%B0%EC%8A%A4%ED%8A%B8%EB%A7%81-%EB%B0%B1%ED%8C%A9/MWKGATA03PZ001.html?cgid=bags-backpacks",
      specs: {
        storage: "★★★★☆",
        utility: "★★★★★",
        travel: "★★★★☆",
        commute: "★★★★★",
        laptop: "◯",
        airline: "✕"
      },
      analysisText: "세련된 다이아몬드 패턴과 뛰어난 착용감을 자랑하는 제품입니다. 가벼운 무게감으로 도심 속 일상이나 비즈니스 캐주얼 스타일에 최적화되어 있습니다."
    },
    {
      id: 3,
      title: "Stark Monogram Nylon Packable Backpack",
      image: bagImg3,
      homepageUrl: "https://kr.mcmworldwide.com/ko_KR/%EA%B0%80%EB%B0%A9/%EB%B0%B1%ED%8C%A9/%EC%8A%A4%ED%83%80%ED%81%AC-%EB%AA%A8%EB%85%B8%EA%B7%B8%EB%9E%A8-%EB%82%98%EC%9D%BC%EB%A1%A0-%ED%8C%A8%EC%BB%A4%EB%B8%94-%EB%B0%B1%ED%8C%A9/MMKEAVE05CO001.html?cgid=bags-backpacks",
      specs: {
        storage: "★★★★★",
        utility: "★★★★☆",
        travel: "★★★☆☆",
        commute: "★★★★★",
        laptop: "◯",
        airline: "◯"
      },
      analysisText: "넉넉한 내부 수납공간과 클래식한 디자인이 조화를 이루는 토트백입니다. 깔끔한 실루엣으로 오피스룩과 포멀한 스타일에 두루 어울립니다."
    }
  ];


  const [currentIndex, setCurrentIndex] = useState(0);


  const currentProduct = products[currentIndex];


  const handleNextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  return (
    <div 
      className="bag-detail-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1 
        className="lounge-logo" 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
      >
        MCM LOUNGE
      </h1>

      <div className="detail-modal-box">
        <span 
          className="go-homepage-link" 
          onClick={() => window.open(currentProduct.homepageUrl, '_blank')}
        >
          홈페이지에서 가방 보러가기 &gt;
        </span>

        <div className="detail-content-grid">
          <div className="detail-left-section">
            <h2 className="bag-title" style={{ whiteSpace: 'pre-line' }}>
              {currentProduct.title}
            </h2>
            <div className="detail-bag-img-wrapper">
              <img src={currentProduct.image} alt={currentProduct.title} />
            </div>
          </div>

          <div className="detail-right-section">
            <h3 className="analysis-title">AI PRODUCT ANALYSIS</h3>
            
            <ul className="spec-list">
              <li>
                <span className="spec-label">
                  <span className="spec-icon">👜</span> 수납력
                </span> 
                <span>{currentProduct.specs.storage}</span>
              </li>
              <li>
                <span className="spec-label">
                  <span className="spec-icon">👤</span> 활용도
                </span> 
                <span>{currentProduct.specs.utility}</span>
              </li>
              <li>
                <span className="spec-label">
                  <span className="spec-icon">✈️</span> 여행 적합도
                </span> 
                <span>{currentProduct.specs.travel}</span>
              </li>
              <li>
                <span className="spec-label">
                  <span className="spec-icon">💼</span> 출퇴근 적합도
                </span> 
                <span>{currentProduct.specs.commute}</span>
              </li>
              <li>
                <span className="spec-label">
                  <span className="spec-icon">💻</span> 노트북 수납
                </span> 
                <span>{currentProduct.specs.laptop}</span>
              </li>
              <li>
                <span className="spec-label">
                  <span className="spec-icon">💺</span> 기내용 적합성
                </span> 
                <span>{currentProduct.specs.airline}</span>
              </li>
            </ul>

            <div className="ai-analysis-result">
              <h4>AI 분석 결과</h4>
              <p>{currentProduct.analysisText}</p>
            </div>
          </div>
        </div>

        <div className="detail-footer-btns">
          <button type="button" className="btn-other-product" onClick={handleNextProduct}>
            다른 제품 보러가기
          </button>
          
          <button type="button" className="btn-visit-pass" onClick={() => navigate('/visit-pass')}>
            VISIT PASS 발급하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BagDetailView;