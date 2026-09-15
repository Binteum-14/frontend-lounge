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
  const [visitPasses, setVisitPassesState] = useState([]); 
  const [studyCards, setStudyCards] = useState([]);
  
  const qrImageUrl = "https://mcm-focus-lounge-visitpass-qr.s3.ap-northeast-2.amazonaws.com/visit-pass/qr/82ca68e6-0f41-4cbe-abd6-c3f33e81af49.png";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await getUsername();
        const fetchedName = userResponse?.result?.username || userResponse?.username;
        if (fetchedName) {
          setUsername(fetchedName); 
        }

        const passResponse = await getVisitPasses();
        const passes = passResponse?.result?.visitPasses || passResponse?.result;
        
        if (passes && Array.isArray(passes) && passes.length > 0) {
          const formattedPasses = passes.map((pass) => {
            const rawDate = pass.diagnosedAt || pass.createdAt;
            const passId = pass.visitPassId || pass.id;
            
            // 🌟 1순위: 오직 이 패스 고유 ID에 매칭된 데이터만 확인
            let cachedImage = localStorage.getItem(`pass_image_${passId}`);
            let cachedTitle = localStorage.getItem(`pass_title_${passId}`);

            // 🌟 2순위: 고유 ID 매칭 값이 없다면 히스토리 배열에서 해당 passId 기록 탐색
            if (!cachedImage) {
              try {
                const history = JSON.parse(localStorage.getItem('passBagHistory') || '[]');
                const matched = history.find(h => h.passId === passId);
                if (matched) {
                  cachedImage = matched.productImage;
                  cachedTitle = matched.productTitle;
                }
              } catch (e) {
                console.error(e);
              }
            }

            return {
              id: passId,
              issuedDate: rawDate ? rawDate.split('T')[0].replace(/-/g, '.') : '2026.09.15',
              qrUrl: pass.qrImageUrl || qrImageUrl,
              bagName: cachedTitle || pass.bagName || pass.itemName || pass.name || 'MCM Bag',
              bagImageUrl: pass.bagImageUrl || pass.productImage || pass.imageUrl || pass.bagImage || cachedImage || null
            };
          });
          setVisitPassesState(formattedPasses);
        }

        const focusResponse = await getFocusPasses(null, 10);
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
      setVisitPassesState([]);
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

  const handleVisitPassClick = (pass) => {
    setSelectedTicketData({
      bgUrl: visitPassBg,
      downloadName: 'MCM_Visit_Pass.png',
      qrData: pass.qrUrl, 
      // 🌟 상세 모달로 가방 이미지 데이터를 안전하게 전달
      bagImageUrl: pass.bagImageUrl || pass.productImage || pass.imageUrl || pass.bagImage,
      fields: [
        { label: 'Bag', value: pass.bagName, className: 'passenger-field' },
        { label: 'Issued', value: pass.issuedDate, className: 'issued-field' },
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

          {/* 스크롤 가능한 컨테이너 */}
          <div 
            style={{
              maxHeight: '380px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              paddingRight: '5px'
            }}
          >
            {visitPasses.length > 0 ? (
              visitPasses.map((pass) => (
                <div
                  key={pass.id}
                  onClick={() => handleVisitPassClick(pass)}
                  style={{ 
                    backgroundImage: `url(${visitPassBg})`, 
                    width: '100%',
                    height: '130px', 
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    borderRadius: '8px'
                  }}
                >
                  {/* 가방 이미지와 이름 영역 (left 조절 가능) */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '25px', 
                      left: '175px', 
                      transform: 'translateX(-50%)',
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '4px',
                      textAlign: 'center',
                      width: '130px'
                    }}
                  >
                    {pass.bagImageUrl && (
                      <div style={{ width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img 
                          src={pass.bagImageUrl} 
                          alt={pass.bagName} 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                        />
                      </div>
                    )}
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                      {pass.bagName}
                    </span>
                  </div>

                  <div className="ticket-overlay-field issued-field">
                    <span className="ticket-label">Issued</span>
                    <span className="ticket-val">{pass.issuedDate}</span>
                  </div>

                  <div className="ticket-overlay-qr"
                  style={{ transform: 'translateX(-4px) translateY(-30px)' }}>
                    <img
                      src={pass.qrUrl}
                      alt="Visit Pass QR Code"
                      style={{ width: '65px', height: '65px', objectFit: 'contain' }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '13px', color: '#666', textAlign: 'center', padding: '20px 0' }}>
                발급된 Visit Pass가 없습니다.
              </div>
            )}
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