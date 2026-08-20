import React, { useEffect } from "react";
import mcmImage from "../../assets/images/mcmlounge.png";
import leftButton from "../../assets/images/leftbtn.png";
import blurImage from "../../assets/images/blur.png";
import "../../styles/FocusLounge.css";

function MCMLounge({ onPrev }) {
    const moveToMiddle = () => {
        requestAnimationFrame(() => {
            const scrollHeight =
                document.body.scrollHeight;

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
        <div className="focus-lounge-page-wrapper">
            <img
                className="focus-lounge-page"
                src={mcmImage}
                alt="MCM Lounge"
                onLoad={moveToMiddle}
            />
            <img
                className="focus-lounge-blur"
                src={blurImage}
                alt=""
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