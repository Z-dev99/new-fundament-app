"use client";

import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../shared/styles/globals.css";
import { Providers } from "./providers";
import ClientOnly from "./ClientOnly";
import ScrollTopButton from "@/widgets/ScrollTopButton";
import { Footer } from "@/widgets/Footer/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const pathname = usePathname();

    const showFooter = pathname !== "/moderator";

    return (
        <html lang="ru" className={inter.className}>
            <body>
                <Providers>
                    <ClientOnly>
                        {children}
                        <ScrollTopButton />
                        {showFooter && <Footer />}
                    </ClientOnly>
                </Providers>
            </body>
        </html>
    );
}
