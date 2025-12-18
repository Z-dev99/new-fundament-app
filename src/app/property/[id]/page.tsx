"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { Navbar } from "@/widgets/navbar/ui/Navbar";
import styles from "./Property.module.scss";
import { ImageSlider } from "@/widgets/imageSlider/ImageSlider";
import { ThumbnailsSlider } from "@/widgets/imageSlider/ThumbnailsSlider";
import {
    useGetAnnouncementByIdQuery,
    useGetAnnouncementContactsQuery,
} from "@/shared/api/announcementsApi";

// Динамический импорт карты для избежания проблем с SSR
const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

// Импорт блоков для страницы property
import { WhyThisProperty, HowToMakeDeal, NeedConsultation } from "@/widgets/propertyBlocks";
import {
    Home,
    MapPin,
    Building2,
    Layers,
    Flame,
    Phone,
    Share2,
    Maximize2,
    Loader2,
    Calendar,
    Ruler,
    Droplets,
    Wrench,
    Car,
    Mail,
    Copy,
} from "lucide-react";

// Константы для переводов enum значений
const PROPERTY_TYPE_LABELS: Record<string, string> = {
    APARTMENT: "Квартира",
    HOUSE: "Дом",
    ROOM: "Комната",
    LAND: "Земельный участок",
    COMMERCIAL: "Коммерческая недвижимость",
};

const WALL_MATERIAL_LABELS: Record<string, string> = {
    BRICK: "Кирпич",
    PANEL: "Панель",
    MONOLITH: "Монолит",
    WOOD: "Дерево",
    BLOCK: "Блок",
    FRAME: "Каркас",
    OTHER: "Другое",
};

const BATHROOM_LAYOUT_LABELS: Record<string, string> = {
    COMBINED: "Совмещенный",
    SEPARATE: "Раздельный",
};

const HEATING_TYPE_LABELS: Record<string, string> = {
    CENTRAL: "Центральное",
    AUTONOMOUS: "Автономное",
    DECENTRALIZED: "Децентрализованное",
};

const RENOVATION_TYPE_LABELS: Record<string, string> = {
    SHELL: "Без отделки",
    BLACK: "Черновая отделка",
    COSMETIC: "Косметический ремонт",
    DESIGNER: "Дизайнерский ремонт",
    EURO: "Евроремонт",
};

const LAYOUT_TYPE_LABELS: Record<string, string> = {
    STUDIO: "Студия",
    SEPARATE_ROOMS: "Раздельные комнаты",
    OPEN_PLAN: "Свободная планировка",
};

// Утилита для получения URL изображения
const getImageUrl = (imagePath: string): string => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    if (imagePath.startsWith('data:')) {
        return imagePath;
    }
    return `https://fundament.uz/img/${imagePath}`;
};

