import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../../api';
import './VisitPassView.css';

import ticketImg from '../../assets/images/VisitPass.png'; 
import bgImage from '../../assets/images/MCMCheckBackground.png';

const VisitPassView = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('USER');
  const [loading, setLoading] = useState(true);

  // PassportModal과 동일하게 유저네임만 불러와서 QR 생성하기
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userResponse = await getUsername();
        const fetchedName = userResponse?.result?.username || userResponse?.username;
        if (fetchedName) {
          setUsername(fetchedName);
        }
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
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MCM-VISIT-PASS-${username.toUpperCase()}`}
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