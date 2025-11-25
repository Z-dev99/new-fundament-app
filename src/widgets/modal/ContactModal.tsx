"use client";

import React, { useRef, useState } from "react";
import styles from "./ContactModal.module.scss";
import { toast } from "react-hot-toast";
import { BaseModal } from "@/shared/ui/BaseModal";

type Props = {
    open: boolean;
    onClose: () => void;
};

function formatUzPhoneFromDigits(digits: string) {
    const d = digits.slice(0, 12);
    let out = "+998";

    if (d.length <= 3) {
        return "+998" + d.slice(3);
    }

    if (d.length > 3) out += ` (${d.slice(3, Math.min(5, d.length))}`;
    if (d.length >= 5) out += `)`;
    if (d.length >= 5) out += ` ${d.slice(5, Math.min(8, d.length))}`;
    if (d.length >= 8) out += `-${d.slice(8, Math.min(10, d.length))}`;
    if (d.length >= 10) out += `-${d.slice(10, Math.min(12, d.length))}`;

    return out;
}

function positionForDigitIndex(formatted: string, digitIndex: number) {
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
            if (count === digitIndex) return i;
            count++;
        }
    }
    return formatted.length;
}

export const ContactModal = ({ open, onClose }: Props) => {
    const [fullName, setFullName] = useState("");
    const [rawPhone, setRawPhone] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const formatted = formatUzPhoneFromDigits(rawPhone);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.target;
        const value = el.value;
        const selStart = el.selectionStart ?? value.length;

        let digitsLeft = 0;
        for (let i = 0; i < selStart; i++) if (/\d/.test(value[i])) digitsLeft++;

        const newDigits = value.replace(/\D/g, "").slice(0, 12);

        setRawPhone(newDigits);

        requestAnimationFrame(() => {
            const newFormatted = formatUzPhoneFromDigits(newDigits);

            const clampDigitIndex = Math.max(0, Math.min(newDigits.length, digitsLeft));

            let caretPos: number;
            if (clampDigitIndex === 0) {
                caretPos = 4;
            } else {
                const pos = positionForDigitIndex(newFormatted, clampDigitIndex - 1);
                caretPos = Math.min(newFormatted.length, pos + 1);
            }

            if (inputRef.current) {
                inputRef.current.setSelectionRange(caretPos, caretPos);
            }
        });
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const digits = pasted.replace(/\D/g, "").slice(0, 12);
        setRawPhone(digits);
        requestAnimationFrame(() => {
            if (inputRef.current) {
                const f = formatUzPhoneFromDigits(digits);
                inputRef.current.setSelectionRange(f.length, f.length);
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!/^998\d{9}$/.test(rawPhone)) {
            toast.error("Введите корректный номер Узбекистана");
            return;
        }
        if (!fullName.trim()) {
            toast.error("Введите ФИО");
            return;
        }

        toast.success("Заявка отправлена!");
        setFullName("");
        setRawPhone("");
        onClose();
    };

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            classNameBackdrop={styles.modalBackdrop}
            classNameModal={styles.modalContainer}
        >
            <div className={styles.modal}>
                <div className={styles.content}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                    <h2 className={styles.title}>
                        Понравился объект? Расскажем подробнее!
                    </h2>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label>
                                Контакты <span>*</span>
                            </label>

                            <input
                                ref={inputRef}
                                type="tel"
                                value={formatted}
                                onChange={handlePhoneChange}
                                onPaste={handlePaste}
                                placeholder="+998 (__) ___-__-__"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>
                                Имя <span>*</span>
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Укажите ФИО"
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.submit}
                            disabled={!fullName.trim() || rawPhone.length !== 12}
                        >
                            Отправить
                        </button>
                    </form>
                    <div className={styles.bottomBanner}>
                        Оставьте свои данные, и мы свяжемся с вами!
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};
