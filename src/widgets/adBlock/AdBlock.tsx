"use client";

import { FC } from "react";
import styles from "./AdBlock.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface AdItem {
    id: number;
    image: string;
    title?: string;
    text?: string;
}

interface AdBlockProps {
    items: AdItem[];
}

export const AdBlock: FC<AdBlockProps> = ({ items }) => {
    return (
        <div className={`${styles.wrapper} container`} style={{ marginTop: "20px" }}>
            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView="auto"
                centeredSlides
                spaceBetween={24}
                loop
                autoplay={{ delay: 2000, disableOnInteraction: true }}
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id} className={styles.slideWrapper}>
                        <div className={styles.slide}>
                            <img src={item.image} alt="" />

                            {(item.title || item.text) && (
                                <div className={styles.content}>
                                    {item.title && <h3>{item.title}</h3>}
                                    {item.text && <p>{item.text}</p>}
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
