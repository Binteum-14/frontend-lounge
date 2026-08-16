import React from "react";

import mcmImage from "../../assets/images/mcmlounge.png";
import leftButton from "../../assets/images/leftbtn.png";

import "../../styles/FocusLounge.css";

function MCMLounge({ onPrev }) {
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
        <div className="focus-lounge-page-wrapper">

            <img
                className="focus-lounge-page"
                src={mcmImage}
                alt="MCM Lounge"
                onLoad={handleImageLoad}
            />

            <button
                className="focus-lounge-prev-button"
                type="button"
                onClick={onPrev}
                aria-label="Go to previous page"
            >
                <img
                    className="focus-lounge-prev-button-image"
                    src={leftButton}
                    alt="Previous"
                />
            </button>

        </div>
    );
}

export default MCMLounge;