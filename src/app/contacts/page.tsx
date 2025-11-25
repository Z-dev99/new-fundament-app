"use client";

import styles from "./styles.module.scss";
import { MessageCircle, Users, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";
import RootLayout from "../layout";
import { Navbar } from "@/widgets/navbar/ui/Navbar";

const contacts = [
    {
        id: 1,
        title: "Бесплатная консультация",
        phone: "+998887556556",
        tg: "https://t.me/example",
        icon: <MessageCircle className={styles.iconYellow} />,
    },
    {
        id: 2,
        title: "Корпоративным клиентам",
        phone: "+998887556556",
        tg: "https://t.me/example",
        icon: <Users className={styles.iconBlue} />,
    },
    {
        id: 3,
        title: "Предложения о сотрудничестве",
        phone: "+998887556556",
        tg: "https://t.me/example",
        icon: <Zap className={styles.iconPurple} />,
    },
];

const addresses = [
    {
        id: 1,
        title: "Филиал Ташкент",
        address: "г. Ташкент, ул. Мукими, д. 100",
        mapUrl:
            "https://yandex.uz/map-widget/v1/?ll=69.233924%2C41.285915&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNTIyNTA5OTc3Ei5Pyrt6YmVraXN0b24sIFRvc2hrZW50LCBNdXFpbWl5IGtvyrtjaGFzaSwgMTAwIgoNIneKQhVnJSVC&z=17.2",
    },
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.2 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ContactsPage() {
    return (
        <div>
            <Navbar />
            <motion.section
                className={styles.section}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className={styles.container}>
                    <motion.h1 className={styles.title} variants={fadeUp}>
                        Контактная информация
                    </motion.h1>

                    <motion.p className={styles.subtitle} variants={fadeUp}>
                        Вы можете связаться с нами, если у вас есть вопросы или предложения :)
                    </motion.p>

                    <motion.div className={styles.cards} variants={containerVariants}>
                        {contacts.map((item) => (
                            <motion.div key={item.id} className={styles.card} variants={fadeUp}>
                                <div className={styles.icon}>{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>
                                    <strong>Телефон:</strong> {item.phone}
                                </p>
                                <a href={item.tg} target="_blank" className={styles.btn}>
                                    Написать в Telegram
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div className={styles.addressSection} variants={containerVariants}>
                        <motion.h2 variants={fadeUp}>Наши адреса</motion.h2>
                        <motion.div className={styles.addresses} variants={containerVariants}>
                            {addresses.map((a) => (
                                <motion.div key={a.id} className={styles.addressCard} variants={fadeUp}>
                                    {a.mapUrl && (
                                        <div style={{ width: "100%", height: "250px", position: "relative" }}>
                                            <iframe
                                                src={a.mapUrl}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0, position: "absolute", top: 0, left: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h3>{a.title}</h3>
                                        <p>{a.address}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}
