"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BaseModal } from "@/shared/ui/BaseModal";
import styles from "./OwnerAuthModal.module.scss";
import { Mail, User, Lock, LogIn, UserPlus, ArrowRight, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSignInOwnerMutation, useSignUpOwnerMutation } from "@/shared/api/authApi";

interface OwnerAuthModalProps {
    open: boolean;
    onClose: () => void;
    onAuthSuccess?: () => void;
}

type AuthMode = "login" | "register";

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({ open, onClose, onAuthSuccess }) => {
    const [mode, setMode] = useState<AuthMode>("login");
    const [regStep, setRegStep] = useState<1 | 2>(1);

    // Общие поля по схеме backend
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");

    const [signInOwner, { isLoading: isLoginLoading }] = useSignInOwnerMutation();
    const [signUpOwner, { isLoading: isRegisterLoading }] = useSignUpOwnerMutation();

    const isLoading = isLoginLoading || isRegisterLoading;

    useEffect(() => {
        if (!open) return;
        const token = Cookies.get("token");
        if (token) {
            onClose();
        }
    }, [open, onClose]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Заполните email и пароль");
            return;
        }

        try {
            const res = await signInOwner({
                email: email.trim(),
                password,
            }).unwrap();

            if (res?.access_token) {
                Cookies.set("token", res.access_token, { expires: 7 });
            }

            toast.success("Добро пожаловать!");
            onAuthSuccess?.();
            onClose();
        } catch (err: any) {
            if (err?.status === "FETCH_ERROR") {
                toast.error("Ошибка сети. Проверьте подключение.");
            } else if (err?.status >= 500) {
                toast.error("Ошибка сервера. Попробуйте позже.");
            } else {
                const message =
                    err?.data?.message ||
                    "Неверный email или пароль";
                toast.error(message);
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Шаг 1: проверяем ФИО и email и переходим к паролю
        if (regStep === 1) {
            if (!firstName.trim() || !middleName.trim() || !lastName.trim() || !email.trim()) {
                toast.error("Заполните имя, отчество, фамилию и email");
                return;
            }
            setRegStep(2);
            return;
        }

        // Шаг 2: отправляем пароль и регистрируем
        if (!password) {
            toast.error("Введите пароль");
            return;
        }

        if (password.length < 6) {
            toast.error("Пароль должен содержать не менее 6 символов");
            return;
        }

        try {
            await signUpOwner({
                email: email.trim(),
                password,
                first_name: firstName.trim(),
                middle_name: middleName.trim(),
                last_name: lastName.trim(),
            }).unwrap();

            toast.success("Вы успешно зарегистрированы! Теперь войдите в аккаунт.");
            setMode("login");
            setRegStep(1);
            setPassword("");
        } catch (err: any) {
            const message =
                err?.data?.message ||
                "Не удалось завершить регистрацию. Попробуйте позже.";
            toast.error(message);
        }
    };

    const renderLogin = () => (
        <form className={styles.form} onSubmit={handleLogin} noValidate>
            <div className={styles.field}>
                <label htmlFor="login-email">
                    <Mail size={14} />
                    Email
                </label>
                <input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="login-password">
                    <Lock size={14} />
                    Пароль
                </label>
                <input
                    id="login-password"
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                />
            </div>

            <button
                type="submit"
                className={styles.submit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className={styles.spinner} />
                        Входим...
                    </>
                ) : (
                    <>
                        <LogIn size={18} />
                        Войти
                    </>
                )}
            </button>

            <div className={styles.bottomText}>
                <span className={styles.muted}>
                    Войти можно с теми же данными, что вы указали при регистрации.
                </span>
                <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => setMode("register")}
                >
                    Нет аккаунта?
                    <ArrowRight size={14} />
                </button>
            </div>
        </form>
    );

    const renderRegister = () => (
        <form className={styles.form} onSubmit={handleRegister} noValidate>
            {regStep === 1 && (
                <>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label htmlFor="firstName">
                                <User size={14} />
                                Имя
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                placeholder="Введите имя"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                autoComplete="given-name"
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="middleName">
                                <User size={14} />
                                Отчество
                            </label>
                            <input
                                id="middleName"
                                type="text"
                                placeholder="Введите отчество"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                autoComplete="additional-name"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="lastName">
                            <User size={14} />
                            Фамилия
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Введите фамилию"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="family-name"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="reg-email">
                            <Mail size={14} />
                            Email
                        </label>
                        <input
                            id="reg-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                </>
            )}

            {regStep === 2 && (
                <div className={styles.field}>
                    <label htmlFor="reg-password">
                        <Lock size={14} />
                        Пароль
                    </label>
                    <input
                        id="reg-password"
                        type="password"
                        placeholder="Минимум 6 символов"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                    <p className={styles.hint}>
                        Используйте латинские буквы, цифры и символы.
                    </p>
                </div>
            )}

            <button
                type="submit"
                className={styles.submit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className={styles.spinner} />
                        Регистрируем...
                    </>
                ) : (
                    <>
                        {regStep === 1 ? "Продолжить" : "Завершить регистрацию"}
                        <ArrowRight size={16} />
                    </>
                )}
            </button>

            <div className={styles.bottomText}>
                <span className={styles.muted}>
                    Нажимая «Продолжить», вы соглашаетесь с условиями сервиса Fundament.
                </span>
                <button
                    type="button"
                    className={styles.linkBtn}
                    onClick={() => {
                        if (regStep === 2) {
                            setRegStep(1);
                            return;
                        }
                        setMode("login");
                        setRegStep(1);
                    }}
                >
                    {regStep === 2 ? "Назад" : "Уже есть аккаунт?"}
                    <ArrowRight size={14} />
                </button>
            </div>
        </form>
    );

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            classNameBackdrop={styles.backdrop}
            classNameModal={styles.modalContainer}
            width="100%"
        >
            <div className={styles.modal}>
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Закрыть"
                    type="button"
                >
                    <X size={18} />
                </button>

                <div className={styles.tabs}>
                    <button
                        type="button"
                        className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
                        onClick={() => setMode("login")}
                    >
                        <LogIn size={14} />
                        Вход
                    </button>
                    <button
                        type="button"
                        className={`${styles.tab} ${mode === "register" ? styles.active : ""}`}
                        onClick={() => setMode("register")}
                    >
                        <UserPlus size={14} />
                        Регистрация
                    </button>
                </div>

                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {mode === "login" ? "Вход для владельцев" : "Регистрация владельца"}
                    </h2>
                    <p className={styles.subtitle}>
                        {mode === "login"
                            ? "Управляйте своими объявлениями и получайте больше заявок от покупателей."
                            : "Создайте аккаунт владельца, чтобы публиковать объявления и управлять объектами."}
                    </p>
                </div>

                {mode === "login" ? renderLogin() : renderRegister()}
            </div>
        </BaseModal>
    );
}

