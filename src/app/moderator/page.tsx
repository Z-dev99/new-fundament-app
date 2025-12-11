"use client";

import { useState } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function DashboardPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            setIsAuthenticated(true);
        }
    };

    if (!isAuthenticated) {
        return (
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
                        <button type="submit">Войти</button>
                    </form>
                </div>
            </div>
        );
    }

    return null; 
}
