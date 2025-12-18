import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Контакты - Свяжитесь с нами",
    description: "Свяжитесь с Fundament - ведущей платформой недвижимости в Узбекистане. Телефон, email, адреса офисов, график работы. Получите бесплатную консультацию по недвижимости.",
    keywords: [
        "контакты Fundament",
        "связаться с агентством недвижимости",
        "консультация по недвижимости",
        "офис недвижимости Ташкент",
        "телефон агентства недвижимости",
        "поддержка клиентов",
    ],
    openGraph: {
        title: "Контакты - Fundament",
        description: "Свяжитесь с нами для получения консультации по недвижимости в Узбекистане",
        url: "/contacts",
        siteName: "Fundament",
        locale: "ru_UZ",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Контакты - Fundament",
        description: "Свяжитесь с нами для получения консультации по недвижимости",
    },
    alternates: {
        canonical: "/contacts",
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

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
