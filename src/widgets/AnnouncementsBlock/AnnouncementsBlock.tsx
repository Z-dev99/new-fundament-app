"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Динамический импорт карты для избежания проблем с SSR
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });
import {
    useGetAnnouncementsQuery,
    useGetAnnouncementByIdQuery,
    useAddAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
    type Announcement,
    type AnnouncementDetail,
    type AddAnnouncementBody,
} from "@/shared/api/announcementsApi";
import styles from "./styles.module.scss";
import toast, { Toaster } from "react-hot-toast";
import {
    Megaphone,
    Plus,
    Edit,
    Trash2,
    Eye,
    X,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Upload,
} from "lucide-react";
import Image from "next/image";

const MAX_IMAGES = 10;

// Константы для выпадающих меню
const ANNOUNCEMENT_TYPES = [
    { value: "SALE", label: "Продажа" },
    { value: "RENT", label: "Аренда" },
];

const PROPERTY_TYPES = [
    { value: "APARTMENT", label: "Квартира" },
    { value: "HOUSE", label: "Дом" },
    { value: "ROOM", label: "Комната" },
    { value: "LAND", label: "Земельный участок" },
    { value: "COMMERCIAL", label: "Коммерческая недвижимость" },
];

const LAYOUT_TYPES = [
    { value: "STUDIO", label: "Студия" },
    { value: "SEPARATE_ROOMS", label: "Раздельные комнаты" },
    { value: "OPEN_PLAN", label: "Свободная планировка" },
];

const WALL_MATERIALS = [
    { value: "BRICK", label: "Кирпич" },
    { value: "PANEL", label: "Панель" },
    { value: "MONOLITH", label: "Монолит" },
    { value: "WOOD", label: "Дерево" },
    { value: "BLOCK", label: "Блок" },
    { value: "FRAME", label: "Каркас" },
    { value: "OTHER", label: "Другое" },
];

const BATHROOM_LAYOUTS = [
    { value: "COMBINED", label: "Совмещенный" },
    { value: "SEPARATE", label: "Раздельный" },
];

const HEATING_TYPES = [
    { value: "CENTRAL", label: "Центральное" },
    { value: "AUTONOMOUS", label: "Автономное" },
    { value: "DECENTRALIZED", label: "Децентрализованное" },
];

const CITY_SIDES = [
    { value: "LEFT", label: "Левая сторона" },
    { value: "RIGHT", label: "Правая сторона" },
];

const RENOVATION_TYPES = [
    { value: "SHELL", label: "Без отделки" },
    { value: "BLACK", label: "Черновая отделка" },
    { value: "COSMETIC", label: "Косметический ремонт" },
    { value: "DESIGNER", label: "Дизайнерский ремонт" },
    { value: "EURO", label: "Евроремонт" },
];


// Утилита для получения URL изображения
const getImageUrl = (imagePath: string): string => {
    // Если это уже полный URL, возвращаем как есть
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Если это base64, возвращаем как есть
    if (imagePath.startsWith('data:')) {
        return imagePath;
    }
    // Иначе формируем URL из file_name: https://fundament.uz/img/file_name
    return `https://fundament.uz/img/${imagePath}`;
};

