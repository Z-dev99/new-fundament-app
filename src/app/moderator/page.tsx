"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useGetMyAnnouncementsQuery } from "@/shared/api/announcementsApi";
import LoginForm from "./widgets/LoginForm";
import DashboardView from "./widgets/DashboardView";

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const token = typeof window !== 'undefined' ? Cookies.get("token") : null;
    
    // Проверяем токен через запрос объявлений
    // Используем минимальные параметры для проверки токена (page_size по умолчанию 12)
    const { data, error, isLoading } = useGetMyAnnouncementsQuery(
        { page: 1 },
        {
            skip: !token, // Пропускаем запрос если нет токена
            refetchOnMountOrArgChange: true,
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    // Предотвращаем hydration mismatch
    if (!mounted) {
        return null;
    }

    // Определяем статус авторизации
    // Если есть токен и запрос успешен (есть data) - авторизован
    // Если есть ошибка 401/403 - не авторизован (токен невалиден)
    // Если ошибка 422 - это проблема с параметрами запроса, не с токеном (считаем авторизованным если токен есть)
    // Если нет токена - не авторизован
    const hasAuthError = error && 'status' in error && (error.status === 401 || error.status === 403);
    const has422Error = error && 'status' in error && error.status === 422;
    // Если токен есть и нет ошибок авторизации (401/403) - считаем авторизованным
    // Ошибка 422 не означает проблему с токеном, это проблема с параметрами запроса
    const isAuthenticated = !!token && (!hasAuthError) && (has422Error || !!data);

    // Показываем загрузку только если проверяем токен
    if (token && isLoading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                background: "#f8f9fa"
            }}>
                <div style={{
                    width: "48px",
                    height: "48px",
                    border: "4px solid rgba(102, 126, 234, 0.1)",
                    borderTopColor: "#667eea",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                }} />
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Если не авторизован - показываем форму логина
    if (!isAuthenticated) {
        return <LoginForm onLogin={() => {
            // После успешного логина страница перезагрузится автоматически
            window.location.reload();
        }} />;
    }

    // Если авторизован - показываем дашборд
    return <DashboardView onLogout={() => {
        Cookies.remove("token");
        window.location.reload();
    }} />;
}