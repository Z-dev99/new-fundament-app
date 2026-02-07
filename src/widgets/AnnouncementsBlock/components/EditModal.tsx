"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { X, Upload, RefreshCw } from "lucide-react";
import { useAnnouncementForm } from "../hooks/useAnnouncementForm";
import { getImageUrl } from "../utils";
import {
    MAX_IMAGES,
    MIN_IMAGES,
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

// Функция для генерации уникального ID
const generateUniqueId = (): string => {
    // Используем timestamp + случайные символы для уникальности
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `${timestamp}-${randomPart}`;
};

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
                                <label>Планировка *</label>
                                <select
                                    name="layout_type"
                                    value={formData.layout_type || ""}
                                    onChange={handleInputChange}
                                    required
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
                                <label>Площадь жилая *</label>
                                <input
                                    type="text"
                                    name="area_living"
                                    value={formData.area_living}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Площадь кухни *</label>
                                <input
                                    type="text"
                                    name="area_kitchen"
                                    value={formData.area_kitchen}
                                    onChange={handleInputChange}
                                    required
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
                                <label>Высота потолков *</label>
                                <input
                                    type="number"
                                    name="ceiling_height"
                                    value={formData.ceiling_height}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Год постройки *</label>
                                <input
                                    type="number"
                                    name="year_built"
                                    value={formData.year_built}
                                    onChange={handleInputChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Адрес</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Страна *</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Регион *</label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleInputChange}
                                    required
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
                                <label>Улица *</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Номер дома *</label>
                                <input
                                    type="text"
                                    name="house_number"
                                    value={formData.house_number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Корпус *</label>
                                <input
                                    type="text"
                                    name="block"
                                    value={formData.block}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Квартира *</label>
                                <input
                                    type="text"
                                    name="apartment"
                                    value={formData.apartment}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Дополнительно</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Материал стен *</label>
                                <select
                                    name="wall_material"
                                    value={formData.wall_material || ""}
                                    onChange={handleInputChange}
                                    required
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
                                <label>Планировка санузла *</label>
                                <select
                                    name="bathroom_layout"
                                    value={formData.bathroom_layout || ""}
                                    onChange={handleInputChange}
                                    required
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
                                <label>Тип отопления *</label>
                                <select
                                    name="heating_type"
                                    value={formData.heating_type || ""}
                                    onChange={handleInputChange}
                                    required
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
                                <label>Сторона города *</label>
                                <select
                                    name="city_side"
                                    value={formData.city_side || ""}
                                    onChange={handleInputChange}
                                    required
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
                                <label>Тип ремонта *</label>
                                <select
                                    name="renovation_type"
                                    value={formData.renovation_type || ""}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Выберите тип ремонта</option>
                                    {RENOVATION_TYPES.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Дополнительные характеристики (в описание и блок «Характеристики»)</h3>
                        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
                            Эти поля не отправляются на сервер отдельно — они сохраняются в описании и отображаются в блоке «Характеристики» на странице объявления.
                        </p>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label>Кол-во санузлов</label>
                                <input
                                    type="number"
                                    name="bathroom_count"
                                    value={formData.bathroom_count || ""}
                                    onChange={handleInputChange}
                                    placeholder="-"
                                    min="1"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Этажи (дома / участки)</label>
                                <input
                                    type="number"
                                    name="house_floors"
                                    value={formData.house_floors || ""}
                                    onChange={handleInputChange}
                                    placeholder="например: 2"
                                    min="1"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Площадь балкона, м²</label>
                                <input
                                    type="text"
                                    name="balcony_area"
                                    value={formData.balcony_area || ""}
                                    onChange={handleInputChange}
                                    placeholder="-"
                                    disabled={!formData.has_balcony}
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.toggleGroup}`}>
                                <label htmlFor="is_duplex">Дабллюкс (квартира)</label>
                                <div className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        name="is_duplex"
                                        checked={formData.is_duplex || false}
                                        onChange={handleInputChange}
                                        id="is_duplex"
                                    />
                                    <span className={styles.slider}></span>
                                </div>
                            </div>

                            <div className={`${styles.formGroup} ${styles.toggleGroup}`}>
                                <label htmlFor="is_two_story">Двухэтажная квартира</label>
                                <div className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        name="is_two_story"
                                        checked={formData.is_two_story || false}
                                        onChange={handleInputChange}
                                        id="is_two_story"
                                    />
                                    <span className={styles.slider}></span>
                                </div>
                            </div>

                            <div className={`${styles.formGroup} ${styles.toggleGroup}`}>
                                <label htmlFor="mortgage_available">Ипотека</label>
                                <div className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        name="mortgage_available"
                                        checked={formData.mortgage_available || false}
                                        onChange={handleInputChange}
                                        id="mortgage_available"
                                    />
                                    <span className={styles.slider}></span>
                                </div>
                            </div>

                            <div className={`${styles.formGroup} ${styles.toggleGroup}`}>
                                <label htmlFor="has_balcony">Балкон</label>
                                <div className={styles.toggleSwitch}>
                                    <input
                                        type="checkbox"
                                        name="has_balcony"
                                        checked={formData.has_balcony || false}
                                        onChange={handleInputChange}
                                        id="has_balcony"
                                    />
                                    <span className={styles.slider}></span>
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                                <label>Описание *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={12}
                                    required
                                    readOnly
                                    className={styles.descriptionTextarea}
                                    style={{ 
                                        backgroundColor: "#f5f5f5", 
                                        cursor: "not-allowed",
                                        whiteSpace: "pre-wrap",
                                        lineHeight: "1.6",
                                        fontFamily: "inherit"
                                    }}
                                />
                                <p style={{ fontSize: "12px", color: "#718096", marginTop: "4px" }}>
                                    Описание генерируется автоматически на основе заполненных данных
                                </p>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Доступно с *</label>
                                <input
                                    type="date"
                                    name="available_from"
                                    value={formData.available_from}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Кадастровый номер *</label>
                                <div style={{ position: "relative", display: "flex", alignItems: "stretch", width: "100%" }}>
                                    <input
                                        type="text"
                                        name="cadastral_number"
                                        value={formData.cadastral_number}
                                        onChange={handleInputChange}
                                        required
                                        style={{ 
                                            paddingRight: "42px",
                                            width: "100%",
                                            flex: 1
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const uniqueId = generateUniqueId();
                                            updateFormData({ cadastral_number: uniqueId });
                                        }}
                                        style={{
                                            position: "absolute",
                                            right: "6px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            padding: "7px 8px",
                                            background: "#f3f4f6",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s ease",
                                            height: "32px",
                                            width: "32px"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#e5e7eb";
                                            e.currentTarget.style.borderColor = "#d1d5db";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "#f3f4f6";
                                            e.currentTarget.style.borderColor = "#e5e7eb";
                                        }}
                                        title="Сгенерировать уникальный ID"
                                    >
                                        <RefreshCw size={16} color="#6b7280" />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                                <label>Выберите местоположение на карте *</label>
                                <div style={{ 
                                    width: "100%", 
                                    marginTop: "8px",
                                    display: "block"
                                }}>
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
                            </div>

                            <div className={styles.formGroup}>
                                <label>Широта *</label>
                                <input
                                    type="text"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Выберите точку на карте"
                                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                                    readOnly
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Долгота *</label>
                                <input
                                    type="text"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Выберите точку на карте"
                                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                                    readOnly
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Почтовый индекс *</label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    required
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
                                <div style={{ position: "relative", display: "flex", alignItems: "stretch", width: "100%" }}>
                                    <input
                                        type="text"
                                        name="subscription_id"
                                        value={formData.subscription_id}
                                        onChange={handleInputChange}
                                        placeholder={isEdit ? "Опционально" : "Обязательно"}
                                        required={!isEdit}
                                        style={{ 
                                            paddingRight: "42px",
                                            width: "100%",
                                            flex: 1
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const uniqueId = generateUniqueId();
                                            updateFormData({ subscription_id: uniqueId });
                                        }}
                                        style={{
                                            position: "absolute",
                                            right: "6px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            padding: "7px 8px",
                                            background: "#f3f4f6",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s ease",
                                            height: "32px",
                                            width: "32px"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#e5e7eb";
                                            e.currentTarget.style.borderColor = "#d1d5db";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "#f3f4f6";
                                            e.currentTarget.style.borderColor = "#e5e7eb";
                                        }}
                                        title="Сгенерировать уникальный ID"
                                    >
                                        <RefreshCw size={16} color="#6b7280" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>
                            Фотографии {isEdit ? `(максимум ${MAX_IMAGES})` : `(минимум ${MIN_IMAGES}, максимум ${MAX_IMAGES})`}
                        </h3>
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

                    {formData.type === "RENT" && (
                        <div className={styles.formSection} style={{ display: "block", visibility: "visible", opacity: 1 }}>
                            <h3>Дополнительная информация для аренды</h3>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup} style={{ gridColumn: "1 / -1", display: "block", visibility: "visible", opacity: 1 }}>
                                    <label>Дополнительная информация</label>
                                    <textarea
                                        name="rentAdditionalInfo"
                                        value={formData.rentAdditionalInfo || ""}
                                        onChange={handleInputChange}
                                        placeholder="Например: + оплата за последний месяц, сумма комиссии и т.д."
                                        rows={3}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            border: "2px solid #e5e7eb",
                                            fontSize: "14px",
                                            fontFamily: "inherit",
                                            resize: "vertical",
                                            display: "block",
                                            visibility: "visible",
                                            opacity: 1
                                        }}
                                    />
                                    <p style={{ marginTop: "8px", fontSize: "12px", color: "#6b7280" }}>
                                        Эта информация будет добавлена в описание объявления
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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
