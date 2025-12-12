"use client";

import { useState } from "react";
import styles from "./Navbar.module.scss";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CitySelect } from "./CitySelect";
import { ContactModal } from "@/widgets/modal/ContactModal";
import { PhoneCall, Menu, X } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <motion.header className={styles.navbar}>
                <div >
                    <div className={styles.inner}>

                        <div className={styles.logoBlock}>
                            <Link href="/" className={styles.logo} onClick={closeMenu}>
                                <Image
                                    src="/logos/logo.svg"
                                    alt="Fundament logo"
                                    width={140}
                                    height={60}
                                />
                            </Link>
                        </div>

                        <nav className={styles.navLinks}>
                            <Link href="/">Главная</Link>
                            <Link href="/contacts">Контакты</Link>
                            <Link href="/reviews">Отзывы</Link>
                        </nav>

                        <div className={styles.rightSide}>
                            {/* <div className={styles.cityDesktop}>
                                <CitySelect />
                            </div> */}
                            <motion.button
                                className={styles.requestDesktop}
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.03 }}
                                onClick={() => setModalOpen(true)}
                            >
                                Подать заявку
                            </motion.button>
                            <button
                                className={styles.burger}
                                onClick={() => setMenuOpen((prev) => !prev)}
                            >
                                {menuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>


                        </div>
                    </div>

                    <div className={styles.cityMobile}>
                        <CitySelect />
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        className={styles.mobileMenu}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Link href="/" onClick={closeMenu}>Главная</Link>
                        <Link href="/contacts" onClick={closeMenu}>Контакты</Link>
                        <Link href="/reviews" onClick={closeMenu}>Отзывы</Link>

                        <button
                            className={styles.mobileBtn}
                            onClick={() => {
                                setModalOpen(true);
                                closeMenu();
                            }}
                        >
                            Подать заявку
                        </button>
                    </motion.nav>
                )}
            </AnimatePresence>

            <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};
