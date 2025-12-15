import { ReactNode } from "react";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "../shared/styles/globals.css";
import { Providers } from "./providers";
import ClientOnly from "./ClientOnly";
import ScrollTopButton from "@/widgets/ScrollTopButton";
import { ConditionalFooter } from "./ConditionalFooter";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: "swap",
    preload: true,
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: "Fundament - Недвижимость в Узбекистане",
        template: "%s | Fundament",
    },
    description: "Лучшие предложения недвижимости в Узбекистане. Новостройки, готовые квартиры, аренда и продажа недвижимости.",
    keywords: ["недвижимость", "квартиры", "Узбекистан", "новостройки", "аренда", "продажа"],
    authors: [{ name: "Fundament" }],
    creator: "Fundament",
    publisher: "Fundament",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    icons: {
        icon: "/logos/logo.svg",
        shortcut: "/logos/logo.svg",
        apple: "/logos/logo.svg",
    },
    openGraph: {
        type: "website",
        locale: "ru_UZ",
        url: "/",
        siteName: "Fundament",
        title: "Fundament - Недвижимость в Узбекистане",
        description: "Лучшие предложения недвижимости в Узбекистане",
    },
    twitter: {
        card: "summary_large_image",
        title: "Fundament - Недвижимость в Узбекистане",
        description: "Лучшие предложения недвижимости в Узбекистане",
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
    verification: {
        // Добавьте здесь коды верификации для поисковых систем
    },
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="ru" className={inter.className}>
            <head>
                <link rel="preconnect" href="https://images.unsplash.com" />
                <link rel="dns-prefetch" href="https://images.unsplash.com" />
                <link rel="preconnect" href="https://images.pexels.com" />
                <link rel="dns-prefetch" href="https://images.pexels.com" />
            </head>
            <body className={inter.variable}>
                <Providers>
                    <ClientOnly>
                        {children}
                        <ScrollTopButton />
                        <ConditionalFooter />
                    </ClientOnly>
                </Providers>
            </body>
        </html>
    );
}
