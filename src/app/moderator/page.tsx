"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import LoginForm from "./widgets/LoginForm";
import DashboardView from "./widgets/DashboardView";

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const token = typeof window !== "undefined" ? Cookies.get("token") : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return (
            <LoginForm
                onLogin={() => {
                    window.location.reload();
                }}
            />
        );
    }

    return (
        <DashboardView
            onLogout={() => {
                Cookies.remove("token");
                window.location.reload();
            }}
        />
    );
}
