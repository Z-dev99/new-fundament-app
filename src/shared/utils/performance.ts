/**
 * Утилиты для оптимизации производительности
 */

/**
 * Debounce функция для оптимизации частых вызовов
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle функция для ограничения частоты вызовов
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Lazy load изображений с Intersection Observer
 */
export function lazyLoadImage(
    imageElement: HTMLImageElement,
    src: string,
    onLoad?: () => void
): () => void {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    imageElement.src = src;
                    if (onLoad) {
                        imageElement.onload = onLoad;
                    }
                    observer.unobserve(imageElement);
                }
            });
        },
        { rootMargin: "50px" }
    );

    observer.observe(imageElement);

    return () => observer.disconnect();
}

/**
 * Prefetch ресурсов
 */
export function prefetchResource(url: string, as: "script" | "style" | "image" | "font" = "script"): void {
    if (typeof window !== "undefined") {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = url;
        link.as = as;
        document.head.appendChild(link);
    }
}

/**
 * Измерение производительности
 */
export function measurePerformance(name: string, fn: () => void): void {
    if (typeof window !== "undefined" && window.performance) {
        const start = performance.now();
        fn();
        const end = performance.now();
    } else {
        fn();
    }
}

/**
 * Оптимизированная проверка мобильного устройства
 */
export function isMobileDevice(): boolean {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
}

/**
 * Оптимизированная проверка планшета
 */
export function isTabletDevice(): boolean {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Оптимизированная проверка десктопа
 */
export function isDesktopDevice(): boolean {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
}











