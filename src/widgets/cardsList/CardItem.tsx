import React, { useState, useEffect } from "react";
import styles from "./CardItem.module.css";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Phone, MapPin, Home, Maximize2, Loader2 } from "lucide-react";
import { useGetAnnouncementContactsQuery } from "@/shared/api/announcementsApi";
import "swiper/css";
import "swiper/css/pagination";

interface Props {
    id: string | number;
    title: string;
    price: string;
    address: string;
    rooms: string;
    area: string;
    images: string[];
}

// Placeholder изображение в формате SVG (серый фон)
const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export const CardItem: React.FC<Props> = React.memo(({
    id,
    title,
    price,
    address,
    rooms,
    area,
    images,
}) => {
    const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
    const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
    const [shouldFetchContacts, setShouldFetchContacts] = useState(false);

    // Запрос контактов только при клике на кнопку
    const { data: contacts, isLoading: loadingContacts, error: contactsError } = useGetAnnouncementContactsQuery(
        String(id),
        {
            skip: !shouldFetchContacts, // Не выполняем запрос до клика
        }
    );

    const handlePhoneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Активируем запрос контактов при первом клике
        if (!shouldFetchContacts) {
            setShouldFetchContacts(true);
        }
    };

    const phoneNumber = contacts?.phone_number || "";

    const handleImageError = (index: number) => {
        setImageErrors((prev) => ({ ...prev, [index]: true }));
        // Если изображение не загрузилось, помечаем его как загруженное, чтобы скрыть placeholder
        setLoadedImages((prev) => ({ ...prev, [index]: true }));
    };

    const handleImageLoad = (index: number) => {
        setLoadedImages((prev) => ({ ...prev, [index]: true }));
    };

    // Проверяем, загружено ли первое изображение из кеша при монтировании
    useEffect(() => {
        if (images.length > 0) {
            const img = new Image();
            let isMounted = true;
            
            img.onload = () => {
                if (isMounted) {
                    setLoadedImages((prev) => ({ ...prev, 0: true }));
                }
            };
            img.onerror = () => {
                if (isMounted) {
                    // Если первое изображение не загрузилось, используем fallback
                    setImageErrors((prev) => ({ ...prev, 0: true }));
                    setLoadedImages((prev) => ({ ...prev, 0: true }));
                }
            };
            
            img.src = images[0];
            
            // Если изображение уже в кеше, оно может быть загружено синхронно
            if (img.complete) {
                if (isMounted) {
                    setLoadedImages((prev) => ({ ...prev, 0: true }));
                }
            }
            
            return () => {
                isMounted = false;
            };
        }
    }, [images]);

    return (
        <Link href={`/property/${id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.imageWrap}>
                    <Swiper
                        pagination={{ 
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        spaceBetween={0}
                        slidesPerView={1}
                        modules={[Pagination]}
                        className={styles.swiper}
                    >
                        {images.length > 0 ? (
                            images.map((src, i) => {
                                const imageSrc = imageErrors[i] ? PLACEHOLDER_IMAGE : src;
                                const isLoaded = loadedImages[i];
                                
                                return (
                                    <SwiperSlide key={i}>
                                        <div className={styles.imageContainer}>
                                            {!isLoaded && (
                                                <div className={styles.imagePlaceholder}>
                                                    <div className={styles.loader}></div>
                                                </div>
                                            )}
                                            <img
                                                src={imageSrc}
                                                alt={`${title} - фото ${i + 1}`}
                                                className={`${styles.image} ${isLoaded ? styles.loaded : ""}`}
                                                onError={() => handleImageError(i)}
                                                onLoad={() => handleImageLoad(i)}
                                                loading={i === 0 ? "eager" : "lazy"}
                                                decoding="async"
                                                fetchPriority={i === 0 ? "high" : "auto"}
                                            />
                                        </div>
                                    </SwiperSlide>
                                );
                            })
                        ) : (
                            <SwiperSlide>
                                <div className={styles.imageContainer}>
                                    <img
                                        src={PLACEHOLDER_IMAGE}
                                        alt={title}
                                        className={`${styles.image} ${styles.loaded}`}
                                    />
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                    <div className={styles.imageOverlay}></div>
                    {images.length > 1 && (
                        <div className={styles.imageCount}>
                            <Maximize2 size={14} />
                            <span>{images.length}</span>
                        </div>
                    )}
                </div>

                <div className={styles.body}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.price}>{price}</div>

                    <div className={styles.info}>
                        <div className={styles.infoItem}>
                            <MapPin size={16} />
                            <span>{address}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <div className={styles.infoItem}>
                                <Home size={16} />
                                <span>{rooms} комн.</span>
                            </div>
                            <div className={styles.infoItem}>
                                <Maximize2 size={16} />
                                <span>{area} м²</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        className={`${styles.phoneBtn} ${phoneNumber ? styles.phoneBtnActive : ""}`}
                        onClick={handlePhoneClick}
                        disabled={loadingContacts}
                    >
                        {loadingContacts ? (
                            <>
                                <Loader2 size={18} className={styles.spinner} />
                                <span>Загрузка...</span>
                            </>
                        ) : phoneNumber ? (
                            <>
                                <Phone size={18} />
                                <span>{phoneNumber}</span>
                            </>
                        ) : contactsError ? (
                            <>
                                <Phone size={18} />
                                <span>Ошибка загрузки</span>
                            </>
                        ) : (
                            <>
                                <Phone size={18} />
                                <span>Показать телефон</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
});

CardItem.displayName = "CardItem";