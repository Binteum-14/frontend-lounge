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

  // 🌟 전달받은 가방 이름과 이미지 추출
  const productTitle = location.state?.productTitle;
  const productImage = location.state?.productImage;

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

        // 🌟 [추가 포인트] 패스가 성공적으로 생성/조회될 때 해당 가방 이미지와 이름을 로컬스토리지에 저장
        const passInfo = (() => {
          if (!response?.result) return null;
          if (Array.isArray(response.result.visitPasses)) {
            return response.result.visitPasses[0];
          }
          return response.result;
        })();

        const passId = passInfo?.visitPassId || passInfo?.id;
        if (passId) {
          if (productImage) {
            localStorage.setItem(`pass_image_${passId}`, productImage);
            localStorage.setItem('lastProductImage', productImage);
          }
          if (productTitle) {
            localStorage.setItem(`pass_title_${passId}`, productTitle);
            localStorage.setItem('lastProductTitle', productTitle);
          }

          // 🌟 추가: 전체 발급 내역 배열(History)에도 누적 저장하여 과거 패스들까지 커버
          try {
            const existingHistory = JSON.parse(localStorage.getItem('passBagHistory') || '[]');
            const isAlreadyExist = existingHistory.some(item => item.passId === passId);
            if (!isAlreadyExist && productImage) {
              existingHistory.unshift({ passId, productImage, productTitle }); // 최신 것이 맨 앞
              localStorage.setItem('passBagHistory', JSON.stringify(existingHistory));
            }
          } catch (e) {
            console.error("History 저장 에러", e);
          }
        }

      } catch (error) {
        console.error("Visit Pass 생성 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPass();
  }, [location.state, navigate, productImage, productTitle]);

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

          {/* 🌟 QR 코드 왼쪽 빈칸 영역에 가방 사진과 이름 표시 */}
          <div className="pass-product-info-overlay">
            {productImage && (
              <div className="pass-bag-img-box">
                <img src={productImage} alt={productTitle || "Selected Bag"} />
              </div>
            )}
            <div className="pass-bag-title-box">
              <span>{productTitle || "MCM Recommended Bag"}</span>
            </div>
          </div>

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