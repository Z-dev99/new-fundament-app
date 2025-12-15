"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ThumbnailsSlider.module.scss";

interface ThumbnailsSliderProps {
    images: string[];
    activeIndex: number;
    onThumbClick: (index: number) => void;
    className?: string;
}

export const ThumbnailsSlider: React.FC<ThumbnailsSliderProps> = ({
    images,
    activeIndex,
    onThumbClick,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeThumbRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (activeThumbRef.current && containerRef.current) {
            const container = containerRef.current;
            const activeThumb = activeThumbRef.current;
            const containerRect = container.getBoundingClientRect();
            const thumbRect = activeThumb.getBoundingClientRect();

            const scrollLeft =
                activeThumb.offsetLeft -
                containerRect.width / 2 +
                thumbRect.width / 2;

            container.scrollTo({
                left: scrollLeft,
                behavior: "smooth",
            });
        }
    }, [activeIndex]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.thumbnails} ${className || ""}`}>
            <div className={styles.thumbnailsContainer} ref={containerRef}>
                {images.map((img, index) => (
                    <button
                        key={index}
                        ref={index === activeIndex ? activeThumbRef : null}
                        className={`${styles.thumbnail} ${
                            index === activeIndex ? styles.active : ""
                        }`}
                        onClick={() => onThumbClick(index)}
                        aria-label={`Показать изображение ${index + 1}`}
                    >
                        <div className={styles.thumbnailImageWrapper}>
                            <Image
                                src={img}
                                alt={`Миниатюра ${index + 1}`}
                                fill
                                className={styles.thumbnailImage}
                                sizes="(max-width: 768px) 25vw, 15vw"
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
