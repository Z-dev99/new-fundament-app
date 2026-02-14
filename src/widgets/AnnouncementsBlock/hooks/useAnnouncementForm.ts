import { useState, useEffect, useRef } from "react";
import { useGetAnnouncementByIdQuery, useAddAnnouncementMutation, useUpdateAnnouncementMutation, type AddAnnouncementBody } from "@/shared/api/announcementsApi";
import { useGetUSDRateQuery } from "@/shared/api/currencyApi";
import { parsePrice, convertUSDtoUZS } from "@/shared/utils/currencyConverter";
import toast from "react-hot-toast";
import { MAX_IMAGES, MIN_IMAGES } from "../constants";
import { generateDescription } from "../utils/generateDescription";

export interface UseAnnouncementFormProps {
    announcementId?: string;
    onSuccess: () => void;
    onClose: () => void;
}

const defaultLat = "41.2995";
const defaultLng = "69.2401";

function toDateOnly(value: string | undefined): string {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
}

function toDatetime(value: string): string {
    if (!value) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return `${value}T00:00:00.000Z`;
    }
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 23);
}

const getInitialFormData = (): Partial<AddAnnouncementBody & {
    layout_type?: string;
    heating_type?: string;
    city_side?: string;
    renovation_type?: string;
    rentAdditionalInfo?: string;
    // Дополнительные поля, не отправляемые на сервер
    bathroom_count?: number;
    is_duplex?: boolean;
    is_two_story?: boolean;
    house_floors?: number;
    mortgage_available?: boolean;
    has_balcony?: boolean;
    balcony_area?: string;
}> => ({
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
    latitude: defaultLat,
    longitude: defaultLng,
    cadastral_number: "",
    available_from: new Date().toISOString().slice(0, 10),
    contact_phone: "",
    contact_email: "",
    images: [],
    subscription_id: "",
    rentAdditionalInfo: "",
    // Дополнительные поля, не отправляемые на сервер
    bathroom_count: undefined,
    is_duplex: false,
    is_two_story: false,
    house_floors: undefined,
    mortgage_available: false,
    has_balcony: false,
    balcony_area: "",
});

