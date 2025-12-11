"use client";

import Link from "next/link";
import Image from "next/image";
import { FaTelegram, FaWhatsapp, FaVk, FaInstagram } from "react-icons/fa";
import styles from "./styles.module.scss";
import NavLink from "../NavLink/NavLink";

const socialLinks = [
    { href: "https://t.me/", label: "Telegram", Icon: FaTelegram, color: "#0088cc" },
    { href: "https://instagram.com/", label: "Instagram", Icon: FaInstagram, color: "#E4405F" },
];

const paymentLogos: PaymentLogo[] = [
    { src: "/icons/humo.png", alt: "HUMO", width: 70, height: 40 },
    { src: "/icons/uzcard.png", alt: "Uzcard", width: 70, height: 40 },
];

paymentLogos.forEach((logo) => {
    if (typeof window !== "undefined") {
        const img = new window.Image();
        img.src = logo.src;
    }
});

interface SocialLink {
    href: string;
    label: string;
    Icon: React.ComponentType<{ color?: string; size?: number }>;
    color: string;
}

interface PaymentLogo {
    src: string;
    alt: string;
    width: number;
    height: number;
}


export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.left}>
                        <NavLink href="/" className={styles.logo}>
                            <Image src="/logos/logo.svg" alt="Логотип" width={160} height={36} priority />
                        </NavLink>

                        <p className={styles.text}>
                            Платформа прямого размещения.
                            <br /> От владельцев.
                            <br /> Без посредников.
                        </p>

                        <p className={styles.copy}>© 2025 Fundament. Все права защищены.</p>
                    </div>

                    <div className={styles.right}>
                        <div className={styles.column}>
                            <h4>Социальные сети</h4>
                            {socialLinks.map(({ href, label, Icon, color }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                                    <Icon color={color} size={18} /> {label}
                                </a>
                            ))}
                        </div>

                        <div className={styles.column}>
                            <h4>Мы принимаем</h4>
                            <div className={styles.payments}>
                                {paymentLogos.map(({ src, alt, width, height }) => (
                                    <Image
                                        key={alt}
                                        src={src}
                                        alt={alt}
                                        width={width}
                                        height={height}
                                        className={styles.paymentLogo}
                                        loading="lazy"
                                        quality={90}
                                        placeholder="blur"
                                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgLz4="
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
