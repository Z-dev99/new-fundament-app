"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useGetMyAnnouncementsQuery } from "@/shared/api/announcementsApi";
import toast from "react-hot-toast";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const pathname = usePathname();

    // Получаем токен (только на клиенте)
    const getToken = () => typeof window !== 'undefined' ? Cookies.get("token") : null;

    // Определяем начальное состояние: если есть токен - проверяем, если нет - сразу показываем форму логина
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(() => {
        // Загрузка только если есть токен для проверки
        const token = getToken();
        return !!token;
    });

    // Используем существующий запрос для проверки токена
    // Если запрос успешен - токен валиден, если 401/403 - токен невалиден
    const currentToken = getToken();
    const { data, error, isLoading: isVerifying } = useGetMyAnnouncementsQuery(
        { page: 1 }, // Используем дефолтное page_size: 12
        {
            skip: !currentToken, // Пропускаем запрос если нет токена
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }
    );

    const handleUnauthorized = useCallback(() => {
        toast.error("Сессия истекла. Пожалуйста, войдите снова.");
        Cookies.remove("token");
        setIsAuthenticated(false);
        setIsLoading(false);
    }, []);

    const checkAuth = useCallback(() => {
        const token = getToken();

        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        // Если запрос еще выполняется, ждем
        if (isVerifying) {
            setIsLoading(true);
            return;
        }

        // Если есть ошибка авторизации (401, 403) - скидываем сессию
        // Ошибка 422 - это проблема с параметрами запроса, не с токеном
        if (error && ('status' in error)) {
            const status = error.status;
            if (status === 401 || status === 403) {
                handleUnauthorized();
                return;
            }
            // Ошибка 422 не означает проблему с токеном - это проблема с параметрами запроса
            // Если токен есть, считаем его валидным
            if (status === 422) {
                setIsAuthenticated(true);
                setIsLoading(false);
                return;
            }
        }

        // Если запрос успешен - токен валиден
        if (data) {
            setIsAuthenticated(true);
            setIsLoading(false);
        }
    }, [data, error, isVerifying, handleUnauthorized]);

    useEffect(() => {
        // Обновляем состояние на основе результата запроса
        if (typeof window === 'undefined') return;

        const token = getToken();

        // Если нет токена - сразу показываем форму логина (не ждем запрос)
        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        // Если запрос еще выполняется - показываем загрузку
        if (isVerifying) {
            setIsLoading(true);
            return;
        }

        // Если есть ошибка авторизации (401, 403) - скидываем сессию
        // Ошибка 422 - это проблема с параметрами запроса, не с токеном
        if (error && ('status' in error)) {
            const status = error.status;
            if (status === 401 || status === 403) {
                handleUnauthorized();
            } else if (status === 422) {
                // Ошибка 422 не означает проблему с токеном - это проблема с параметрами запроса
                // Если токен есть, считаем его валидным
                setIsAuthenticated(true);
                setIsLoading(false);
            } else {
                // Другие ошибки не связаны с авторизацией - считаем токен валидным
                setIsAuthenticated(true);
                setIsLoading(false);
            }
        } else if (data) {
            // Запрос успешен - токен валиден
            setIsAuthenticated(true);
            setIsLoading(false);
        } else if (!isVerifying && token) {
            // Если запрос завершен, но нет данных и нет ошибки - токен валиден
            setIsAuthenticated(true);
            setIsLoading(false);
        }
    }, [data, error, isVerifying, handleUnauthorized]);

    useEffect(() => {
        // Начальная проверка токена при монтировании (только на клиенте)
        if (typeof window === 'undefined') return;

        const token = getToken();
        if (!token) {
            // Нет токена - сразу показываем форму логина
            setIsAuthenticated(false);
            setIsLoading(false);
        }
        // Если есть токен - проверяем через запрос (уже выполняется через useGetMyAnnouncementsQuery)
        // Состояние обновится в useEffect выше
    }, []);

    useEffect(() => {
        // Периодическая проверка токена каждые 5 минут
        const interval = setInterval(() => {
            const token = getToken();
            if (token) {
                checkAuth();
            } else {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        }, 5 * 60 * 1000); // 5 минут

        return () => clearInterval(interval);
    }, [checkAuth]);

    useEffect(() => {
        // Проверяем токен при изменении пути (навигация)
        if (pathname) {
            const token = getToken();
            if (token) {
                checkAuth();
            } else {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        }
    }, [pathname, checkAuth]);

    // Всегда рендерим children - ModeratorContent сам решит что показывать
    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
