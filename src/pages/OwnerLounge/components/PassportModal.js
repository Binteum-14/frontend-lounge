import React, { useState, useEffect } from 'react';
import { LogOut, UserX } from 'lucide-react';

import passportBookBg from '../../../assets/images/book.png';
import visitPassBg from '../../../assets/images/VisitPass.png';
import studyCardBg from '../../../assets/images/StudyCard.png';
import TicketDetailModal from './TicketDetailModal';
import { logoutUser, withdrawUser, getUsername, getVisitPasses, getFocusPasses } from '../../../api';

function PassportModal({ isOpen, onClose }) {
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [username, setUsername] = useState('사용자');
  const [issuedDate, setIssuedDate] = useState('2026.08.03'); 
  const [studyCards, setStudyCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUsername();
        const fetchedName = userResponse?.result?.username || userResponse?.username;
        if (fetchedName) {
          setUsername(fetchedName); 
        }

        const passResponse = await getVisitPasses();
        const passes = passResponse?.result?.visitPasses;
        if (passes && passes.length > 0) {
          const rawDate = passes[0].diagnosedAt; 
          if (rawDate) {
            setIssuedDate(rawDate.replace(/-/g, '.'));
          }
        }

        const focusResponse = await getFocusPasses(null, 10);
        console.log("포커스 패스 응답 확인:", focusResponse);
        
        const items = focusResponse?.result?.items;
        if (items && items.length > 0) {
          const formattedCards = items.map(item => ({
            id: item.focusRecordId,
            duration: `${Math.floor(item.allMinutes / 60)}시간 ${item.allMinutes % 60}분`,
            location: item.themeType === 'LOUNGE' ? '라운지' : '기내',
            from: item.departureAirport,
            to: item.arrivalAirport,
            flight: item.flightNumber,
            date: item.startedAt ? item.startedAt.split('T')[0].replace(/-/g, '.') : ''
          }));
          setStudyCards(formattedCards);
        }
      } catch (error) {
        console.error("데이터를 불러오지 못했습니다.", error);
      }
    };

    if (isOpen) {
      fetchData(); 
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.clear();

      setUsername('사용자');
      setStudyCards([]);

      alert("로그아웃되었습니다.");
      onClose();
      window.location.href = "/"; 
    }
  };

  const handleWithdraw = async () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      try {
        await withdrawUser();
        localStorage.removeItem('accessToken');
        localStorage.clear();

        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "/";
      } catch (error) {
        console.error("회원탈퇴 에러 상세:", error);
        alert("회원 탈퇴에 실패했습니다.");
      }
    }
  };

  const handleVisitPassClick = () => {
    setSelectedTicketData({
      bgUrl: visitPassBg,
      downloadName: 'MCM_Visit_Pass.png',
      qrData: `MCM-VISIT-PASS-${username.toUpperCase()}`, 
      fields: [
        { label: 'Passenger', value: username, className: 'passenger-field' },
        { label: 'Issued', value: issuedDate, className: 'issued-field' },
      ]
    });
  };

  const handleStudyCardClick = (card) => {
    setSelectedTicketData({
      bgUrl: studyCardBg,
      downloadName: `Study_Ticket_${card.flight}.png`,
      qrData: null,
      fields: [
        { label: 'FROM', value: card.from, className: 'sc-val-from' },
        { label: 'TO', value: card.to, className: 'sc-val-to' },
        { label: 'FLIGHT', value: card.flight, className: 'sc-flight-group' },
        { label: 'DATE', value: card.date, className: 'sc-date-group' },
        { label: '총 시간', value: card.duration, className: 'sc-duration-group' },
        { label: '장소', value: card.location, className: 'sc-location-group' },
      ]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="passport-modal-backdrop" onClick={onClose}>
      <div
        className="passport-book-container"
        style={{ backgroundImage: `url(${passportBookBg})` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="passport-left-page">
          <div className="user-account-section">
            <span className="label-name">이름</span>
            <h2 className="user-name">{username}</h2>

            <div className="account-buttons">
              <button type="button" className="account-btn" onClick={handleLogout}>
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
              <button type="button" className="account-btn danger" onClick={handleWithdraw}>
                <UserX size={16} />
                <span>회원탈퇴</span>
              </button>
            </div>
          </div>

          <h3 className="visit-pass-title">MY VISIT PASS</h3>

          <div
            className="img-ticket-card clickable"
            style={{ backgroundImage: `url(${visitPassBg})` }}
            onClick={handleVisitPassClick}
          >
            <div className="ticket-overlay-field passenger-field">
              <span className="ticket-label">Passenger</span>
              <span className="ticket-val">{username}</span>
            </div>

            <div className="ticket-overlay-field issued-field">
              <span className="ticket-label">Issued</span>
              <span className="ticket-val">{issuedDate}</span>
            </div>

            <div className="ticket-overlay-qr">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MCM-VISIT-PASS-${username.toUpperCase()}`}
                alt="QR Code"
              />
            </div>
          </div>
        </div>

        <div className="passport-right-page">
          <h3 className="study-cards-title">STUDY CARDS</h3>
          <div className="study-cards-scroll-container">
            {studyCards.map((card) => (
              <div 
                key={card.id}
                className="study-card-item clickable"
                style={{ backgroundImage: `url(${studyCardBg})`, cursor: 'pointer' }}
                onClick={() => handleStudyCardClick(card)}
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
        </div>
      </div>

      <TicketDetailModal
        isOpen={!!selectedTicketData}
        onClose={() => setSelectedTicketData(null)}
        ticketData={selectedTicketData}
      />
    </div>
  );
}

export default PassportModal;