// Компонент модального окна для просмотра деталей
const DetailModal: React.FC<{
    announcementId: string;
    onClose: () => void;
    onEdit: () => void;
}> = ({ announcementId, onClose, onEdit }) => {
    const { data, isLoading, error } = useGetAnnouncementByIdQuery(announcementId);

    if (isLoading) {
        return (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Загрузка...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.errorContainer}>
                        <p>Ошибка загрузки объявления</p>
                        <button className={styles.closeBtn} onClick={onClose}>
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Детали объявления</h2>
                    <div className={styles.modalActions}>
                        <button className={styles.editBtn} onClick={onEdit}>
                            <Edit size={18} />
                            Редактировать
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.modalContent}>
                    <div className={styles.detailSection}>
                        <h3>Основная информация</h3>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Название:</span>
                                <span className={styles.detailValue}>{data.title}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Тип:</span>
                                <span className={styles.detailValue}>{data.type}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Тип недвижимости:</span>
                                <span className={styles.detailValue}>{data.property_type}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Цена:</span>
                                <span className={styles.detailValue}>
                                    {data.price} {data.currency}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Комнат:</span>
                                <span className={styles.detailValue}>{data.rooms_count}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Площадь:</span>
                                <span className={styles.detailValue}>{data.area_total} м²</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Этаж:</span>
                                <span className={styles.detailValue}>
                                    {data.floor} из {data.floors_total}
                                </span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Город:</span>
                                <span className={styles.detailValue}>{data.city}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Район:</span>
                                <span className={styles.detailValue}>{data.district}</span>
                            </div>
                        </div>
                    </div>

                    {data.description && (
                        <div className={styles.detailSection}>
                            <h3>Описание</h3>
                            <p className={styles.descriptionText}>{data.description}</p>
                        </div>
                    )}

                    {data.images && data.images.length > 0 && (
                        <div className={styles.detailSection}>
                            <h3>Фотографии ({data.images.length})</h3>
                            <div className={styles.imagesGrid}>
                                {data.images.map((img, idx) => (
                                    <div key={idx} className={styles.imagePreview}>
                                        <Image
                                            src={getImageUrl(img)}
                                            alt={`Фото ${idx + 1}`}
                                            width={200}
                                            height={150}
                                            className={styles.image}
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Компонент модального окна для редактирования/добавления
const EditModal: React.FC<{
    announcementId?: string;
    onClose: () => void;
    onSuccess: () => void;
}> = ({ announcementId, onClose, onSuccess }) => {
    const isEdit = !!announcementId;
    const { data: existingData } = useGetAnnouncementByIdQuery(announcementId || "", {
        skip: !announcementId,
    });

    const [addAnnouncement, { isLoading: isAdding }] = useAddAnnouncementMutation();
    const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();

    const [formData, setFormData] = useState<Partial<AddAnnouncementBody & {
        layout_type?: string;
        heating_type?: string;
        city_side?: string;
        renovation_type?: string;
    }>>({
        title: "",
        description: "",
        type: "SALE",
        property_type: "",
        rooms_count: 1,
        floor: 1,
        floors_total: 1,
        area_total: "",
        area_living: "",
        area_kitchen: "",
        ceiling_height: 2.5,
        year_built: new Date().getFullYear(),
        wall_material: "",
        bathroom_layout: "",
        layout_type: "",
        heating_type: "",
        city_side: "",
        renovation_type: "",
        price: "",
        currency: "UZS",
        country: "",
        region: "",
        city: "",
        district: "",
        street: "",
        house_number: "",
        block: "",
        apartment: "",
        postal_code: "",
        latitude: "",
        longitude: "",
        cadastral_number: "",
        available_from: "",
        contact_phone: "",
        contact_email: "",
        images: [],
        subscription_id: "",
    });

    const [images, setImages] = useState<string[]>([]); // Превью изображений (URL.createObjectURL или существующие file_name)
    const [imageFiles, setImageFiles] = useState<File[]>([]); // Файлы для загрузки при отправке формы
    const [existingImageNames, setExistingImageNames] = useState<string[]>([]); // Существующие file_name из сервера (при редактировании)
    const [uploadingImages, setUploadingImages] = useState(false); // Состояние загрузки изображений
    const blobUrlsRef = useRef<string[]>([]); // Храним blob URLs для очистки

    // Заполняем форму данными при редактировании
    useEffect(() => {
        if (existingData && isEdit) {
            setFormData({
                title: existingData.title || "",
                description: existingData.description || "",
                type: (existingData.type as "RENT" | "SALE") || "SALE",
                property_type: existingData.property_type || "",
                rooms_count: existingData.rooms_count || 1,
                floor: existingData.floor || 1,
                floors_total: existingData.floors_total || 1,
                area_total: String(existingData.area_total || ""),
                area_living: existingData.area_living || "",
                area_kitchen: existingData.area_kitchen || "",
                ceiling_height: existingData.ceiling_height || 2.5,
                year_built: existingData.year_built || new Date().getFullYear(),
                wall_material: existingData.wall_material || "",
                bathroom_layout: existingData.bathroom_layout || "",
                layout_type: (existingData as any).layout_type || "",
                heating_type: (existingData as any).heating_type || "",
                city_side: (existingData as any).city_side || "",
                renovation_type: (existingData as any).renovation_type || "",
                price: String(existingData.price || ""),
                currency: existingData.currency || "UZS",
                country: (existingData as any).country || "",
                region: (existingData as any).region || "",
                city: existingData.city || "",
                district: existingData.district || "",
                street: existingData.street || "",
                house_number: existingData.house_number || "",
                block: existingData.block || "",
                apartment: existingData.apartment || "",
                postal_code: existingData.postal_code || "",
                latitude: existingData.latitude || "",
                longitude: existingData.longitude || "",
                cadastral_number: (existingData as any).cadastral_number || "",
                available_from: existingData.available_from || "",
                contact_phone: (existingData as any).contact_phone || "",
                contact_email: (existingData as any).contact_email || "",
                images: existingData.images || [],
                subscription_id: (existingData as any).subscription_id || "",
            });
            // При редактировании сохраняем существующие изображения
            setExistingImageNames(existingData.images || []);
            setImages(existingData.images || []);
            setImageFiles([]); // Очищаем новые файлы
        } else if (!isEdit) {
            // Сбрасываем форму при добавлении нового объявления
            setFormData({
                title: "",
                description: "",
                type: "SALE",
                property_type: "",
                rooms_count: 1,
                floor: 1,
                floors_total: 1,
                area_total: "",
                area_living: "",
                area_kitchen: "",
                ceiling_height: 2.5,
                year_built: new Date().getFullYear(),
                wall_material: "",
                bathroom_layout: "",
                layout_type: "",
                heating_type: "",
                city_side: "",
                renovation_type: "",
                price: "",
                currency: "UZS",
                country: "",
                region: "",
                city: "",
                district: "",
                street: "",
                house_number: "",
                block: "",
                apartment: "",
                postal_code: "",
                latitude: "",
                longitude: "",
                cadastral_number: "",
                available_from: "",
                contact_phone: "",
                contact_email: "",
                images: [],
                subscription_id: "",
            });
            setImages([]);
            setImageFiles([]);
            setExistingImageNames([]);
            // Очищаем blob URLs
            blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            blobUrlsRef.current = [];
        }
    }, [existingData, isEdit]);

    // Очистка blob URLs при размонтировании
    useEffect(() => {
        return () => {
            blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            blobUrlsRef.current = [];
        };
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "rooms_count" || name === "floor" || name === "floors_total" || name === "ceiling_height" || name === "year_built"
                ? Number(value)
                : value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length === 0) {
            return;
        }

        // Проверяем общее количество изображений
        const totalImages = images.length + files.length;
        if (totalImages > MAX_IMAGES) {
            toast.error(`Максимум ${MAX_IMAGES} фотографий`);
            e.target.value = "";
            return;
        }

        const newFiles: File[] = [];
        const newPreviews: string[] = [];
        const errors: string[] = [];

        for (const file of files) {
            // Проверяем тип файла
            if (!file.type.startsWith("image/")) {
                errors.push(`${file.name}: не является изображением`);
                continue;
            }

            // Проверяем размер файла (максимум 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                errors.push(`${file.name}: размер файла превышает 10MB`);
                continue;
            }

            // Создаем превью для отображения
            const previewUrl = URL.createObjectURL(file);
            blobUrlsRef.current.push(previewUrl); // Сохраняем для очистки
            newPreviews.push(previewUrl);
            newFiles.push(file);
        }

        // Обновляем состояние
        if (newFiles.length > 0) {
            setImages((prev) => [...prev, ...newPreviews]);
            setImageFiles((prev) => [...prev, ...newFiles]);
            toast.success(`Добавлено ${newFiles.length} фотографий`);
        }

        // Показываем ошибки, если есть
        if (errors.length > 0) {
            errors.forEach((error) => {
                toast.error(error);
            });
        }

        e.target.value = "";
    };

    const removeImage = (index: number) => {
        // Определяем, является ли это новым файлом или существующим изображением
        const existingCount = existingImageNames.length;
        
        if (index < existingCount) {
            // Удаляем существующее изображение
            setExistingImageNames((prev) => prev.filter((_, i) => i !== index));
            setImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            // Удаляем новый файл и его превью
            const fileIndex = index - existingCount;
            setImageFiles((prev) => {
                const newFiles = prev.filter((_, i) => i !== fileIndex);
                return newFiles;
            });
            setImages((prev) => {
                const previewIndex = index;
                // Освобождаем память от URL.createObjectURL
                const previewUrl = prev[previewIndex];
                if (previewUrl && previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                    blobUrlsRef.current = blobUrlsRef.current.filter(url => url !== previewUrl);
                }
                return prev.filter((_, i) => i !== previewIndex);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setUploadingImages(true);

            // Объединяем существующие изображения (при редактировании) и названия новых файлов
            const newImageNames = imageFiles.map(file => file.name);
            const allImageNames = [...existingImageNames, ...newImageNames];

            if (isEdit && announcementId) {
                // При редактировании используем UpdateAnnouncementBody (все поля опциональны)
                const updateData = {
                    ...formData,
                    images: allImageNames,
                };
                await updateAnnouncement({ 
                    id: announcementId, 
                    data: updateData,
                    files: imageFiles.length > 0 ? imageFiles : undefined
                }).unwrap();
                toast.success("Объявление успешно обновлено!");
            } else {
                // При добавлении используем AddAnnouncementBody
                // Создаем объект строго по интерфейсу AddAnnouncementBody (соответствует API примеру)
                const submitData: AddAnnouncementBody = {
                    title: formData.title || "",
                    description: formData.description || "",
                    type: formData.type || "SALE",
                    property_type: formData.property_type || "",
                    layout_type: formData.layout_type || "",
                    rooms_count: formData.rooms_count || 0,
                    floor: formData.floor || 0,
                    floors_total: formData.floors_total || 0,
                    area_total: formData.area_total || "",
                    area_living: formData.area_living || "",
                    area_kitchen: formData.area_kitchen || "",
                    ceiling_height: Math.round(formData.ceiling_height || 0),
                    year_built: formData.year_built || 0,
                    wall_material: formData.wall_material || "",
                    bathroom_layout: formData.bathroom_layout || "",
                    heating_type: formData.heating_type || "",
                    renovation_type: formData.renovation_type || "",
                    city_side: formData.city_side || "",
                    price: formData.price || "",
                    currency: formData.currency || "UZS",
                    country: formData.country || "",
                    region: formData.region || "",
                    city: formData.city || "",
                    district: formData.district || "",
                    street: formData.street || "",
                    house_number: formData.house_number || "",
                    block: formData.block || "",
                    apartment: formData.apartment || "",
                    postal_code: formData.postal_code || "",
                    latitude: formData.latitude || "",
                    longitude: formData.longitude || "",
                    cadastral_number: formData.cadastral_number || "",
                    available_from: formData.available_from || "",
                    contact_phone: formData.contact_phone || "",
                    images: allImageNames,
                    // Опциональные поля добавляем только если они заполнены
                    ...(formData.contact_email && { contact_email: formData.contact_email }),
                    ...(formData.subscription_id && { subscription_id: formData.subscription_id }),
                };
                
                // Проверяем обязательные поля (из основного примера API)
                if (!submitData.title) {
                    toast.error("Пожалуйста, заполните название");
                    return;
                }
                if (!submitData.city) {
                    toast.error("Пожалуйста, заполните город");
                    return;
                }
                if (!submitData.district) {
                    toast.error("Пожалуйста, заполните район");
                    return;
                }
                if (!submitData.contact_phone) {
                    toast.error("Пожалуйста, заполните телефон");
                    return;
                }
                
                await addAnnouncement({ 
                    data: submitData
                }).unwrap();
                toast.success("Объявление успешно добавлено!");
            }

            // Очищаем blob URLs после успешной отправки
            blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            blobUrlsRef.current = [];
            
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.data?.message || "Ошибка при сохранении объявления");
        } finally {
            setUploadingImages(false);
        }
    };

    const isLoading = isAdding || isUpdating;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{isEdit ? "Редактировать объявление" : "Добавить объявление"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formSection}>
                        <h3>Основная информация</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Название *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Тип *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Выберите тип</option>
                                    {ANNOUNCEMENT_TYPES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Тип недвижимости *</label>
                                <select
                                    name="property_type"
                                    value={formData.property_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Выберите тип недвижимости</option>
                                    {PROPERTY_TYPES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Планировка</label>
                                <select
                                    name="layout_type"
                                    value={formData.layout_type || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Выберите планировку</option>
                                    {LAYOUT_TYPES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Цена *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Валюта *</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="UZS">UZS</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Комнат *</label>
                                <input
                                    type="number"
                                    name="rooms_count"
                                    value={formData.rooms_count}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Площадь общая *</label>
                                <input
                                    type="text"
                                    name="area_total"
                                    value={formData.area_total}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Площадь жилая</label>
                                <input
                                    type="text"
                                    name="area_living"
                                    value={formData.area_living}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Площадь кухни</label>
                                <input
                                    type="text"
                                    name="area_kitchen"
                                    value={formData.area_kitchen}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Этаж *</label>
                                <input
                                    type="number"
                                    name="floor"
                                    value={formData.floor}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Этажей всего *</label>
                                <input
                                    type="number"
                                    name="floors_total"
                                    value={formData.floors_total}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Высота потолков</label>
                                <input
                                    type="number"
                                    name="ceiling_height"
                                    value={formData.ceiling_height}
                                    onChange={handleInputChange}
                                    step="0.1"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Год постройки</label>
                                <input
                                    type="number"
                                    name="year_built"
                                    value={formData.year_built}
                                    onChange={handleInputChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Адрес</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Страна</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Регион</label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Город *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Район *</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Улица</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Номер дома</label>
                                <input
                                    type="text"
                                    name="house_number"
                                    value={formData.house_number}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Корпус</label>
                                <input
                                    type="text"
                                    name="block"
                                    value={formData.block}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Квартира</label>
                                <input
                                    type="text"
                                    name="apartment"
                                    value={formData.apartment}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Дополнительно</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Материал стен</label>
                                <select
                                    name="wall_material"
                                    value={formData.wall_material || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Выберите материал</option>
                                    {WALL_MATERIALS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Планировка санузла</label>
                                <select
                                    name="bathroom_layout"
                                    value={formData.bathroom_layout || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Выберите планировку</option>
                                    {BATHROOM_LAYOUTS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Тип отопления</label>
                                <select
                                    name="heating_type"
                                    value={formData.heating_type || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Выберите тип отопления</option>
                                    {HEATING_TYPES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Сторона города</label>
                                <select
                                    name="city_side"
                                    value={formData.city_side || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Выберите сторону</option>
                                    {CITY_SIDES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Тип ремонта</label>
                                <select
                                    name="renovation_type"
                                    value={formData.renovation_type || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Выберите тип ремонта</option>
                                    {RENOVATION_TYPES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Описание</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Доступно с</label>
                                <input
                                    type="date"
                                    name="available_from"
                                    value={formData.available_from}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Кадастровый номер</label>
                                <input
                                    type="text"
                                    name="cadastral_number"
                                    value={formData.cadastral_number}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                                <label>Выберите местоположение на карте</label>
                                <MapPicker
                                    latitude={formData.latitude || ""}
                                    longitude={formData.longitude || ""}
                                    onLocationSelect={(lat, lng) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            latitude: lat.toFixed(8),
                                            longitude: lng.toFixed(8),
                                        }));
                                    }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Широта</label>
                                <input
                                    type="text"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    readOnly
                                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Долгота</label>
                                <input
                                    type="text"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    readOnly
                                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Почтовый индекс</label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Контакты</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Телефон *</label>
                                <input
                                    type="tel"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>ID подписки {!isEdit && "*"}</label>
                                <input
                                    type="text"
                                    name="subscription_id"
                                    value={formData.subscription_id}
                                    onChange={handleInputChange}
                                    placeholder={isEdit ? "Опционально" : "Обязательно"}
                                    required={!isEdit}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Фотографии (максимум {MAX_IMAGES})</h3>
                        <div className={styles.imagesUpload}>
                            <label className={styles.uploadLabel}>
                                <Upload size={20} />
                                {uploadingImages ? "Загрузка..." : "Загрузить фото"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={images.length >= MAX_IMAGES || uploadingImages}
                                    style={{ display: "none" }}
                                />
                            </label>
                            <p className={styles.uploadHint}>
                                Загружено: {images.length} / {MAX_IMAGES}
                            </p>
                        </div>

                        {images.length > 0 && (
                            <div className={styles.imagesGrid}>
                                {images.map((img, idx) => {
                                    // Определяем источник изображения
                                    // Если это blob URL (новый файл), используем его напрямую
                                    // Если это file_name (существующее изображение), используем getImageUrl
                                    const imageSrc = img.startsWith('blob:') 
                                        ? img 
                                        : getImageUrl(img);
                                    
                                    return (
                                        <div key={idx} className={styles.imagePreview}>
                                            <Image
                                                src={imageSrc}
                                                alt={`Preview ${idx + 1}`}
                                                width={150}
                                                height={150}
                                                className={styles.image}
                                                unoptimized
                                            />
                                            <button
                                                type="button"
                                                className={styles.removeImageBtn}
                                                onClick={() => removeImage(idx)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? "Сохранение..." : isEdit ? "Сохранить" : "Добавить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const AnnouncementsBlock: React.FC = () => {
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "detail" | "edit" | "add">("list");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading, error, refetch } = useGetAnnouncementsQuery({
        page,
        page_size: pageSize,
    });
    const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();

    const handleView = (id: string) => {
        setSelectedId(id);
        setViewMode("detail");
    };

    const handleEdit = (id?: string) => {
        setSelectedId(id || null);
        setViewMode(id ? "edit" : "add");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить это объявление? Это действие нельзя отменить.")) {
            return;
        }

        try {
            setDeleteId(id);
            await deleteAnnouncement(id).unwrap();
            toast.success("Объявление успешно удалено!");
            refetch();
        } catch (err: any) {
            toast.error(err.data?.message || "Ошибка при удалении объявления");
        } finally {
            setDeleteId(null);
        }
    };

    const handleCloseModal = () => {
        setViewMode("list");
        setSelectedId(null);
    };

    const handleSuccess = () => {
        refetch();
    };

    if (isLoading) {
        return (
            <div className={styles.announcementsBlock}>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка объявлений...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.announcementsBlock}>
                <div className={styles.errorContainer}>
                    <p>Ошибка загрузки объявлений</p>
                </div>
            </div>
        );
    }

    const totalPages = data ? Math.ceil(data.total / pageSize) : 1;
    const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className={styles.announcementsBlock}>
            <Toaster position="top-right" />

            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerIcon}>
                        <Megaphone size={28} />
                    </div>
                    <div>
                        <h2>Объявления</h2>
                        <p className={styles.subtitle}>
                            {data?.total
                                ? `${data.total} объявлени${data.total > 1 ? "й" : "е"}`
                                : "Нет объявлений"}
                        </p>
                    </div>
                </div>
                <button className={styles.addBtn} onClick={() => handleEdit()}>
                    <Plus size={20} />
                    Добавить объявление
                </button>
            </div>

            {data?.announcements.length ? (
                <>
                    <div className={styles.cards}>
                        {data.announcements.map((announcement, index) => {
                            const isDeleting = deleteId === announcement.id;
                            const gradientClass = `gradient${(index % 3) + 1}`;

                            return (
                                <div
                                    key={announcement.id}
                                    className={`${styles.card} ${styles[gradientClass]}`}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardImage}>
                                            {announcement.images && announcement.images.length > 0 ? (
                                                <Image
                                                    src={getImageUrl(announcement.images[0])}
                                                    alt={announcement.title}
                                                    width={300}
                                                    height={200}
                                                    className={styles.image}
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className={styles.noImage}>
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.cardContent}>
                                        <h3 className={styles.cardTitle}>{announcement.title}</h3>
                                        <div className={styles.cardInfo}>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Тип:</span>
                                                <span className={styles.infoValue}>
                                                    {announcement.type}
                                                </span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Цена:</span>
                                                <span className={styles.infoValue}>
                                                    {announcement.price} {announcement.currency}
                                                </span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Комнат:</span>
                                                <span className={styles.infoValue}>
                                                    {announcement.rooms_count}
                                                </span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Площадь:</span>
                                                <span className={styles.infoValue}>
                                                    {announcement.area_total} м²
                                                </span>
                                            </div>
                                            <div className={styles.infoRow}>
                                                <span className={styles.infoLabel}>Город:</span>
                                                <span className={styles.infoValue}>
                                                    {announcement.city}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            className={styles.viewBtn}
                                            onClick={() => handleView(announcement.id)}
                                        >
                                            <Eye size={18} />
                                            Просмотр
                                        </button>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => handleEdit(announcement.id)}
                                        >
                                            <Edit size={18} />
                                            Редактировать
                                        </button>
                                    </div>

                                    <div className={styles.deleteAction}>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(announcement.id)}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <>
                                                    <span className={styles.spinnerSmall}></span>
                                                    Удаляем...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 size={18} />
                                                    Удалить
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.paginationBtn}
                                onClick={handlePrev}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={18} />
                                Назад
                            </button>
                            <div className={styles.paginationInfo}>
                                <span className={styles.currentPage}>{page}</span>
                                <span className={styles.separator}>из</span>
                                <span className={styles.totalPages}>{totalPages}</span>
                            </div>
                            <button
                                className={styles.paginationBtn}
                                onClick={handleNext}
                                disabled={page === totalPages}
                            >
                                Вперед
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.emptyState}>
                    <Megaphone size={64} />
                    <h3>Нет объявлений</h3>
                    <p>Добавьте первое объявление, нажав кнопку выше</p>
                </div>
            )}

            {viewMode === "detail" && selectedId && (
                <DetailModal
                    announcementId={selectedId}
                    onClose={handleCloseModal}
                    onEdit={() => handleEdit(selectedId)}
                />
            )}

            {(viewMode === "edit" || viewMode === "add") && (
                <EditModal
                    announcementId={viewMode === "edit" ? selectedId || undefined : undefined}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};




