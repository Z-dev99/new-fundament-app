"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./PropertyBlocks.module.scss";
import { Phone, Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateLeadRequestMutation } from "@/shared/api/leadApi";

interface NeedConsultationProps {
    announcementId: string;
}

export const NeedConsultation: React.FC<NeedConsultationProps> = ({ announcementId }) => {
    const [name, setName] = useState("");
    const [rawPhone, setRawPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createLeadRequest] = useCreateLeadRequestMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error("Введите ваше имя");
            return;
        }

        if (!/^998\d{9}$/.test(rawPhone)) {
            toast.error("Введите корректный номер Узбекистана");
            return;
        }

        setIsSubmitting(true);
        
        try {
            await createLeadRequest({
                first_name: name.trim(),
                phone_number: rawPhone,
                announcement_id: announcementId,
            }).unwrap();

            toast.success("Заявка отправлена! Наш менеджер свяжется с вами в ближайшее время.");
            setName("");
            setRawPhone("");
        } catch (err: any) {
            toast.error(err.data?.message || "Ошибка отправки заявки");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const digits = value.replace(/\D/g, "").slice(0, 12);
        setRawPhone(digits);
    };

    const contactMethods = [
        {
            icon: <Phone size={24} />,
            title: "Позвоните нам",
            description: "Работаем с 9:00 до 20:00",
            value: "+998 (XX) XXX-XX-XX",
            link: "tel:+998",
        },
        {
            icon: <Mail size={24} />,
            title: "Напишите на email",
            description: "Ответим в течение часа",
            value: "info@fundament.uz",
            link: "mailto:info@fundament.uz",
        },
    ];

    const formatPhone = (digits: string): string => {
        if (!digits) return "";
        const d = digits.slice(0, 12);
        let out = "+998";
        if (d.length <= 3) return "+998" + d.slice(3);
        if (d.length > 3) out += ` (${d.slice(3, Math.min(5, d.length))}`;
        if (d.length >= 5) out += `)`;
        if (d.length >= 5) out += ` ${d.slice(5, Math.min(8, d.length))}`;
        if (d.length >= 8) out += `-${d.slice(8, Math.min(10, d.length))}`;
        if (d.length >= 10) out += `-${d.slice(10, Math.min(12, d.length))}`;
        return out;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.section
            className={styles.needConsultation}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className="container">
                <motion.div className={styles.content} variants={itemVariants}>
                    <div className={styles.leftSide}>
                        <h2 className={styles.title}>Нужна консультация?</h2>
                        <p className={styles.subtitle}>
                            Наши специалисты готовы ответить на все ваши вопросы и помочь с выбором
                        </p>

                        <div className={styles.contactMethods}>
                            {contactMethods.map((method, index) => (
                                <motion.a
                                    key={index}
                                    href={method.link}
                                    className={styles.contactMethod}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05, x: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={styles.methodIcon}>{method.icon}</div>
                                    <div className={styles.methodInfo}>
                                        <h3 className={styles.methodTitle}>{method.title}</h3>
                                        <p className={styles.methodDescription}>{method.description}</p>
                                        <span className={styles.methodValue}>{method.value}</span>
                                    </div>
                                    <ArrowRight size={20} className={styles.methodArrow} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <motion.div className={styles.rightSide} variants={itemVariants}>
                        <form className={styles.consultationForm} onSubmit={handleSubmit}>
                            <h3 className={styles.formTitle}>Оставить заявку</h3>
                            <p className={styles.formSubtitle}>
                                Заполните форму, и мы свяжемся с вами в течение 15 минут
                            </p>

                            <div className={styles.formFields}>
                                <div className={styles.formField}>
                                    <label htmlFor="consultation-name">Ваше имя</label>
                                    <input
                                        id="consultation-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Иван Иванов"
                                        required
                                    />
                                </div>

                                <div className={styles.formField}>
                                    <label htmlFor="consultation-phone">Номер телефона</label>
                                    <input
                                        id="consultation-phone"
                                        type="tel"
                                        value={formatPhone(rawPhone)}
                                        onChange={handlePhoneChange}
                                        placeholder="+998 (XX) XXX-XX-XX"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? "Отправляем..." : "Получить консультацию"}
                                <ArrowRight size={20} />
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
};
