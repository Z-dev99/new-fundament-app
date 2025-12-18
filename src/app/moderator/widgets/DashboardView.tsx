"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import styles from "../styles.module.scss";
import Image from "next/image";
import AnalyticsBlock from "@/widgets/AnalyticsBlock/AnalyticsBlock";
import { SupportCards } from "@/widgets/Support/SupportCards";
import { LeadRequests } from "@/widgets/LeadRequests/LeadRequests";
import { ModeratorReviews } from "@/widgets/ModeratorReviews/ModeratorReviews";
import { PublishedReviews } from "@/widgets/ModeratorReviews/PublishedReviews";
import { BannersBlock } from "@/widgets/bannersBlock/BannersBlock";
import { AnnouncementsBlock } from "@/widgets/AnnouncementsBlock/AnnouncementsBlock";
import { 
    Megaphone, 
    Users, 
    Mail, 
    Image as ImageIcon, 
    BarChart3, 
    MessageSquare,
    LogOut,
    Menu,
    X
} from "lucide-react";

interface DashboardViewProps {
    onLogout: () => void;
}

export default function DashboardView({ onLogout }: DashboardViewProps) {
    const [activeTab, setActiveTab] = useState("Объявления");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const tabs = [
        { title: "Объявления", icon: <Megaphone size={20} /> },
        { title: "Заявки пользователей", icon: <Users size={20} /> },
        { title: "Обратная связь", icon: <Mail size={20} /> },
        { title: "Баннеры", icon: <ImageIcon size={20} /> },
        { title: "Аналитика", icon: <BarChart3 size={20} /> },
        { title: "Отзывы", icon: <MessageSquare size={20} /> },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "Объявления":
                return <AnnouncementsBlock />;
            case "Заявки пользователей":
                return <LeadRequests />;
            case "Обратная связь":
                return <SupportCards />;
            case "Баннеры":
                return <BannersBlock />;
            case "Аналитика":
                return <AnalyticsBlock />;
            case "Отзывы":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                        <ModeratorReviews />
                        <PublishedReviews />
                    </div>
                );
            default:
                return (
                    <div className={styles.emptyTab}>
                        <BarChart3 size={48} />
                        <h3>Добро пожаловать в Dashboard</h3>
                        <p>Выберите раздел в меню</p>
                    </div>
                );
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
                        aria-label="Закрыть меню"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className={styles.nav}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.title}
                            className={`${styles.navItem} ${activeTab === tab.title ? styles.active : ""}`}
                            onClick={() => { 
                                setActiveTab(tab.title); 
                                setSidebarOpen(false); 
                            }}
                        >
                            <span className={styles.icon}>{tab.icon}</span>
                            <span className={styles.tabText}>{tab.title}</span>
                        </button>
                    ))}
                </nav>

                <button className={styles.logout} onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Выйти</span>
                </button>
            </aside>

            <div className={`${styles.mobileHeader} ${sidebarOpen ? styles.hidden : ""}`}>
                <button
                    className={styles.burger}
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Открыть меню"
                >
                    <Menu size={28} />
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
                <h1 className={styles.pageTitle}>{activeTab}</h1>
                {renderTabContent()}
            </main>
        </div>
    );
}