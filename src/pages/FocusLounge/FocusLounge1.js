import React, { useEffect, useState } from "react";

import focus1Background from "../../assets/images/focus1.png";
import rightButton from "../../assets/images/rightbtn.png";
import loungeIcon from "../../assets/images/sofa.png";
import calendarIcon from "../../assets/images/calendar.png";
import bookIcon from "../../assets/images/bookicon.png";

import "../../styles/FocusLounge.css";

function FocusLounge1({
    onNext,
    onStartTimer,
    timerActive,
    ensureMusicPlaying,
    openFlightModal,
    onFlightModalOpened,
    onTakeoff,
    flightFocusSeconds,
}) {
    const now = new Date();

    const todayDateText =
        `${now.getMonth() + 1}월 ${now.getDate()}일`;

    const todayWeekdayText =
        now.toLocaleDateString(
            "ko-KR",
            {
                weekday: "short",
            }
        );

    const [showModal, setShowModal] =
        useState(!timerActive);

    const [modalStep, setModalStep] =
        useState("setting");

    const [
        selectedPlace,
        setSelectedPlace,
    ] = useState("lounge");

    const [hours, setHours] =
        useState(0);

    const [minutes, setMinutes] =
        useState(0);

    const [
        selectedFlight,
        setSelectedFlight,
    ] = useState(0);

    // 타이머가 이미 실행 중이면
    // FocusLounge1으로 돌아와도 모달 숨김
    useEffect(() => {
        if (timerActive) {
            setShowModal(false);
        }
    }, [timerActive]);

    // =========================================
    // SUCCESS 화면에서
    // "공항으로 이동하기"를 눌렀을 때
    // 항공편 추천 팝업 바로 열기
    // =========================================
    useEffect(() => {
        if (!openFlightModal) {
            return;
        }

        // SUCCESS에서 사용했던 총 시간을
        // 항공편 팝업의 시간으로 다시 넣어줌
        if (flightFocusSeconds > 0) {
            const nextHours = Math.floor(
                flightFocusSeconds / 3600
            );

            const nextMinutes = Math.floor(
                (flightFocusSeconds % 3600) / 60
            );

            setHours(nextHours);
            setMinutes(nextMinutes);
        }

        // 바로 항공편 추천 화면 열기
        setModalStep("flight");
        setShowModal(true);

        if (onFlightModalOpened) {
            onFlightModalOpened();
        }
    }, [
        openFlightModal,
        flightFocusSeconds,
        onFlightModalOpened,
    ]);

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

    // =========================================
    // 시간 조절
    // =========================================
    const decreaseHour = () => {
        ensureMusicPlaying();

        if (hours > 0) {
            setHours(hours - 1);
        }
    };

    const increaseHour = () => {
        ensureMusicPlaying();

        setHours(hours + 1);
    };

    const decreaseMinute = () => {
        ensureMusicPlaying();

        if (minutes >= 5) {
            setMinutes(minutes - 5);
        }
    };

    const increaseMinute = () => {
        ensureMusicPlaying();

        if (minutes < 55) {
            setMinutes(
                minutes + 5
            );
        } else {
            setMinutes(0);
            setHours(hours + 1);
        }
    };

    // =========================================
    // 장소 선택
    // =========================================
    const handleSelectLounge = () => {
        ensureMusicPlaying();

        setSelectedPlace(
            "lounge"
        );
    };

    const handleSelectAirplane = () => {
        ensureMusicPlaying();

        setSelectedPlace(
            "airplane"
        );
    };

    // =========================================
    // 하단 버튼
    // =========================================
    const handleMainButton = () => {
        ensureMusicPlaying();

        const totalMinutes =
            hours * 60 + minutes;

        if (totalMinutes <= 0) {
            return;
        }

        if (
            selectedPlace ===
            "lounge"
        ) {
            onStartTimer(
                hours,
                minutes
            );

            setShowModal(false);
        }

        if (
            selectedPlace ===
            "airplane"
        ) {
            setModalStep(
                "flight"
            );
        }
    };

    const handleSelectFlight = (
        index
    ) => {
        ensureMusicPlaying();

        setSelectedFlight(
            index
        );
    };

    // =========================================
    // 항공편 데이터
    // =========================================
    const flights = [
        {
            id: 1,
            airline: "대한항공",
            flightNo: "KE888",
            from: "ICN",
            fromName: "인천",
            departure: "18:00",
            to: "NRT",
            toName: "도쿄 나리타",
            arrival: "21:00",
        },
        {
            id: 2,
            airline: "대한항공",
            flightNo: "KE888",
            from: "ICN",
            fromName: "인천",
            departure: "18:00",
            to: "NRT",
            toName: "도쿄 나리타",
            arrival: "21:00",
        },
        {
            id: 3,
            airline: "대한항공",
            flightNo: "KE888",
            from: "ICN",
            fromName: "인천",
            departure: "18:00",
            to: "NRT",
            toName: "도쿄 나리타",
            arrival: "21:00",
        },
        {
            id: 4,
            airline: "대한항공",
            flightNo: "KE888",
            from: "ICN",
            fromName: "인천",
            departure: "18:00",
            to: "NRT",
            toName: "도쿄 나리타",
            arrival: "21:00",
        },
    ];

    return (
        <div className="focus-lounge-page-wrapper">

            <img
                className="focus-lounge-page"
                src={focus1Background}
                alt="Focus Lounge background"
                onLoad={handleImageLoad}
            />

            <button
                className="focus-lounge-next-button"
                type="button"
                onClick={() => {
                    ensureMusicPlaying();
                    onNext();
                }}
                aria-label="Go to next page"
            >
                <img
                    className="focus-lounge-next-button-image"
                    src={rightButton}
                    alt="Next"
                />
            </button>

            {showModal && (
                <div className="focus-modal-background">

                    {modalStep ===
                        "setting" && (
                        <div className="focus-setting-modal">

                            <h2 className="focus-modal-title">
                                목표 시간
                            </h2>

                            <div className="focus-time-section">

                                <div className="focus-time-label">
                                    Focus time
                                </div>

                                <div className="focus-time-controls">

                                    <div className="focus-time-row">

                                        <button
                                            type="button"
                                            className="focus-time-button"
                                            onClick={decreaseHour}
                                        >
                                            −
                                        </button>

                                        <div className="focus-time-value">
                                            {hours}

                                            <span className="focus-time-unit">
                                                시간
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="focus-time-button"
                                            onClick={increaseHour}
                                        >
                                            +
                                        </button>

                                    </div>

                                    <div className="focus-time-row">

                                        <button
                                            type="button"
                                            className="focus-time-button"
                                            onClick={decreaseMinute}
                                        >
                                            −
                                        </button>

                                        <div className="focus-time-value">
                                            {minutes}

                                            <span className="focus-time-unit">
                                                분
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="focus-time-button"
                                            onClick={increaseMinute}
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>
                            </div>

                            <div className="focus-modal-divider" />

                            <div className="focus-place-title">
                                장소 선택
                            </div>

                            <div className="focus-place-buttons">

                                <button
                                    type="button"
                                    onClick={
                                        handleSelectLounge
                                    }
                                    className={`focus-place-button ${
                                        selectedPlace ===
                                        "lounge"
                                            ? "selected"
                                            : "unselected"
                                    }`}
                                >
                                    <span className="focus-place-icon">
                                        <img
                                            className="focus-place-image"
                                            src={loungeIcon}
                                            alt="Lounge"
                                        />
                                    </span>

                                    라운지
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSelectAirplane
                                    }
                                    className={`focus-place-button ${
                                        selectedPlace ===
                                        "airplane"
                                            ? "selected"
                                            : "unselected"
                                    }`}
                                >
                                    <span className="focus-place-icon">
                                        ✈
                                    </span>

                                    비행기
                                </button>

                            </div>

                            {selectedPlace ===
                                "airplane" && (
                                <div className="focus-flight-note">
                                    ※ 총 목표 학습 시간과 유사한 실시간 항공편을
                                    이용하실 수 있습니다.
                                </div>
                            )}

                            <button
                                type="button"
                                className="focus-modal-main-button"
                                onClick={
                                    handleMainButton
                                }
                            >
                                {selectedPlace ===
                                "lounge"
                                    ? "라운지 이용하기"
                                    : "이용 가능한 실시간 항공편 검색하기"}
                            </button>

                        </div>
                    )}

                    {modalStep ===
                        "flight" && (
                        <div className="focus-flight-modal">

                            <button
                                type="button"
                                className="focus-modal-back-button"
                                onClick={() => {
                                    ensureMusicPlaying();

                                    setModalStep(
                                        "setting"
                                    );
                                }}
                                aria-label="Back"
                            >
                                ‹
                            </button>

                            <h2 className="focus-flight-title">
                                실시간 항공편 추천
                            </h2>

                            <div className="focus-flight-info-row">

                                <span>
                                    <img
                                        className="calendar-image"
                                        src={calendarIcon}
                                        alt="Calendar"
                                    />
                                </span>

                                <span>
                                    {todayDateText}
                                    {" "}
                                    (
                                    {todayWeekdayText}
                                    )
                                </span>

                            </div>

                            <div className="focus-flight-info-row">

                                <span
                                    className="focus-flight-clock-icon"
                                    aria-hidden="true"
                                />

                                <span>
                                    오후 6시
                                </span>

                                <span className="focus-flight-info-gap">

                                    <img
                                        className="book-image"
                                        src={bookIcon}
                                        alt="Book"
                                    />

                                </span>

                                <span>
                                    총 {hours}시간{" "}
                                    {minutes}분
                                </span>

                            </div>

                            <div className="focus-flight-divider" />

                            <div className="focus-flight-list">

                                {flights.map(
                                    (
                                        flight,
                                        index
                                    ) => {
                                        const isSelected =
                                            selectedFlight ===
                                            index;

                                        return (
                                            <div
                                                key={
                                                    flight.id
                                                }
                                                className={`focus-flight-card ${
                                                    isSelected
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleSelectFlight(
                                                        index
                                                    )
                                                }
                                            >

                                                <div className="focus-flight-left-area">

                                                    <div className="focus-flight-airline-row">

                                                        <div className="focus-airline-logo">
                                                            S
                                                        </div>

                                                        <div>

                                                            <div className="focus-flight-number">
                                                                {flight.flightNo}
                                                            </div>

                                                            <div className="focus-airline-name">
                                                                {flight.airline}
                                                            </div>

                                                        </div>

                                                    </div>

                                                    <div className="focus-flight-duration">

                                                        비행시간
                                                        <br />

                                                        <strong>
                                                            {hours}시간{" "}
                                                            {minutes}분
                                                        </strong>

                                                    </div>

                                                </div>

                                                <div className="focus-flight-route">

                                                    <div className="focus-airport">

                                                        <div className="focus-airport-code">
                                                            {flight.from}
                                                        </div>

                                                        <div className="focus-airport-name">
                                                            {flight.fromName}
                                                        </div>

                                                        <div className="focus-airport-time">
                                                            {flight.departure}
                                                        </div>

                                                    </div>

                                                    <div className="focus-plane-area">

                                                        <div className="focus-plane-icon">
                                                            ✈
                                                        </div>

                                                        <div className="focus-plane-line" />

                                                        <div className="focus-plane-direct">
                                                            직항
                                                        </div>

                                                    </div>

                                                    <div className="focus-airport">

                                                        <div className="focus-airport-code">
                                                            {flight.to}
                                                        </div>

                                                        <div className="focus-airport-name">
                                                            {flight.toName}
                                                        </div>

                                                        <div className="focus-airport-time">
                                                            {flight.arrival}
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                            <button
                                type="button"
                                className="focus-flight-select-button"
                                onClick={() => {
                                    ensureMusicPlaying();

                                    // 타이머 먼저 시작
                                    onStartTimer(
                                        hours,
                                        minutes
                                    );

                                    setShowModal(false);

                                    // 그 다음 Takeoff로 이동
                                    if (onTakeoff) {
                                        onTakeoff();
                                    }
                                }}
                            >
                                이 항공편 선택하기
                            </button>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

export default FocusLounge1;