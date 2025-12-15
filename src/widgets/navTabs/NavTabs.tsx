"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "./NavTabs.module.scss";

export type NavItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
};

type Props = {
    items: NavItem[];
    active: string;
    onChange: (id: string) => void;
    className?: string;
};

const NavTabs: React.FC<Props> = ({ items, active, onChange, className }) => {
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        if (swiperRef.current) {
            const index = items.findIndex((item) => item.id === active);
            if (index !== -1) {
                swiperRef.current.slideTo(index, 300);
            }
        }
    }, [active, items]);

    const handleClick = useCallback(
        (id: string) => {
            onChange(id);
        },
        [onChange]
    );

    return (
        <div className={`${styles.wrapper} container ${className || ""}`}>
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                spaceBetween={12}
                slidesPerView="auto"
                freeMode={true}
                modules={[FreeMode]}
                className={styles.swiper}
            >
                {items.map((item) => {
                    const isActive = active === item.id;
                    return (
                        <SwiperSlide key={item.id} className={styles.slide}>
                            <button
                                type="button"
                                className={`${styles.item} ${isActive ? styles.active : ""}`}
                                onClick={() => handleClick(item.id)}
                                aria-pressed={isActive}
                                aria-label={item.label}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                                {item.badge !== undefined && (
                                    <span className={styles.badge}>{item.badge}</span>
                                )}
                                {isActive && <span className={styles.activeIndicator} />}
                            </button>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default NavTabs;
