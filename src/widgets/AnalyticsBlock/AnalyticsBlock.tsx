"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.scss";
import {
    UpdateStatsPayload,
    useGetStatsQuery,
    useUpdateStatsMutation,
} from "@/shared/api/statsApi";
import toast, { Toaster } from "react-hot-toast";
import { TrendingUp, Home, Clock, Save, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface FormErrors {
    apartments_sold_monthly?: string;
    average_price_one_room?: string;
    avg_sale_days?: string;
    news_message?: string;
}

export default function AnalyticsBlock() {
    const { data, isLoading, error, refetch } = useGetStatsQuery();
    const [updateStats, { isLoading: isUpdating }] = useUpdateStatsMutation();

    const [formState, setFormState] = useState<UpdateStatsPayload>({
        apartments_sold_monthly: "",
        average_price_one_room: "",
        avg_sale_days: "",
        news_message: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (data) {
            setFormState(data);
        }
    }, [data]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formState.apartments_sold_monthly.trim()) {
            newErrors.apartments_sold_monthly = "Введите количество проданных квартир";
        }

        if (!formState.average_price_one_room.trim()) {
            newErrors.average_price_one_room = "Введите среднюю цену";
        }

        if (!formState.avg_sale_days.trim()) {
            newErrors.avg_sale_days = "Введите среднее время продажи";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
        
        if (touched[name] && errors[name as keyof FormErrors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        validateForm();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({
            apartments_sold_monthly: true,
            average_price_one_room: true,
            avg_sale_days: true,
        });

        if (!validateForm()) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }

        try {
            await updateStats(formState).unwrap();
            toast.success("Данные успешно обновлены!");
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Ошибка при обновлении данных");
        }
    };

    const handleRefresh = () => {
        refetch();
        toast.success("Данные обновлены");
    };

    const statsCards = useMemo(
        () => [
            {
                icon: <TrendingUp size={28} />,
                title: "Квартир продано за последний месяц",
                value: data?.apartments_sold_monthly || "—",
                gradient: "gradient1",
                suffix: "квартир",
            },
            {
                icon: <Home size={28} />,
                title: "Средняя цена за однокомнатную квартиру",
                value: data?.average_price_one_room || "—",
                gradient: "gradient2",
                suffix: "",
            },
            {
                icon: <Clock size={28} />,
                title: "Среднее время продажи квартиры",
                value: data?.avg_sale_days || "—",
                gradient: "gradient3",
                suffix: "дней",
            },
        ],
        [data]
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1] as const,
            },
        },
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 size={48} className={styles.spinner} />
                <p>Загрузка статистики...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <AlertCircle size={48} className={styles.errorIcon} />
                <p>Ошибка загрузки статистики</p>
                <button onClick={handleRefresh} className={styles.retryBtn}>
                    <RefreshCw size={16} />
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <div className={styles.analyticsBlock}>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: "#fff",
                        color: "#1a202c",
                        borderRadius: "12px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    },
                }}
            />

            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.headerTop}>
                    <div>
                        <h2>Аналитика</h2>
                        <p className={styles.subtitle}>Статистика продаж недвижимости</p>
                    </div>
                    <button onClick={handleRefresh} className={styles.refreshBtn} title="Обновить">
                        <RefreshCw size={20} />
                    </button>
                </div>
            </motion.div>

            <motion.div
                className={styles.cards}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {statsCards.map((card, index) => (
                    <motion.div
                        key={index}
                        className={`${styles.card} ${styles[card.gradient]}`}
                        variants={cardVariants}
                        whileHover={{ y: -4 }}
                    >
                        <div className={styles.cardIcon}>{card.icon}</div>
                        <div className={styles.cardContent}>
                            <h3>{card.title}</h3>
                            <p className={styles.cardValue}>
                                {card.value}
                                {card.suffix && card.value !== "—" && (
                                    <span className={styles.cardSuffix}> {card.suffix}</span>
                                )}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className={styles.formSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className={styles.formHeader}>
                    <h3>Обновить данные</h3>
                    <p>Измените статистические показатели</p>
                </div>

                <form className={styles.analyticsForm} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formGroup}>
                        <label htmlFor="apartments_sold_monthly">
                            <TrendingUp size={16} />
                            Квартир продано за месяц
                        </label>
                        <input
                            id="apartments_sold_monthly"
                            type="text"
                            name="apartments_sold_monthly"
                            value={formState.apartments_sold_monthly}
                            onChange={handleChange}
                            onBlur={() => handleBlur("apartments_sold_monthly")}
                            placeholder="Например: 150"
                            className={errors.apartments_sold_monthly ? styles.inputError : ""}
                            disabled={isUpdating}
                        />
                        {touched.apartments_sold_monthly && errors.apartments_sold_monthly && (
                            <span className={styles.error}>{errors.apartments_sold_monthly}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="average_price_one_room">
                            <Home size={16} />
                            Средняя цена за однокомнатную
                        </label>
                        <input
                            id="average_price_one_room"
                            type="text"
                            name="average_price_one_room"
                            value={formState.average_price_one_room}
                            onChange={handleChange}
                            onBlur={() => handleBlur("average_price_one_room")}
                            placeholder="Например: 2 500 000 сум"
                            className={errors.average_price_one_room ? styles.inputError : ""}
                            disabled={isUpdating}
                        />
                        {touched.average_price_one_room && errors.average_price_one_room && (
                            <span className={styles.error}>{errors.average_price_one_room}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="avg_sale_days">
                            <Clock size={16} />
                            Среднее время продажи
                        </label>
                        <input
                            id="avg_sale_days"
                            type="text"
                            name="avg_sale_days"
                            value={formState.avg_sale_days}
                            onChange={handleChange}
                            onBlur={() => handleBlur("avg_sale_days")}
                            placeholder="Например: 45 дней"
                            className={errors.avg_sale_days ? styles.inputError : ""}
                            disabled={isUpdating}
                        />
                        {touched.avg_sale_days && errors.avg_sale_days && (
                            <span className={styles.error}>{errors.avg_sale_days}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="news_message">
                            Новостное сообщение (необязательно)
                        </label>
                        <textarea
                            id="news_message"
                            name="news_message"
                            value={formState.news_message}
                            onChange={handleChange}
                            placeholder="Введите новостное сообщение..."
                            rows={4}
                            disabled={isUpdating}
                        />
                        <div className={styles.charCount}>
                            {formState.news_message.length} / 500 символов
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isUpdating}
                        whileHover={!isUpdating ? { scale: 1.02 } : {}}
                        whileTap={!isUpdating ? { scale: 0.98 } : {}}
                    >
                        {isUpdating ? (
                            <>
                                <Loader2 size={20} className={styles.spinnerSmall} />
                                Сохранение...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Сохранить изменения
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}