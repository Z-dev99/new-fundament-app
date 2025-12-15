"use client";

import { FC, useState } from "react";
import styles from "./AdBlock.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface AdItem {
    id: number;
    image: string;
    title?: string;
    text?: string;
}

interface AdBlockProps {
    items: AdItem[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop";

export const AdBlock: FC<AdBlockProps> = ({ items }) => {
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

    if (!items || items.length === 0) {
        return null;
    }

    const handleImageError = (itemId: number) => {
        setImageErrors((prev) => ({ ...prev, [itemId]: true }));
    };

    const handleImageLoad = (itemId: number) => {
        setLoadedImages((prev) => ({ ...prev, [itemId]: true }));
    };

    return (
        <div className={`${styles.wrapper} container`}>
            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView="auto"
                spaceBetween={24}
                loop={items.length > 1}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                className={styles.swiper}
            >
                {items.map((item) => {
                    const imageSrc = imageErrors[item.id] ? FALLBACK_IMAGE : item.image;
                    const isLoaded = loadedImages[item.id];
                    
                    return (
                        <SwiperSlide key={item.id} className={styles.slideWrapper}>
                            <div className={styles.slide}>
                                {!isLoaded && (
                                    <div className={styles.imagePlaceholder}>
                                        <div className={styles.loader}></div>
                                    </div>
                                )}
                                <img
                                    src={imageSrc}
                                    alt={item.title || "Реклама"}
                                    className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
                                    onError={() => handleImageError(item.id)}
                                    onLoad={() => handleImageLoad(item.id)}
                                    loading={item.id === items[0]?.id ? "eager" : "lazy"}
                                />

                                {(item.title || item.text) && (
                                    <div className={styles.content}>
                                        {item.title && <h3>{item.title}</h3>}
                                        {item.text && <p>{item.text}</p>}
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};