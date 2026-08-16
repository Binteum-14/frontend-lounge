import React from "react";

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
    const handleImageLoad = () => {
        const maxScroll =
            document.documentElement
                .scrollHeight -
            window.innerHeight;

        window.scrollTo({
            top: maxScroll / 2,
            behavior: "auto",
        });
    };

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
                onLoad={handleImageLoad}
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