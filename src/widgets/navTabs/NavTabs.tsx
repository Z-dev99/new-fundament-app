"use client";

import React, { useRef, useEffect } from "react";
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
};

type Props = {
    items: NavItem[];
    active: string;
    onChange: (id: string) => void;
};

const NavTabs: React.FC<Props> = ({ items, active, onChange }) => {
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        if (swiperRef.current) {
            const index = items.findIndex((item) => item.id === active);
            if (index !== -1) {
                swiperRef.current.slideTo(index);
            }
        }
    }, [active, items]);

    return (
        <div className={`${styles.wrapper} container`}>
            <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                spaceBetween={10}
                slidesPerView="auto"
                freeMode={true}
                modules={[FreeMode]}
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id} style={{ width: "auto" }}>
                        <button
                            className={`${styles.item} ${active === item.id ? styles.active : ""
                                }`}
                            onClick={() => onChange(item.id)}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default NavTabs;
