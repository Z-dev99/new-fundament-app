"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

interface Props {
    page: number;
    pages: number;
    onChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({ page, pages, onChange }) => {
    if (pages <= 1) return null;

    const handlePrev = () => {
        if (page > 1) {
            onChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < pages) {
            onChange(page + 1);
        }
    };

    const handlePageClick = (newPage: number) => {
        if (newPage !== page && newPage >= 1 && newPage <= pages) {
            onChange(newPage);
        }
    };

    // Генерируем массив страниц для отображения
    const getPageNumbers = (): (number | string)[] => {
        const delta = 2; // Количество страниц по бокам от текущей
        const range: (number | string)[] = [];

        // Если страниц немного, показываем все
        if (pages <= 7) {
            for (let i = 1; i <= pages; i++) {
                range.push(i);
            }
            return range;
        }

        // Всегда показываем первую страницу
        range.push(1);

        // Вычисляем диапазон вокруг текущей страницы
        const left = Math.max(2, page - delta);
        const right = Math.min(pages - 1, page + delta);

        // Добавляем многоточие слева, если нужно
        if (left > 2) {
            range.push("...");
        }

        // Добавляем страницы вокруг текущей
        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        // Добавляем многоточие справа, если нужно
        if (right < pages - 1) {
            range.push("...");
        }

        // Всегда показываем последнюю страницу
        if (pages > 1) {
            range.push(pages);
        }

        return range;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={styles.pagination}>
            <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handlePrev}
                disabled={page === 1}
                aria-label="Предыдущая страница"
            >
                <ChevronLeft size={20} />
                <span>Назад</span>
            </button>

            <div className={styles.pages}>
                {pageNumbers.map((item, index) => {
                    if (item === "...") {
                        return (
                            <span
                                key={`dots-${index}`}
                                className={styles.dots}
                                aria-hidden="true"
                            >
                                ...
                            </span>
                        );
                    }

                    const pageNum = item as number;
                    const isActive = pageNum === page;

                    return (
                        <button
                            key={`page-${pageNum}`}
                            className={`${styles.pageButton} ${isActive ? styles.active : ""}`}
                            onClick={() => handlePageClick(pageNum)}
                            aria-label={`Страница ${pageNum}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleNext}
                disabled={page === pages}
                aria-label="Следующая страница"
            >
                <span>Вперед</span>
                <ChevronRight size={20} />
            </button>
        </div>
    );
};
