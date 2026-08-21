import React, { useEffect, useState } from "react";

import { get } from "../api";
import config from "../config";

import iceTeaImage from "../assets/images/icetea.png";

import "../styles/TeaModal.css";

function TeaModal({ onClose, onOrder }) {
    const [activeCategory, setActiveCategory] =
        useState("drink");

    // API에서 받은 전체 간식 목록
    const [items, setItems] = useState([]);

    const [selectedItem, setSelectedItem] =
        useState(null);

    useEffect(() => {
        const fetchSnacks = async () => {
            try {
                const response = await get(
                    config.SNACK.GET
                );

                console.log(
                    "간식 목록 API 응답:",
                    response
                );

                if (
                    response.isSuccess &&
                    Array.isArray(response.result)
                ) {
                    setItems(response.result);

                    // 처음에는 음료 탭이므로
                    // 첫 번째 DRINK를 자동 선택
                    const firstDrink =
                        response.result.find(
                            (item) =>
                                item.type === "DRINK"
                        );

                    if (firstDrink) {
                        setSelectedItem(
                            firstDrink.snackId
                        );
                    }
                } else {
                    setItems([]);
                }

            } catch (error) {
                console.error(
                    "간식 목록 조회 실패:",
                    error.response?.data || error
                );

                setItems([]);
            }
        };

        fetchSnacks();
    }, []);

    // =========================================
    // 현재 탭에 맞는 type 변환
    // =========================================
    const getCategoryType = () => {
        if (activeCategory === "drink") {
            return "DRINK";
        }

        if (activeCategory === "food") {
            return "SNACK";
        }

        if (activeCategory === "perfume") {
            return "PERFUME";
        }

        return "";
    };

    // =========================================
    // 현재 탭에 보여줄 항목만 필터링
    // =========================================
    const filteredItems = items.filter(
        (item) =>
            item.type === getCategoryType()
    );

    // =========================================
    // 탭 변경
    // =========================================
    const handleCategoryChange = (category) => {
        setActiveCategory(category);

        let type = "";

        if (category === "drink") {
            type = "DRINK";
        } else if (category === "food") {
            type = "SNACK";
        } else if (category === "perfume") {
            type = "PERFUME";
        }

        // 바뀐 카테고리의 첫 번째 항목 자동 선택
        const firstItem =
            items.find(
                (item) => item.type === type
            );

        if (firstItem) {
            setSelectedItem(
                firstItem.snackId
            );
        } else {
            setSelectedItem(null);
        }
    };

    const handleOrder = async () => {
        if (!selectedItem) {
            return;
        }

        // 현재 선택한 상품 정보
        const selectedData = items.find(
            (item) => item.snackId === selectedItem
        );

        if (!selectedData) {
            return;
        }

        try {
            const response = await get(
                config.SNACK.DETAIL_GET(
                    selectedItem
                )
            );

            console.log(
                "간식 주문 API 응답:",
                response
            );

            if (
                response.isSuccess &&
                response.result
            ) {
                if (onOrder) {
                    onOrder({
                        snackId:
                            selectedItem,

                        snackImageUrl:
                            response.result.snackImageUrl,

                        productImageUrl:
                            response.result.productImageUrl,

                        productVariantId:
                            response.result.productVariantId,

                        // ★ 새 Packing API에서 사용할 ID
                        packingProfileId:
                            response.result.packingProfileId,

                        type:
                            selectedData.type,

                        name:
                            selectedData.name,

                        imageUrl:
                            selectedData.imageUrl,
                    });
                }

                onClose();
            }

        } catch (error) {
            console.error(
                "간식 주문 실패:",
                error.response?.data || error
            );
        }
    };

    return (
        <div
            className="tea-modal-overlay"
            onClick={onClose}
        >
            <div
                className="tea-modal-container"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* 닫기 */}
                <button
                    type="button"
                    className="tea-modal-close-button"
                    onClick={onClose}
                    aria-label="닫기"
                >
                    ×
                </button>

                {/* 제목 */}
                <h2 className="tea-modal-title">
                    간식 주문
                </h2>

                {/* =====================================
                    카테고리
                ===================================== */}
                <div className="tea-modal-tabs">

                    <button
                        type="button"
                        className={`tea-modal-tab ${
                            activeCategory === "drink"
                                ? "tea-modal-tab-active"
                                : ""
                        }`}
                        onClick={() =>
                            handleCategoryChange(
                                "drink"
                            )
                        }
                    >
                        음료
                    </button>

                    <button
                        type="button"
                        className={`tea-modal-tab ${
                            activeCategory === "food"
                                ? "tea-modal-tab-active"
                                : ""
                        }`}
                        onClick={() =>
                            handleCategoryChange(
                                "food"
                            )
                        }
                    >
                        식사
                    </button>

                    <button
                        type="button"
                        className={`tea-modal-tab ${
                            activeCategory === "perfume"
                                ? "tea-modal-tab-active"
                                : ""
                        }`}
                        onClick={() =>
                            handleCategoryChange(
                                "perfume"
                            )
                        }
                    >
                        향수
                    </button>

                </div>

                {/* =====================================
                    현재 카테고리 상품
                ===================================== */}
                <div className="tea-modal-item-grid">

                    {filteredItems.map((item) => (
                        <button
                            key={item.snackId}
                            type="button"
                            className={`tea-modal-item ${
                                selectedItem ===
                                item.snackId
                                    ? "tea-modal-item-selected"
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedItem(
                                    item.snackId
                                )
                            }
                        >
                            <div className="tea-modal-item-image-wrapper">

                                <img
                                    className="tea-modal-item-image"
                                    src={
                                        item.imageUrl ||
                                        iceTeaImage
                                    }
                                    alt={item.name}
                                />

                            </div>

                            <span className="tea-modal-item-name">
                                {item.name}
                            </span>

                        </button>
                    ))}

                </div>

                {/* =====================================
                    주문하기
                ===================================== */}
                <button
                    type="button"
                    className="tea-modal-order-button"
                    onClick={handleOrder}
                    disabled={!selectedItem}
                >
                    주문하기
                </button>

            </div>
        </div>
    );
}

export default TeaModal;