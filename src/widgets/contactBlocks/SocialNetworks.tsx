"use client";

import { motion } from "framer-motion";
import { Instagram, Send } from "lucide-react";
import styles from "./ContactBlocks.module.scss";

export const SocialNetworks = () => {
    const socials = [
        {
            icon: <Instagram size={24} />,
            name: "Instagram",
            link: "https://instagram.com/fundament",
            color: "#E4405F",
        },
        {
            icon: <Send size={24} />,
            name: "Telegram",
            link: "https://t.me/fundament",
            color: "#0088cc",
        },
    ];

    return (
        <motion.div
            className={styles.socialNetworks}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <h3 className={styles.sectionTitle}>Мы в социальных сетях</h3>
            <p className={styles.sectionDescription}>
                Следите за новостями и акциями в наших социальных сетях
            </p>
            <div className={styles.socialsGrid}>
                {socials.map((social, index) => (
                    <motion.a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialCard}
                        whileHover={{ y: -8, scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        style={{ "--social-color": social.color } as React.CSSProperties}
                    >
                        <div className={styles.socialIcon} style={{ background: `${social.color}15`, color: social.color }}>
                            {social.icon}
                        </div>
                        <span className={styles.socialName}>{social.name}</span>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
};


