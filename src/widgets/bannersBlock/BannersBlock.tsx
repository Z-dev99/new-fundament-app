"use client";

import { useState } from "react";
import {
    useGetBannerByTypeQuery,
    useCreateBannerMutation,
    useDeleteBannerMutation,
    type BannerType,
    type Banner,
} from "@/shared/api/bannersApi";
import styles from "./styles.module.scss";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const STATIC_BANNER_TYPES: { type: BannerType; label: string; description: string }[] = [
    { type: "LEFT_SIDE", label: "Левый боковой", description: "Статический баннер слева (можно добавить один раз и потом менять)" },
    { type: "RIGHT_SIDE", label: "Правый боковой", description: "Статический баннер справа (можно добавить один раз и потом менять)" },
];

const SLIDER_BANNER_TYPE: { type: BannerType; label: string; description: string } = {
    type: "MIDDLE_SIDE",
    label: "Средний слайдер",
    description: "Слайдер баннеров в середине страницы (можно добавить несколько)",
};

export const BannersBlock: React.FC = () => {
    // Получаем боковые баннеры отдельными запросами (возвращают массивы)
    const { data: leftBanners = [], refetch: refetchLeft, isLoading: isLoadingLeft } = useGetBannerByTypeQuery("LEFT_SIDE");
    const { data: rightBanners = [], refetch: refetchRight, isLoading: isLoadingRight } = useGetBannerByTypeQuery("RIGHT_SIDE");
    
    // Получаем баннеры для слайдера (MIDDLE_SIDE)
    const { data: middleBanners = [], refetch: refetchMiddle, isLoading: isLoadingMiddle } = useGetBannerByTypeQuery("MIDDLE_SIDE");
    
    const isLoading = isLoadingLeft || isLoadingRight || isLoadingMiddle;
    
    const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
    const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

    const [uploadingType, setUploadingType] = useState<BannerType | null>(null);
    const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

    // Получить первый баннер для статического типа (LEFT_SIDE, RIGHT_SIDE)
    const getStaticBanner = (type: BannerType): Banner | undefined => {
        if (type === "LEFT_SIDE") return leftBanners[0];
        if (type === "RIGHT_SIDE") return rightBanners[0];
        return undefined;
    };

    // Получить все баннеры для слайдера (MIDDLE_SIDE)
    const getSliderBanners = (): Banner[] => {
        return middleBanners;
    };
    
    // Функция для обновления всех данных
    const refetch = () => {
        refetchLeft();
        refetchRight();
        refetchMiddle();
    };

    const handleFileSelect = async (type: BannerType, file: File) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Выберите изображение");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Размер файла не должен превышать 5MB");
            return;
        }

        try {
            setUploadingType(type);

            // Отправляем файл напрямую на сервер
            await createBanner({ banner_type: type, file }).unwrap();
            
            const label = type === "MIDDLE_SIDE" 
                ? SLIDER_BANNER_TYPE.label 
                : STATIC_BANNER_TYPES.find(t => t.type === type)?.label;
            
            toast.success(`Баннер "${label}" успешно ${type === "MIDDLE_SIDE" ? "добавлен" : "обновлен"}!`);
            refetch();
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Ошибка при загрузке баннера");
        } finally {
            setUploadingType(null);
        }
    };

    const handleDeleteStatic = async (banner: Banner) => {
        const typeLabel = STATIC_BANNER_TYPES.find(t => t.type === banner.banner_type)?.label;
        if (!confirm(`Вы уверены, что хотите удалить баннер "${typeLabel}"?`)) {
            return;
        }

        try {
            setDeletingBannerId(banner.id);
            await deleteBanner(banner.id).unwrap();
            toast.success("Баннер успешно удален!");
            refetch();
        } catch (err: any) {
            toast.error(err.data?.message || "Ошибка при удалении баннера");
        } finally {
            setDeletingBannerId(null);
        }
    };

    const handleDeleteSliderBanner = async (banner: Banner) => {
        if (!confirm("Вы уверены, что хотите удалить этот баннер из слайдера?")) {
            return;
        }

        try {
            setDeletingBannerId(banner.id);
            await deleteBanner(banner.id).unwrap();
            toast.success("Баннер успешно удален из слайдера!");
            refetch();
        } catch (err: any) {
            toast.error(err.data?.message || err.message || "Ошибка при удалении баннера");
        } finally {
            setDeletingBannerId(null);
        }
    };

    const getImageUrl = (fileName: string): string => {
        return `https://fundament.uz/img/${fileName}`;
    };

    if (isLoading) return <p className={styles.loading}>Загрузка баннеров...</p>;

    const sliderBanners = getSliderBanners();

    return (
        <div className={styles.bannersBlock}>
            <Toaster position="top-right" />
            <h2>Управление баннерами</h2>
            <p className={styles.description}>
                Загружайте и управляйте баннерами для разных позиций на сайте
            </p>

            {/* Статические баннеры */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Статические баннеры</h3>
                <div className={styles.cards}>
                    {STATIC_BANNER_TYPES.map(({ type, label, description }) => {
                        const banner = getStaticBanner(type);
                        const isUploading = uploadingType === type;
                        const isDeleting = banner ? deletingBannerId === banner.id : false;

                        return (
                            <div key={type} className={styles.card}>
                                <div className={styles.header}>
                                    <div>
                                        <h3 className={styles.bannerTitle}>{label}</h3>
                                        <p className={styles.bannerDescription}>{description}</p>
                                    </div>
                                    <span className={styles.bannerType}>{type}</span>
                                </div>

                                {banner ? (
                                    <div className={styles.bannerPreview}>
                                        <div className={styles.imageWrapper}>
                                            <Image
                                                src={getImageUrl(banner.file_name)}
                                                alt={label}
                                                width={300}
                                                height={200}
                                                className={styles.bannerImage}
                                                unoptimized
                                            />
                                        </div>
                                        <div className={styles.fileInfo}>
                                            <span className={styles.fileName}>{banner.file_name}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.noBanner}>
                                        <span>Нет баннера</span>
                                    </div>
                                )}

                                <div className={styles.actions}>
                                    <label className={styles.uploadBtn}>
                                        {isUploading ? "Загрузка..." : banner ? "Заменить" : "Загрузить"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileSelect(type, file);
                                                e.target.value = "";
                                            }}
                                            disabled={isUploading || isDeleting}
                                            style={{ display: "none" }}
                                        />
                                    </label>

                                    {banner && (
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeleteStatic(banner)}
                                            disabled={isDeleting || isUploading}
                                        >
                                            {deletingBannerId === banner.id ? "Удаляем..." : "Удалить"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Слайдер баннеров (MIDDLE_SIDE) */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>{SLIDER_BANNER_TYPE.label}</h3>
                <p className={styles.sectionDescription}>{SLIDER_BANNER_TYPE.description}</p>

                <div className={styles.sliderSection}>
                    {/* Кнопка добавления нового баннера в слайдер */}
                    <div className={styles.addBannerCard}>
                        <label className={styles.addBannerBtn}>
                            {uploadingType === "MIDDLE_SIDE" ? "Загрузка..." : "+ Добавить баннер в слайдер"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileSelect("MIDDLE_SIDE", file);
                                    e.target.value = "";
                                }}
                                disabled={uploadingType === "MIDDLE_SIDE"}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    {/* Список баннеров в слайдере */}
                    {sliderBanners.length > 0 ? (
                        <div className={styles.sliderBanners}>
                            {sliderBanners.map((banner, index) => {
                                const isDeleting = deletingBannerId === banner.id;

                                return (
                                    <div key={`${banner.id}-${index}`} className={styles.sliderBannerCard}>
                                        <div className={styles.sliderBannerHeader}>
                                            <span className={styles.bannerNumber}>Баннер #{index + 1}</span>
                                            <span className={styles.bannerType}>MIDDLE_SIDE</span>
                                        </div>

                                        <div className={styles.bannerPreview}>
                                            <div className={styles.imageWrapper}>
                                                <Image
                                                    src={getImageUrl(banner.file_name)}
                                                    alt={`Слайдер баннер ${index + 1}`}
                                                    width={300}
                                                    height={200}
                                                    className={styles.bannerImage}
                                                    unoptimized
                                                />
                                            </div>
                                            <div className={styles.fileInfo}>
                                                <span className={styles.fileName}>{banner.file_name}</span>
                                            </div>
                                        </div>

                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDeleteSliderBanner(banner)}
                                            disabled={isDeleting || uploadingType === "MIDDLE_SIDE"}
                                        >
                                            {isDeleting ? "Удаляем..." : "Удалить"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.noBannersMessage}>
                            <p>В слайдере пока нет баннеров. Добавьте первый баннер, нажав кнопку выше.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};