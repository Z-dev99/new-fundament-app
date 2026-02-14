"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import styles from "./FullscreenGallery.module.scss";

interface FullscreenGalleryProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export const FullscreenGallery: React.FC<FullscreenGalleryProps> = ({
    images,
    initialIndex,
    isOpen,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setIsZoomed(false);
            setImagePosition({ x: 0, y: 0 });
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Фильтруем изображения с ошибками
    const validImages = useMemo(() => {
        return images.filter((_, index) => !imageErrors[index]);
    }, [images, imageErrors]);

    const goToPrevious = useCallback(() => {
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
            setCurrentIndex(prevIndex);
            setIsZoomed(false);
            setImagePosition({ x: 0, y: 0 });
        }
    }, [currentIndex, images.length, imageErrors]);

    const goToNext = useCallback(() => {
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
            setCurrentIndex(nextIndex);
            setIsZoomed(false);
            setImagePosition({ x: 0, y: 0 });
        }
    }, [currentIndex, images.length, imageErrors]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft") {
                goToPrevious();
            } else if (e.key === "ArrowRight") {
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, goToPrevious, goToNext]);

    // Если текущее изображение с ошибкой и есть валидные изображения, переходим к первому валидному
    useEffect(() => {
        if (isOpen && imageErrors[currentIndex] && validImages.length > 0) {
            const firstValidIndex = images.findIndex((_, index) => !imageErrors[index]);
            if (firstValidIndex >= 0 && firstValidIndex !== currentIndex) {
                setCurrentIndex(firstValidIndex);
            }
        }
    }, [isOpen, currentIndex, imageErrors, validImages.length, images]);

    const handleImageClick = () => {
        setIsZoomed(!isZoomed);
        if (!isZoomed) {
            setImagePosition({ x: 0, y: 0 });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 200;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 200;
        setImagePosition({ x, y });
    };

    if (!isOpen) return null;

    if (validImages.length === 0) {
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.galleryContainer}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Закрыть"
                    >
                        <X size={24} />
                    </button>

                    <div className={styles.imageContainer}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                className={styles.imageWrapper}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                onClick={handleImageClick}
                                onMouseMove={handleMouseMove}
                                style={{
                                    cursor: isZoomed ? "zoom-out" : "zoom-in",
                                }}
                            >
                                {!imageErrors[currentIndex] && images[currentIndex] && (
                                    <NextImage
                                        src={images[currentIndex]}
                                        alt={`Изображение ${currentIndex + 1}`}
                                        fill
                                        className={styles.image}
                                        style={{
                                            objectFit: isZoomed ? "contain" : "contain",
                                            transform: isZoomed
                                                ? `scale(2) translate(${imagePosition.x}px, ${imagePosition.y}px)`
                                                : "scale(1)",
                                            transition: isZoomed
                                                ? "none"
                                                : "transform 0.3s ease",
                                        }}
                                        sizes="100vw"
                                        priority
                                        unoptimized={images[currentIndex]?.startsWith('data:')}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {validImages.length > 1 && (
                            <>
                                <button
                                    className={`${styles.navButton} ${styles.prevButton}`}
                                    onClick={goToPrevious}
                                    aria-label="Предыдущее изображение"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    className={`${styles.navButton} ${styles.nextButton}`}
                                    onClick={goToNext}
                                    aria-label="Следующее изображение"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        <div className={styles.counter}>
                            {(() => {
                                let validCount = 0;
                                for (let i = 0; i <= currentIndex; i++) {
                                    if (!imageErrors[i]) validCount++;
                                }
                                return validCount;
                            })()} / {validImages.length}
                        </div>

                        <button
                            className={styles.zoomButton}
                            onClick={handleImageClick}
                            aria-label={isZoomed ? "Уменьшить" : "Увеличить"}
                        >
                            {isZoomed ? (
                                <ZoomOut size={24} />
                            ) : (
                                <ZoomIn size={24} />
                            )}
                        </button>
                    </div>

                    {validImages.length > 1 && (
                        <div className={styles.thumbnails}>
                            {images.map((img, index) => {
                                // Пропускаем изображения с ошибками
                                if (imageErrors[index]) {
                                    return null;
                                }
                                
                                return (
                                    <button
                                        key={index}
                                        className={`${styles.thumbnail} ${
                                            index === currentIndex ? styles.active : ""
                                        }`}
                                        onClick={() => {
                                            setCurrentIndex(index);
                                            setIsZoomed(false);
                                            setImagePosition({ x: 0, y: 0 });
                                        }}
                                        aria-label={`Показать изображение ${index + 1}`}
                                    >
                                        <NextImage
                                            src={img}
                                            alt={`Миниатюра ${index + 1}`}
                                            fill
                                            className={styles.thumbnailImage}
                                            sizes="(max-width: 768px) 15vw, 10vw"
                                            unoptimized={img?.startsWith('data:')}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

