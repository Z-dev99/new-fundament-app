"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import styles from "./InlineAdBlock.module.scss";
import { useGetBannerByTypeQuery } from "@/shared/api/bannersApi";
import Image from "next/image";

interface InlineAdBlockProps {
    title?: string;
    onClick?: () => void;
}

// Утилита для получения URL изображения
const getImageUrl = (fileName: string): string => {
    return `https://fundament.uz/img/${fileName}`;
};

// Placeholder изображение в формате SVG (серый фон)
const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export const InlineAdBlock: FC<InlineAdBlockProps> = ({ 
    title = "Место для вашей рекламы",
    onClick 
}) => {
    const { data: middleBanners = [] } = useGetBannerByTypeQuery("MIDDLE_SIDE");
    const banner = middleBanners[0];

    return (
        <motion.div
            className={styles.wrapper}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={onClick}
        >
            {banner ? (
                <div className={styles.bannerContent}>
                    <Image
                        src={getImageUrl(banner.file_name)}
                        alt={title}
                        fill
                        className={styles.bannerImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                    />
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.icon}>
                        <svg
                            width="40"
                            height="40"
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





