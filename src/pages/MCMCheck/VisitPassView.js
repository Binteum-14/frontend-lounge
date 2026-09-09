import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVisitPass } from '../../api';
import './VisitPassView.css';

import ticketImg from '../../assets/images/VisitPass.png'; 
import bgImage from '../../assets/images/MCMCheckBackground.png';

const VisitPassView = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // 백엔드 응답을 담을 상태 추가

  useEffect(() => {
    const fetchPass = async () => {
      setLoading(true);
      try {
        // 💡 주의: 발급 API는 recommendationProductId 파라미터가 필요합니다. 
        // 이전 페이지(진단 등)에서 넘어온 상품 ID가 있다면 넣어주어야 합니다.
        const recommendationProductId = 1; // 예시 ID (실제 전달받은 ID로 변경 필요)
        
        const response = await createVisitPass(recommendationProductId);
        setUserData(response);
      } catch (error) {
        console.error("Visit Pass 발급 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPass();
  }, []);

  return (
    <div
      className="visit-pass-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${bgImage})`,
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

          <div className="qr-code-overlay">
            {loading ? (
              <span style={{ fontSize: '11px', color: '#666' }}>생성 중...</span>
            ) : (
              <img
                src={userData?.result?.qrImageUrl} // result를 거치도록 수정
                alt="Visit Pass QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
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