"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import styles from "./ImageSlider.module.scss";

interface ImageSliderProps {
    images: string[];
    className?: string;
    activeIndex?: number;
    onSlideChange?: (index: number) => void;
    onFullscreen?: (index: number) => void;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export const ImageSlider: React.FC<ImageSliderProps> = ({
    images,
    className,
    activeIndex: externalIndex,
    onSlideChange,
    onFullscreen,
}) => {
    const [internalIndex, setInternalIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;

    // Проверяем загрузку изображений при изменении индекса
    useEffect(() => {
        if (images.length > 0 && images[currentIndex]) {
            const img = new window.Image();
            img.onerror = () => {
                setImageErrors((prev) => ({ ...prev, [currentIndex]: true }));
            };
            img.onload = () => {
                // Если изображение загрузилось, сбрасываем ошибку
                setImageErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[currentIndex];
                    return newErrors;
                });
            };
            img.src = images[currentIndex];
        }
    }, [currentIndex, images]);

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
        // Находим предыдущее валидное изображение
        let prevIndex = currentIndex - 1;
        while (prevIndex >= 0 && imageErrors[prevIndex]) {
            prevIndex--;
        }
        if (prevIndex < 0) {
            // Ищем с конца
            prevIndex = images.length - 1;
            while (prevIndex > currentIndex && imageErrors[prevIndex]) {
                prevIndex--;
            }
        }
        if (prevIndex >= 0 && !imageErrors[prevIndex]) {
            goToSlide(prevIndex);
        }
    }, [currentIndex, images.length, isAnimating, goToSlide, imageErrors]);

    const goToNext = useCallback(() => {
        if (isAnimating) return;
        // Находим следующее валидное изображение
        let nextIndex = currentIndex + 1;
        while (nextIndex < images.length && imageErrors[nextIndex]) {
            nextIndex++;
        }
        if (nextIndex >= images.length) {
            // Ищем с начала
            nextIndex = 0;
            while (nextIndex < currentIndex && imageErrors[nextIndex]) {
                nextIndex++;
            }
        }
        if (nextIndex < images.length && !imageErrors[nextIndex]) {
            goToSlide(nextIndex);
        }
    }, [currentIndex, images.length, isAnimating, goToSlide, imageErrors]);

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

    // Фильтруем изображения с ошибками, но если все "ошибочные" — используем исходный список,
    // чтобы не показывать пустой блок.
    const validImages = useMemo(() => {
        const filtered = images.filter((_, index) => !imageErrors[index]);
        return filtered.length > 0 ? filtered : images;
    }, [images, imageErrors]);

    const validCurrentIndex = useMemo(() => {
        if (validImages.length === 0) return 0;
        // Находим индекс в отфильтрованном массиве
        let validCount = 0;
        for (let i = 0; i < currentIndex && i < images.length; i++) {
            if (!imageErrors[i]) validCount++;
        }
        return Math.min(validCount, validImages.length - 1);
    }, [currentIndex, images, imageErrors, validImages.length]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.slider} ${className || ""}`}>
            <div className={styles.sliderContainer}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={validCurrentIndex}
                        className={styles.slide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div 
                            className={styles.imageWrapper}
                            onClick={() => {
                                // Находим оригинальный индекс для полноэкранного режима
                                let originalIndex = 0;
                                let validCount = 0;
                                for (let i = 0; i < images.length; i++) {
                                    if (!imageErrors[i]) {
                                        if (validCount === validCurrentIndex) {
                                            originalIndex = i;
                                            break;
                                        }
                                        validCount++;
                                    }
                                }
                                onFullscreen?.(originalIndex);
                            }}
                            style={{ cursor: onFullscreen ? "pointer" : "default" }}
                        >
                            {validImages[validCurrentIndex] && (
                                <NextImage
                                    src={validImages[validCurrentIndex]}
                                    alt={`Изображение ${validCurrentIndex + 1}`}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 100vw, 70vw"
                                    priority={validCurrentIndex === 0}
                                    unoptimized={validImages[validCurrentIndex]?.startsWith('data:')}
                                />
                            )}
                            {onFullscreen && (
                                <button
                                    className={styles.fullscreenButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        let originalIndex = 0;
                                        let validCount = 0;
                                        for (let i = 0; i < images.length; i++) {
                                            if (!imageErrors[i]) {
                                                if (validCount === validCurrentIndex) {
                                                    originalIndex = i;
                                                    break;
                                                }
                                                validCount++;
                                            }
                                        }
                                        onFullscreen(originalIndex);
                                    }}
                                    aria-label="Открыть в полноэкранном режиме"
                                >
                                    <Maximize2 size={20} />
                                </button>
                            )}
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
                    {validCurrentIndex + 1} / {validImages.length}
                </div>

                {validImages.length > 1 && (
                    <div className={styles.pagination}>
                        {validImages.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.paginationDot} ${
                                    index === validCurrentIndex ? styles.active : ""
                                }`}
                                onClick={() => {
                                    // Находим оригинальный индекс
                                    let originalIndex = 0;
                                    let validCount = 0;
                                    for (let i = 0; i < images.length; i++) {
                                        if (!imageErrors[i]) {
                                            if (validCount === index) {
                                                originalIndex = i;
                                                break;
                                            }
                                            validCount++;
                                        }
                                    }
                                    goToSlide(originalIndex);
                                }}
                                aria-label={`Перейти к изображению ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
