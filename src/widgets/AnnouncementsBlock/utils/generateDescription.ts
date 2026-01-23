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
        parts.push(introParts.join(" ") + ".");
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
        characteristics.push(`формат: ${layoutType.label.toLowerCase()} + ${roomsText}`);
    }

    // Площади
    if (formData.area_total) {
        characteristics.push(`общая площадь: ${formData.area_total} м²`);
    }
    if (formData.area_living) {
        characteristics.push(`жилая площадь: ${formData.area_living} м²`);
    }
    if (formData.area_kitchen) {
        characteristics.push(`кухня: ${formData.area_kitchen} м²`);
    }

    // Высота потолков
    if (formData.ceiling_height) {
        characteristics.push(`высота потолков: ${formData.ceiling_height.toString().replace(".", ",")} м`);
    }

    // Санузел
    const bathroomLayout = BATHROOM_LAYOUTS.find(t => t.value === formData.bathroom_layout);
    if (bathroomLayout) {
        characteristics.push(`санузел: ${bathroomLayout.label.toLowerCase()}`);
    }

    // Отопление
    const heatingType = HEATING_TYPES.find(t => t.value === formData.heating_type);
    if (heatingType) {
        characteristics.push(`отопление: ${heatingType.label.toLowerCase()}`);
    }

    // Состояние/ремонт
    const renovationType = RENOVATION_TYPES.find(t => t.value === formData.renovation_type);
    if (renovationType) {
        let renovationText = `состояние: ${renovationType.label.toLowerCase()}`;
        if (renovationType.value === "SHELL") {
            renovationText += " — идеальная возможность реализовать собственный дизайн-проект";
        }
        characteristics.push(renovationText);
    }

    if (characteristics.length > 0) {
        parts.push("\nПланировка и характеристики:\n");
        parts.push(characteristics.join("\n\n"));
    }

    // Секция "Преимущества"
    const advantages: string[] = [];
    
    if (formData.floor && formData.floors_total && formData.floor === formData.floors_total) {
        advantages.push("верхний этаж — тишина и панорамные виды");
    }
    
    const wallMaterial = WALL_MATERIALS.find(t => t.value === formData.wall_material);
    if (wallMaterial && wallMaterial.value === "BRICK") {
        advantages.push("кирпичный дом — надёжность и теплоизоляция");
    } else if (wallMaterial && wallMaterial.value === "MONOLITH") {
        advantages.push("монолитный дом — прочность и долговечность");
    }
    
    advantages.push("все коммуникации подключены");
    
    if (renovationType && renovationType.value !== "SHELL") {
        advantages.push("дом готов к заселению");
    } else {
        advantages.push("готово к ремонту по вашему вкусу");
    }

    if (advantages.length > 0) {
        parts.push("\n\nПреимущества:\n");
        parts.push(advantages.join("\n\n"));
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
        parts.push("\n\nАдрес:\n");
        parts.push(addressParts.join(", "));
    }

    // Цена
    if (formData.price) {
        const currency = formData.currency === "USD" ? "$" : formData.currency === "EUR" ? "€" : "сум";
        const priceText = formData.currency === "UZS" 
            ? `${parseInt(formData.price).toLocaleString("ru-RU")} ${currency}`
            : `${parseInt(formData.price).toLocaleString("ru-RU")} ${currency}`;
        parts.push(`\n\nЦена: ${priceText}`);
    }

    // Заключительная фраза
    if (parts.length > 0) {
        const finalText = announcementType?.value === "SALE"
            ? "Отличный вариант как для комфортного проживания, так и для инвестиции.\nЗвоните и записывайтесь на просмотр!"
            : "Отличный вариант для комфортного проживания.\nЗвоните и записывайтесь на просмотр!";
        parts.push(`\n\n${finalText}`);
    } else {
        return "Заполните основные данные для автоматической генерации описания.";
    }

    return parts.join("");
};
