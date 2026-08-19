import React from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import {
  CheckSquare,
  Coffee,
  Ticket,
} from "lucide-react";

import bgImage from "../../assets/images/MCMAirport.png";
import luggageImg from "../../assets/images/luggage.png";


function Home() {
  const navigate =
    useNavigate();


  /* =========================================
     Owner Lounge 이동
  ========================================= */

  const handleGoToLounge = () => {
    const isLoggedIn =
      localStorage.getItem(
        "isLoggedIn"
      );


    if (
      isLoggedIn === "true"
    ) {
      navigate(
        "/owner-lounge"
      );

      return;
    }


    alert(
      "로그인이 필요한 서비스입니다. MCM Check를 통해 로그인 또는 회원가입을 진행해주세요."
    );


    navigate(
      "/mcm-check"
    );
  };


  /* =========================================
     MCM Check 이동
  ========================================= */

  const handleGoToMcmCheck = () => {
    navigate(
      "/mcm-check"
    );
  };


  /* =========================================
     Focus Lounge 이동

     게스트도 바로 입장 가능
  ========================================= */

  const handleGoToFocusLounge = () => {
    navigate(
      "/focus-lounge"
    );
  };


  return (
    <div
      className="home-container"
      style={{
        backgroundImage:
          `url(${bgImage})`,
      }}
    >

      <header className="home-header">

        <h1 className="main-title">
          MCM LOUNGE
        </h1>

      </header>


      <div className="luggage-interaction-group">


        <main className="menu-card">


          {/* MCM Check */}

          <button
            className="menu-btn"
            type="button"
            onClick={
              handleGoToMcmCheck
            }
          >

            <CheckSquare
              className="btn-icon"
              size={20}
            />

            <span>
              MCM Check
            </span>

          </button>


          {/* Focus Lounge */}

          <button
            className="menu-btn"
            type="button"
            onClick={
              handleGoToFocusLounge
            }
          >

            <Coffee
              className="btn-icon"
              size={20}
            />

            <span>
              Focus Lounge
            </span>

          </button>


          {/* Owner Lounge */}

          <button
            className="menu-btn"
            type="button"
            onClick={
              handleGoToLounge
            }
          >

            <Ticket
              className="btn-icon"
              size={20}
            />

            <span>
              Owner Lounge
            </span>

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

    </div>
  );
}


export default Home;