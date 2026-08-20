import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../../api';
import './VisitPassView.css';

import ticketImg from '../../assets/images/VisitPass.png'; 
import bgImage from '../../assets/images/MCMCheckBackground.png';

const VisitPassView = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);

  // 고정된 S3 QR 이미지 URL 상수로 선언
  const qrImageUrl = "https://mcm-focus-lounge-visitpass-qr.s3.ap-northeast-2.amazonaws.com/visit-pass/qr/82ca68e6-0f41-4cbe-abd6-c3f33e81af49.png";

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // API 연결 상태 유지용 호출 (필요시 데이터 활용 가능)
        await getUsername();
      } catch (error) {
        console.error("유저 정보를 불러오지 못했습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
                src={qrImageUrl}
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