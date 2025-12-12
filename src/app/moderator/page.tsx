"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import LoginForm from "./widgets/LoginForm";
import DashboardView from "./widgets/DashboardView";

export default function DashboardPage() {
    const [token, setToken] = useState<string | null>(Cookies.get("token") || null);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentToken = Cookies.get("token") || null;
            if (currentToken !== token) {
                setToken(currentToken);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [token]);

    if (!token) return <LoginForm onLogin={() => setToken(Cookies.get("token") || null)} />;

    return <DashboardView onLogout={() => setToken(null)} />;
}
