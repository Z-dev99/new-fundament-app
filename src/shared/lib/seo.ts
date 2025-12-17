import type { Metadata } from "next";

/**
 * Утилиты для генерации SEO метаданных
 */

interface GenerateMetadataOptions {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    noindex?: boolean;
}

export function generateMetadata(options: GenerateMetadataOptions): Metadata {
    const {
        title = "Fundament - Недвижимость в Узбекистане",
        description = "Лучшие предложения недвижимости в Узбекистане",
        image,
        url = "/",
        type = "website",
        noindex = false,
    } = options;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const fullUrl = `${siteUrl}${url}`;
    const ogImage = image || `${siteUrl}/og-image.jpg`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: fullUrl,
            siteName: "Fundament",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type,
            locale: "ru_UZ",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: fullUrl,
        },
        robots: noindex
            ? {
                  index: false,
                  follow: false,
              }
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      "max-video-preview": -1,
                      "max-image-preview": "large",
                      "max-snippet": -1,
                  },
              },
    };
}








