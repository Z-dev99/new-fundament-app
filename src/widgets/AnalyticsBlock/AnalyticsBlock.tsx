"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import {
    UpdateStatsPayload,
    useGetStatsQuery,
    useUpdateStatsMutation,
} from "@/shared/api/statsApi";

export default function AnalyticsBlock() {
    const { data, isLoading, error, refetch } = useGetStatsQuery();
    const [updateStats, { isLoading: isUpdating }] = useUpdateStatsMutation();

    const [formState, setFormState] = useState<UpdateStatsPayload>({
        apartments_sold_monthly: "",
        average_price_one_room: "",
        avg_sale_days: "",
        news_message: "",
    });

    useEffect(() => {
        if (data) {
            setFormState(data);
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateStats(formState).unwrap();
            alert("Данные успешно обновлены!");
            refetch(); // Обновляем данные после успешного PUT
        } catch (err) {
            console.error(err);
            alert("Ошибка при обновлении данных");
        }
    };

    if (isLoading) return <p>Загрузка статистики...</p>;
    if (error) return <p>Ошибка загрузки статистики</p>;

    return (
        <div className={styles.analyticsBlock}>
            <h2>Аналитика</h2>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>Квартир продано за последний месяц</h3>
                    <p>{data?.apartments_sold_monthly}</p>
                </div>
                <div className={styles.card}>
                    <h3>Средняя цена за однокомнатную квартиру</h3>
                    <p>{data?.average_price_one_room}</p>
                </div>
                <div className={styles.card}>
                    <h3>Среднее время продажи квартиры</h3>
                    <p>{data?.avg_sale_days}</p>
                </div>
            </div>

            <form className={styles.analyticsForm} onSubmit={handleSubmit}>
                <h3>Обновить данные</h3>
                <input
                    type="text"
                    name="apartments_sold_monthly"
                    value={formState.apartments_sold_monthly}
                    onChange={handleChange}
                    placeholder="Квартир продано за месяц"
                />
                <input
                    type="text"
                    name="average_price_one_room"
                    value={formState.average_price_one_room}
                    onChange={handleChange}
                    placeholder="Средняя цена за однокомнатную"
                />
                <input
                    type="text"
                    name="avg_sale_days"
                    value={formState.avg_sale_days}
                    onChange={handleChange}
                    placeholder="Среднее время продажи"
                />
                {/* <textarea
                    name="news_message"
                    value={formState.news_message}
                    onChange={handleChange}
                    placeholder="Сообщение для новостей"
                /> */}
                <button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Сохраняем..." : "Сохранить"}
                </button>
            </form>
        </div>
    );
}
