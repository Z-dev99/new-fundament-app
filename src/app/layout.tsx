import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "../shared/styles/globals.css";
import { Providers } from "./providers";
import ClientOnly from "./ClientOnly";
import ScrollTopButton from "@/widgets/ScrollTopButton";
import { Footer } from "@/widgets/Footer/Footer";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="ru" className={inter.className}>
            <body>
                <Providers>
                    <ClientOnly>{children}
                        <ScrollTopButton />
                        <Footer />
                    </ClientOnly>
                </Providers>
            </body>
        </html>
    );
}
