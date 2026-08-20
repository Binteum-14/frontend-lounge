import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import mocaProfileImg from '../../../assets/images/Chatbot.png';
import passportImg from '../../../assets/images/MCMPassport.png';
import { sendChatMessage } from '../../../api';

function ChatSection({ onPassportClick }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      botName: 'AI Moca',
      text: `안녕하세요, 고객님! MCM 제품 관리에 대해 무엇이든 물어보세요.`,
      options: ['가죽 손상 예방법', '비 오는 날 관리법', '가방 보관 방법'],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([]); // 대화 내역 관리

  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: `[첨부 파일] ${file.name}` }]);
      e.target.value = '';
    }
  };

  const requestChatApi = async (userText, currentHistory) => {
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: userText }]);

    try {
      const payload = {
        message: userText,
        history: currentHistory || [],
      };

      const response = await sendChatMessage(payload);
      const resResult = response?.result || response?.data?.result || response; 
      const botText = resResult?.answer || resResult?.message || "답변을 가져왔습니다.";
      const candidates = resResult?.candidates || resResult?.suggestedQuestions || [];

      let botReplyObj = {
        id: Date.now() + 1,
        sender: 'bot',
        botName: 'AI Moca',
        text: botText,
      };

      if (Array.isArray(candidates) && candidates.length > 0) {
        botReplyObj.options = candidates.map((c) => (typeof c === 'string' ? c : c.name || c.question));
      }

      setMessages((prev) => [...prev, botReplyObj]);

      setHistory((prev) => [
        ...prev,
        { role: 'USER', content: userText },
        { role: 'ASSISTANT', content: botText },
      ]);

    } catch (error) {
      console.error("챗봇 API 통신 에러:", error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        botName: 'AI Moca',
        text: "죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해 주세요.",
      }]);
    }
  };

  const handleOptionClick = (optionText) => {
    requestChatApi(optionText, history);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');
    requestChatApi(textToSend, history);
  };

  return (
    <div className="chat-section">
      <div className="chat-messages-container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <div className="bot-profile-header">
                <div className="bot-avatar"><img src={mocaProfileImg} alt="AI Moca" /></div>
                <span className="bot-name">{msg.botName || 'AI Moca'}</span>
              </div>
            )}
            <div className={`message-bubble ${msg.sender}`}>
              <p className="message-text">{msg.text}</p>
            </div>
            
            {/* 카드 형태(세로 리스트)로 후보/옵션 렌더링 */}
            {msg.sender === 'bot' && msg.options && msg.options.length > 0 && (
              <div className="product-cards-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', maxWidth: '85%' }}>
                {msg.options.map((option, idx) => (
                  <div 
                    key={idx} 
                    className="product-card-item"
                    onClick={() => handleOptionClick(option)}
                    style={{
                      background: '#ffffff',
                      color: '#333333',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b0029'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  >
                    📦 {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bottom-interaction-area">
        <form className="chat-input-bar" onSubmit={handleSendMessage}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*, .pdf" style={{ display: 'none' }} />
          <button type="button" className="plus-btn" onClick={handlePlusClick}><Plus size={20} color="#666" /></button>
          <input type="text" className="chat-input" placeholder="궁금한 내용을 입력하세요..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
          <button type="submit" className="send-btn"><Send size={18} color="#fff" /></button>
        </form>
        <div className="passport-wrapper" onClick={onPassportClick}>
          <img src={passportImg} alt="MCM Passport" className="passport-img" />
        </div>
      </div>
    </div>
  );
}

export default ChatSection;