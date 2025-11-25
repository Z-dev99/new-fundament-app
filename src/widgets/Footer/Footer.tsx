"use client";

import Link from "next/link";
import Image from "next/image";
import { FaTelegram, FaWhatsapp, FaVk, FaInstagram } from "react-icons/fa";

import styles from "./styles.module.scss";
import NavLink from "../NavLink/NavLink";

const socialLinks = [
    { href: "https://t.me/", label: "Telegram", icon: <FaTelegram color="#0088cc" /> },
    { href: "https://wa.me/", label: "WhatsApp", icon: <FaWhatsapp color="#25D366" /> },
    { href: "https://vk.com/", label: "ВКонтакте", icon: <FaVk color="#4c75a3" /> },
    { href: "https://instagram.com/", label: "Instagram", icon: <FaInstagram color="#E4405F" /> },
];

const paymentLogos = [
    { src: "/icons/humo.png", alt: "HUMO" },
    { src: "/icons/uzcard.png", alt: "Uzcard" },
];

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <NavLink href="/" className={styles.logo}>
                        <Image
                            src="/logos/logo.svg"
                            alt="Логотип"
                            width={160}
                            height={36}
                            priority
                            style={{ height: "auto", width: "160px" }}
                        />
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
                        {socialLinks.map(({ href, label, icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {icon} {label}
                            </a>
                        ))}
                    </div>

                    <div className={styles.column}>
                        <h4>Мы принимаем</h4>
                        <div className={styles.payments}>
                            {paymentLogos.map(({ src, alt }) => (
                                <Image
                                    key={alt}
                                    src={src}
                                    alt={alt}
                                    width={70}
                                    height={40}
                                    className={styles.paymentLogo}
                                    priority={false}
                                    style={{ height: "auto", width: "70px" }}

                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};
