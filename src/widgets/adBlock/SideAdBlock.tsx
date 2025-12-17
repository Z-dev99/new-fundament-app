"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./SideAdBlock.module.scss";

interface SideAdBlockProps {
    position: "left" | "right";
    title?: string;
    image?: string;
    onClick?: () => void;
}

export const SideAdBlock: FC<SideAdBlockProps> = ({
    position,
    title = "Место для вашей рекламы",
    image,
    onClick
}) => {

    return (
        <motion.div
            className={styles.wrapper}
            data-position={position}
            initial={{ opacity: 0, x: position === "left" ? -60 : 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
        >
            {image ? (
                <div className={styles.imageWrapper}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className={styles.image}
                        sizes="200px"
                        priority
                        unoptimized
                    />
                    <div className={styles.overlay}>
                        <div className={styles.badge}>Реклама</div>
                        {title && <p className={styles.title}>{title}</p>}
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 9h6v6H9z" />
                        </svg>
                    </div>
                    <p className={styles.title}>{title}</p>
                    <div className={styles.badge}>Реклама</div>
                </div>
            )}
        </motion.div>
    );
};











