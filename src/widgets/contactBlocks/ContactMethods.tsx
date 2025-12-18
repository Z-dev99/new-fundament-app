"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone, ExternalLink } from "lucide-react";
import styles from "./ContactBlocks.module.scss";

export const ContactMethods = () => {
    const methods = [
        {
            icon: <Mail size={24} />,
            title: "Email",
            description: "Напишите нам на почту",
            value: "info@fundament.uz",
            link: "mailto:info@fundament.uz",
            color: "#ff6b6b",
        },
        {
            icon: <MessageCircle size={24} />,
            title: "WhatsApp",
            description: "Быстрая связь через WhatsApp",
            value: "+998 90 123 45 67",
            link: "https://wa.me/998901234567",
            color: "#25D366",
        },
        {
            icon: <Phone size={24} />,
            title: "Telegram",
            description: "Пишите в Telegram",
            value: "@fundament_support",
            link: "https://t.me/fundament_support",
            color: "#0088cc",
        },
    ];

    return (
        <motion.div
            className={styles.contactMethods}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h3 className={styles.sectionTitle}>Другие способы связи</h3>
            <p className={styles.sectionDescription}>
                Выберите удобный для вас способ связи — мы всегда готовы помочь!
            </p>
            <div className={styles.methodsGrid}>
                {methods.map((method, index) => (
                    <motion.a
                        key={index}
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.methodCard}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ "--method-color": method.color } as React.CSSProperties}
                    >
                        <div className={styles.methodIcon} style={{ background: `${method.color}15`, color: method.color }}>
                            {method.icon}
                        </div>
                        <div className={styles.methodContent}>
                            <h4 className={styles.methodTitle}>{method.title}</h4>
                            <p className={styles.methodDescription}>{method.description}</p>
                            <div className={styles.methodValue}>
                                {method.value}
                                <ExternalLink size={14} className={styles.externalIcon} />
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
};





