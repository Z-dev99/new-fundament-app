"use client";

import { FC, useState, useMemo } from "react";
import { useGetBannersQuery } from "@/shared/api/bannersApi";
import styles from "./AdBlock.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

const getImageUrl = (fileName: string): string => {
    return `https://fundament.uz/img/${fileName}`;
};

export const AdBlock: FC = () => {
    const { data: banners, isLoading } = useGetBannersQuery();
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

    // Фильтруем только MIDDLE_SIDE баннеры
    const middleBanners = useMemo(() => {
        if (!banners) return [];
        return banners.filter((banner) => banner.banner_type === "MIDDLE_SIDE");
    }, [banners]);

    if (isLoading) {
        return (
            <div className={`${styles.wrapper} container`}>
                <div style={{ height: "420px", background: "#f0f0f0", borderRadius: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div>Загрузка баннеров...</div>
                </div>
            </div>
        );
    }

    // Если нет баннеров, показываем placeholder
    if (!middleBanners || middleBanners.length === 0) {
        return (
            <div className={`${styles.wrapper} container`}>
                <div className={styles.emptyBanner}>
                    <div className={styles.emptyContent}>
                        <div className={styles.emptyIcon}>
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M9 9h6v6H9z" />
                            </svg>
                        </div>
                        <h3 className={styles.emptyTitle}>Место для вашей рекламы</h3>
                        <p className={styles.emptyText}>Свяжитесь с нами для размещения</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleImageError = (fileName: string) => {
        setImageErrors((prev) => ({ ...prev, [fileName]: true }));
    };

    const handleImageLoad = (fileName: string) => {
        setLoadedImages((prev) => ({ ...prev, [fileName]: true }));
    };

    return (
        <div className={`${styles.wrapper} container`}>
            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView="auto"
                spaceBetween={24}
                loop={middleBanners.length > 1}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                className={styles.swiper}
            >
                {middleBanners.map((banner, index) => {
                    const imageSrc = imageErrors[banner.file_name]
                        ? PLACEHOLDER_IMAGE
                        : getImageUrl(banner.file_name);
                    const isLoaded = loadedImages[banner.file_name];

                    return (
                        <SwiperSlide key={`${banner.banner_type}-${banner.file_name}-${index}`} className={styles.slideWrapper}>
                            <div className={styles.slide}>
                                {!isLoaded && (
                                    <div className={styles.imagePlaceholder}>
                                        <div className={styles.loader}></div>
                                    </div>
                                )}
                                <img
                                    src={imageSrc}
                                    alt="Реклама"
                                    className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
                                    onError={() => handleImageError(banner.file_name)}
                                    onLoad={() => handleImageLoad(banner.file_name)}
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};