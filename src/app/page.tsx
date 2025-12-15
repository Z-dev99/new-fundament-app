"use client";

import { useState, useMemo, useCallback, Suspense, memo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useDeviceType } from "@/shared/hooks/useMediaQuery";

import { Navbar } from "@/widgets/navbar/ui/Navbar";
import { Marquee } from "@/widgets/marquee/Marquee";


const AdBlock = dynamic(() => import("@/widgets/adBlock/AdBlock").then(mod => ({ default: mod.AdBlock })), {
    loading: () => <div style={{ height: "420px", background: "#f0f0f0", borderRadius: "22px" }} />,
    ssr: true,
});

const SideAdBlock = dynamic(() => import("@/widgets/adBlock/SideAdBlock").then(mod => ({ default: mod.SideAdBlock })), {
    ssr: false,
});

const InlineAdBlock = dynamic(() => import("@/widgets/adBlock/InlineAdBlock").then(mod => ({ default: mod.InlineAdBlock })), {
    ssr: false,
});

const CardsList = dynamic(() => import("@/widgets/cardsList/CardsList").then(mod => ({ default: mod.CardsList })), {
    loading: () => (
        <div style={{
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f9fb",
            borderRadius: "20px"
        }}>
            <div style={{ fontSize: "16px", color: "#6b7280" }}>Загрузка карточек...</div>
        </div>
    ),
    ssr: true,
});

const AnalyticsCards = dynamic(() => import("@/widgets/analyticsCards/AnalyticsCards").then(mod => ({ default: mod.AnalyticsCards })), {
    ssr: false,
});

const FeedbackForm = dynamic(() => import("@/widgets/feedbackForm/FeedbackForm"), {
    ssr: false,
});


const PageContent = memo(function PageContent() {
    const [activeTab, setActiveTab] = useState("new-builds");
    const { isDesktop } = useDeviceType();
    const isMobile = !isDesktop;

    const adItems = useMemo(
        () => [


        ],
        []
    );

    const sideAdImages = useMemo(
        () => [
            {
                position: "left" as const,
                image: "",
            },
            {
                position: "right" as const,
                image: "",
            },
        ],
        []
    );

    const handleAdClick = useCallback(() => { }, []);

    return (
        <div>
            <Navbar />
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                {isDesktop && (
                    <Suspense fallback={null}>
                        <SideAdBlock
                            position="left"
                            title="Специальное предложение"
                            image={sideAdImages[0].image}
                            onClick={handleAdClick}
                        />
                        <SideAdBlock
                            position="right"
                            title="Акция недели"
                            image={sideAdImages[1].image}
                            onClick={handleAdClick}
                        />
                    </Suspense>
                )}
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Marquee />
                    </motion.div>

                    <Suspense fallback={<div style={{ height: "420px", background: "#f0f0f0", borderRadius: "22px", marginBottom: "32px" }} />}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ marginBottom: "32px" }}
                        >
                            <AdBlock items={adItems} />
                        </motion.div>
                    </Suspense>

                    {isMobile && (
                        <Suspense fallback={null}>
                            <InlineAdBlock
                                title="Место для вашей рекламы"
                                onClick={handleAdClick}
                            />
                        </Suspense>
                    )}

                    <Suspense fallback={<div style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>Загрузка...</div>}>
                        <CardsList activeTab={activeTab} />
                    </Suspense>

                    {isMobile && (
                        <Suspense fallback={null}>
                            <InlineAdBlock
                                title="Место для вашей рекламы"
                                onClick={handleAdClick}
                            />
                        </Suspense>
                    )}

                    <Suspense fallback={null}>
                        <AnalyticsCards />
                    </Suspense>
                    <Suspense fallback={null}>
                        <FeedbackForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
});

export default function Page() {
    return <PageContent />;
}
