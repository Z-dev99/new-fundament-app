"use client";

import styles from "./Marquee.module.scss";

export const Marquee = () => {
    const items = [
        "Было продано за неделю 274 объектов",
        "Было продано за неделю 274 объектов",
        "Было продано за неделю 274 объектов",
        "Было продано за неделю 274 объектов",
    ];

    return (
        <div className="container">
            <div className={` ${styles.wrapper}`} style={{ marginTop: "20px" }}>
                <div className={styles.track}>
                    {[...items, ...items].map((item, idx) => (
                        <div key={idx} className={styles.item}>
                            {item}
                            <span className={styles.dot} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
