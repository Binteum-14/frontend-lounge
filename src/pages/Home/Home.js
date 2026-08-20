import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/MCMCheckLogo.png";
import { loginUser } from "../../api";
import { Cookies } from "react-cookie";

import "./Home.css";

import {
  CheckSquare,
  Coffee,
  Ticket,
  X,
} from "lucide-react";

import bgImage from "../../assets/images/MCMAirport.png";
import luggageImg from "../../assets/images/luggage.png";

function Home() {
  const navigate = useNavigate();
  const cookies = new Cookies();

  // 모달창 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  // true면 회원가입 뷰, false면 로그인 뷰
  const [isSignup, setIsSignup] = useState(false);

  // 로그인 상태 관리 (새로고침해도 유지되도록 localStorage 연동)
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // 입력폼 상태 관리
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 로그인 제출 핸들러
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData.username, formData.password);

      if (response.isSuccess) {
        alert("로그인에 성공했습니다!");
        
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        
        setIsModalOpen(false);
        setFormData({ username: "", password: "", confirmPassword: "" });
      } else {
        alert(`로그인 실패: ${response.message || "아이디 또는 비밀번호를 확인해주세요."}`);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    cookies.remove("accessToken", { path: "/" });
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  // 회원가입 제출 핸들러
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("회원가입 시도:", formData.username, formData.password);
    alert("회원가입 시도중...");
  };

  /* =========================================
     메뉴 버튼 이동 핸들러들
  ========================================= */
  const handleGoToCheck = () => {
    if (isLoggedIn) {
      navigate("/mcm-check");
      return;
    }

    alert("로그인이 필요한 서비스입니다. 로그인을 먼저 진행해주세요.");
    setIsModalOpen(true);
    setIsSignup(false);
  };

  // Focus Lounge는 로그인 체크 없이 바로 이동
  const handleGoToFocusLounge = () => {
    navigate("/focus-lounge");
  };

  const handleGoToLounge = () => {
    if (isLoggedIn) {
      navigate("/owner-lounge");
      return;
    }

    alert("로그인이 필요한 서비스입니다. 로그인을 먼저 진행해주세요.");
    setIsModalOpen(true);
    setIsSignup(false);
  };

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* 우측 상단 로그인/로그아웃 버튼 */}
      <div className="top-right-nav">
        {isLoggedIn ? (
          <button
            className="top-login-btn"
            type="button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <button
            className="top-login-btn"
            type="button"
            onClick={() => {
              setIsSignup(false);
              setIsModalOpen(true);
            }}
          >
            로그인
          </button>
        )}
      </div>

      <header className="home-header">
        <h1 className="main-title">MCM LOUNGE</h1>
      </header>

      <div className="luggage-interaction-group">
        <main className="menu-card">
          <button
            className="menu-btn"
            type="button"
            onClick={handleGoToCheck}
          >
            <CheckSquare className="btn-icon" size={20} />
            <span>MCM Check</span>
          </button>

          <button
            className="menu-btn"
            type="button"
            onClick={handleGoToFocusLounge}
          >
            <Coffee className="btn-icon" size={20} />
            <span>Focus Lounge</span>
          </button>

          <button
            className="menu-btn"
            type="button"
            onClick={handleGoToLounge}
          >
            <Ticket className="btn-icon" size={20} />
            <span>Owner Lounge</span>
          </button>
        </main>

        <div className="luggage-wrapper">
          <img
            src={luggageImg}
            alt="MCM Luggage"
            className="luggage-img"
          />
        </div>
      </div>

      {/* 로그인 / 회원가입 모달 창 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            <div className="modal-logo-container">
              <img
                src={logoImg}
                alt="MCM Check Logo"
                className="modal-logo-img"
              />
            </div>

            <form
              onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit}
            >
              <div className="input-group">
                <label>아이디</label>
                <input
                  type="text"
                  name="username"
                  placeholder="아이디를 입력하세요"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {isSignup && (
                <div className="input-group">
                  <label>비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <button type="submit" className="auth-submit-btn">
                {isSignup ? "회원가입 하기" : "로그인"}
              </button>
            </form>

            <div className="auth-switch-text">
              {isSignup ? (
                <p>
                  이미 계정이 있으신가요?{" "}
                  <span onClick={() => setIsSignup(false)}>로그인</span>
                </p>
              ) : (
                <p>
                  계정이 없으신가요?{" "}
                  <span onClick={() => setIsSignup(true)}>회원가입</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;