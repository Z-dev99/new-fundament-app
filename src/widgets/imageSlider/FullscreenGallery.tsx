"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import styles from "./FullscreenGallery.module.scss";

interface FullscreenGalleryProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export const FullscreenGallery: React.FC<FullscreenGalleryProps> = ({
    images,
    initialIndex,
    isOpen,
    onClose,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

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

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setIsZoomed(false);
        setImagePosition({ x: 0, y: 0 });
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setIsZoomed(false);
        setImagePosition({ x: 0, y: 0 });
    }, [images.length]);

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

    if (!isOpen) return null;

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
                                <Image
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
                                />
                            </motion.div>
                        </AnimatePresence>

                        {images.length > 1 && (
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
                            {currentIndex + 1} / {images.length}
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

                    {images.length > 1 && (
                        <div className={styles.thumbnails}>
                            {images.map((img, index) => (
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
                                    <Image
                                        src={img}
                                        alt={`Миниатюра ${index + 1}`}
                                        fill
                                        className={styles.thumbnailImage}
                                        sizes="(max-width: 768px) 15vw, 10vw"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

