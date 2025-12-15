"use client";

import styles from "./styles.module.scss";
import { MessageCircle, Users, Zap, Phone, MapPin, Send, ExternalLink } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Navbar } from "@/widgets/navbar/ui/Navbar";

const contacts = [
    {
        id: 1,
        title: "Бесплатная консультация",
        phone: "+998887556556",
        tg: "https://t.me/example",
        icon: MessageCircle,
        gradient: "gradient1",
        description: "Получите бесплатную консультацию по недвижимости",
    },
    {
        id: 2,
        title: "Корпоративным клиентам",
        phone: "+998887556556",
        tg: "https://t.me/example",
        icon: Users,
        gradient: "gradient2",
        description: "Специальные условия для корпоративных клиентов",
    },
    {
        id: 3,
        title: "Предложения о сотрудничестве",
        phone: "+998887556556",
        tg: "https://t.me/example",
        icon: Zap,
        gradient: "gradient3",
        description: "Предложите нам сотрудничество или партнерство",
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
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("998")) {
        return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
    }
    return phone;
};

export default function ContactsPage() {
    return (
        <div className={styles.page}>
            <Navbar />
            <motion.section
                className={styles.section}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className={styles.container}>
                    <motion.div className={styles.header} variants={fadeUp}>
                        <motion.h1
                            className={styles.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Контактная информация
                        </motion.h1>
                        <motion.p
                            className={styles.subtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Вы можете связаться с нами, если у вас есть вопросы или предложения
                        </motion.p>
                    </motion.div>

                    <motion.div className={styles.cards} variants={containerVariants}>
                        {contacts.map((item) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    className={`${styles.card} ${styles[item.gradient]}`}
                                    variants={fadeUp}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.iconWrapper}>
                                            <Icon size={28} />
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p className={styles.description}>{item.description}</p>
                                    </div>

                                    <div className={styles.cardContent}>
                                        <a
                                            href={`tel:${item.phone}`}
                                            className={styles.phoneLink}
                                        >
                                            <Phone size={18} />
                                            <span>{formatPhone(item.phone)}</span>
                                        </a>
                                    </div>

                                    <a
                                        href={item.tg}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.btn}
                                    >
                                        <Send size={18} />
                                        <span>Написать в Telegram</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <motion.div className={styles.addressSection} variants={containerVariants}>
                        <motion.div className={styles.addressHeader} variants={fadeUp}>
                            <div className={styles.addressIcon}>
                                <MapPin size={32} />
                            </div>
                            <h2>Наши адреса</h2>
                            <p>Приходите к нам в офис или свяжитесь с нами онлайн</p>
                        </motion.div>

                        <motion.div className={styles.addresses} variants={containerVariants}>
                            {addresses.map((a) => (
                                <motion.div
                                    key={a.id}
                                    className={styles.addressCard}
                                    variants={fadeUp}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <div className={styles.mapContainer}>
                                        {a.mapUrl && (
                                            <iframe
                                                src={a.mapUrl}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                title={a.title}
                                            />
                                        )}
                                        <div className={styles.mapOverlay}></div>
                                    </div>
                                    <div className={styles.addressInfo}>
                                        <div className={styles.addressIconSmall}>
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <h3>{a.title}</h3>
                                            <p>{a.address}</p>
                                        </div>
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