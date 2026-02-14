"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import styles from "./ThumbnailsSlider.module.scss";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

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
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

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

    // Проверяем загрузку изображений
    useEffect(() => {
        const checkImages = () => {
            images.forEach((img, index) => {
                if (img) {
                    const imageElement = new window.Image();
                    imageElement.onerror = () => {
                        setImageErrors((prev) => ({ ...prev, [index]: true }));
                    };
                    imageElement.onload = () => {
                        // Если изображение загрузилось, сбрасываем ошибку
                        setImageErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors[index];
                            return newErrors;
                        });
                    };
                    imageElement.src = img;
                }
            });
        };
        
        // Сбрасываем ошибки при изменении изображений
        setImageErrors({});
        checkImages();
    }, [images]);

    if (!images || images.length === 0) {
        return null;
    }

    // Фильтруем изображения с ошибками
    const validImages = images.filter((_, index) => !imageErrors[index]);
    
    if (validImages.length === 0) {
        return null;
    }

    return (
        <div className={`${styles.thumbnails} ${className || ""}`}>
            <div className={styles.thumbnailsContainer} ref={containerRef}>
                {images.map((img, index) => {
                    // Пропускаем изображения с ошибками
                    if (imageErrors[index]) {
                        return null;
                    }
                    
                    return (
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
                                <NextImage
                                    src={img}
                                    alt={`Миниатюра ${index + 1}`}
                                    fill
                                    className={styles.thumbnailImage}
                                    sizes="(max-width: 768px) 25vw, 15vw"
                                    unoptimized={img?.startsWith('data:')}
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
