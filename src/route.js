import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { get } from "./api";
import config from "./config";
import FocusLounge1 from "./pages/FocusLounge/FocusLounge1";
import FocusLounge2 from "./pages/FocusLounge/FocusLounge2";
import MCMLounge from "./pages/FocusLounge/MCMLounge";
import TeaModal from "./pages/TeaModal";
import Takeoff from "./pages/Takeoff/Takeoff";

import focusAirportBgm from "./assets/music/focusAirportbgm.mp3";
import focus2Bgm from "./assets/music/focus2bgm.mp3";
import focus1Bgm from "./assets/music/focus1bgm.mp3";
import takeoffBgm from "./assets/music/Takeoff-background.mp3";

import peopleIcon from "./assets/images/people.png";
import volumeIcon from "./assets/images/volume.png";

import mcmbag from "./assets/images/mcmwallet.png";

import iceTeaImage from "./assets/images/icetea.png";
import drinkIcon from "./assets/images/drink.png";

/* 성공 티켓 */
import ticketImage from "./assets/images/ticket.png";

import "./styles/Route.css";

const TIMER_STORAGE_KEY = "focusLoungeTimer";

function Route() {
    const successTicketRef = useRef(null);
    const [page, setPage] = useState("focus1");

    const [endTimeMs, setEndTimeMs] = useState(null);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    /* 처음 설정했던 총 집중 시간 */
    const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);

    const [isPaused, setIsPaused] = useState(false);
    const pausedSecondsRef = useRef(0);

    const [musicOn, setMusicOn] = useState(true);

    /* 간식 팝업 */
    const [showTeaModal, setShowTeaModal] = useState(false);

    /* MCM 제품 팝업 */
    const [showProductModal, setShowProductModal] = useState(false);
    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] = useState(false);

    /* 성공 화면 */
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [openFlightModal, setOpenFlightModal] = useState(false);

    /* 타이머가 끝난 순간 어느 라운지에 있었는지 */
    const [successPage, setSuccessPage] = useState("focus1");

    /* 주문된 음료 */
    const [selectedDrink, setSelectedDrink] = useState(null);

    /* 임시 라운지 인원 */
    const [loungePeople] = useState(18);

    const audioRef = useRef(null);

    const goTakeoff = () => {
        ensureMusicPlaying();
        setPage("takeoff");
    };

    /* =========================================
       현재 페이지 BGM
    ========================================= */

    const getCurrentBgm = () => {
        if (page === "focus1") {
            return focusAirportBgm;
        }

        if (page === "focus2") {
            return focus2Bgm;
        }

        if (page === "mcm") {
            return focus1Bgm;
        }

        if (page === "takeoff") {
            return takeoffBgm;
        }

        return focusAirportBgm;
    };

    /* =========================================
       저장된 타이머 불러오기
    ========================================= */

    useEffect(() => {
        try {
            const savedTimer =
                localStorage.getItem(TIMER_STORAGE_KEY);

            if (!savedTimer) {
                return;
            }

            const parsedTimer = JSON.parse(savedTimer);

            if (!parsedTimer?.endTimeMs) {
                return;
            }

            const diffSeconds = Math.ceil(
                (parsedTimer.endTimeMs - Date.now()) / 1000
            );

            if (diffSeconds > 0) {
                setEndTimeMs(parsedTimer.endTimeMs);
                setRemainingSeconds(diffSeconds);

                setTotalFocusSeconds(
                    parsedTimer.totalFocusSeconds || diffSeconds
                );
            } else {
                localStorage.removeItem(TIMER_STORAGE_KEY);
            }
        } catch (error) {
            localStorage.removeItem(TIMER_STORAGE_KEY);
        }
    }, []);

    /* =========================================
       타이머 카운트다운
    ========================================= */

    useEffect(() => {
        if (!endTimeMs || isPaused) {
            return undefined;
        }

        const updateTimer = () => {
            const diffSeconds = Math.max(
                0,
                Math.ceil(
                    (endTimeMs - Date.now()) / 1000
                )
            );

            setRemainingSeconds(diffSeconds);

            /* ================================
               타이머 종료
            ================================= */

            if (diffSeconds === 0) {
                setEndTimeMs(null);
                setRemainingSeconds(0);

                setIsPaused(false);
                pausedSecondsRef.current = 0;

                /* 현재 보고 있던 페이지 저장 */
                setSuccessPage(page);

                /* 성공 화면 열기 */
                setShowSuccessModal(true);

                localStorage.removeItem(
                    TIMER_STORAGE_KEY
                );
            }
        };

        updateTimer();

        const intervalId =
            window.setInterval(
                updateTimer,
                1000
            );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [
        endTimeMs,
        isPaused,
        page,
    ]);

    /* =========================================
       페이지 변경 시 BGM 변경
    ========================================= */

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        audio.pause();
        audio.currentTime = 0;

        if (!musicOn) {
            return;
        }

        audio.load();
        audio.volume = 0.5;

        audio.play().catch((error) => {
            console.log(
                "BGM 자동재생 실패:",
                error
            );
        });
    }, [page, musicOn]);

    /* =========================================
       사용자 클릭 시 음악 재생
    ========================================= */

    const ensureMusicPlaying = () => {
        const audio = audioRef.current;

        if (!audio || !musicOn) {
            return;
        }

        if (audio.paused) {
            audio.volume = 0.5;

            audio.play().catch((error) => {
                console.log(
                    "BGM 재생 실패:",
                    error
                );
            });
        }
    };

    /* =========================================
       타이머 시작
    ========================================= */

    const startTimer = (hours, minutes) => {
        ensureMusicPlaying();

        const totalSeconds =
            (hours * 60 + minutes) * 60;

        if (totalSeconds <= 0) {
            return;
        }

        const nextEndTimeMs =
            Date.now() +
            totalSeconds * 1000;

        setEndTimeMs(nextEndTimeMs);
        setRemainingSeconds(totalSeconds);

        /* 성공 티켓에 표시할 총 시간 저장 */
        setTotalFocusSeconds(totalSeconds);

        setIsPaused(false);
        pausedSecondsRef.current = 0;

        /* 새로운 타이머 시작하면 성공창 닫기 */
        setShowSuccessModal(false);

        localStorage.setItem(
            TIMER_STORAGE_KEY,
            JSON.stringify({
                endTimeMs: nextEndTimeMs,
                totalFocusSeconds: totalSeconds,
            })
        );
    };

    const togglePause = () => {
        ensureMusicPlaying();

        if (remainingSeconds <= 0) {
            return;
        }

        if (!isPaused) {
            pausedSecondsRef.current =
                remainingSeconds;

            setIsPaused(true);

            localStorage.removeItem(
                TIMER_STORAGE_KEY
            );
        } else {
            const resumeSeconds =
                pausedSecondsRef.current;

            if (resumeSeconds <= 0) {
                return;
            }

            const nextEndTimeMs =
                Date.now() +
                resumeSeconds * 1000;

            setEndTimeMs(nextEndTimeMs);
            setRemainingSeconds(resumeSeconds);
            setIsPaused(false);

            localStorage.setItem(
                TIMER_STORAGE_KEY,
                JSON.stringify({
                    endTimeMs: nextEndTimeMs,
                    totalFocusSeconds:
                        totalFocusSeconds,
                })
            );
        }
    };

    /* =========================================
       음악 ON / OFF
    ========================================= */

    const toggleMusic = () => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (musicOn) {
            audio.pause();
            setMusicOn(false);
        } else {
            setMusicOn(true);

            audio.volume = 0.5;

            audio.play().catch((error) => {
                console.log(
                    "BGM 재생 실패:",
                    error
                );
            });
        }
    };

    const fetchProductDetail = async (productId) => {
        try {
            setProductLoading(true);

            const response = await get(
                config.PRODUCT.DETAIL_GET(productId)
            );

            console.log("상품 상세 API 응답:", response);

            if (
                response.isSuccess &&
                response.result
            ) {
                setProduct(response.result);
            } else {
                setProduct(null);
            }

        } catch (error) {
            console.error(
                "상품 상세 조회 실패:",
                error.response?.data || error
            );

            setProduct(null);
        } finally {
            setProductLoading(false);
        }
    };

    /* =========================================
       현재 타이머 표시
    ========================================= */

    const formatTime = (seconds) => {
        const safeSeconds =
            Math.max(0, seconds);

        const hours =
            Math.floor(
                safeSeconds / 3600
            );

        const minutes =
            Math.floor(
                (safeSeconds % 3600) / 60
            );

        const secs =
            safeSeconds % 60;

        return `${String(hours).padStart(
            2,
            "0"
        )}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    /* =========================================
       성공 티켓용 총 시간
    ========================================= */

    const formatSuccessTime = (seconds) => {
        const hours =
            Math.floor(seconds / 3600);

        const minutes =
            Math.floor(
                (seconds % 3600) / 60
            );

        const secs =
            seconds % 60;

        return `${String(hours).padStart(
            2,
            "0"
        )}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    /* =========================================
       성공 티켓 날짜
    ========================================= */

    const getTodayDate = () => {
        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}.${month}.${day}`;
    };

    /* =========================================
       성공 티켓 장소
    ========================================= */

    const getSuccessPlace = () => {
        if (successPage === "focus1") {
            return "공항라운지1";
        }

        if (successPage === "focus2") {
            return "공항라운지2";
        }

        if (successPage === "mcm") {
            return "mcmLounge";
        }

        if (successPage === "takeoff") {
            return "비행기";
        }

        return "";
    };

    /* =========================================
       페이지 이동
    ========================================= */

    const goFocus1 = () => {
        ensureMusicPlaying();
        setPage("focus1");
    };

    const goFocus2 = () => {
        ensureMusicPlaying();
        setPage("focus2");
    };

    const goMcm = () => {
        ensureMusicPlaying();
        setPage("mcm");
    };

    /* =========================================
       음료 주문 완료
    ========================================= */

    const handleDrinkOrder = (drink) => {
        setSelectedDrink(drink);
        setShowTeaModal(false);
    };

    const handleSaveTicket = async () => {
        if (!successTicketRef.current) {
            return;
        }

        try {
            const canvas = await html2canvas(
                successTicketRef.current,
                {
                    backgroundColor: null,
                    scale: 2,
                    useCORS: true,
                }
            );

            const image = canvas.toDataURL("image/png");

            const link = document.createElement("a");

            link.href = image;
            link.download = "focus-success-ticket.png";

            link.click();
        } catch (error) {
            console.log("티켓 이미지 저장 실패:", error);
        }
    };

    const timerActive =
        remainingSeconds > 0;

    return (
        <div className="lounge-route">

            {/* BGM */}
            <audio
                ref={audioRef}
                className="lounge-route-audio"
                loop
                preload="auto"
                src={getCurrentBgm()}
            />

            {/* =========================================
                라운지 인원
            ========================================= */}

            <div className="lounge-people">

                <div className="lounge-people-icon">
                    <img
                        className="lounge-people-icon-image"
                        src={peopleIcon}
                        alt="People"
                    />
                </div>

                <div className="lounge-people-title">
                    라운지 전체
                </div>

                <div className="lounge-people-divider" />

                <div className="lounge-people-count">

                    <span className="lounge-people-number">
                        {loungePeople}명
                    </span>

                    <span className="lounge-people-text">
                        함께 하는 중..
                    </span>

                </div>

            </div>

            {/* =========================================
                공통 타이머
            ========================================= */}

            {timerActive && (
                <div
                    className={`lounge-timer ${
                        isPaused
                            ? "lounge-timer-paused"
                            : "lounge-timer-running"
                    }`}
                >

                    <div className="lounge-timer-header">

                        <span className="lounge-timer-title">
                            Focus Time
                        </span>

                        <span
                            className={`lounge-timer-status ${
                                isPaused
                                    ? "lounge-timer-status-paused"
                                    : "lounge-timer-status-running"
                            }`}
                        >
                            ●
                        </span>

                    </div>

                    <div className="lounge-timer-time">
                        {formatTime(
                            remainingSeconds
                        )}
                    </div>

                    <div className="lounge-timer-controls">

                        <button
                            type="button"
                            className={`lounge-control-button lounge-music-button ${
                                musicOn
                                    ? "lounge-music-button-on"
                                    : "lounge-music-button-off"
                            }`}
                            onClick={toggleMusic}
                        >

                            <span className="lounge-music-note-icon">
                                ♫
                            </span>

                            <span className="lounge-music-label">
                                음악
                            </span>

                            <span className="lounge-control-divider" />

                            <span className="lounge-volume-icon">
                                <img
                                    className="lounge-volume-icon-image"
                                    src={volumeIcon}
                                    alt="Volume"
                                />
                            </span>

                            <span className="lounge-music-state">
                                {musicOn
                                    ? "ON"
                                    : "OFF"}
                            </span>

                        </button>

                        <button
                            type="button"
                            className="lounge-control-button lounge-pause-button"
                            onClick={togglePause}
                        >

                            <span className="lounge-pause-icon">
                                {isPaused
                                    ? "▶"
                                    : "Ⅱ"}
                            </span>

                            <span className="lounge-pause-text">
                                {isPaused
                                    ? "다시 시작"
                                    : "일시정지"}
                            </span>

                        </button>

                    </div>

                </div>
            )}

            {/* =========================================
                MCM 가방
            ========================================= */}

            <button
                type="button"
                className={`lounge-wallet-wrapper lounge-wallet-wrapper-${page}`}
                onClick={() => {
                    fetchProductDetail(1);
                    setShowProductModal(true);
                }}
                aria-label="MCM 제품 정보 보기"
            >
                <img
                    className="lounge-wallet-image"
                    src={mcmbag}
                    alt="MCM Bag"
                />
            </button>

            {/* =========================================
                주문 전 drink.png
            ========================================= */}

            {!selectedDrink && (
                <button
                    type="button"
                    className={`lounge-drink-button lounge-drink-button-${page}`}
                    onClick={() =>
                        setShowTeaModal(true)
                    }
                >
                    <img
                        className="lounge-drink-image"
                        src={drinkIcon}
                        alt="간식 주문"
                    />
                </button>
            )}

            {/* =========================================
                주문 후 음료
            ========================================= */}

            {selectedDrink && (
                <button
                    type="button"
                    className={`lounge-ordered-drink lounge-ordered-drink-${page}`}
                    onClick={() =>
                        setShowTeaModal(true)
                    }
                >
                    <img
                        className="lounge-ordered-drink-image"
                        src={
                            selectedDrink.snackImageUrl ||
                            iceTeaImage
                        }
                        alt="주문한 간식"
                    />
                </button>
            )}

            {/* =========================================
                간식 팝업
            ========================================= */}

            {showTeaModal && (
                <TeaModal
                    onClose={() =>
                        setShowTeaModal(false)
                    }
                    onOrder={handleDrinkOrder}
                />
            )}

            {showProductModal && (
                <div
                    className="lounge-product-modal-overlay"
                    onClick={() =>
                        setShowProductModal(false)
                    }
                >

                    <div
                        className="lounge-product-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            type="button"
                            className="lounge-product-modal-close"
                            onClick={() =>
                                setShowProductModal(false)
                            }
                        >
                            ×
                        </button>

                       {productLoading ? (
                            <div>
                                상품 정보를 불러오는 중입니다...
                            </div>
                        ) : product ? (
                            <>
                                <img
                                    className="lounge-product-modal-image"
                                    src={product.imageUrl}
                                    alt={product.name}
                                />

                                <div className="lounge-product-modal-name">
                                    {product.name}
                                </div>

                                <div className="lounge-product-modal-price">
                                    ₩ {product.price?.toLocaleString()}
                                </div>

                                <div className="lounge-product-modal-description">
                                    {product.description}
                                </div>

                                <button
                                    type="button"
                                    className="lounge-product-modal-button"
                                    onClick={() => {
                                        if (product.detailUrl) {
                                            window.open(
                                                product.detailUrl,
                                                "_blank"
                                            );
                                        }
                                    }}
                                >
                                    <span>
                                        제품 자세히보기
                                    </span>

                                    <span className="lounge-product-modal-arrow">
                                        〉
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="lounge-product-modal-button"
                                >
                                    <span>
                                        AI 수납 확인하기
                                    </span>

                                    <span className="lounge-product-modal-arrow">
                                        〉
                                    </span>
                                </button>
                            </>
                        ) : (
                            <div>
                                상품 정보를 불러오지 못했습니다.
                            </div>
                        )}

                        <button
                            type="button"
                            className="lounge-product-modal-button"
                        >
                            <span>
                                제품 자세히보기
                            </span>

                            <span className="lounge-product-modal-arrow">
                                〉
                            </span>
                        </button>

                        <button
                            type="button"
                            className="lounge-product-modal-button"
                        >
                            <span>
                                AI 수납 확인하기
                            </span>

                            <span className="lounge-product-modal-arrow">
                                〉
                            </span>
                        </button>

                    </div>

                </div>
            )}

            {/* =========================================
                현재 페이지
            ========================================= */}

            <div
                className={`lounge-page-container lounge-page-${page}`}
            >
                {page === "takeoff" ? (

                    <Takeoff />

                ) : page === "focus2" ? (

                    <FocusLounge2
                        onPrev={goFocus1}
                        onNext={goMcm}
                    />

                ) : page === "mcm" ? (

                    <MCMLounge
                        onPrev={goFocus2}
                    />

                ) : (

                    <FocusLounge1
                        onNext={goFocus2}
                        onStartTimer={startTimer}
                        onTakeoff={goTakeoff}
                        timerActive={timerActive}
                        ensureMusicPlaying={ensureMusicPlaying}

                        openFlightModal={openFlightModal}

                        flightFocusSeconds={totalFocusSeconds}

                        onFlightModalOpened={() =>
                            setOpenFlightModal(false)
                        }
                    />

                )}
            </div>

            {/* =========================================
                타이머 완료 SUCCESS 화면
                Route 최상위이기 때문에 어느 페이지든 표시됨
            ========================================= */}

            {showSuccessModal && (
                <div className="lounge-success-overlay">

                    <div className="lounge-success-content">

                        {/* 티켓 */}
                        <div 
                            className="lounge-success-ticket-wrapper"
                            ref={successTicketRef}
                        >
                            <img
                                className="lounge-success-ticket-image"
                                src={ticketImage}
                                alt="Focus Success Ticket"
                            />

                            {/* 총 시간 */}
                            <div className="lounge-success-ticket-time">
                                {formatSuccessTime(
                                    totalFocusSeconds
                                )}
                            </div>

                            {/* 장소 */}
                            <div className="lounge-success-ticket-place">
                                {getSuccessPlace()}
                            </div>

                            {/* 오늘 날짜 */}
                            <div className="lounge-success-ticket-date">
                                {getTodayDate()}
                            </div>

                        </div>

                        {/* 오른쪽 영역 */}
                        <div className="lounge-success-right">

                            <div className="lounge-success-title">
                                SUCCESS!!
                            </div>

                            <button
                                type="button"
                                className="lounge-success-button lounge-success-save-button"
                                onClick={handleSaveTicket}
                            >
                                이미지 저장하기
                            </button>

                            <button
                                type="button"
                                className="lounge-success-button lounge-success-airport-button"
                                onClick={() => {
                                    // SUCCESS 화면 닫기
                                    setShowSuccessModal(false);

                                    // 항공편 팝업을 가지고 있는 FocusLounge1으로 이동
                                    setPage("focus1");

                                    // 항공편 팝업 열기
                                    setOpenFlightModal(true);
                                }}
                            >
                                공항으로 이동하기
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Route;