export const useAnnouncementForm = ({ announcementId, onSuccess, onClose }: UseAnnouncementFormProps) => {
    const isEdit = !!announcementId;
    const { data: existingData } = useGetAnnouncementByIdQuery(announcementId || "", {
        skip: !announcementId,
    });

    // Получаем курс USD для конвертации
    const { data: usdRateData } = useGetUSDRateQuery();
    const usdRate = usdRateData?.[0] ? parseFloat(usdRateData[0].Rate) : null;
    const usdNominal = usdRateData?.[0] ? parseFloat(usdRateData[0].Nominal) : 1;

    const [addAnnouncement, { isLoading: isAdding }] = useAddAnnouncementMutation();
    const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();

    const [formData, setFormData] = useState<Partial<AddAnnouncementBody & {
        layout_type?: string;
        heating_type?: string;
        city_side?: string;
        renovation_type?: string;
        rentAdditionalInfo?: string;
        // Дополнительные поля, не отправляемые на сервер
        bathroom_count?: number;
        is_duplex?: boolean;
        is_two_story?: boolean;
        house_floors?: number;
        mortgage_available?: boolean;
        has_balcony?: boolean;
        balcony_area?: string;
    }>>(getInitialFormData());

    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImageNames, setExistingImageNames] = useState<string[]>([]);
    const blobUrlsRef = useRef<string[]>([]);

    // Функция для парсинга дополнительных полей из описания
    const parseAdditionalFieldsFromDescription = (description: string) => {
        const fields: {
            bathroom_count?: number;
            balcony_area?: string;
            is_duplex?: boolean;
            is_two_story?: boolean;
            house_floors?: number;
            mortgage_available?: boolean;
            has_balcony?: boolean;
        } = {};
        
        // Парсим количество санузлов
        const bathroomCountMatch = description.match(/<strong>количество санузлов:<\/strong>\s*(\d+)/i);
        if (bathroomCountMatch) {
            fields.bathroom_count = parseInt(bathroomCountMatch[1], 10);
        }
        
        // Парсим балкон
        const balconyMatch = description.match(/<strong>балкон:<\/strong>\s*([^<]+)/i);
        if (balconyMatch) {
            const balconyText = balconyMatch[1].trim().toLowerCase();
            if (balconyText.includes("есть") || balconyText.includes("да")) {
                fields.has_balcony = true;
                const areaMatch = balconyText.match(/(\d+(?:[.,]\d+)?)\s*м²/i);
                if (areaMatch) {
                    fields.balcony_area = areaMatch[1].replace(",", ".");
                }
            }
        }
        
        // Парсим дуплекс
        const duplexMatch = description.match(/<strong>дуплекс:<\/strong>\s*([^<]+)/i);
        if (duplexMatch) {
            const duplexText = duplexMatch[1].trim().toLowerCase();
            fields.is_duplex = duplexText.includes("да") || duplexText.includes("есть");
        }
        
        // Парсим двухэтажную квартиру
        const twoStoryMatch = description.match(/<strong>двухэтажная квартира:<\/strong>\s*([^<]+)/i);
        if (twoStoryMatch) {
            const twoStoryText = twoStoryMatch[1].trim().toLowerCase();
            fields.is_two_story = twoStoryText.includes("да") || twoStoryText.includes("есть");
        }
        
        // Парсим этажи домов/участков
        const houseFloorsMatch = description.match(/<strong>этажи \(дома \/ участки\):<\/strong>\s*(\d+)/i);
        if (houseFloorsMatch) {
            fields.house_floors = parseInt(houseFloorsMatch[1], 10);
        }
        
        // Парсим ипотеку
        const mortgageMatch = description.match(/<strong>ипотека:<\/strong>\s*([^<]+)/i);
        if (mortgageMatch) {
            const mortgageText = mortgageMatch[1].trim().toLowerCase();
            fields.mortgage_available = mortgageText.includes("доступна") || mortgageText.includes("можно");
        }
        
        return fields;
    };

    // Заполняем форму данными при редактировании
    useEffect(() => {
        if (existingData && isEdit) {
            const lat = existingData.latitude != null && existingData.latitude !== ""
                ? String(existingData.latitude) : defaultLat;
            const lng = existingData.longitude != null && existingData.longitude !== ""
                ? String(existingData.longitude) : defaultLng;
            
            // Парсим дополнительные поля из описания
            const additionalFields = existingData.description 
                ? parseAdditionalFieldsFromDescription(existingData.description)
                : {};
            
            const initialData = {
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
                latitude: lat,
                longitude: lng,
                cadastral_number: (existingData as any).cadastral_number || "",
                available_from: toDateOnly((existingData as any).available_from) || new Date().toISOString().slice(0, 10),
                contact_phone: (existingData as any).contact_phone || "",
                contact_email: (existingData as any).contact_email || "",
                images: existingData.images || [],
                subscription_id: (existingData as any).subscription_id || "",
                // Дополнительные поля из описания
                ...additionalFields,
            };
            setFormData(initialData);
            setExistingImageNames(existingData.images || []);
            setImages(existingData.images || []);
            setImageFiles([]);
        } else if (!isEdit) {
            const initialData = getInitialFormData();
            const autoDescription = generateDescription(initialData);
            setFormData({
                ...initialData,
                description: autoDescription,
            });
            setImages([]);
            setImageFiles([]);
            setExistingImageNames([]);
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
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        const updatedData = {
            ...formData,
            [name]: type === "checkbox" 
                ? checked
                : name === "rooms_count" || name === "floor" || name === "floors_total" || name === "ceiling_height" || name === "year_built" || name === "bathroom_count" || name === "house_floors"
                    ? (value === "" ? undefined : Number(value))
                    : value,
        };
        
        // Очищаем площадь балкона, если балкон отключен
        if (name === "has_balcony" && !checked) {
            updatedData.balcony_area = "";
        }
        
        // Автогенерация описания при изменении основных полей (кроме самого description)
        if (name !== "description") {
            const autoDescription = generateDescription(updatedData);
            updatedData.description = autoDescription;
        }
        
        setFormData(updatedData);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length === 0) return;

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
            if (!file.type.startsWith("image/")) {
                errors.push(`${file.name}: не является изображением`);
                continue;
            }

            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                errors.push(`${file.name}: размер файла превышает 10MB`);
                continue;
            }

            const previewUrl = URL.createObjectURL(file);
            blobUrlsRef.current.push(previewUrl);
            newPreviews.push(previewUrl);
            newFiles.push(file);
        }

        if (newFiles.length > 0) {
            setImages((prev) => [...prev, ...newPreviews]);
            setImageFiles((prev) => [...prev, ...newFiles]);
            toast.success(`Добавлено ${newFiles.length} фотографий`);
        }

        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
        }

        e.target.value = "";
    };

    const removeImage = (index: number) => {
        const existingCount = existingImageNames.length;
        
        if (index < existingCount) {
            setExistingImageNames((prev) => prev.filter((_, i) => i !== index));
            setImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            const fileIndex = index - existingCount;
            setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
            setImages((prev) => {
                const previewUrl = prev[index];
                if (previewUrl && previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                    blobUrlsRef.current = blobUrlsRef.current.filter(url => url !== previewUrl);
                }
                return prev.filter((_, i) => i !== index);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newImageNames = imageFiles.map(file => file.name);
            const allImageNames = [...existingImageNames, ...newImageNames];

            if (isEdit && announcementId) {
                const latRaw = (formData.latitude ?? "").trim();
                const lngRaw = (formData.longitude ?? "").trim();
                const latNum = latRaw ? parseFloat(latRaw) : NaN;
                const lngNum = lngRaw ? parseFloat(lngRaw) : NaN;
                const latitude = !isNaN(latNum) ? String(latNum) : defaultLat;
                const longitude = !isNaN(lngNum) ? String(lngNum) : defaultLng;
                const availRaw = (formData.available_from ?? "").trim();
                const available_from = availRaw ? toDatetime(availRaw) : toDatetime(new Date().toISOString().slice(0, 10));

                // Добавляем дополнительную информацию для аренды в описание
                let finalDescription = formData.description || "";
                if (formData.type === "RENT" && formData.rentAdditionalInfo?.trim()) {
                    finalDescription = finalDescription 
                        ? `${finalDescription}\n\n${formData.rentAdditionalInfo.trim()}`
                        : formData.rentAdditionalInfo.trim();
                }

                // Парсим цену и конвертируем доллары в сумы
                const priceInput = formData.price || "";
                const parsedPrice = parsePrice(priceInput);
                let finalPrice = parsedPrice.amount.toString();
                let finalCurrency = "UZS";

                if (parsedPrice.currency === "USD") {
                    if (!usdRate) {
                        toast.error("Курс доллара не загружен. Пожалуйста, попробуйте позже.");
                        return;
                    }
                    // Конвертируем доллары в сумы
                    const priceInUZS = convertUSDtoUZS(parsedPrice.amount, usdRate, usdNominal);
                    finalPrice = Math.round(priceInUZS).toString();
                    finalCurrency = "UZS";
                } else {
                    // Уже в сумах
                    finalPrice = parsedPrice.amount.toString();
                    finalCurrency = "UZS";
                }

                const updateData = {
                    ...formData,
                    price: finalPrice,
                    currency: finalCurrency,
                    description: finalDescription,
                    images: allImageNames,
                    latitude,
                    longitude,
                    available_from,
                    postal_code: formData.postal_code || "",
                    cadastral_number: formData.cadastral_number || "",
                };
                await updateAnnouncement({ 
                    id: announcementId, 
                    data: updateData,
                    files: imageFiles.length > 0 ? imageFiles : undefined
                }).unwrap();
                toast.success("Объявление успешно обновлено!");
            } else {
                const latRaw = (formData.latitude ?? "").trim();
                const lngRaw = (formData.longitude ?? "").trim();
                const latNum = latRaw ? parseFloat(latRaw) : NaN;
                const lngNum = lngRaw ? parseFloat(lngRaw) : NaN;
                const latitude = !isNaN(latNum) ? String(latNum) : defaultLat;
                const longitude = !isNaN(lngNum) ? String(lngNum) : defaultLng;

                const availRaw = (formData.available_from ?? "").trim();
                const available_from = availRaw ? toDatetime(availRaw) : toDatetime(new Date().toISOString().slice(0, 10));

                // Добавляем дополнительную информацию для аренды в описание
                let finalDescription = formData.description || "";
                if (formData.type === "RENT" && formData.rentAdditionalInfo?.trim()) {
                    finalDescription = finalDescription 
                        ? `${finalDescription}\n\n${formData.rentAdditionalInfo.trim()}`
                        : formData.rentAdditionalInfo.trim();
                }

                // Парсим цену и конвертируем доллары в сумы
                const priceInput = formData.price || "";
                const parsedPrice = parsePrice(priceInput);
                let finalPrice = parsedPrice.amount.toString();
                let finalCurrency = "UZS";

                if (parsedPrice.currency === "USD") {
                    if (!usdRate) {
                        toast.error("Курс доллара не загружен. Пожалуйста, попробуйте позже.");
                        return;
                    }
                    // Конвертируем доллары в сумы
                    const priceInUZS = convertUSDtoUZS(parsedPrice.amount, usdRate, usdNominal);
                    finalPrice = Math.round(priceInUZS).toString();
                    finalCurrency = "UZS";
                } else {
                    // Уже в сумах
                    finalPrice = parsedPrice.amount.toString();
                    finalCurrency = "UZS";
                }

                const submitData: AddAnnouncementBody = {
                    title: formData.title || "",
                    description: finalDescription,
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
                    price: finalPrice,
                    currency: finalCurrency,
                    country: formData.country || "",
                    region: formData.region || "",
                    city: formData.city || "",
                    district: formData.district || "",
                    street: formData.street || "",
                    house_number: formData.house_number || "",
                    block: formData.block || "",
                    apartment: formData.apartment || "",
                    postal_code: formData.postal_code || "",
                    latitude,
                    longitude,
                    cadastral_number: formData.cadastral_number || "",
                    available_from,
                    contact_phone: formData.contact_phone || "",
                    contact_email: formData.contact_email || "",
                    subscription_id: formData.subscription_id || "",
                    images: allImageNames,
                };

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
                if (!latRaw || !lngRaw || isNaN(latNum) || isNaN(lngNum)) {
                    toast.error("Выберите местоположение на карте");
                    return;
                }
                if (!availRaw) {
                    toast.error("Укажите дату «Доступно с»");
                    return;
                }

                // Валидация минимум 4 фото для нового объявления
                if (imageFiles.length < MIN_IMAGES) {
                    toast.error(`Необходимо загрузить минимум ${MIN_IMAGES} фотографий`);
                    return;
                }
                
                await addAnnouncement({ 
                    data: submitData,
                    files: imageFiles.length > 0 ? imageFiles : undefined
                }).unwrap();
                toast.success("Объявление успешно добавлено!");
            }

            blobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            blobUrlsRef.current = [];
            
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.data?.message || "Ошибка при сохранении объявления");
        }
    };

    const updateFormData = (updates: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    return {
        formData,
        images,
        imageFiles,
        isEdit,
        isLoading: isAdding || isUpdating,
        handleInputChange,
        handleImageUpload,
        removeImage,
        handleSubmit,
        updateFormData,
    };
};
