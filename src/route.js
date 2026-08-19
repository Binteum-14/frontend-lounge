import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

import { get, post } from "./api";
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

import ticketImage from "./assets/images/ticket.png";

import "./styles/Route.css";

const TIMER_STORAGE_KEY = "focusLoungeTimer";
let heartbeatRequestPromise = null;
let lastHeartbeatKey = null;

function Route() {
    const successTicketRef = useRef(null);
    const audioRef = useRef(null);

    const [page, setPage] = useState("focus1");

    /* =========================================
       타이머
    ========================================= */

    const [endTimeMs, setEndTimeMs] = useState(null);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
    const [startedAt, setStartedAt] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    const pausedSecondsRef = useRef(0);
    const pauseStartedAtRef = useRef(null);
    const totalBreakSecondsRef = useRef(0);
    const passSavedRef = useRef(false);

    /* =========================================
       선택한 항공편
    ========================================= */

    const [selectedFlightInfo, setSelectedFlightInfo] =
        useState(null);

    /* =========================================
       음악
    ========================================= */

    const [musicOn, setMusicOn] = useState(true);

    /* =========================================
       간식
    ========================================= */

    const [showTeaModal, setShowTeaModal] = useState(false);
    const [selectedDrink, setSelectedDrink] = useState(null);

    /* =========================================
       상품 팝업
    ========================================= */

    const [showProductModal, setShowProductModal] =
        useState(false);

    const [product, setProduct] = useState(null);
    const [productLoading, setProductLoading] =
        useState(false);

    /* =========================================
       성공 화면
    ========================================= */

    const [showSuccessModal, setShowSuccessModal] =
        useState(false);

    const [openFlightModal, setOpenFlightModal] =
        useState(false);

    const [successPage, setSuccessPage] =
        useState("focus1");

    /* =========================================
       Presence 현재 이용 인원
    ========================================= */

    const [loungePeople, setLoungePeople] = useState(0);
    const [flightPeople, setFlightPeople] = useState(0);

    /* =========================================
    Presence Heartbeat

    focus1 / focus2 / mcm = LOUNGE
    takeoff = FLIGHT

    같은 라운지 내부 페이지 이동 시
    heartbeat 재호출하지 않음

    LOUNGE ↔ FLIGHT 전환 시에만 즉시 호출
    이후 1분마다 호출
    ========================================= */

    const presenceTheme =
        page === "takeoff"
            ? "FLIGHT"
            : "LOUNGE";


    useEffect(() => {
        let isMounted = true;

        const sendHeartbeat = async () => {
            const accessToken =
                localStorage.getItem(
                    "accessToken"
                );

            const hasAccessToken =
                !!accessToken;

            const heartbeatKey =
                `${presenceTheme}-${
                    hasAccessToken
                        ? "USER"
                        : "GUEST"
                }`;

            try {
                console.log(
                    "Heartbeat 요청 준비:",
                    {
                        themeType:
                            presenceTheme,
                        hasAccessToken,
                    }
                );


                /*
                * StrictMode 중복 요청 방지
                */
                if (
                    !heartbeatRequestPromise ||
                    lastHeartbeatKey !==
                        heartbeatKey
                ) {
                    lastHeartbeatKey =
                        heartbeatKey;

                    const currentHeartbeatPromise =
                        post(
                            config.PRESENCE.HEARTBEAT,

                            {
                                themeType:
                                    presenceTheme,
                            },

                            hasAccessToken
                                ? {}
                                : {
                                    skipAuth: true,
                                }
                        );

                    heartbeatRequestPromise =
                        currentHeartbeatPromise;

                    currentHeartbeatPromise.finally(() => {
                        window.setTimeout(
                            () => {
                                /*
                                * 내가 만든 요청이 아직
                                * 현재 요청일 때만 제거
                                *
                                * 그 사이 새로운 요청이 생겼다면
                                * 절대 제거하지 않음
                                */
                                if (
                                    heartbeatRequestPromise ===
                                    currentHeartbeatPromise
                                ) {
                                    heartbeatRequestPromise =
                                        null;
                                }
                            },
                            1000
                        );
                    });

                } else {
                    console.log(
                        "중복 Heartbeat 요청 방지됨"
                    );
                }


                const response =
                    await heartbeatRequestPromise;


                console.log(
                    "Heartbeat API 응답:",
                    response
                );


                if (!isMounted) {
                    return;
                }


                if (
                    response?.isSuccess &&
                    response?.result
                ) {
                    const loungeCount =
                        response.result
                            .loungeCount;

                    const flightCount =
                        response.result
                            .flightCount;


                    if (
                        typeof loungeCount ===
                        "number"
                    ) {
                        setLoungePeople(
                            loungeCount
                        );
                    }


                    if (
                        typeof flightCount ===
                        "number"
                    ) {
                        setFlightPeople(
                            flightCount
                        );
                    }


                    console.log(
                        "현재 라운지 인원:",
                        loungeCount
                    );

                    console.log(
                        "현재 비행기 인원:",
                        flightCount
                    );
                }

            } catch (error) {
                console.error(
                    "Heartbeat 요청 실패:",
                    error.response?.data ||
                    error
                );
            }
        };


        /*
        * LOUNGE 또는 FLIGHT 진입 시 즉시 1번
        */
        sendHeartbeat();


        /*
        * 같은 장소에 머무는 동안
        * 1분마다 갱신
        */
        const heartbeatInterval =
            window.setInterval(
                sendHeartbeat,
                60_000
            );


        return () => {
            isMounted = false;

            window.clearInterval(
                heartbeatInterval
            );
        };

    }, [presenceTheme]);

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
       음악 재생 보장
    ========================================= */

    const ensureMusicPlaying = () => {
        const audio =
            audioRef.current;

        if (!audio || !musicOn) {
            return;
        }

        if (audio.paused) {
            audio.volume = 0.5;

            audio.play().catch(
                (error) => {
                    console.log(
                        "BGM 재생 실패:",
                        error
                    );
                }
            );
        }
    };

    /* =========================================
       페이지 변경 시 BGM 변경
    ========================================= */

    useEffect(() => {
        const audio =
            audioRef.current;

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

        audio.play().catch(
            (error) => {
                console.log(
                    "BGM 자동재생 실패:",
                    error
                );
            }
        );
    }, [page, musicOn]);

    /* =========================================
       로컬 날짜 문자열
    ========================================= */

    const getLocalDateTime = (
        date = new Date()
    ) => {
        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                date.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                date.getMinutes()
            ).padStart(2, "0");

        const seconds =
            String(
                date.getSeconds()
            ).padStart(2, "0");

        return (
            `${year}-${month}-${day}` +
            `T${hours}:${minutes}:${seconds}`
        );
    };

    /* =========================================
       저장된 타이머 불러오기
    ========================================= */

    useEffect(() => {
        try {
            const savedTimer =
                localStorage.getItem(
                    TIMER_STORAGE_KEY
                );

            if (!savedTimer) {
                return;
            }

            const parsedTimer =
                JSON.parse(
                    savedTimer
                );

            if (
                !parsedTimer?.endTimeMs
            ) {
                return;
            }

            const diffSeconds =
                Math.ceil(
                    (
                        parsedTimer.endTimeMs -
                        Date.now()
                    ) / 1000
                );

            if (diffSeconds > 0) {
                setEndTimeMs(
                    parsedTimer.endTimeMs
                );

                setRemainingSeconds(
                    diffSeconds
                );

                setTotalFocusSeconds(
                    parsedTimer
                        .totalFocusSeconds ||
                    diffSeconds
                );

                if (
                    parsedTimer.startedAt
                ) {
                    setStartedAt(
                        parsedTimer.startedAt
                    );
                }
            } else {
                localStorage.removeItem(
                    TIMER_STORAGE_KEY
                );
            }
        } catch (error) {
            console.error(
                "저장된 타이머 불러오기 실패:",
                error
            );

            localStorage.removeItem(
                TIMER_STORAGE_KEY
            );
        }
    }, []);

    /* =========================================
       타이머 시작
    ========================================= */

    const startTimer = (
        hours,
        minutes
    ) => {
        ensureMusicPlaying();

        const totalSeconds =
            (
                hours * 60 +
                minutes
            ) * 60;

        if (totalSeconds <= 0) {
            return;
        }

        const startDateTime =
            getLocalDateTime();

        setStartedAt(
            startDateTime
        );

        totalBreakSecondsRef.current = 0;
        pauseStartedAtRef.current = null;
        passSavedRef.current = false;

        const nextEndTimeMs =
            Date.now() +
            totalSeconds * 1000;

        setEndTimeMs(
            nextEndTimeMs
        );

        setRemainingSeconds(
            totalSeconds
        );

        setTotalFocusSeconds(
            totalSeconds
        );

        setIsPaused(false);
        pausedSecondsRef.current = 0;

        setShowSuccessModal(
            false
        );

        localStorage.setItem(
            TIMER_STORAGE_KEY,
            JSON.stringify({
                endTimeMs:
                    nextEndTimeMs,
                totalFocusSeconds:
                    totalSeconds,
                startedAt:
                    startDateTime,
            })
        );
    };

    /* =========================================
       일시정지 / 재시작
    ========================================= */

    const togglePause = () => {
        ensureMusicPlaying();

        if (
            remainingSeconds <= 0
        ) {
            return;
        }

        if (!isPaused) {
            pausedSecondsRef.current =
                remainingSeconds;

            pauseStartedAtRef.current =
                Date.now();

            setIsPaused(true);

            localStorage.removeItem(
                TIMER_STORAGE_KEY
            );

            return;
        }

        const resumeSeconds =
            pausedSecondsRef.current;

        if (
            pauseStartedAtRef.current
        ) {
            const breakSeconds =
                Math.floor(
                    (
                        Date.now() -
                        pauseStartedAtRef.current
                    ) / 1000
                );

            totalBreakSecondsRef.current +=
                breakSeconds;

            pauseStartedAtRef.current =
                null;
        }

        if (
            resumeSeconds <= 0
        ) {
            return;
        }

        const nextEndTimeMs =
            Date.now() +
            resumeSeconds * 1000;

        setEndTimeMs(
            nextEndTimeMs
        );

        setRemainingSeconds(
            resumeSeconds
        );

        setIsPaused(false);

        localStorage.setItem(
            TIMER_STORAGE_KEY,
            JSON.stringify({
                endTimeMs:
                    nextEndTimeMs,
                totalFocusSeconds:
                    totalFocusSeconds,
                startedAt:
                    startedAt,
            })
        );
    };

    const saveFocusPass = useCallback(async (
        finishedPage
    ) => {

        /* =========================================
        게스트는 포커스 기록 저장 X
        ========================================= */

        const accessToken =
            localStorage.getItem(
                "accessToken"
            );

        if (!accessToken) {
            console.log(
                "게스트 사용자이므로 포커스 기록을 저장하지 않습니다."
            );

            return;
        }


        if (
            passSavedRef.current
        ) {
            return;
        }


        if (!startedAt) {
            console.error(
                "포커스 패스 저장 실패: 시작 시간이 없습니다."
            );

            return;
        }


        passSavedRef.current =
            true;


        let breakSeconds =
            totalBreakSecondsRef.current;


        if (
            isPaused &&
            pauseStartedAtRef.current
        ) {

            breakSeconds +=
                Math.floor(
                    (
                        Date.now() -
                        pauseStartedAtRef.current
                    ) / 1000
                );
        }


        const isFlight =
            finishedPage ===
            "takeoff";


        const requestBody = {

            themeType:
                isFlight
                    ? "FLIGHT"
                    : "LOUNGE",

            allMinutes:
                Math.floor(
                    (
                        totalFocusSeconds +
                        breakSeconds
                    ) / 60
                ),

            studySeconds:
                totalFocusSeconds,

            breaksSeconds:
                breakSeconds,

            startedAt:
                startedAt,

            endedAt:
                getLocalDateTime(),
        };


        if (
            isFlight &&
            selectedFlightInfo
        ) {

            requestBody.flightNumber =
                selectedFlightInfo
                    .flightNumber;

            requestBody.departureAirport =
                selectedFlightInfo
                    .departureAirportCode;

            requestBody.arrivalAirport =
                selectedFlightInfo
                    .arrivalAirportCode;

            requestBody.departureTime =
                selectedFlightInfo
                    .departureTime;
        }


        console.log(
            "포커스 패스 API URL:",
            config
                .FOCUSRECORD
                .PASS_POST
        );

        console.log(
            "포커스 패스 요청값:",
            requestBody
        );


        try {

            const response =
                await post(
                    config
                        .FOCUSRECORD
                        .PASS_POST,
                    requestBody
                );


            console.log(
                "포커스 패스 저장 성공:",
                response
            );

            } catch (error) {
                console.error(
                    "포커스 패스 저장 실패:",
                    error.response?.data ||
                    error
                );

                passSavedRef.current =
                    false;
            }
        }, [
            startedAt,
            isPaused,
            totalFocusSeconds,
            selectedFlightInfo,
        ]);

    /* =========================================
       타이머 카운트다운
    ========================================= */

    useEffect(() => {
        if (
            !endTimeMs ||
            isPaused
        ) {
            return undefined;
        }

        const updateTimer = () => {
            const diffSeconds =
                Math.max(
                    0,
                    Math.ceil(
                        (
                            endTimeMs -
                            Date.now()
                        ) / 1000
                    )
                );

            setRemainingSeconds(
                diffSeconds
            );

            if (
                diffSeconds === 0
            ) {
                setEndTimeMs(null);
                setRemainingSeconds(0);
                setIsPaused(false);

                pausedSecondsRef.current = 0;

                setSuccessPage(page);

                saveFocusPass(page);

                setShowSuccessModal(
                    true
                );

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
            window.clearInterval(
                intervalId
            );
        };
    }, [
        endTimeMs,
        isPaused,
        page,
        saveFocusPass,
    ]);

    /* =========================================
       음악 ON / OFF
    ========================================= */

    const toggleMusic = () => {
        const audio =
            audioRef.current;

        if (!audio) {
            return;
        }

        if (musicOn) {
            audio.pause();
            setMusicOn(false);
        } else {
            setMusicOn(true);

            audio.volume = 0.5;

            audio.play().catch(
                (error) => {
                    console.log(
                        "BGM 재생 실패:",
                        error
                    );
                }
            );
        }
    };

    /* =========================================
       간식에서 연결된 상품 ID
    ========================================= */

    const getSelectedProductId = () => {
        if (!selectedDrink) {
            return 1;
        }

        if (
            selectedDrink.productId !==
                undefined &&
            selectedDrink.productId !==
                null
        ) {
            return (
                selectedDrink.productId
            );
        }

        if (
            selectedDrink.productVariantId !==
                undefined &&
            selectedDrink.productVariantId !==
                null
        ) {
            return (
                selectedDrink
                    .productVariantId
            );
        }

        if (
            selectedDrink
                .product
                ?.productId !==
                undefined &&
            selectedDrink
                .product
                ?.productId !==
                null
        ) {
            return (
                selectedDrink
                    .product
                    .productId
            );
        }

        return 1;
    };

    /* =========================================
       상품 상세 API
    ========================================= */

    const fetchProductDetail = async (
        productId
    ) => {
        try {
            setProductLoading(true);
            setProduct(null);

            const url =
                config
                    .PRODUCT
                    .DETAIL_GET(
                        productId
                    );

            console.log(
                "상품 상세 요청 ID:",
                productId
            );

            console.log(
                "상품 상세 요청 URL:",
                url
            );

            const response =
                await get(url);

            console.log(
                "상품 상세 API 응답:",
                response
            );

            if (
                response?.isSuccess &&
                response?.result
            ) {
                setProduct(
                    response.result
                );
            } else {
                console.error(
                    "상품 상세 조회 응답 오류:",
                    response
                );

                setProduct(null);
            }
        } catch (error) {
            console.error(
                "상품 상세 조회 실패:",
                error.response?.data ||
                error
            );

            setProduct(null);
        } finally {
            setProductLoading(
                false
            );
        }
    };

    /* =========================================
    지갑 클릭
    ========================================= */

    const handleProductClick = () => {
        ensureMusicPlaying();

        /*
        * 아직 간식을 선택하지 않은 경우
        * 상품 API 호출하지 않음
        */
        if (!selectedDrink) {
            setProduct(null);
            setProductLoading(false);
            setShowProductModal(true);

            return;
        }

        const productId =
            getSelectedProductId();

        console.log(
            "현재 selectedDrink:",
            selectedDrink
        );

        console.log(
            "사용할 productId:",
            productId
        );

        setShowProductModal(true);

        fetchProductDetail(
            productId
        );
    };

    /* =========================================
       음료 주문 완료
    ========================================= */

    const handleDrinkOrder = (
        drink
    ) => {
        console.log(
            "Route에서 받은 주문 상품:",
            drink
        );

        setSelectedDrink(
            drink
        );

        setShowTeaModal(
            false
        );

        setProduct(null);
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

    const goTakeoff = () => {
        ensureMusicPlaying();
        setPage("takeoff");
    };

    /* =========================================
       시간 표시
    ========================================= */

    const formatTime = (
        seconds
    ) => {
        const safeSeconds =
            Math.max(
                0,
                seconds
            );

        const hours =
            Math.floor(
                safeSeconds /
                3600
            );

        const minutes =
            Math.floor(
                (
                    safeSeconds %
                    3600
                ) / 60
            );

        const secs =
            safeSeconds % 60;

        return (
            `${String(hours).padStart(
                2,
                "0"
            )}:` +
            `${String(minutes).padStart(
                2,
                "0"
            )}:` +
            `${String(secs).padStart(
                2,
                "0"
            )}`
        );
    };

    const formatSuccessTime = (
        seconds
    ) => {
        const hours =
            Math.floor(
                seconds /
                3600
            );

        const minutes =
            Math.floor(
                (
                    seconds %
                    3600
                ) / 60
            );

        const secs =
            seconds % 60;

        return (
            `${String(hours).padStart(
                2,
                "0"
            )}:` +
            `${String(minutes).padStart(
                2,
                "0"
            )}:` +
            `${String(secs).padStart(
                2,
                "0"
            )}`
        );
    };

    /* =========================================
       오늘 날짜
    ========================================= */

    const getTodayDate = () => {
        const today =
            new Date();

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

        return (
            `${year}.${month}.${day}`
        );
    };

    /* =========================================
       성공 장소
    ========================================= */

    const getSuccessPlace = () => {
        if (
            successPage === "focus1"
        ) {
            return "LOUNGE1";
        }

        if (
            successPage === "focus2"
        ) {
            return "LOUNGE2";
        }

        if (
            successPage === "mcm"
        ) {
            return "MCMLounge";
        }

        if (
            successPage === "takeoff"
        ) {
            return "TAKEOFF";
        }

        return "";
    };

    /* =========================================
       티켓 저장
    ========================================= */

    const handleSaveTicket =
        async () => {
            if (
                !successTicketRef.current
            ) {
                return;
            }

            try {
                const canvas =
                    await html2canvas(
                        successTicketRef.current,
                        {
                            backgroundColor:
                                null,
                            scale: 2,
                            useCORS: true,
                        }
                    );

                const image =
                    canvas.toDataURL(
                        "image/png"
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href = image;
                link.download =
                    "focus-success-ticket.png";

                link.click();
            } catch (error) {
                console.log(
                    "티켓 이미지 저장 실패:",
                    error
                );
            }
        };

    const timerActive =
        remainingSeconds > 0;

    /* =========================================
       상품 모달 값
    ========================================= */

    const productImageUrl =
        product?.imageUrl ||
        product?.productImageUrl ||
        selectedDrink?.productImageUrl ||
        mcmbag;

    const productName =
        product?.name ||
        product?.productName ||
        "MCM Product";

    const productDescription =
        product?.description ||
        product?.productDescription ||
        product?.detail ||
        "상품 설명이 없습니다.";

    const productDetailUrl =
        product?.detailUrl ||
        product?.productUrl ||
        product?.url ||
        product?.homepageUrl;

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

            {/* 현재 이용 인원 */}
            <div className="lounge-people">

                <div className="lounge-people-icon">
                    <img
                        className="lounge-people-icon-image"
                        src={peopleIcon}
                        alt="People"
                    />
                </div>

                <div className="lounge-people-title">
                    {
                        page === "takeoff"
                            ? "비행기 전체"
                            : "라운지 전체"
                    }
                </div>

                <div className="lounge-people-divider" />

                <div className="lounge-people-count">

                    <span className="lounge-people-number">
                        {
                            page === "takeoff"
                                ? flightPeople
                                : loungePeople
                        }명
                    </span>

                    <span className="lounge-people-text">
                        함께 하는 중..
                    </span>

                </div>
            </div>

            {/* 공통 타이머 */}
            {timerActive && (
                <div
                    className={
                        `lounge-timer ${
                            isPaused
                                ? "lounge-timer-paused"
                                : "lounge-timer-running"
                        }`
                    }
                >

                    <div className="lounge-timer-header">

                        <span className="lounge-timer-title">
                            Focus Time
                        </span>

                        <span
                            className={
                                `lounge-timer-status ${
                                    isPaused
                                        ? "lounge-timer-status-paused"
                                        : "lounge-timer-status-running"
                                }`
                            }
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
                            className={
                                `lounge-control-button lounge-music-button ${
                                    musicOn
                                        ? "lounge-music-button-on"
                                        : "lounge-music-button-off"
                                }`
                            }
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
                                {
                                    musicOn
                                        ? "ON"
                                        : "OFF"
                                }
                            </span>

                        </button>

                        <button
                            type="button"
                            className="lounge-control-button lounge-pause-button"
                            onClick={togglePause}
                        >

                            <span className="lounge-pause-icon">
                                {
                                    isPaused
                                        ? "▶"
                                        : "Ⅱ"
                                }
                            </span>

                            <span className="lounge-pause-text">
                                {
                                    isPaused
                                        ? "다시 시작"
                                        : "일시정지"
                                }
                            </span>

                        </button>

                    </div>
                </div>
            )}

            {/* MCM 지갑 */}
            <button
                type="button"
                className={
                    `lounge-wallet-wrapper lounge-wallet-wrapper-${page}`
                }
                onClick={handleProductClick}
                aria-label="MCM 제품 정보 보기"
            >
                <img
                    className={
                        selectedDrink?.productImageUrl
                            ? "lounge-wallet-image lounge-wallet-image-api"
                            : "lounge-wallet-image"
                    }
                    src={
                        selectedDrink?.productImageUrl ||
                        mcmbag
                    }
                    alt="MCM Bag"
                />
            </button>

            {/* 주문 전 점선 물병 */}
            {!selectedDrink && (
                <button
                    type="button"
                    className={
                        `lounge-drink-button lounge-drink-button-${page}`
                    }
                    onClick={() => {
                        ensureMusicPlaying();
                        setShowTeaModal(true);
                    }}
                    aria-label="간식 주문"
                >
                    <img
                        className="lounge-drink-image"
                        src={drinkIcon}
                        alt="간식 주문"
                    />
                </button>
            )}

            {/* 주문 후 음료 */}
            {selectedDrink && (
                <button
                    type="button"
                    className={
                        `lounge-ordered-drink lounge-ordered-drink-${page}`
                    }
                    onClick={() => {
                        ensureMusicPlaying();
                        setShowTeaModal(true);
                    }}
                >
                    <img
                        className={
                            `lounge-ordered-drink-image ${
                                selectedDrink.type === "PERFUME"
                                    ? "lounge-ordered-item-perfume"
                                    : selectedDrink.type === "SNACK"
                                    ? "lounge-ordered-item-snack"
                                    : "lounge-ordered-item-drink"
                            }`
                        }
                        src={
                            selectedDrink.snackImageUrl ||
                            selectedDrink.imageUrl ||
                            iceTeaImage
                        }
                        alt={
                            selectedDrink.name ||
                            "주문한 간식"
                        }
                    />
                </button>
            )}

            {/* Snack 팝업 */}
            {showTeaModal && (
                <TeaModal
                    onClose={() =>
                        setShowTeaModal(false)
                    }
                    onOrder={handleDrinkOrder}
                />
            )}

            {/* =========================================
                상품 상세 팝업
            ========================================= */}

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
                        {/* 닫기 버튼 */}
                        <button
                            type="button"
                            className="lounge-product-modal-close"
                            onClick={() =>
                                setShowProductModal(false)
                            }
                            aria-label="상품 팝업 닫기"
                        >
                            ×
                        </button>


                        {/* =========================================
                            간식 선택 전
                        ========================================= */}

                        {!selectedDrink ? (
                            <div className="lounge-product-empty">
                                간식을 선택해주세요
                            </div>

                        ) : productLoading ? (

                            /* =========================================
                            상품 정보 로딩
                            ========================================= */

                            <div className="lounge-product-loading">
                                상품 정보를 불러오는 중입니다...
                            </div>

                        ) : product ? (

                            /* =========================================
                            간식 선택 후 상품 정보
                            ========================================= */

                            <>
                                <img
                                    className="lounge-product-modal-image"
                                    src={productImageUrl}
                                    alt={productName}
                                />

                                <div className="lounge-product-modal-name">
                                    {productName}
                                </div>

                                <div className="lounge-product-modal-price">
                                    {
                                        product.price !== undefined &&
                                        product.price !== null
                                            ? `₩ ${Number(
                                                product.price
                                            ).toLocaleString()}`
                                            : ""
                                    }
                                </div>

                                <div className="lounge-product-modal-description">
                                    {productDescription}
                                </div>


                                {/* 제품 자세히보기 */}
                                <button
                                    type="button"
                                    className="lounge-product-modal-button"
                                    onClick={() => {
                                        console.log(
                                            "제품 상세 URL:",
                                            productDetailUrl
                                        );

                                        if (!productDetailUrl) {
                                            console.error(
                                                "제품 상세 URL이 없습니다.",
                                                product
                                            );

                                            return;
                                        }

                                        window.open(
                                            productDetailUrl,
                                            "_blank",
                                            "noopener,noreferrer"
                                        );
                                    }}
                                >
                                    <span>
                                        제품 자세히보기
                                    </span>

                                    <span className="lounge-product-modal-arrow">
                                        〉
                                    </span>
                                </button>


                                {/* AI 수납 확인 */}
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

                            <div className="lounge-product-loading">
                                상품 정보를 불러오지 못했습니다.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 현재 페이지 */}
            <div
                className={
                    `lounge-page-container lounge-page-${page}`
                }
            >
                {
                    page === "takeoff"
                        ? (
                            <Takeoff />
                        )
                        : page === "focus2"
                        ? (
                            <FocusLounge2
                                onPrev={goFocus1}
                                onNext={goMcm}
                            />
                        )
                        : page === "mcm"
                        ? (
                            <MCMLounge
                                onPrev={goFocus2}
                            />
                        )
                        : (
                            <FocusLounge1
                                onNext={goFocus2}
                                onStartTimer={startTimer}
                                onTakeoff={goTakeoff}

                                onSelectFlight={(flight) => {
                                    console.log(
                                        "선택한 항공편:",
                                        flight
                                    );

                                    setSelectedFlightInfo(
                                        flight
                                    );
                                }}

                                timerActive={timerActive}
                                ensureMusicPlaying={ensureMusicPlaying}
                                openFlightModal={openFlightModal}
                                flightFocusSeconds={totalFocusSeconds}

                                onFlightModalOpened={() =>
                                    setOpenFlightModal(false)
                                }
                            />
                        )
                }
            </div>

            {/* SUCCESS */}
            {showSuccessModal && (
                <div className="lounge-success-overlay">

                    <div className="lounge-success-content">

                        <div
                            className="lounge-success-ticket-wrapper"
                            ref={successTicketRef}
                        >
                            <img
                                className="lounge-success-ticket-image"
                                src={ticketImage}
                                alt="Focus Success Ticket"
                            />

                            <div className="lounge-success-ticket-time">
                                {formatSuccessTime(
                                    totalFocusSeconds
                                )}
                            </div>

                            <div className="lounge-success-ticket-place">
                                {getSuccessPlace()}
                            </div>

                            <div className="lounge-success-ticket-date">
                                {getTodayDate()}
                            </div>
                        </div>

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
                                    setShowSuccessModal(false);
                                    setPage("focus1");
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