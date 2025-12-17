"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/widgets/Footer/Footer";

export function ConditionalFooter() {
    const pathname = usePathname();
    const showFooter = pathname !== "/moderator";

    if (!showFooter) return null;

    return <Footer />;
}








