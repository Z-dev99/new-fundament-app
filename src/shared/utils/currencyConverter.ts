/**
 * Утилиты для конвертации валют
 */

export interface CurrencyRate {
    Rate: string;
    Nominal: string;
}

/** Парсит числовые поля ответа ЦБУ (пробелы как разделитель тысяч, запятая как десятичная). */
export function parseCbuNumeric(value: string | number | undefined | null): number | null {
    if (value === undefined || value === null) return null;
    const cleaned = String(value).trim().replace(/\s/g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) && n > 0 ? n : null;
}

/** Запасной курс UZS за 1 USD, если API ЦБУ недоступен (только для отображения в каталоге). */
export const DEFAULT_USD_UZS_FALLBACK = 12800;

/**
 * Курс для отображения цен в списке/карточке: данные ЦБУ или fallback.
 * Для сохранения объявлений используйте только фактический курс без fallback.
 */
export function getUsdRateForDisplay(
    usdRateData: { Rate: string; Nominal: string }[] | undefined,
    fallback: number = DEFAULT_USD_UZS_FALLBACK
): { rate: number; nominal: number } {
    const row = usdRateData?.[0];
    const rate = row ? parseCbuNumeric(row.Rate) : null;
    const nominalRaw = row ? parseCbuNumeric(row.Nominal) : null;
    const nominal = nominalRaw && nominalRaw > 0 ? nominalRaw : 1;
    return { rate: rate ?? fallback, nominal };
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
 * Парсит сумму в USD из поля ввода: только цифры и десятичный разделитель (. или ,),
 * без символов валюты. Невалидный ввод → NaN.
 */
export function parseUsdPriceAmount(priceString: string): number {
    if (!priceString || !priceString.trim()) return NaN;
    const cleaned = priceString.trim().replace(/\s/g, "").replace(",", ".");
    if (!/^\d+(\.\d+)?$/.test(cleaned)) return NaN;
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : NaN;
}

/** Округление для отображения введённой суммы в USD (например при загрузке из UZS). */
export function formatUsdInputAmount(usd: number): string {
    if (!Number.isFinite(usd) || usd <= 0) return "";
    const rounded = Math.round(usd * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
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

