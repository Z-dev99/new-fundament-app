"use client";

import { Navbar } from "@/widgets/navbar/ui/Navbar";
import styles from "./Reviews.module.css";
import { motion } from "framer-motion";

const reviews = [
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

// ---------- ANIMATION VARIANTS ----------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function ReviewsPage() {
  return (
    <section className={styles.section}>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.title}>Отзывы наших клиентов</h2>

        <p className={styles.subtitle}>
          Мы ценим каждого клиента. Вот что говорят люди, которые нашли или продали квартиру через наш сервис.
        </p>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              className={styles.card}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
              }}
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
      </div>
    </section>
  );
}
