"use client";

import React, { useState } from "react";
import styles from "./FiltersBar.module.scss";
import { ModalFilter } from "../modal/ModalFilter";

const IconMap = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 20l-5-2V6l5 2v12zM9 4l6-2 6 2v12l-6 2-6-2V4z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const IconList = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

export default function FiltersBar() {
    const [dealType, setDealType] = useState<"purchase" | "rent">("purchase");
    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [areaFrom, setAreaFrom] = useState("");
    const [areaTo, setAreaTo] = useState("");
    const [rooms, setRooms] = useState<number | null>(null);
    const [view, setView] = useState<"map" | "list">("map");
    const [modalOpen, setModalOpen] = useState(false);

    const [filtersCount] = useState(2);
    const [resultsCount] = useState(1055);

    const toggleRoom = (n: number) => {
        setRooms(prev => prev === n ? null : n);
    };

    const onApply = () => {
        console.log({
            dealType, priceFrom, priceTo, areaFrom, areaTo, rooms, view
        });
    };

    return (
        <>
            <div className="container">
                <div className={styles.wrapper}>

                    {/* === TOP GRID === */}
                    <div className={styles.grid}>
                        {/* Тип сделки */}
                        <div className={styles.group}>
                            <div className={styles.label}>Тип сделки</div>
                            <div className={styles.segment}>
                                <button
                                    className={`${styles.segmentBtn} ${dealType === "purchase" ? styles.active : ""}`}
                                    onClick={() => setDealType("purchase")}
                                >
                                    Покупка
                                </button>
                                <button
                                    className={`${styles.segmentBtn} ${dealType === "rent" ? styles.active : ""}`}
                                    onClick={() => setDealType("rent")}
                                >
                                    Аренда
                                </button>
                            </div>
                        </div>

                        {/* Стоимость */}
                        <div className={styles.group}>
                            <div className={styles.label}>Стоимость</div>
                            <div className={styles.inlineInputs}>
                                <input
                                    placeholder="От"
                                    inputMode="numeric"
                                    value={priceFrom}
                                    onChange={(e) => setPriceFrom(e.target.value)}
                                    className={styles.input}
                                />
                                <input
                                    placeholder="До"
                                    inputMode="numeric"
                                    value={priceTo}
                                    onChange={(e) => setPriceTo(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        {/* Комнатность */}
                        <div className={styles.group}>
                            <div className={styles.label}>Комнатность</div>
                            <div className={styles.rooms}>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        key={n}
                                        className={`${styles.roomBtn} ${rooms === n ? styles.roomActive : ""}`}
                                        onClick={() => toggleRoom(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Площадь */}
                        <div className={styles.group}>
                            <div className={styles.label}>Площадь</div>
                            <div className={styles.inlineInputs}>
                                <input
                                    placeholder="От"
                                    inputMode="numeric"
                                    value={areaFrom}
                                    onChange={(e) => setAreaFrom(e.target.value)}
                                    className={styles.input}
                                />
                                <input
                                    placeholder="До"
                                    inputMode="numeric"
                                    value={areaTo}
                                    onChange={(e) => setAreaTo(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                        </div>
                    </div>

                    {/* === ACTIONS === */}
                    <div className={styles.actions}>
                        <div className={styles.viewSwitch}>
                            <button
                                className={`${styles.viewBtn} ${view === "map" ? styles.viewActive : ""}`}
                                onClick={() => setView("map")}
                            >
                                <IconMap /> <span>На карте</span>
                            </button>
                            <button
                                className={`${styles.viewBtn} ${view === "list" ? styles.viewActive : ""}`}
                                onClick={() => setView("list")}
                            >
                                <IconList /> <span>Список</span>
                            </button>
                        </div>

                        <div className={styles.right}>
                            <button
                                className={styles.moreBtn}
                                onClick={() => setModalOpen(true)}
                            >
                                Ещё фильтры <span className={styles.count}>{filtersCount}</span>
                            </button>

                            <button
                                className={styles.applyBtn}
                                onClick={onApply}
                            >
                                Показать {resultsCount.toLocaleString()} объектов
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ModalFilter open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
