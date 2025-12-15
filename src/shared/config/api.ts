/**
 * Конфигурация API
 */

export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
} as const;

/**
 * Настройки кэширования для разных типов запросов
 */
export const CACHE_CONFIG = {
    banners: {
        staleTime: 5 * 60 * 1000, // 5 минут
        cacheTime: 10 * 60 * 1000, // 10 минут
    },
    properties: {
        staleTime: 2 * 60 * 1000, // 2 минуты
        cacheTime: 5 * 60 * 1000, // 5 минут
    },
    stats: {
        staleTime: 1 * 60 * 1000, // 1 минута
        cacheTime: 3 * 60 * 1000, // 3 минуты
    },
} as const;

/**
 * Настройки для оптимизации запросов
 */
export const REQUEST_OPTIMIZATION = {
    debounceDelay: 300,
    throttleDelay: 1000,
    batchSize: 10,
} as const;




