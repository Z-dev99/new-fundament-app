"use client";

import { Navbar } from "@/widgets/navbar/ui/Navbar";
import styles from "./Property.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import "swiper/css";
import "swiper/css/thumbs";
import Image from "next/image";

export default function PropertyPage() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const images = [
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
        "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
        "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
        "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg",
        "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg",
        "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg",
        "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg",
        "https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg",
    ];

    return (
        <>
            <Navbar />

            <section className={styles.page}>
                <div className="container" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    {/* Левый блок: галерея + описание */}
                    <div className={styles.leftBlock} style={{ flex: 1, minWidth: '320px' }}>
                        <div className={styles.gallery}>
                            <Swiper
                                spaceBetween={10}
                                thumbs={{ swiper: thumbsSwiper }}
                                className={styles.mainSlider}
                                style={{ borderRadius: '18px', overflow: 'hidden' }}
                            >
                                {images.map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <Image
                                            src={img}
                                            alt=""
                                            width={900}
                                            height={600}
                                            className={styles.mainImage}
                                            style={{ borderRadius: '18px' }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <Swiper
                                spaceBetween={10}
                                slidesPerView={4}
                                watchSlidesProgress
                                className={styles.thumbs}
                                style={{ marginTop: '12px' }}
                            >
                                {images.map((img, i) => (
                                    <SwiperSlide key={i} className={styles.thumbSlide}>
                                        <Image
                                            src={img}
                                            alt=""
                                            width={200}
                                            height={150}
                                            className={styles.thumbImage}
                                            style={{ borderRadius: '12px', cursor: 'pointer' }}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <div className={styles.description} style={{ marginTop: '20px' }}>
                            <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
                                3-комнатная квартира в Чиланзаре
                            </h1>
                            <p style={{ color: '#666', fontSize: '16px', lineHeight: 1.5 }}>
                                Просторная квартира с ремонтом. Тихий двор, рядом школы, метро,
                                парки. Все коммуникации подключены. Окна выходят на солнечную сторону.
                            </p>
                        </div>

                        <div className={styles.params} style={{ marginTop: '24px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Параметры</h2>
                            <ul style={{ listStyle: 'none', padding: 0, color: '#444' }}>
                                <li><strong>Этаж:</strong> 4 / 9</li>
                                <li><strong>Площадь:</strong> 78 м²</li>
                                <li><strong>Кухня:</strong> 12 м²</li>
                                <li><strong>Тип строения:</strong> Панельный</li>
                                <li><strong>Комнаты:</strong> 3</li>
                                <li><strong>Отопление:</strong> Центральное</li>
                            </ul>
                        </div>
                    </div>

                    {/* Правый блок: контакты + карта */}
                    <div className={styles.rightBlock} style={{ width: '360px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className={styles.ownerCard} style={{ background: '#fff', borderRadius: '18px', padding: '16px', boxShadow: '0 6px 20px rgba(255, 140, 80, 0.15)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Контакты владельца</h2>
                            <div className={styles.ownerInfo} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                <strong>Александр</strong>
                                <span>Собственник</span>
                            </div>
                            <a
                                href="tel:+998909999999"
                                className={styles.callBtn}
                                style={{
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    border: '2px solid rgba(0,0,0,0.15)',
                                    color: '#222',
                                    cursor: 'pointer',
                                    transition: '0.25s'
                                }}
                                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255, 106, 92, 0.15)')}
                                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                            >
                                Позвонить владельцу
                            </a>
                        </div>

                        <div className={styles.map} style={{ borderRadius: '18px', overflow: 'hidden', height: '280px' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18..."
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                style={{ width: '100%', height: '100%', border: 0 }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
