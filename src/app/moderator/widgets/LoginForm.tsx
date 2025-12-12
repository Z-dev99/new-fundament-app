"use client";

import { useState, useEffect } from "react";
import styles from "../styles.module.scss";
import Image from "next/image";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useSignInModeratorMutation } from "@/shared/api/authApi";

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
        <div className="container">
            <div className={styles.authWrapper}>
                <div className={styles.authBox}>
                    <Image
                        src="/logos/logo.svg"
                        alt="Fundament logo"
                        width={140}
                        height={60}
                    />

                    <form onSubmit={handleLogin} className={styles.authForm}>
                        <input
                            type="text"
                            placeholder="Имя пользователя"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Входим..." : "Войти"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
