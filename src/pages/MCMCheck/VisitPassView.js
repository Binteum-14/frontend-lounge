import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VisitPassView.css';

import ticketImg from '../../assets/images/VisitPass.png'; 
import bgImage from '../../assets/images/MCMCheckBackground.png';

const VisitPassView = () => {
  const navigate = useNavigate();

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
        onKeyDown={(e) => { 
          if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault(); 
            navigate('/'); 
          } 
        }}
        style={{ cursor: 'pointer' }}
      >
        MCM LOUNGE
      </h1>

      <div className="visit-pass-content">
        <h2 className="pass-ready-title">YOUR VISIT PASS IS READY.</h2>
        
        <div className="ticket-img-wrapper">
          <img src={ticketImg} alt="MCM VISIT PASS" />
        </div>

        <p className="pass-guide-text">
          매장에서 VISIT PASS의 QR 코드를 스캔하고 당신을 위한 제품을 바로 만나보세요.
        </p>
      </div>
    </div>
  );
};

export default VisitPassView;