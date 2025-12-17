/**
 * Утилиты для оптимизации изображений
 */

export interface ImageOptimizationOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "avif" | "jpg" | "png";
}

/**
 * Генерация оптимизированного URL для изображения
 */
export function getOptimizedImageUrl(
    src: string,
    options: ImageOptimizationOptions = {}
): string {
    const { width, height, quality = 80, format } = options;

    // Если это Unsplash
    if (src.includes("unsplash.com")) {
        const url = new URL(src);
        if (width) url.searchParams.set("w", String(width));
        if (height) url.searchParams.set("h", String(height));
        url.searchParams.set("q", String(quality));
        url.searchParams.set("fit", "crop");
        url.searchParams.set("auto", "format");
        return url.toString();
    }

    // Если это Pexels
    if (src.includes("pexels.com")) {
        return src; // Pexels не поддерживает параметры оптимизации
    }

    return src;
}

/**
 * Получение размеров изображения для разных устройств
 */
export function getResponsiveImageSizes(breakpoints: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
}): string {
    const { mobile = 100, tablet = 50, desktop = 33 } = breakpoints;
    return `(max-width: 768px) ${mobile}vw, (max-width: 1024px) ${tablet}vw, ${desktop}vw`;
}

/**
 * Preload критичных изображений
 */
export function preloadImage(src: string, as: "image" = "image"): void {
    if (typeof document !== "undefined") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = as;
        link.href = src;
        document.head.appendChild(link);
    }
}

/**
 * Lazy load изображений с placeholder
 */
export function createImagePlaceholder(width: number, height: number): string {
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">Loading...</text>
        </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}








