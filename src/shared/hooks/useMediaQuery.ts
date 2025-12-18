import { useState, useEffect } from "react";

/**
 * Хук для отслеживания медиа-запросов с оптимизацией
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mediaQuery = window.matchMedia(query);
        
        // Используем addEventListener для лучшей производительности
        const handler = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Проверяем поддержку addEventListener
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        } else {
            // Fallback для старых браузеров
            mediaQuery.addListener(handler);
            return () => mediaQuery.removeListener(handler);
        }
    }, [query]);

    return matches;
}

/**
 * Хук для определения типа устройства
 */
export function useDeviceType() {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    return {
        isMobile,
        isTablet,
        isDesktop,
        isMobileOrTablet: isMobile || isTablet,
    };
}