export default function PropertyPage() {
    const routeParams = useParams();
    const id = routeParams.id as string;
    
    const { data: announcement, isLoading, error } = useGetAnnouncementByIdQuery(id);
    const { data: contacts, isLoading: loadingContacts } = useGetAnnouncementContactsQuery(id);
    
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showPhone, setShowPhone] = useState(false);

    // Placeholder изображение в формате SVG (серый фон)
    const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

    const images = useMemo(() => {
        if (!announcement?.images || announcement.images.length === 0) {
            return [PLACEHOLDER_IMAGE];
        }
        return announcement.images.map(getImageUrl);
    }, [announcement]);

    const propertyData = useMemo(() => {
        if (!announcement) return null;

        const addressParts = [
            announcement.city,
            announcement.district,
            announcement.street && `ул. ${announcement.street}`,
            announcement.house_number && `д. ${announcement.house_number}`,
            announcement.block && `корп. ${announcement.block}`,
            announcement.apartment && `кв. ${announcement.apartment}`,
        ].filter(Boolean);

        return {
            id: announcement.id,
            title: announcement.title,
            price: `${Number(announcement.price).toLocaleString('ru-RU')} ${announcement.currency}`,
            address: addressParts.join(", ") || `${announcement.city}, ${announcement.district}`,
            description: announcement.description || "",
            type: announcement.type === "SALE" ? "Продажа" : "Аренда",
            propertyType: PROPERTY_TYPE_LABELS[announcement.property_type] || announcement.property_type,
            rooms: announcement.rooms_count,
            floor: `${announcement.floor} / ${announcement.floors_total}`,
            totalArea: `${announcement.area_total} м²`,
            livingArea: announcement.area_living ? `${announcement.area_living} м²` : null,
            kitchenArea: announcement.area_kitchen ? `${announcement.area_kitchen} м²` : null,
            wallMaterial: WALL_MATERIAL_LABELS[announcement.wall_material] || announcement.wall_material,
            bathroomLayout: BATHROOM_LAYOUT_LABELS[announcement.bathroom_layout] || announcement.bathroom_layout,
            ceilingHeight: announcement.ceiling_height ? `${announcement.ceiling_height} м` : null,
            yearBuilt: announcement.year_built,
            heating: announcement.heating_type ? HEATING_TYPE_LABELS[announcement.heating_type] : null,
            renovation: announcement.renovation_type ? RENOVATION_TYPE_LABELS[announcement.renovation_type] : null,
            layout: announcement.layout_type ? LAYOUT_TYPE_LABELS[announcement.layout_type] : null,
            street: announcement.street || "",
            availableFrom: announcement.available_from,
            latitude: announcement.latitude || "",
            longitude: announcement.longitude || "",
            coordinates: {
                lat: parseFloat(announcement.latitude) || 41.2995,
                lng: parseFloat(announcement.longitude) || 69.2401,
            },
            phone: contacts?.phone_number || "",
            email: contacts?.email || "",
        };
    }, [announcement, contacts]);

    const characteristics = useMemo(() => {
        if (!propertyData) return [];
        
        const allCharacteristics = [
            { icon: Building2, label: "Тип", value: propertyData.type },
            { icon: Home, label: "Тип недвижимости", value: propertyData.propertyType },
            { icon: Home, label: "Комнаты", value: `${propertyData.rooms}` },
            { icon: Building2, label: "Этаж", value: propertyData.floor },
            { icon: Maximize2, label: "Общая площадь", value: propertyData.totalArea },
            propertyData.livingArea && { icon: Home, label: "Жилая площадь", value: propertyData.livingArea },
            propertyData.kitchenArea && { icon: Home, label: "Площадь кухни", value: propertyData.kitchenArea },
            propertyData.ceilingHeight && { icon: Ruler, label: "Высота потолков", value: propertyData.ceilingHeight },
            { icon: Layers, label: "Материал стен", value: propertyData.wallMaterial },
            { icon: Droplets, label: "Санузел", value: propertyData.bathroomLayout },
            propertyData.layout && { icon: Home, label: "Планировка", value: propertyData.layout },
            propertyData.heating && { icon: Flame, label: "Отопление", value: propertyData.heating },
            propertyData.renovation && { icon: Wrench, label: "Ремонт", value: propertyData.renovation },
            propertyData.yearBuilt && { icon: Calendar, label: "Год постройки", value: `${propertyData.yearBuilt}` },
            propertyData.availableFrom && { icon: Calendar, label: "Доступно с", value: new Date(propertyData.availableFrom).toLocaleDateString('ru-RU') },
        ].filter(Boolean) as Array<{ icon: any; label: string; value: string }>;
        
        return allCharacteristics;
    }, [propertyData]);

    const handlePhoneClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (showPhone || !propertyData?.phone || loadingContacts) return;
        
        setShowPhone(true);
        setTimeout(() => setShowPhone(false), 5000);
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <section className={styles.page}>
                    <div className="container">
                        <div style={{ padding: "60px 20px", textAlign: "center" }}>
                            <Loader2 size={48} className={styles.spinner} style={{ animation: "spin 1s linear infinite" }} />
                            <p style={{ marginTop: "20px", fontSize: "18px" }}>Загрузка данных...</p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error || !announcement || !propertyData) {
        return (
            <>
                <Navbar />
                <section className={styles.page}>
                    <div className="container">
                        <div style={{ padding: "60px 20px", textAlign: "center" }}>
                            <h2 style={{ marginBottom: "16px" }}>Объявление не найдено</h2>
                            <p style={{ color: "#666" }}>К сожалению, запрашиваемое объявление не существует или было удалено.</p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    

    return (
        <>
            <Navbar />
            <section className={styles.page}>
                <div className="container">
                    <motion.div
                        className={styles.content}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div className={styles.leftBlock}>
                            <div className={styles.gallery}>
                                <ImageSlider
                                    images={images}
                                    className={styles.mainSlider}
                                    activeIndex={activeImageIndex}
                                    onSlideChange={setActiveImageIndex}
                                />
                                <ThumbnailsSlider
                                    images={images}
                                    activeIndex={activeImageIndex}
                                    onThumbClick={setActiveImageIndex}
                                    className={styles.thumbnails}
                                />
                            </div>

                            <motion.div
                                className={styles.header}

                            >
                                <div className={styles.headerTop}>
                                    <h1 className={styles.title}>{propertyData.title}</h1>
                                    <div className={styles.actions}>
                                        <motion.button
                                            className={styles.actionBtn}
                                            onClick={async () => {
                                                try {
                                                    const url = window.location.href;
                                                    const title = propertyData.title;
                                                    const text = `${title} - ${propertyData.price} - ${propertyData.address}`;

                                                    // Используем Web Share API, если доступен
                                                    if (navigator.share) {
                                                        await navigator.share({
                                                            title,
                                                            text,
                                                            url,
                                                        });
                                                    } else {
                                                        // Копируем ссылку в буфер обмена
                                                        await navigator.clipboard.writeText(url);
                                                        toast.success("Ссылка скопирована в буфер обмена!");
                                                    }
                                                } catch (error) {
                                                    // Пользователь отменил или произошла ошибка
                                                    if (error instanceof Error && error.name !== 'AbortError') {
                                                        console.error('Ошибка при попытке поделиться:', error);
                                                    }
                                                }
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Share2 size={20} />
                                        </motion.button>
                                    </div>
                                </div>
                                <div className={styles.idSection}>
                                    <span className={styles.idLabel}>ID объекта:</span>
                                    <span className={styles.idValue}>{propertyData.id}</span>
                                    <motion.button
                                        className={styles.copyIdBtn}
                                        onClick={async () => {
                                            try {
                                                await navigator.clipboard.writeText(propertyData.id);
                                                toast.success("ID скопирован в буфер обмена!");
                                            } catch (error) {
                                                console.error('Ошибка при копировании ID:', error);
                                                toast.error("Не удалось скопировать ID");
                                            }
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Копировать ID"
                                    >
                                        <Copy size={16} />
                                    </motion.button>
                                </div>
                                <div className={styles.price}>{propertyData.price}</div>
                                <div className={styles.location}>
                                    <MapPin size={18} />
                                    <span>{propertyData.address}</span>
                                </div>
                            </motion.div>

                            {propertyData.description && (
                                <motion.div
                                    className={styles.description}
                                >
                                    <h2 className={styles.sectionTitle}>Описание</h2>
                                    <p>{propertyData.description}</p>
                                </motion.div>
                            )}

                            <motion.div
                                className={styles.params}

                            >
                                <h2 className={styles.sectionTitle}>Характеристики</h2>
                                <div className={styles.paramsGrid}>
                                    {characteristics.map((characteristic, i) => {
                                        const Icon = characteristic.icon;
                                        return (
                                            <div key={i} className={styles.paramItem}>
                                                <div className={styles.paramIcon}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className={styles.paramContent}>
                                                    <span className={styles.paramLabel}>
                                                        {characteristic.label}
                                                    </span>
                                                    <span className={styles.paramValue}>
                                                        {characteristic.value}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div className={styles.rightBlock}>
                            <motion.div
                                className={styles.ownerCard}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h3 className={styles.ownerTitle}>Контакты</h3>
                                
                                {loadingContacts ? (
                                    <button
                                        className={styles.phoneBtn}
                                        type="button"
                                        disabled
                                    >
                                        <Loader2 size={20} className={styles.spinner} />
                                        <span>Загрузка...</span>
                                    </button>
                                ) : propertyData.phone ? (
                                    <>
                                        <button
                                            className={`${styles.phoneBtn} ${showPhone ? styles.phoneBtnActive : ""}`}
                                            onClick={handlePhoneClick}
                                            type="button"
                                        >
                                            {showPhone ? (
                                                <>
                                                    <Phone size={20} />
                                                    <span>{propertyData.phone}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Phone size={20} />
                                                    <span>Показать телефон</span>
                                                </>
                                            )}
                                        </button>
                                        
                                        {showPhone && (
                                            <motion.a
                                                href={`tel:${propertyData.phone.replace(/\s/g, "")}`}
                                                className={styles.callBtn}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Phone size={20} />
                                                Позвонить
                                            </motion.a>
                                        )}
                                    </>
                                ) : null}
                                
                                {propertyData.email && (
                                    <motion.a
                                        href={`mailto:${propertyData.email}`}
                                        className={styles.emailBtn}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Mail size={20} />
                                        Написать на email
                                    </motion.a>
                                )}
                            </motion.div>

                            {propertyData && (
                                <motion.div
                                    className={styles.map}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h3 className={styles.mapTitle}>Расположение</h3>
                                    <PropertyMap
                                        latitude={propertyData?.latitude || ""}
                                        longitude={propertyData?.longitude || ""}
                                        title={propertyData.title}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <WhyThisProperty 
                propertyType={propertyData?.propertyType}
                district={propertyData?.address.split(",")[1]?.trim()}
            />
            <HowToMakeDeal />
            <NeedConsultation announcementId={announcement?.id || ""} />
        </>
    );
}
