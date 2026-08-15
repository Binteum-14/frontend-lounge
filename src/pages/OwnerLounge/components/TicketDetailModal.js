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
          style={{ backgroundImage: `url(${ticketData.bgUrl})` }}
        >
          {ticketData.fields.map((field, index) => (
            <div key={index} className={`ticket-overlay-field ${field.className || ''}`}>
              {field.label && field.label !== 'FROM' && field.label !== 'TO' && (
                <span className="ticket-label">{field.label}</span>
              )}
              <span className="ticket-val" style={field.style}>{field.value}</span>
            </div>
          ))}

          {ticketData.qrData && (
            <div className="ticket-overlay-qr">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData.qrData}`} alt="QR" />
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