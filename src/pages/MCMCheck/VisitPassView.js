import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createVisitPass } from '../../api'; 
import './VisitPassView.css';

import ticketImg from '../../assets/images/VisitPass.png'; 
import bgImage from '../../assets/images/MCMCheckBackground.png';

const VisitPassView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchPass = async () => {
      setLoading(true);
      try {
        const recommendationProductId = location.state?.recommendationProductId;
        
        if (!recommendationProductId) {
          console.error("recommendationProductId가 존재하지 않습니다.");
          alert("잘못된 접근입니다. 다시 시도해주세요.");
          navigate('/');
          return;
        }

        console.log("🚀 새로운 Visit Pass 생성을 요청합니다. 상품 ID:", recommendationProductId);

        const response = await createVisitPass(recommendationProductId);
        console.log("🔥 새로 생성된 Pass 응답:", response);
        setUserData(response);
      } catch (error) {
        console.error("Visit Pass 생성 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPass();
  }, [location.state, navigate]);

  // 화면에 렌더링할 데이터 추출
  const passInfo = (() => {
    if (!userData?.result) return null;
    if (Array.isArray(userData.result.visitPasses)) {
      return userData.result.visitPasses[0];
    }
    return userData.result;
  })();

  return (
    <div
      className="visit-pass-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1 
        className="lounge-logo" 
        role="link"
        tabIndex={0}
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
      >
        MCM LOUNGE
      </h1>

      <div className="visit-pass-content">
        <h2 className="pass-ready-title">YOUR VISIT PASS IS READY.</h2>

        <div className="ticket-img-wrapper">
          <img src={ticketImg} alt="MCM VISIT PASS" />

          {/* QR 코드 영역 */}
          <div className="qr-code-overlay">
            {loading ? (
              <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>발급 중...</span>
            ) : passInfo?.qrImageUrl ? (
              <img
                src={passInfo.qrImageUrl} 
                alt="Visit Pass QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: '11px', color: '#999' }}>정보 없음</span>
            )}
          </div>
        </div>

        <p className="pass-guide-text">
          매장에서 VISIT PASS의 QR 코드를 스캔하고 당신을 위한 제품을 바로 만나보세요.
        </p>
      </div>
    </div>
  );
};

export default VisitPassView;