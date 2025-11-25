"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./FeedbackForm.module.css";

export default function FeedbackForm() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("SEND:", form);
    };

    return (
        <div className="container">
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
                    <span>  Свяжитесь с нами</span>
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
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="example@mail.com"
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
                        className={styles.button}
                        whileHover={{ scale: 1.02, opacity: 0.95 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                    >
                        Отправить
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    );
}
