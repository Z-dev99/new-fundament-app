/**
 * Константы приложения
 */

export const APP_CONFIG = {
    name: "Fundament",
    description: "Недвижимость в Узбекистане",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    locale: "ru",
    defaultPageSize: 24,
    maxPageSize: 100,
} as const;

export const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
    wide: 1536,
} as const;

export const ANIMATION_DURATION = {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
} as const;











