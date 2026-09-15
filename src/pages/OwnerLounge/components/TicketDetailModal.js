import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

function TicketDetailModal({ isOpen, onClose, ticketData }) {
  const ticketRef = useRef(null);

  if (!isOpen || !ticketData) return null;

  const handleSaveImage = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 3,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = ticketData.downloadName || 'TICKET.png';
      link.click();
      alert('이미지가 저장되었습니다!');
    } catch (err) {
      console.error('저장 실패:', err);
    }
  };

  return (
    <div className="pass-detail-overlay" onClick={onClose}>
      <div className="pass-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div 
          ref={ticketRef} 
          className="img-ticket-card enlarged-ticket" 
          style={{ backgroundImage: `url(${ticketData.bgUrl})`, position: 'relative' }}
        >
          {/* 🌟 상세 모달 전용 가방 이미지와 이름 세로 배치 */}
          {ticketData.bagImageUrl && (
            <div 
              style={{ 
                position: 'absolute', 
                top: '30px', 
                left: '160px', 
                transform: 'translateX(-50%)',
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '4px',
                textAlign: 'center',
                width: '130px'
              }}
            >
              <div style={{ width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img 
                  src={ticketData.bagImageUrl} 
                  alt="Bag" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
              </div>
              {ticketData.fields.map((field, idx) => field.label === 'Bag' && (
                <span key={idx} style={{ fontSize: '10px', fontWeight: 'bold', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  {field.value}
                </span>
              ))}
            </div>
          )}

          {/* 기존 필드 렌더링 (Bag 라벨/텍스트는 위에서 처리했으므로 제외하거나 Issued만 렌더링) */}
          {ticketData.fields.map((field, index) => {
            if (field.label === 'Bag') return null; // Bag은 위에서 이미지와 함께 처리하므로 생략
            return (
              <div key={index} className={`ticket-overlay-field ${field.className || ''}`}>
                {field.label && field.label !== 'FROM' && field.label !== 'TO' && (
                  <span className="ticket-label">{field.label}</span>
                )}
                <span className="ticket-val" style={field.style}>{field.value}</span>
              </div>
            );
          })}

          {ticketData.qrData && (
            <div className="ticket-overlay-qr">
              <img 
                src={ticketData.qrData} 
                alt="Visit Pass QR Code" 
                onClick={() => window.open(ticketData.qrData, '_blank')}
                style={{ 
                  width: '65px', 
                  height: '65px', 
                  objectFit: 'contain', 
                  cursor: 'pointer',
                  transform: 'translateX(-4px) translateY(-0px)'
                }}
                title="클릭하여 원본 링크 열기"
              />
            </div>
          )}
        </div>

        <div className="pass-detail-buttons">
          <button type="button" className="detail-action-btn primary" onClick={handleSaveImage}>이미지 저장하기</button>
          <button type="button" className="detail-action-btn secondary" onClick={onClose}>뒤로 가기</button>
        </div>
      </div>
    </div>
  );
}

export default TicketDetailModal;