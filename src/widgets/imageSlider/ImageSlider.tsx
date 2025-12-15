"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ImageSlider.module.scss";

interface ImageSliderProps {
    images: string[];
    className?: string;
    activeIndex?: number;
    onSlideChange?: (index: number) => void;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
    images,
    className,
    activeIndex: externalIndex,
    onSlideChange,
}) => {
    const [internalIndex, setInternalIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;

    const goToSlide = useCallback(
        (index: number) => {
            if (isAnimating || index === currentIndex) return;
            if (index < 0 || index >= images.length) return;
            setIsAnimating(true);
            if (externalIndex === undefined) {
                setInternalIndex(index);
            }
            onSlideChange?.(index);
            setTimeout(() => setIsAnimating(false), 300);
        },
        [currentIndex, isAnimating, images.length, externalIndex, onSlideChange]
    );

    const goToPrevious = useCallback(() => {
        if (isAnimating) return;
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
    }, [currentIndex, images.length, isAnimating, goToSlide]);

    const goToNext = useCallback(() => {
        if (isAnimating) return;
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        goToSlide(newIndex);
    }, [currentIndex, images.length, isAnimating, goToSlide]);

    useEffect(() => {
        if (externalIndex !== undefined && externalIndex !== internalIndex) {
            setInternalIndex(externalIndex);
        }
    }, [externalIndex, internalIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goToPrevious, goToNext]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.slider} ${className || ""}`}>
            <div className={styles.sliderContainer}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className={styles.slide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className={styles.imageWrapper}>
                            <Image
                                src={images[currentIndex]}
                                alt={`Изображение ${currentIndex + 1}`}
                                fill
                                className={styles.image}
                                sizes="(max-width: 768px) 100vw, 70vw"
                                priority={currentIndex === 0}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <button
                            className={`${styles.navButton} ${styles.prevButton}`}
                            onClick={goToPrevious}
                            aria-label="Предыдущее изображение"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className={`${styles.navButton} ${styles.nextButton}`}
                            onClick={goToNext}
                            aria-label="Следующее изображение"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                <div className={styles.counter}>
                    {currentIndex + 1} / {images.length}
                </div>

                {images.length > 1 && (
                    <div className={styles.pagination}>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.paginationDot} ${
                                    index === currentIndex ? styles.active : ""
                                }`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Перейти к изображению ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
