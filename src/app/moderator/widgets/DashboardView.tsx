"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import styles from "../styles.module.scss";
import Image from "next/image";
import AnalyticsBlock from "@/widgets/AnalyticsBlock/AnalyticsBlock";
import { SupportCards } from "@/widgets/Support/SupportCards";
import { LeadRequests } from "@/widgets/LeadRequests/LeadRequests";
import { ModeratorReviews } from "@/widgets/ModeratorReviews/ModeratorReviews";

interface DashboardViewProps {
    onLogout: () => void;
}

export default function DashboardView({ onLogout }: DashboardViewProps) {
    const [activeTab, setActiveTab] = useState("Объявления");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const tabs = [
        { title: "Объявления", icon: "📢" },
        { title: "Заявки пользователей", icon: "👥" },
        { title: "Обратная связь", icon: "✉️" },
        { title: "Баннеры", icon: "🖼️" },
        { title: "Аналитика", icon: "📊" },
        { title: "Отзывы", icon: "" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "Объявления":
                return <p>Здесь отображаются все объявления</p>;
            case "Заявки пользователей":
                return <LeadRequests />;
            case "Обратная связь":
                return <SupportCards />;
            case "Баннеры":
                return <p>Управление баннерами на сайте</p>;
            case "Аналитика":
                return <AnalyticsBlock />;
            case "Отзывы":
                return <ModeratorReviews />;
            default:
                return <p>Добро пожаловать в Dashboard</p>;
        }
    };

    const handleLogout = () => {
        Cookies.remove("token");
        onLogout();
    };

    return (
        <div className={styles.dashboard}>
            <div
                className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.active : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
                <div className={styles.sidebarHeader}>
                    <Image
                        src="/logos/logo.svg"
                        alt="Логотип"
                        width={140}
                        height={60}
                        className={styles.logoImg}
                    />
                    <button
                        className={styles.close}
                        onClick={() => setSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <nav className={styles.nav}>
                    {tabs.map((tab) => (
                        <div
                            key={tab.title}
                            className={`${styles.navItem} ${activeTab === tab.title ? styles.active : ""}`}
                            onClick={() => { setActiveTab(tab.title); setSidebarOpen(false); }}
                        >
                            <span className={styles.icon}>{tab.icon}</span>
                            <span className={styles.tabText}>{tab.title}</span>
                        </div>
                    ))}
                </nav>

                <button className={styles.logout} onClick={handleLogout}>
                    🚪 Выйти
                </button>
            </aside>

            <div className={`${styles.burger} ${sidebarOpen ? styles.hidden : ""} ${styles.mobileHeader}`}>
                <button
                    className={`${styles.burger} ${sidebarOpen ? styles.hidden : ""}`}
                    onClick={() => setSidebarOpen(true)}
                >
                    ☰
                </button>
                <Image
                    src="/logos/logo.svg"
                    alt="Логотип"
                    width={140}
                    height={40}
                    className={styles.logoImg}
                />
            </div>

            <main className={`${styles.content} ${sidebarOpen ? styles.blur : ""}`}>
                <h1>{activeTab}</h1>
                {renderTabContent()}
            </main>
        </div>
    );
}
