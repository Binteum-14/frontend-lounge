import React, { useEffect } from "react";
import focus2Background from "../../assets/images/focus2-background.mp4";
import focus2Frame from "../../assets/images/focus2.png";
import blurImage from "../../assets/images/blur.png";
import leftButton from "../../assets/images/leftbtn.png";
import rightButton from "../../assets/images/rightbtn.png";

import "../../styles/FocusLounge2.css";

function FocusLounge2({
    onPrev,
    onNext,
}) {
    const moveToMiddle = () => {
        requestAnimationFrame(() => {
            const scrollHeight = document.body.scrollHeight;

            const middle =
                (scrollHeight - window.innerHeight) / 2;

            window.scrollTo({
                top: Math.max(0, middle),
                left: 0,
                behavior: "auto",
            });
        });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="focus-lounge-container">

            <video
                className="focus-lounge-video"
                src={focus2Background}
                autoPlay
                loop
                muted
                playsInline
            />

            <img
                className="focus-lounge-overlay"
                src={focus2Frame}
                alt=""
                onLoad={moveToMiddle}
            />

            <img
                className="focus-lounge-blur"
                src={blurImage}
                alt=""
            />

            <button
                className="focus-lounge-button focus-lounge-button-left"
                type="button"
                onClick={onPrev}
                aria-label="Go to previous page"
            >
                <img
                    className="focus-lounge-button-image"
                    src={leftButton}
                    alt="Previous"
                />
            </button>

            <button
                className="focus-lounge-button focus-lounge-button-right"
                type="button"
                onClick={onNext}
                aria-label="Go to next page"
            >
                <img
                    className="focus-lounge-button-image"
                    src={rightButton}
                    alt="Next"
                />
            </button>

        </div>
    );
}

export default FocusLounge2;