import React from "react";

import takeoffBackground from "../../assets/images/takeoff-background.mp4";
import takeoffOverlay from "../../assets/images/takeoff.png";
import blurImage from "../../assets/images/blur.png";

import "../../styles/Takeoff.css";

function Takeoff() {
    return (
        <div className="takeoff-page">

            {/* 배경 영상 */}
            <video
                className="takeoff-background"
                src={takeoffBackground}
                autoPlay
                loop
                muted
                playsInline
            />

            {/* 비행기 프레임 */}
            <img
                className="takeoff-overlay"
                src={takeoffOverlay}
                alt=""
            />

            {/* 타이머 바로 아래에 깔리는 blur */}
            <img
                className="takeoff-blur"
                src={blurImage}
                alt=""
            />

        </div>
    );
}

export default Takeoff;