import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import mocaProfileImg from '../../../assets/images/Chatbot.png';
import passportImg from '../../../assets/images/MCMPassport.png';

function ChatSection({ onPassportClick }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      botName: 'AI Moca',
      text: `안녕하세요, 고객님! MCM 스타크 백팩의 비세토스 가죽은 세심한 관리가 필요합니다.`,
      options: ['가죽 손상 예방법', '비 오는 날 관리법', '가방 보관 방법'],
    },
  ]);

  const [inputText, setInputText] = useState('');
  
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('선택된 파일:', file);
      const fileMessage = {
        id: Date.now(),
        sender: 'user',
        text: `[첨부 파일] ${file.name}`,
      };
      setMessages((prev) => [...prev, fileMessage]);
      e.target.value = '';
    }
  };

  const handleOptionClick = (optionText) => {
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: optionText,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        botName: 'AI Moca',
        text: `'${optionText}' 관련 안내 답변입니다.`,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 800);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        botName: 'AI Moca',
        text: `'${userMessage.text}'에 대한 답변입니다.`,
        options: ['가죽 손상 예방법', '비 오는 날 관리법', '가방 보관 방법'],
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  return (
    <div className="chat-section">
      <div className="chat-messages-container" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <div className="bot-profile-header">
                <div className="bot-avatar">
                  <img src={mocaProfileImg} alt="AI Moca" />
                </div>
                <span className="bot-name">{msg.botName || 'AI Moca'}</span>
              </div>
            )}

            <div className={`message-bubble ${msg.sender}`}>
              <p className="message-text">{msg.text}</p>
            </div>

            {msg.sender === 'bot' && msg.options && (
              <div className="options-container">
                {msg.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="option-btn"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bottom-interaction-area">
        <form className="chat-input-bar" onSubmit={handleSendMessage}>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*, .pdf"
            style={{ display: 'none' }}
          />

          <button type="button" className="plus-btn" onClick={handlePlusClick}>
            <Plus size={20} color="#666" />
          </button>
          
          <input
            type="text"
            className="chat-input"
            placeholder="궁금한 내용을 입력하세요..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <button type="submit" className="send-btn">
            <Send size={18} color="#fff" />
          </button>
        </form>

        <div className="passport-wrapper" onClick={onPassportClick}>
          <img src={passportImg} alt="MCM Passport" className="passport-img" />
        </div>
      </div>
    </div>
  );
}

export default ChatSection;