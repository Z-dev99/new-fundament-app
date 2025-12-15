"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Phone, MessageSquare, Send, Loader2 } from "lucide-react";
import styles from "./FeedbackForm.module.css";
import toast, { Toaster } from "react-hot-toast";

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const phoneInputRef = useRef<HTMLInputElement>(null);

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

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm({ ...form, name: value });
        if (touched.name && errors.name) {
            setErrors({ ...errors, name: undefined });
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        const value = el.value;
        const selStart = el.selectionStart ?? value.length;
        let digitsLeft = 0;
        for (let i = 0; i < selStart; i++) if (/\d/.test(value[i])) digitsLeft++;

        const newDigits = value.replace(/\D/g, "").slice(0, 12);
        setRawPhone(newDigits);

        requestAnimationFrame(() => {
            if (phoneInputRef.current) {
                const newFormatted = formatUzPhoneFromDigits(newDigits);
                const clampDigitIndex = Math.max(0, Math.min(newDigits.length, digitsLeft));
                let caretPos: number;
                if (clampDigitIndex === 0) {
                    caretPos = 4;
                } else {
                    const pos = positionForDigitIndex(newFormatted, clampDigitIndex - 1);
                    caretPos = Math.min(newFormatted.length, pos + 1);
                }
                phoneInputRef.current.setSelectionRange(caretPos, caretPos);
            }
        });

        setForm({ ...form, phone: newDigits });
        if (touched.phone && errors.phone) {
            setErrors({ ...errors, phone: undefined });
        }
    };

    const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const digits = pasted.replace(/\D/g, "").slice(0, 12);
        setRawPhone(digits);
        setForm({ ...form, phone: digits });
        requestAnimationFrame(() => {
            if (phoneInputRef.current) {
                const f = formatUzPhoneFromDigits(digits);
                phoneInputRef.current.setSelectionRange(f.length, f.length);
            }
        });
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setForm({ ...form, message: value });
        if (touched.message && errors.message) {
            setErrors({ ...errors, message: undefined });
        }
    };

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        validateForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, phone: true, message: true });

        if (!validateForm()) {
            toast.error("Пожалуйста, исправьте ошибки в форме");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support_request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: form.name.trim(),
                    phone_number: rawPhone,
                    details: form.message.trim(),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Ошибка отправки формы");
            }

            toast.success("Сообщение успешно отправлено!");
            setForm({ name: "", phone: "", message: "" });
            setRawPhone("");
            setErrors({});
            setTouched({});
        } catch (err: any) {
            toast.error(err.message || "Не удалось отправить сообщение. Попробуйте позже.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#fff",
                        color: "#1a202c",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    },
                    success: {
                        iconTheme: {
                            primary: "#22c55e",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                        },
                    },
                }}
            />
            <motion.div
                className={styles.wrapper}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
            >
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
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
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    viewport={{ once: true }}
                    noValidate
                >
                    <div className={styles.group}>
                        <label htmlFor="name" className={styles.label}>
                            <User size={16} />
                            Ваше имя
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleNameChange}
                            onBlur={() => handleBlur("name")}
                            placeholder="Введите ваше имя"
                            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                            disabled={isSubmitting}
                            autoComplete="name"
                        />
                        {touched.name && errors.name && (
                            <span className={styles.error}>{errors.name}</span>
                        )}
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="phone" className={styles.label}>
                            <Phone size={16} />
                            Телефон
                        </label>
                        <input
                            ref={phoneInputRef}
                            id="phone"
                            name="phone"
                            type="text"
                            value={formattedPhone}
                            onChange={handlePhoneChange}
                            onPaste={handlePhonePaste}
                            onBlur={() => handleBlur("phone")}
                            placeholder="+998 (90) 123-45-67"
                            className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                            disabled={isSubmitting}
                            autoComplete="tel"
                        />
                        {touched.phone && errors.phone && (
                            <span className={styles.error}>{errors.phone}</span>
                        )}
                    </div>

                    <div className={styles.group}>
                        <label htmlFor="message" className={styles.label}>
                            <MessageSquare size={16} />
                            Сообщение
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handleMessageChange}
                            onBlur={() => handleBlur("message")}
                            placeholder="Расскажите, чем мы можем вам помочь..."
                            rows={5}
                            className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                            disabled={isSubmitting}
                        />
                        <div className={styles.charCount}>
                            {form.message.length} / 500 символов
                        </div>
                        {touched.message && errors.message && (
                            <span className={styles.error}>{errors.message}</span>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        className={styles.button}
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        transition={{ duration: 0.15 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
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
