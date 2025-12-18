import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Отзывы клиентов - Реальные отзывы о Fundament",
    description: "Читайте реальные отзывы клиентов о работе с Fundament - ведущей платформой недвижимости в Узбекистане. Узнайте о нашем опыте, профессионализме и качестве услуг. Оставьте свой отзыв.",
    keywords: [
        "отзывы о Fundament",
        "отзывы клиентов недвижимость",
        "рейтинг агентства недвижимости",
        "мнения клиентов",
        "отзывы о покупке квартиры",
        "отзывы об аренде недвижимости",
        "рекомендации клиентов",
    ],
    openGraph: {
        title: "Отзывы клиентов - Fundament",
        description: "Реальные отзывы клиентов о работе с Fundament - платформой недвижимости в Узбекистане",
        url: "/reviews",
        siteName: "Fundament",
        locale: "ru_UZ",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Отзывы клиентов - Fundament",
        description: "Реальные отзывы клиентов о работе с Fundament",
    },
    alternates: {
        canonical: "/reviews",
    },
    robots: {
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

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
