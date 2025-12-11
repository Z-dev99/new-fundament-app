"use client";

import { Navbar } from "@/widgets/navbar/ui/Navbar";
import styles from "./Reviews.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { Pagination } from "@/widgets/cardsList/Pagination";

const PER_PAGE = 12;

const initialReviews = [
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
  {
    name: "Анастасия Р.",
    text: "Нашла идеальную квартиру за один день! Фильтры очень удобные, фотографии реальные, а владелец сразу вышел на связь.",
    avatar: "/img/avatars/1.jpg",
    company: "Купила квартиру на Чиланзаре",
  },
  {
    name: "Дамир Х.",
    text: "Арендовал жильё без посредников. Всё прозрачно, документы оформлены быстро.",
    avatar: "/img/avatars/does-not-exist.jpg",
    company: "Снял квартиру в Юнусабаде",
  },
  {
    name: "Ирина М.",
    text: "Очень удобный сайт! Нашли просторную квартиру для семьи буквально за вечер.",
    avatar: "",
    company: "Нашли квартиру в Мирабаде",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    text: "",
    avatar: "",
  });

  const pages = Math.ceil(reviews.length / PER_PAGE);
  const start = (page - 1) * PER_PAGE;
  const current = reviews.slice(start, start + PER_PAGE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.text.trim()) {
      alert("Имя и текст обязательны!");
      return;
    }

    const newReview = {
      name: form.name.trim(),
      company: form.company.trim() || "Клиент",
      text: form.text.trim(),
      avatar: form.avatar.trim(),
    };

    setReviews([newReview, ...reviews]);
    setPage(1);
    setModal(false);
    setForm({ name: "", company: "", text: "", avatar: "" });
  };

  return (
    <section className={styles.section}>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.title}>Отзывы наших клиентов</h2>

        <p className={styles.subtitle}>
          Мы ценим каждого клиента. Вот что говорят люди, которые нашли или продали квартиру через наш сервис.
        </p>

        <button className={styles.addBtn} onClick={() => setModal(true)}>
          Оставить отзыв
        </button>

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
                  placeholder="Ваше имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Компания или статус"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />

                <textarea
                  placeholder="Ваш отзыв"
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  required
                />

                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setModal(false)}>
                    Отмена
                  </button>
                  <button type="submit">Добавить</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        <motion.div className={styles.grid} variants={containerVariants} initial="hidden" animate="visible">
          {current.map((r, i) => (
            <motion.div
              key={i}
              className={styles.card}
              whileHover={{ scale: 1.03, boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className={styles.avatarWrap}>
                {r.avatar ? (
                  <img
                    src={r.avatar}
                    alt={r.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const icon = e.currentTarget.parentElement?.querySelector(".fallbackIcon");
                      if (icon) icon.classList.add("showIcon");
                    }}
                  />
                ) : null}
                <svg viewBox="0 0 24 24" className="fallbackIcon">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff3d79" />
                      <stop offset="35%" stopColor="#ff6a5c" />
                      <stop offset="70%" stopColor="#ff9f3f" />
                      <stop offset="100%" stopColor="#ffc93b" />
                    </linearGradient>
                  </defs>

                  <path
                    fill="url(#grad)"
                    d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                  />
                </svg>
              </div>

              <p className={styles.text}>“{r.text}”</p>

              <div className={styles.info}>
                <strong>{r.name}</strong>
                <span>{r.company}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <Pagination
          page={page}
          pages={pages}
          onChange={(p) => {
            setPage(p);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />

      </div>
    </section>
  );
}
