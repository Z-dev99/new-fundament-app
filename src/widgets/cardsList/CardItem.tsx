import React from "react";
import styles from "./CardItem.module.css";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination } from "swiper/modules";

interface Props {
    id: string | number;     // ← Добавили ID
    title: string;
    price: string;
    address: string;
    rooms: string;
    area: string;
    images: string[];
}

export const CardItem: React.FC<Props> = ({
    id,
    title,
    price,
    address,
    rooms,
    area,
    images,
}) => {
    return (
        <Link href={`/property/${id}`} className={styles.cardLink}>
            <div className={styles.card}>
                <div className={styles.imageWrap}>
                    <Swiper
                        pagination={{ clickable: true }}
                        navigation={false}
                        spaceBetween={0}
                        slidesPerView={1}
                        modules={[Pagination]}
                        style={{ width: "100%", height: "100%" }}
                    >
                        {images.map((src, i) => (
                            <SwiperSlide key={i}>
                                <img src={src} alt={title} className={styles.image} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        className={styles.favorite}
                        onClick={(e) => {
                            e.preventDefault(); 
                        }}
                    >
                        ♡
                    </button>
                </div>

                <div className={styles.body}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.price}>{price}</div>

                    <div className={styles.info}>
                        {address}
                        <br />
                        {rooms} комнаты • {area} м²
                    </div>

                    <button
                        className={styles.phoneBtn}
                        onClick={(e) => {
                            e.preventDefault(); 
                            alert("Телефон: +998 ** *** ** **");
                        }}
                    >
                        Показать телефон
                    </button>
                </div>
            </div>
        </Link>
    );
};
