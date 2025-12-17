"use client";

import { useState, useEffect } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useSignInModeratorMutation } from "@/shared/api/authApi";
import { LogIn, User, Lock, Loader2 } from "lucide-react";

interface LoginFormProps {
    onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [signInModerator, { data, isLoading }] = useSignInModeratorMutation();

    useEffect(() => {
        if (data?.access_token) {
            Cookies.set("token", data.access_token, { expires: 7 });
            toast.success("Успешный вход");
            onLogin();
        }
    }, [data, onLogin]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            toast.error("Заполните все поля");
            setUsername("");
            setPassword("");
            return;
        }

        try {
            await signInModerator({ username, password }).unwrap();
        } catch (err: any) {
            if (err?.status === "FETCH_ERROR") {
                toast.error("Ошибка сети. Проверьте подключение.");
            } else if (err?.status >= 500) {
                toast.error("Ошибка сервера. Попробуйте позже.");
            } else {
                const message =
                    err?.data?.message ||
                    "Неверное имя пользователя или пароль";
                toast.error(message);
            }

            setUsername("");
            setPassword("");
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.authWrapper}>
                <div className={styles.authBox}>
                    <div className={styles.authHeader}>
                        <Image
                            src="/logos/logo.svg"
                            alt="Fundament logo"
                            width={140}
                            height={60}
                            className={styles.authLogo}
                        />
                        <h2 className={styles.authTitle}>Панель модератора</h2>
                        <p className={styles.authSubtitle}>Войдите в систему для управления</p>
                    </div>

                    <form onSubmit={handleLogin} className={styles.authForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username">
                                <User size={18} />
                                Имя пользователя
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Введите имя пользователя"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                <Lock size={18} />
                                Пароль
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Введите пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className={styles.spinner} />
                                    Входим...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Войти
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}