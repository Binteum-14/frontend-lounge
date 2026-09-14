import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createVisitPass, getVisitPasses } from '../../api';
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
        // 1. 이미 발급된 Visit Pass가 있는지 먼저 조회 시도
        const existingPasses = await getVisitPasses();
        
        console.log("🔥 서버 응답 데이터 전체:", existingPasses);

        const passesArray = existingPasses?.result?.visitPasses;
        if (existingPasses?.isSuccess && Array.isArray(passesArray) && passesArray.length > 0) {
          console.log("✅ 기존 발급된 패스 발견:", passesArray[0]);
          setUserData(existingPasses);
          setLoading(false);
          return;
        }

        console.log("⚠️ 기존 패스가 없으므로 새로 생성을 시도합니다.");

        // 2. 발급된 패스가 없다면 새로 생성 (POST)
        const recommendationProductId = location.state?.recommendationProductId;
        
        if (!recommendationProductId) {
          console.error("recommendationProductId가 존재하지 않습니다.");
          alert("잘못된 접근입니다. 다시 시도해주세요.");
          navigate('/');
          return;
        }

        const response = await createVisitPass(recommendationProductId);
        console.log("🔥 새로 생성된 Pass 응답:", response);
        setUserData(response);
      } catch (error) {
        console.error("Visit Pass 처리 실패:", error);
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

          {/* 🌟 티켓 안쪽 왼쪽 영역에 배치되는 추천 상품 정보 */}
          {!loading && passInfo && (
            <div className="ticket-product-overlay">
              {passInfo.productImageUrl && (
                <img 
                  src={passInfo.productImageUrl} 
                  alt="Recommended Bag" 
                />
              )}
              <p>
                {passInfo.productName}
              </p>
            </div>
          )}

          {/* QR 코드 영역 */}
          <div className="qr-code-overlay">
            {loading ? (
              <span style={{ fontSize: '11px', color: '#666' }}>생성 중...</span>
            ) : (
              <img
                src={passInfo?.qrImageUrl} 
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