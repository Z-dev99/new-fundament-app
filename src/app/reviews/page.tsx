"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/widgets/navbar/ui/Navbar";
import styles from "./Reviews.module.scss";
import { Pagination } from "@/widgets/cardsList/Pagination";
import { toast, Toaster } from "react-hot-toast";
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
} from "@/shared/api/reviewsApi";
import {
  MessageSquare,
  Star,
  User,
  Calendar,
  X,
  Send,
  Loader2,
  Quote,
  TrendingUp,
  Award,
  ThumbsUp,
  Sparkles,
  Heart,
} from "lucide-react";
import { HowToReview, FeedbackMatters, WhyTrustUs } from "@/widgets/reviewsBlocks";

const PER_PAGE = 12;

function getInitials(firstName: string, lastName?: string): string {
  const first = firstName?.charAt(0).toUpperCase() || "";
  const last = lastName?.charAt(0).toUpperCase() || "";
  return first + last || first || "?";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дней назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getRandomGradient(index: number): string {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  ];
  return gradients[index % gradients.length];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        },
    },
} as const;

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    review: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { data, isLoading, refetch } = useGetReviewsQuery({
    page,
    page_size: PER_PAGE,
  });
  const [addReview, { isLoading: isAdding }] = useCreateReviewMutation();

  const pages = data ? Math.ceil(data.total / PER_PAGE) : 1;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.first_name.trim()) {
      newErrors.first_name = "Введите ваше имя";
    } else if (form.first_name.trim().length < 2) {
      newErrors.first_name = "Имя должно содержать минимум 2 символа";
    }

    if (!form.review.trim()) {
      newErrors.review = "Введите текст отзыва";
    } else if (form.review.trim().length < 10) {
      newErrors.review = "Отзыв должен содержать минимум 10 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (touched[name] && errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      first_name: true,
      review: true,
    });

    if (!validateForm()) {
      toast.error("Пожалуйста, исправьте ошибки в форме");
      return;
    }

    try {
      await addReview(form).unwrap();
      toast.success("Отзыв успешно отправлен! Спасибо за ваш отзыв!");
      setForm({ first_name: "", last_name: "", review: "" });
      setErrors({});
      setTouched({});
      setModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || "Ошибка отправки отзыва");
    }
  };

  const stats = useMemo(() => {
    if (!data) return null;
    const reviews = data.reviews;
    return {
      total: data.total,
      averageLength: Math.round(
        reviews.reduce((acc, r) => acc + r.review.length, 0) /
        reviews.length
      ),
      averageRating: 5, // Все отзывы по умолчанию 5 звезд
      recentCount: reviews.filter((r) => {
        const date = new Date(r.created_at);
        const now = new Date();
        const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length,
    };
  }, [data]);

  return (
    <>
      <Navbar />
      <section className={styles.page}>
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

        <div className="container">
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>
                <MessageSquare size={48} />
              </div>
              <h1 className={styles.title}>Отзывы наших клиентов</h1>
              <p className={styles.subtitle}>
                Мы ценим каждого клиента. Вот что говорят люди, которые
                нашли или продали квартиру через наш сервис.
              </p>
              {stats && (
                <motion.div
                  className={styles.stats}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <motion.div
                    className={styles.statItem}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={styles.statIcon}>
                      <MessageSquare size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <strong>{stats.total}</strong>
                      <span>Всего отзывов</span>
                    </div>
                  </motion.div>
                  <motion.div
                    className={styles.statItem}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={styles.statIcon}>
                      <Star size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <strong>{stats.averageRating}.0</strong>
                      <span>Средний рейтинг</span>
                    </div>
                  </motion.div>
                  <motion.div
                    className={styles.statItem}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={styles.statIcon}>
                      <TrendingUp size={20} />
                    </div>
                    <div className={styles.statContent}>
                      <strong>{stats.recentCount}</strong>
                      <span>За месяц</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className={styles.addBtn}
              onClick={() => setModal(true)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} />
              <span>Оставить отзыв</span>
            </motion.button>
          </motion.div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Loader2 size={48} className={styles.spinner} />
              <p>Загрузка отзывов...</p>
            </div>
          ) : data && data.reviews.length > 0 ? (
            <>
              <motion.div
                className={styles.grid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    className={styles.card}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.cardHeader}>
                      <div
                        className={styles.avatar}
                        style={{
                          background: getRandomGradient(index),
                        }}
                      >
                        {getInitials(
                          review.first_name,
                          review.last_name
                        )}
                      </div>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorName}>
                          {review.first_name}{" "}
                          {review.last_name}
                        </div>
                        <div className={styles.date}>
                          <Calendar size={14} />
                          {formatDate(review.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className={styles.quoteIcon}>
                      <Quote size={24} />
                    </div>

                    <p className={styles.reviewText}>
                      {review.review}
                    </p>

                    <div className={styles.cardFooter}>
                      <div className={styles.rating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className={styles.star}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <div className={styles.reviewActions}>
                        <motion.button
                          className={styles.actionBtn}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ThumbsUp size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {pages > 1 && (
                <div className={styles.paginationWrapper}>
                  <Pagination
                    page={page}
                    pages={pages}
                    onChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <MessageSquare size={64} className={styles.emptyIcon} />
              <h3>Пока нет отзывов</h3>
              <p>Будьте первым, кто оставит отзыв!</p>
              <motion.button
                className={styles.emptyBtn}
                onClick={() => setModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare size={20} />
                Оставить первый отзыв
              </motion.button>
            </div>
          )}

          <WhyTrustUs />

          <HowToReview onOpenModal={() => setModal(true)} />

          <FeedbackMatters onOpenModal={() => setModal(true)} />
        </div>

        <AnimatePresence>
          {modal && (
            <motion.div
              className={styles.overlay}
              onClick={() => setModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>
                    <MessageSquare size={24} />
                    Оставить отзыв
                  </h2>
                  <button
                    className={styles.closeBtn}
                    onClick={() => setModal(false)}
                    aria-label="Закрыть"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  className={styles.modalForm}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="first_name">
                      <User size={16} />
                      Имя *
                    </label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Введите ваше имя"
                      value={form.first_name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("first_name")}
                      className={
                        touched.first_name && errors.first_name
                          ? styles.inputError
                          : ""
                      }
                      disabled={isAdding}
                    />
                    {touched.first_name && errors.first_name && (
                      <span className={styles.error}>
                        {errors.first_name}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="last_name">
                      <User size={16} />
                      Фамилия (необязательно)
                    </label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Введите вашу фамилию"
                      value={form.last_name}
                      onChange={handleChange}
                      disabled={isAdding}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="review">
                      <MessageSquare size={16} />
                      Ваш отзыв *
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      placeholder="Расскажите о вашем опыте..."
                      value={form.review}
                      onChange={handleChange}
                      onBlur={() => handleBlur("review")}
                      rows={6}
                      className={
                        touched.review && errors.review
                          ? styles.inputError
                          : ""
                      }
                      disabled={isAdding}
                    />
                    <div className={styles.charCount}>
                      {form.review.length} / 500 символов
                    </div>
                    {touched.review && errors.review && (
                      <span className={styles.error}>
                        {errors.review}
                      </span>
                    )}
                  </div>

                  <div className={styles.modalActions}>
                    <motion.button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={() => setModal(false)}
                      disabled={isAdding}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Отмена
                    </motion.button>
                    <motion.button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={isAdding}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isAdding ? (
                        <>
                          <Loader2
                            size={20}
                            className={styles.spinner}
                          />
                          <span>Отправка...</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <span>Отправить отзыв</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
