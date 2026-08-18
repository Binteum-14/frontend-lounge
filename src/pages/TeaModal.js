import React, { useEffect, useState } from "react";

import { get } from "../api";
import config from "../config";

import iceTeaImage from "../assets/images/icetea.png";

import "../styles/TeaModal.css";

function TeaModal({ onClose, onOrder }) {
    const [activeCategory, setActiveCategory] = useState("drink");

    const [drinkItems, setDrinkItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSnacks = async () => {
            try {
                setLoading(true);

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
                    setDrinkItems(response.result);

                    if (response.result.length > 0) {
                        setSelectedItem(
                            response.result[0].snackId
                        );
                    }
                } else {
                    setDrinkItems([]);
                }

            } catch (error) {
                console.error(
                    "간식 목록 조회 실패:",
                    error.response?.data || error
                );

                setDrinkItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSnacks();
    }, []);

    const handleOrder = async () => {
        if (!selectedItem) {
            return;
        }

        try {
            const response = await get(
                config.SNACK.DETAIL_GET(selectedItem)
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
                        snackId: selectedItem,
                        snackImageUrl:
                            response.result.snackImageUrl,
                        productImageUrl:
                            response.result.productImageUrl,
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

                {/* 카테고리 */}
                <div className="tea-modal-tabs">
                    <button
                        type="button"
                        className={`tea-modal-tab ${
                            activeCategory === "drink"
                                ? "tea-modal-tab-active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveCategory("drink")
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
                            setActiveCategory("food")
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
                            setActiveCategory("perfume")
                        }
                    >
                        향수
                    </button>
                </div>

                {/* 음료 */}
                {activeCategory === "drink" && (
                    <div className="tea-modal-item-grid">
                        {drinkItems.map((item) => (
                            <button
                                key={item.snackId}
                                type="button"
                                className={`tea-modal-item ${
                                    selectedItem === item.snackId
                                        ? "tea-modal-item-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedItem(item.snackId)
                                }
                            >
                                <div className="tea-modal-item-image-wrapper">
                                    <img
                                        className="tea-modal-item-image"
                                        src={item.imageUrl || iceTeaImage}
                                        alt={item.name}
                                    />
                                </div>

                                <span className="tea-modal-item-name">
                                    {item.name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* 식사 */}
                {activeCategory === "food" && (
                    <div className="tea-modal-empty">
                        준비 중입니다.
                    </div>
                )}

                {/* 향수 */}
                {activeCategory === "perfume" && (
                    <div className="tea-modal-empty">
                        준비 중입니다.
                    </div>
                )}

                {/* 주문하기 */}
                <button
                    type="button"
                    className="tea-modal-order-button"
                    onClick={handleOrder}
                    disabled={
                        activeCategory !== "drink"
                    }
                >
                    주문하기
                </button>
            </div>
        </div>
    );
}

export default TeaModal;