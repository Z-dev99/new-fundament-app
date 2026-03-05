"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// import { CitySelect } from "./CitySelect";
import { ContactModal } from "@/widgets/modal/ContactModal";
import { AddAnnouncementModal } from "@/widgets/modal/AddAnnouncementModal";
import { OwnerAuthModal } from "@/widgets/modal/OwnerAuthModal";
import { Menu, X, Home, Phone, MessageSquare, FileText, Plus, LogIn, User } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

const navItems = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/contacts", label: "Контакты", icon: Phone },
    { href: "/reviews", label: "Отзывы", icon: MessageSquare },
];

export const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setMenuOpen(false);

    // Проверяем авторизацию
    useEffect(() => {
        setIsAuthenticated(!!Cookies.get("token"));
    }, []);

    // Закрываем меню при изменении роута
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Блокируем скролл при открытом мобильном меню
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    return (
        <>
            <motion.header
                className={styles.navbar}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.container}>
                    <div className={styles.inner}>
                        <div className={styles.logoBlock}>
                            <Link href="/" className={styles.logo} onClick={closeMenu}>
                                <Image
                                    src="/logos/logo.svg"
                                    alt="Fundament logo"
                                    width={140}
                                    height={60}
                                    priority
                                />
                            </Link>
                        </div>

                        <nav className={styles.navLinks}>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <motion.div
                                        key={item.href}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                                        >
                                            <Icon size={18} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        <div className={styles.rightSide}>
                            <motion.button
                                className={styles.requestDesktop}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setModalOpen(true)}
                            >
                                <FileText size={18} />
                                <span>Подать заявку</span>
                            </motion.button>

                            {isAuthenticated ? (
                                <Link href="/owner" className={styles.authBtn}>
                                    <User size={18} />
                                    <span>Личный кабинет</span>
                                </Link>
                            ) : (
                                <motion.button
                                    className={styles.authBtn}
                                    whileTap={{ scale: 0.95 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setAuthModalOpen(true)}
                                >
                                    <LogIn size={18} />
                                    <span>Войти</span>
                                </motion.button>
                            )}

                            <button
                                className={styles.burger}
                                onClick={() => setMenuOpen((prev) => !prev)}
                                aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                                aria-expanded={menuOpen}
                            >
                                <AnimatePresence mode="wait">
                                    {menuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X size={28} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu size={28} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    {/* <div className={styles.cityMobile}>
                        <CitySelect />
                    </div> */}
                </div>
            </motion.header>

            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            className={styles.mobileOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={closeMenu}
                        />
                        <motion.nav
                            className={styles.mobileMenu}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <div className={styles.mobileMenuHeader}>
                                <div className={styles.mobileMenuHeaderContent}>
                                    <h3>Меню</h3>
                                    <button
                                        className={styles.closeButton}
                                        onClick={closeMenu}
                                        aria-label="Закрыть меню"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.mobileNavLinks}>
                                {navItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`${styles.mobileNavLink} ${isActive ? styles.active : ""}`}
                                            onClick={closeMenu}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={styles.mobileNavLinkContent}
                                            >
                                                <div className={styles.iconWrapper}>
                                                    <Icon size={20} />
                                                </div>
                                                <span>{item.label}</span>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Кнопка добавления объявления отключена */}
                            <motion.button
                                className={styles.mobileBtn}
                                onClick={() => {
                                    setModalOpen(true);
                                    closeMenu();
                                }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <FileText size={20} />
                                <span>Подать заявку</span>
                            </motion.button>

                            {isAuthenticated ? (
                                <Link
                                    href="/owner"
                                    className={styles.mobileBtn}
                                    onClick={closeMenu}
                                >
                                    <User size={20} />
                                    <span>Личный кабинет</span>
                                </Link>
                            ) : (
                                <motion.button
                                    className={styles.mobileBtn}
                                    onClick={() => {
                                        setAuthModalOpen(true);
                                        closeMenu();
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <LogIn size={20} />
                                    <span>Войти</span>
                                </motion.button>
                            )}
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>

            <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
            {/* Модалка добавления объявления отключена вместе с кнопкой */}
            <OwnerAuthModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onAuthSuccess={() => setIsAuthenticated(true)}
            />
        </>
    );
};