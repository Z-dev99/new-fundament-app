import React from "react";
import styles from "./Pagination.module.css";

interface Props {
    page: number;
    pages: number;
    onChange: (page: number) => void;
}

export const Pagination: React.FC<Props> = ({ page, pages, onChange }) => {
    if (pages <= 1) return null;

    const createRange = () => {
        const range: (number | "...")[] = [];
        const delta = 1;

        const left = Math.max(2, page - delta);
        const right = Math.min(pages - 1, page + delta);

        range.push(1);

        if (left > 2) range.push("...");

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < pages - 1) range.push("...");

        if (pages > 1) range.push(pages);

        return range;
    };

    const items = createRange();

    return (
        <div className={styles.wrap}>
            {items.map((p, i) => {
                if (p === "...") {
                    return (
                        <div
                            key={`dots-${i}`}
                            className={styles.page}
                            style={{ pointerEvents: "none", opacity: 0.4 }}
                        >
                            ...
                        </div>
                    );
                }

                return (
                    <div
                        key={`page-${p}-${i}`}
                        className={`${styles.page} ${p === page ? styles.active : ""}`}
                        onClick={() => onChange(p)}
                    >
                        {p}
                    </div>
                );
            })}
        </div>
    );
};
