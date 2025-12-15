"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    Phone,
    Mail,
    MapPin,
    Send,
    Instagram,
    MessageCircle,
    Shield,
    TrendingUp,
    Home,
    FileText,
    Users,
} from "lucide-react";
import styles from "./styles.module.scss";
import NavLink from "../NavLink/NavLink";

const socialLinks = [
    {
        href: "https://t.me/",
        label: "Telegram",
        icon: Send,
        color: "#0088cc",
    },
    {
        href: "https://instagram.com/",
        label: "Instagram",
        icon: Instagram,
        color: "#E4405F",
    },
];

const navigationLinks = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/contacts", label: "Контакты", icon: Phone },
    { href: "/reviews", label: "Отзывы", icon: FileText },
];

const paymentLogos = [
    { src: "/icons/humo.png", alt: "HUMO", width: 70, height: 40 },
    { src: "/icons/uzcard.png", alt: "Uzcard", width: 70, height: 40 },
    { src: "/icons/visa.svg", alt: "Visa", width: 70, height: 40 },
    { src: "/icons/mc.svg", alt: "Mastercard", width: 70, height: 40 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            className={styles.footer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            <div className={styles.wave} />
            <div className="container">
                <div className={styles.content}>
                    <motion.div className={styles.left} >
                        <NavLink href="/" className={styles.logo}>
                            <Image
                                src="/logos/logo.svg"
                                alt="Логотип Fundament"
                                width={180}
                                height={40}
                                priority
                            />
                        </NavLink>

                        <p className={styles.description}>
                            Платформа прямого размещения недвижимости.
                            <br />
                            От владельцев. Без посредников.
                        </p>

                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <Phone size={18} />
                                <a href="tel:+998887556556">+998 88 755-65-56</a>
                            </div>
                            <div className={styles.contactItem}>
                                <Mail size={18} />
                                <a href="mailto:info@fundament.uz">info@fundament.uz</a>
                            </div>
                            <div className={styles.contactItem}>
                                <MapPin size={18} />
                                <span>Ташкент, Узбекистан</span>
                            </div>
                        </div>

                        <div className={styles.socialLinks}>
                            {socialLinks.map(({ href, label, icon: Icon, color }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ "--social-color": color } as React.CSSProperties}
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div className={styles.right} >
                        <div className={styles.column}>
                            <h4 className={styles.columnTitle}>
                                <TrendingUp size={18} />
                                Навигация
                            </h4>
                            <nav className={styles.nav}>
                                {navigationLinks.map(({ href, label, icon: Icon }) => (
                                    <Link key={href} href={href} className={styles.navLink}>
                                        <Icon size={16} />
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className={styles.column}>
                            <h4 className={styles.columnTitle}>
                                <Shield size={18} />
                                Мы принимаем
                            </h4>
                            <div className={styles.payments}>
                                {paymentLogos.map(({ src, alt, width, height }) => (
                                    <motion.div
                                        key={alt}
                                        className={styles.paymentItem}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Image
                                            src={src}
                                            alt={alt}
                                            width={width}
                                            height={height}
                                            className={styles.paymentLogo}
                                            loading="lazy"
                                            quality={90}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>

                <motion.div
                    className={styles.bottom}
                >
                    <div className={styles.divider} />
                    <div className={styles.bottomContent}>
                        <p className={styles.copyright}>
                            © {currentYear} Fundament. Все права защищены.
                        </p>

                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};
