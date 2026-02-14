/**
 * Утилиты для конвертации валют
 */

export interface CurrencyRate {
    Rate: string;
    Nominal: string;
}

/**
 * Конвертирует сумму из UZS в USD по курсу ЦБУ
 */
export function convertUZSToUSD(amountUZS: number, rate: number, nominal: number = 1): number {
    if (!rate || rate === 0) return amountUZS;
    return (amountUZS / rate) * nominal;
}

/**
 * Конвертирует сумму из USD в UZS по курсу ЦБУ
 */
export function convertUSDtoUZS(amountUSD: number, rate: number, nominal: number = 1): number {
    if (!rate || rate === 0) return amountUSD;
    return (amountUSD * rate) / nominal;
}

/**
 * Парсит цену из строки, определяя валюту по символу $
 * Возвращает объект с ценой и валютой
 */
export function parsePrice(priceString: string): { amount: number; currency: "UZS" | "USD" } {
    if (!priceString || priceString.trim() === "") {
        return { amount: 0, currency: "UZS" };
    }

    // Убираем пробелы и проверяем наличие символа $
    const cleaned = priceString.trim().replace(/\s/g, "");
    const isUSD = cleaned.includes("$") || cleaned.toUpperCase().includes("USD");

    // Извлекаем число, убирая все нечисловые символы кроме точки и запятой
    const numberString = cleaned.replace(/[^\d.,]/g, "").replace(",", ".");
    const amount = parseFloat(numberString) || 0;

    return {
        amount,
        currency: isUSD ? "USD" : "UZS"
    };
}

/**
 * Форматирует цену с учетом выбранной валюты
 */
export function formatPrice(
    price: number,
    originalCurrency: string,
    displayCurrency: "UZS" | "USD" | "",
    usdRate: number | null,
    nominal: number = 1
): string {
    // Если валюта не выбрана, показываем в исходной валюте
    if (!displayCurrency) {
        if (originalCurrency === "USD") {
            return `$${Math.round(price).toLocaleString("ru-RU")}`;
        }
        return `${Math.round(price).toLocaleString("ru-RU")} сум`;
    }

    // Если выбрана UZS
    if (displayCurrency === "UZS") {
        if (originalCurrency === "USD" && usdRate) {
            // Если исходная валюта USD, конвертируем в UZS
            const priceInUZS = price * usdRate / nominal;
            return `${Math.round(priceInUZS).toLocaleString("ru-RU")} сум`;
        }
        // Уже в UZS
        return `${Math.round(price).toLocaleString("ru-RU")} сум`;
    }

    // Если выбрана USD
    if (displayCurrency === "USD") {
        if (!usdRate) {
            // Если курс не загружен, показываем в исходной валюте
            return `${Math.round(price).toLocaleString("ru-RU")} ${originalCurrency === "USD" ? "$" : "сум"}`;
        }

        if (originalCurrency === "USD") {
            // Уже в USD
            return `$${Math.round(price).toLocaleString("ru-RU")}`;
        }

        // Конвертируем из UZS в USD и округляем до целых
        const priceInUSD = convertUZSToUSD(price, usdRate, nominal);
        return `$${Math.round(priceInUSD).toLocaleString("ru-RU")}`;
    }

    // Fallback - показываем в исходной валюте
    return `${Math.round(price).toLocaleString("ru-RU")} ${originalCurrency === "USD" ? "$" : "сум"}`;
}

