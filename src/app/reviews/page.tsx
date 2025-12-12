"use client";

import { Navbar } from "@/widgets/navbar/ui/Navbar";
import styles from "./Reviews.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { Pagination } from "@/widgets/cardsList/Pagination";
import { toast, Toaster } from "react-hot-toast";
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
} from "@/shared/api/reviewsApi";

const PER_PAGE = 12;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", review: "" });

  const { data, isLoading, refetch } = useGetReviewsQuery({ page, page_size: PER_PAGE });
  const [addReview, { isLoading: isAdding }] = useCreateReviewMutation();

  const pages = data ? Math.ceil(data.total / PER_PAGE) : 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.review.trim()) {
      toast.error("Имя и текст отзыва обязательны!");
      return;
    }

    try {
      await addReview(form).unwrap();
      toast.success("Отзыв успешно отправлен!");
      setForm({ first_name: "", last_name: "", review: "" });
      setModal(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.message || "Ошибка отправки отзыва");
    }
  };

  return (
    <section className={styles.section}>
      <Navbar />
      <Toaster position="top-right" />
      <div className={styles.container}>
        <h2 className={styles.title}>Отзывы наших клиентов</h2>
        <p className={styles.subtitle}>
          Мы ценим каждого клиента. Вот что говорят люди, которые нашли или продали квартиру через наш сервис.
        </p>

        <button className={styles.addBtn} onClick={() => setModal(true)}>Оставить отзыв</button>

        {modal && (
          <div className={styles.overlay} onClick={() => setModal(false)}>
            <motion.div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <h3>Добавить отзыв</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Имя"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Фамилия (необязательно)"
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                />
                <textarea
                  placeholder="Ваш отзыв"
                  value={form.review}
                  onChange={(e) => setForm({ ...form, review: e.target.value })}
                  required
                />
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setModal(false)}>Отмена</button>
                  <button type="submit" disabled={isAdding}>{isAdding ? "Отправка..." : "Добавить"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isLoading ? (
          <p>Загрузка отзывов...</p>
        ) : (
          <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="visible">
            {data?.reviews.map((r) => (
              <motion.div
                key={r.id}
                className={styles.card}
                whileHover={{ scale: 1.03, boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <p className={styles.text}>“{r.review}”</p>
                <div className={styles.info}>
                  <strong>{r.first_name} {r.last_name}</strong>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <Pagination page={page} pages={pages} onChange={(p) => setPage(p)} />
      </div>
    </section>
  );
}
