"use client";

import React, { useEffect } from "react";
import styles from "./ModalFilter.module.css";

interface Props {
    open: boolean;
    onClose: () => void;
}

export const ModalFilter: React.FC<Props> = ({ open, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
    }, [open]);

    if (!open) return null;

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className={styles.header}>
                    <h2>Фильтр объектов</h2>
                    <button className={styles.close} onClick={onClose}>✕</button>
                </div>

                {/* Content */}
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>ID заявки</label>
                        <input type="text" placeholder="Введите ID" />
                    </div>

                    <div className={styles.field}>
                        <label>Тип сделки</label>
                        <select>
                            <option>Покупка</option>
                            <option>Аренда</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Стоимость</label>
                        <div className={styles.row2}>
                            <input type="number" placeholder="От" />
                            <input type="number" placeholder="До" />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Комнатность</label>
                        <div className={styles.chips}>
                            {["1", "2", "3", "4", "5"].map((n) => (
                                <button key={n} className={styles.chip}>{n}</button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Площадь</label>
                        <div className={styles.row2}>
                            <input type="number" placeholder="От" />
                            <input type="number" placeholder="До" />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Город</label>
                        <select>
                            <option>Астана</option>
                            <option>Алматы</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Жилой комплекс</label>
                        <select>
                            <option>Выберите ЖК</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Район</label>
                        <select>
                            <option>Район</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Улица</label>
                        <select>
                            <option>Выберите улицу</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Планировка</label>
                        <select>
                            <option>Выберите планировку</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Состояние</label>
                        <select>
                            <option>Любое</option>
                        </select>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.rightBtns}>
                        <button className={styles.resetBtn}>Сбросить</button>
                        <button className={styles.showBtn}>
                            Показать 1055 объектов
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
