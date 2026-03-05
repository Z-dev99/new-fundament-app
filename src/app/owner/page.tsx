"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "../moderator/styles.module.scss";
import Image from "next/image";
import { OwnerAnnouncementsBlock } from "@/widgets/OwnerAnnouncementsBlock/OwnerAnnouncementsBlock";
import { Megaphone, LogOut, Menu, X } from "lucide-react";

export default function OwnerCabinetPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const token = typeof window !== "undefined" ? Cookies.get("token") : null;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const currentToken = Cookies.get("token");
        if (!currentToken) {
            router.replace("/");
        }
    }, [mounted, router]);

    if (!mounted || !token) return null;

    const handleLogout = () => {
        Cookies.remove("token");
        router.replace("/");
    };

    const activeTabTitle = "Мои объявления";

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
                    <button
                        className={`${styles.navItem} ${styles.active}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className={styles.icon}>
                            <Megaphone size={20} />
                        </span>
                        <span className={styles.tabText}>{activeTabTitle}</span>
                    </button>
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
                <h1 className={styles.pageTitle}>{activeTabTitle}</h1>
                <OwnerAnnouncementsBlock />
            </main>
        </div>
    );
}

