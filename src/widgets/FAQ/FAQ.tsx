"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.scss";

const faqData = [
    { question: "Как работает поддержка?", answer: "Наша команда поддержки доступна 24/7 через чат и email." },
    { question: "Могу ли я поменять свой план потом?", answer: "Да, вы можете поменять или улучшить свой план в любой удобный для вас момент. Мы вычтем стоимость предыдущего плана из стоимости нового." },
    { question: "Как поменять номер телефона моего аккаунта?", answer: "Вы можете изменить номер телефона обратившись в техничесткую поддержку." },
    { question: "Как работает безопасность сделок?", answer: "Все сделки проходят через безопасный сервис с использованием шифрования и проверки личности." },
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [fio, setFio] = useState("");
    const [phone, setPhone] = useState("+998 ");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, "");
        let result = "+998";
        if (digits.length > 3) {
            const rest = digits.slice(3);
            if (rest.length > 0) result += ` (${rest.slice(0, 2)}`;
            if (rest.length >= 2) result += `) ${rest.slice(2, 5)}`;
            if (rest.length >= 5) result += ` ${rest.slice(5, 7)}`;
            if (rest.length >= 7) result += ` ${rest.slice(7, 9)}`;
        }
        return result;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhone(e.target.value));
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const uzbPhoneRegex = /^\+998 \(\d{2}\) \d{3} \d{2} \d{2}$/;

        if (!fio.trim()) {
            setError("Пожалуйста, введите ФИО");
            return;
        }

        if (!uzbPhoneRegex.test(phone)) {
            setError("Введите номер в формате +998 (90) 123 45 67");
            return;
        }

        if (!message.trim()) {
            setError("Пожалуйста, введите сообщение");
            return;
        }

        setError("");
        setSuccess("");

        try {

            setSuccess("Сообщение успешно отправлено!");
            setFio("");
            setPhone("+998 ");
            setMessage("");
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess("");
            }, 1500);
        } catch (err) {
            setError("Ошибка при отправке. Попробуйте позже.");
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <h2 className={styles.heading}>Часто задаваемые вопросы</h2>
                <p className={styles.subheading}>
                    Тут собраны самые частые вопросы о нашем сервисе. <br />
                    Не можете найти нужный ответ?{" "}
                    <button className={styles.link} onClick={() => setIsModalOpen(true)}>
                        Напишите нам
                    </button>
                </p>

                <div className={styles.accordion}>
                    {faqData.map((item, index) => (
                        <div key={index} className={styles.item}>
                            <button className={styles.question} onClick={() => toggle(index)}>
                                <div className={styles.left}>
                                    <HelpCircle className={styles.iconLeft} />
                                    <span>{item.question}</span>
                                </div>
                                <ChevronDown
                                    className={`${styles.icon} ${openIndex === index ? styles.open : ""}`}
                                />
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        className={styles.answer}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: "easeInOut" }}
                                    >
                                        <p>{item.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className={styles.modalBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
                                <X />
                            </button>
                            <h3>Свяжитесь с нами</h3>
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <label>
                                    ФИО
                                    <input
                                        type="text"
                                        value={fio}
                                        onChange={(e) => setFio(e.target.value)}
                                        placeholder="Введите ваше имя"
                                    />
                                </label>
                                <label>
                                    Номер телефона
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        maxLength={19}
                                        placeholder="+998 (__) ___ __ __"
                                    />
                                </label>
                                <label>
                                    Сообщение
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Ваше сообщение..."
                                    />
                                </label>
                                {error && <p className={styles.error}>{error}</p>}
                                {success && <p className={styles.success}>{success}</p>}
                                <button type="submit" className={styles.submitBtn} >
                                    Отправить
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
