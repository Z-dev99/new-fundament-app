"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Phone, MessageSquare, Send, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./FeedbackForm.module.css";
import { useCreateSupportRequestMutation } from "@/shared/api/supportApi";

function formatUzPhoneFromDigits(digits: string): string {
    const d = digits.slice(0, 12);
    let out = "+998";
    if (d.length <= 3) return "+998" + d.slice(3);
    if (d.length > 3) out += ` (${d.slice(3, Math.min(5, d.length))}`;
    if (d.length >= 5) out += `)`;
    if (d.length >= 5) out += ` ${d.slice(5, Math.min(8, d.length))}`;
    if (d.length >= 8) out += `-${d.slice(8, Math.min(10, d.length))}`;
    if (d.length >= 10) out += `-${d.slice(10, Math.min(12, d.length))}`;
    return out;
}

function positionForDigitIndex(formatted: string, digitIndex: number): number {
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
            if (count === digitIndex) return i;
            count++;
        }
    }
    return formatted.length;
}

interface FormState {
    name: string;
    phone: string;
    message: string;
}

interface FormErrors {
    name?: string;
    phone?: string;
    message?: string;
}

export default function FeedbackForm() {
    const [form, setForm] = useState<FormState>({ name: "", phone: "", message: "" });
    const [rawPhone, setRawPhone] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const phoneInputRef = useRef<HTMLInputElement>(null);

    const [createSupportRequest, { isLoading }] =
        useCreateSupportRequestMutation();

    const formattedPhone = formatUzPhoneFromDigits(rawPhone);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Введите ваше имя";
        } else if (form.name.trim().length < 2) {
            newErrors.name = "Имя должно содержать минимум 2 символа";
        }

        if (!rawPhone) {
            newErrors.phone = "Введите номер телефона";
        } else if (!/^998\d{9}$/.test(rawPhone)) {
            newErrors.phone = "Введите корректный номер Узбекистана";
        }

        if (!form.message.trim()) {
            newErrors.message = "Введите сообщение";
        } else if (form.message.trim().length < 10) {
            newErrors.message = "Сообщение должно содержать минимум 10 символов";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        const value = el.value;
        const selStart = el.selectionStart ?? value.length;

        let digitsLeft = 0;
        for (let i = 0; i < selStart; i++) if (/\d/.test(value[i])) digitsLeft++;

        const newDigits = value.replace(/\D/g, "").slice(0, 12);
        setRawPhone(newDigits);
        setForm({ ...form, phone: newDigits });

        requestAnimationFrame(() => {
            if (!phoneInputRef.current) return;
            const newFormatted = formatUzPhoneFromDigits(newDigits);
            const clampDigitIndex = Math.max(0, Math.min(newDigits.length, digitsLeft));
            const pos =
                clampDigitIndex === 0
                    ? 4
                    : positionForDigitIndex(newFormatted, clampDigitIndex - 1) + 1;
            phoneInputRef.current.setSelectionRange(pos, pos);
        });
    };

    const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 12);
        setRawPhone(digits);
        setForm({ ...form, phone: digits });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, phone: true, message: true });

        if (!validateForm()) {
            toast.error("Пожалуйста, исправьте ошибки в форме");
            return;
        }

        try {
            await createSupportRequest({
                first_name: form.name.trim(),
                phone_number: rawPhone,
                details: form.message.trim(),
            }).unwrap();

            toast.success("Сообщение успешно отправлено!");
            setForm({ name: "", phone: "", message: "" });
            setRawPhone("");
            setErrors({});
            setTouched({});
        } catch (err: any) {
            toast.error(err?.data?.message || "Не удалось отправить сообщение");
        }
    };

    return (
        <div className="container">
            <Toaster position="top-right" />

            <motion.div className={styles.wrapper}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className={styles.title}>
                        <span>Свяжитесь с нами</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Оставьте заявку, и мы свяжемся с вами в ближайшее время
                    </p>
                </motion.div>

                <motion.form
                    className={styles.card}
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <div className={styles.group}>
                        <label className={styles.label}>
                            <User size={16} />
                            Ваше имя
                        </label>
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                            disabled={isLoading}
                        />
                        {errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>
                            <Phone size={16} />
                            Телефон
                        </label>
                        <input
                            ref={phoneInputRef}
                            value={formattedPhone}
                            onChange={handlePhoneChange}
                            onPaste={handlePhonePaste}
                            className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                            disabled={isLoading}
                        />
                        {errors.phone && (
                            <span className={styles.error}>{errors.phone}</span>
                        )}
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>
                            <MessageSquare size={16} />
                            Сообщение
                        </label>
                        <textarea
                            value={form.message}
                            onChange={(e) =>
                                setForm({ ...form, message: e.target.value })
                            }
                            rows={5}
                            className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                            disabled={isLoading}
                        />
                        {errors.message && (
                            <span className={styles.error}>{errors.message}</span>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className={styles.spinner} />
                                <span>Отправляем...</span>
                            </>
                        ) : (
                            <>
                                <Send size={20} />
                                <span>Отправить сообщение</span>
                            </>
                        )}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    );
}
