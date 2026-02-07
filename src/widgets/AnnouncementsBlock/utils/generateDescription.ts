import {
    ANNOUNCEMENT_TYPES,
    PROPERTY_TYPES,
    LAYOUT_TYPES,
    WALL_MATERIALS,
    BATHROOM_LAYOUTS,
    HEATING_TYPES,
    RENOVATION_TYPES,
} from "../constants";

interface FormData {
    type?: string;
    property_type?: string;
    layout_type?: string;
    rooms_count?: number;
    area_total?: string;
    area_living?: string;
    area_kitchen?: string;
    floor?: number;
    floors_total?: number;
    ceiling_height?: number;
    year_built?: number;
    wall_material?: string;
    bathroom_layout?: string;
    heating_type?: string;
    renovation_type?: string;
    city?: string;
    district?: string;
    street?: string;
    house_number?: string;
    price?: string;
    currency?: string;
    // Дополнительные поля, не отправляемые на сервер
    bathroom_count?: number;
    is_duplex?: boolean;
    is_two_story?: boolean;
    house_floors?: number;
    mortgage_available?: boolean;
    has_balcony?: boolean;
    balcony_area?: string;
}

export const generateDescription = (formData: FormData): string => {
    const parts: string[] = [];

    // Вводный абзац
    const introParts: string[] = [];
    const announcementType = ANNOUNCEMENT_TYPES.find(t => t.value === formData.type);
    const propertyType = PROPERTY_TYPES.find(t => t.value === formData.property_type);
    
    if (announcementType && propertyType) {
        const typeText = announcementType.value === "SALE" ? "к продаже" : "в аренду";
        introParts.push(`Предлагается ${typeText}`);
        
        // Добавляем эпитеты
        const adjectives: string[] = [];
        if (formData.ceiling_height && formData.ceiling_height >= 2.7) {
            adjectives.push("просторная");
        }
        if (formData.renovation_type && formData.renovation_type !== "SHELL") {
            adjectives.push("светлая");
        }
        if (adjectives.length > 0) {
            introParts.push(adjectives.join(" и"));
        }
        
        introParts.push(propertyType.label.toLowerCase());
    }

    // Площадь
    if (formData.area_total) {
        introParts.push(`общей площадью ${formData.area_total} м²`);
    }

    // Этаж и дом
    if (formData.floor && formData.floors_total) {
        const floorText = formData.floor === formData.floors_total 
            ? "верхнем этаже" 
            : `${formData.floor} этаже из ${formData.floors_total}`;
        introParts.push(`расположенная на ${floorText}`);
        
        // Материал и год
        const houseParts: string[] = [];
        const wallMaterial = WALL_MATERIALS.find(t => t.value === formData.wall_material);
        if (wallMaterial) {
            const materialText = wallMaterial.value === "BRICK" ? "кирпичного" 
                : wallMaterial.value === "MONOLITH" ? "монолитного"
                : wallMaterial.value === "PANEL" ? "панельного"
                : wallMaterial.label.toLowerCase();
            houseParts.push(materialText);
        }
        
        if (formData.year_built) {
            const currentYear = new Date().getFullYear();
            const yearText = formData.year_built >= currentYear - 5 ? "современного" : "";
            if (yearText) houseParts.push(yearText);
            houseParts.push(`дома ${formData.year_built} года постройки`);
        } else if (houseParts.length > 0) {
            houseParts.push("дома");
        }
        
        if (houseParts.length > 0) {
            introParts.push(houseParts.join(" "));
        }
    }

    if (introParts.length > 0) {
        parts.push(`<p>${introParts.join(" ")}.</p>`);
    }

    // Секция "Планировка и характеристики"
    const characteristics: string[] = [];
    
    // Формат планировки
    const layoutType = LAYOUT_TYPES.find(t => t.value === formData.layout_type);
    if (layoutType && formData.rooms_count) {
        const roomsText = formData.rooms_count === 1 
            ? "1 комната" 
            : formData.rooms_count < 5 
                ? `${formData.rooms_count} комнаты` 
                : `${formData.rooms_count} комнат`;
        characteristics.push(`<li><strong>формат:</strong> ${layoutType.label.toLowerCase()} + ${roomsText}</li>`);
    }

    // Площади
    if (formData.area_total) {
        characteristics.push(`<li><strong>общая площадь:</strong> ${formData.area_total} м²</li>`);
    }
    if (formData.area_living) {
        characteristics.push(`<li><strong>жилая площадь:</strong> ${formData.area_living} м²</li>`);
    }
    if (formData.area_kitchen) {
        characteristics.push(`<li><strong>кухня:</strong> ${formData.area_kitchen} м²</li>`);
    }

    // Высота потолков
    if (formData.ceiling_height) {
        const heightStr = formData.ceiling_height.toString().replace(".", ",");
        characteristics.push(`<li><strong>высота потолков:</strong> ${heightStr} м</li>`);
    }

    // Санузел
    const bathroomLayout = BATHROOM_LAYOUTS.find(t => t.value === formData.bathroom_layout);
    if (bathroomLayout) {
        const bathroomLabel = bathroomLayout.label.charAt(0).toUpperCase() + bathroomLayout.label.slice(1).toLowerCase();
        characteristics.push(`<li><strong>санузел:</strong> ${bathroomLabel}</li>`);
    }

    // Количество санузлов
    if (formData.bathroom_count) {
        characteristics.push(`<li><strong>количество санузлов:</strong> ${formData.bathroom_count}</li>`);
    }

    // Дуплекс
    if (formData.is_duplex) {
        characteristics.push(`<li><strong>дуплекс:</strong> Да</li>`);
    }

    // Двухэтажная квартира
    if (formData.is_two_story) {
        characteristics.push(`<li><strong>двухэтажная квартира:</strong> Да</li>`);
    }

    // Этажи (дома / участки)
    if (formData.house_floors) {
        characteristics.push(`<li><strong>этажи (дома / участки):</strong> ${formData.house_floors}</li>`);
    }

    // Ипотека
    if (formData.mortgage_available !== undefined) {
        characteristics.push(`<li><strong>ипотека:</strong> ${formData.mortgage_available ? "Доступна" : "Недоступна"}</li>`);
    }

    // Балкон
    if (formData.has_balcony) {
        const balconyText = formData.balcony_area 
            ? `Есть, ${formData.balcony_area} м²`
            : "Есть";
        characteristics.push(`<li><strong>балкон:</strong> ${balconyText}</li>`);
    }

    // Отопление
    const heatingType = HEATING_TYPES.find(t => t.value === formData.heating_type);
    if (heatingType) {
        const heatingLabel = heatingType.label.charAt(0).toUpperCase() + heatingType.label.slice(1).toLowerCase();
        characteristics.push(`<li><strong>отопление:</strong> ${heatingLabel}</li>`);
    }

    // Состояние/ремонт
    const renovationType = RENOVATION_TYPES.find(t => t.value === formData.renovation_type);
    if (renovationType) {
        let renovationText = `<strong>состояние:</strong> ${renovationType.label.toLowerCase()}`;
        if (renovationType.value === "SHELL") {
            renovationText += " — идеальная возможность реализовать собственный дизайн-проект";
        }
        characteristics.push(`<li>${renovationText}</li>`);
    }

    if (characteristics.length > 0) {
        parts.push(`<h3>Планировка и характеристики:</h3><ul>${characteristics.join("")}</ul>`);
    }

    // Секция "Преимущества"
    const advantages: string[] = [];
    
    if (formData.floor && formData.floors_total && formData.floor === formData.floors_total) {
        advantages.push("<li>верхний этаж — тишина и панорамные виды</li>");
    }
    
    const wallMaterial = WALL_MATERIALS.find(t => t.value === formData.wall_material);
    if (wallMaterial && wallMaterial.value === "BRICK") {
        advantages.push("<li>кирпичный дом — надёжность и теплоизоляция</li>");
    } else if (wallMaterial && wallMaterial.value === "MONOLITH") {
        advantages.push("<li>монолитный дом — прочность и долговечность</li>");
    }
    
    advantages.push("<li>все коммуникации подключены</li>");
    
    if (renovationType && renovationType.value !== "SHELL") {
        advantages.push("<li>дом готов к заселению</li>");
    } else {
        advantages.push("<li>готово к ремонту по вашему вкусу</li>");
    }

    if (advantages.length > 0) {
        parts.push(`<h3>Преимущества:</h3><ul>${advantages.join("")}</ul>`);
    }

    // Адрес
    const addressParts: string[] = [];
    if (formData.city) {
        addressParts.push(`г. ${formData.city}`);
    }
    if (formData.district) {
        addressParts.push(formData.district);
    }
    if (formData.street) {
        addressParts.push(`ул. ${formData.street}`);
    }
    if (formData.house_number) {
        addressParts.push(`д. ${formData.house_number}`);
    }
    
    if (addressParts.length > 0) {
        parts.push(`<h3>Адрес:</h3><p>${addressParts.join(", ")}</p>`);
    }

    // Цена
    if (formData.price) {
        const currency = formData.currency === "USD" ? "$" : formData.currency === "EUR" ? "€" : "сум";
        const priceText = formData.currency === "UZS" 
            ? `${parseInt(formData.price).toLocaleString("ru-RU")} ${currency}`
            : `${parseInt(formData.price).toLocaleString("ru-RU")} ${currency}`;
        parts.push(`<h3>Цена:</h3><p>${priceText}</p>`);
    }

    // Заключительная фраза
    if (parts.length > 0) {
        const finalText = announcementType?.value === "SALE"
            ? "Отличный вариант как для комфортного проживания, так и для инвестиции.<br>Звоните и записывайтесь на просмотр!"
            : "Отличный вариант для комфортного проживания.<br>Звоните и записывайтесь на просмотр!";
        parts.push(`<p>${finalText}</p>`);
    } else {
        return "<p>Заполните основные данные для автоматической генерации описания.</p>";
    }

    return parts.join("");
};




