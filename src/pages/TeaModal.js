import React, { useState } from "react";

import iceTeaImage from "../assets/images/icetea.png";

import "../styles/TeaModal.css";

function TeaModal({ onClose, onOrder }) {
    const [activeCategory, setActiveCategory] = useState("drink");
    const [selectedItem, setSelectedItem] = useState(0);

    const drinkItems = [
        {
            id: 0,
            name: "아이스티",
            image: iceTeaImage,
        },
        {
            id: 1,
            name: "아이스티",
            image: iceTeaImage,
        },
        {
            id: 2,
            name: "아이스티",
            image: iceTeaImage,
        },
        {
            id: 3,
            name: "아이스티",
            image: iceTeaImage,
        },
    ];

    const handleOrder = () => {
        const selectedDrink = drinkItems.find(
            (item) => item.id === selectedItem
        );

        if (onOrder) {
            onOrder(selectedDrink);
        }

        onClose();
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
                                key={item.id}
                                type="button"
                                className={`tea-modal-item ${
                                    selectedItem === item.id
                                        ? "tea-modal-item-selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    setSelectedItem(item.id)
                                }
                            >
                                <div className="tea-modal-item-image-wrapper">
                                    <img
                                        className="tea-modal-item-image"
                                        src={item.image}
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