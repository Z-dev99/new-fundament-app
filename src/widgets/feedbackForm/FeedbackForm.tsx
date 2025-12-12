"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./FeedbackForm.module.css";
import toast, { Toaster } from "react-hot-toast";

export default function FeedbackForm() {
    const [form, setForm] = useState({ name: "", phone: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support_request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: form.name,
                    phone_number: form.phone, // обязательное поле для API
                    details: form.message,
                }),
            });

            if (!res.ok) throw new Error("Ошибка отправки формы");

            toast.success("Сообщение успешно отправлено!");
            setForm({ name: "", phone: "", message: "" });
        } catch (err) {
            console.error(err);
            toast.error("Не удалось отправить сообщение. Попробуйте позже.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <Toaster position="top-right" reverseOrder={false} />
            <motion.div
                className={styles.wrapper}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <span>Свяжитесь с нами</span>
                </motion.h2>

                <motion.form
                    className={styles.card}
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <div className={styles.group}>
                        <label>Ваше имя</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Введите имя"
                            required
                        />
                    </div>

                    <div className={styles.group}>
                        <label>Телефон</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+998901234567"
                            required
                        />
                    </div>

                    <div className={styles.group}>
                        <label>Сообщение</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Ваше сообщение..."
                            rows={5}
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className={styles.button}
                        whileHover={{ scale: 1.02, opacity: 0.95 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Отправляем..." : "Отправить"}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    );
}
