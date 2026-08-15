import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './OwnerLounge.css';
import ChatSection from './components/ChatSection';
import PassportModal from './components/PassportModal';
import TicketDetailModal from './components/TicketDetailModal';

import loungeBg from '../../assets/images/OwnerLounge.png';
import studyCardBg from '../../assets/images/StudyCard.png';

const OwnerLounge = () => {
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const navigate = useNavigate();

  const [selectedCardDetail, setSelectedCardDetail] = useState(null);

  const togglePassport = () => {
    setIsPassportOpen((prev) => !prev);
  };

  const handleCardClick = (card) => {
    setSelectedCardDetail({
      bgUrl: studyCardBg,
      downloadName: `Study_Ticket_${card.flight}.png`,
      qrData: `STUDY-TICKET-${card.flight}`,
      fields: [
        { label: 'FLIGHT', value: card.flight, className: 'sc-flight-group' },
        { label: 'DATE', value: card.date, className: 'sc-date-group' },
        { label: '총 시간', value: card.duration, className: 'sc-duration-group' },
        { label: '장소', value: card.location, className: 'sc-location-group' },
      ]
    });
  };

  return (
    <div
      className="owner-lounge-container"
      style={{ backgroundImage: `url(${loungeBg})` }}
    >
      <button 
        type="button" 
        className="lounge-back-btn" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={16} />
        <span>Home</span>
      </button>

      <ChatSection onPassportClick={togglePassport} />

      <PassportModal isOpen={isPassportOpen} onClose={togglePassport} />

      <div className="study-cards-scroll-container">
        {[
          { id: 1, duration: '3시간 5분', location: '라운지', from: 'ICN', to: 'NRT', flight: 'KE888', date: '2026.08.03' },
          { id: 2, duration: '2시간 0분', location: '라운지', from: 'ICN', to: 'JFK', flight: 'KE011', date: '2026.08.01' },
          { id: 3, duration: '3시간 15분', location: '라운지', from: 'ICN', to: 'CDG', flight: 'KE901', date: '2026.07.29' },
        ].map((card) => (
          <div 
            key={card.id}
            className="study-card-item clickable"
            style={{ backgroundImage: `url(${studyCardBg})` }}
            onClick={() => handleCardClick(card)}
          >
            <div className="sc-data-overlay">
              <div className="sc-group sc-duration-group">
                <span className="sc-label">총 시간</span>
                <span className="sc-val">{card.duration}</span>
              </div>
              <div className="sc-group sc-location-group">
                <span className="sc-label">장소</span>
                <span className="sc-val">{card.location}</span>
              </div>
              <span className="sc-val-from">{card.from}</span>
              <span className="sc-val-to">{card.to}</span>
              <div className="sc-group sc-flight-group">
                <span className="sc-label">FLIGHT</span>
                <span className="sc-val-flight">{card.flight}</span>
              </div>
              <div className="sc-group sc-date-group">
                <span className="sc-label">DATE</span>
                <span className="sc-val-date">{card.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TicketDetailModal
        isOpen={!!selectedCardDetail}
        onClose={() => setSelectedCardDetail(null)}
        ticketData={selectedCardDetail}
      />
    </div>
  );
};

export default OwnerLounge;