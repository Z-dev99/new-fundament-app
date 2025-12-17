"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { useAnnouncementForm } from "../hooks/useAnnouncementForm";
import { getImageUrl } from "../utils";
import {
    MAX_IMAGES,
    ANNOUNCEMENT_TYPES,
    PROPERTY_TYPES,
    LAYOUT_TYPES,
    WALL_MATERIALS,
    BATHROOM_LAYOUTS,
    HEATING_TYPES,
    CITY_SIDES,
    RENOVATION_TYPES,
} from "../constants";
import styles from "../styles.module.scss";

const MapPicker = dynamic(() => import("../MapPicker"), { ssr: false });

interface EditModalProps {
    announcementId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({ announcementId, onClose, onSuccess }) => {
    const {
        formData,
        images,
        isEdit,
        isLoading,
        handleInputChange,
        handleImageUpload,
        removeImage,
        handleSubmit,
        updateFormData,
    } = useAnnouncementForm({ announcementId, onSuccess, onClose });

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
                                        updateFormData({
                                            latitude: lat.toFixed(8),
                                            longitude: lng.toFixed(8),
                                        });
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
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleInputChange}
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
                                Загрузить фото
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={images.length >= MAX_IMAGES || isLoading}
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
