"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { Marquee } from "@/widgets/marquee/Marquee";
import { AdBlock } from "@/widgets/adBlock/AdBlock";
import NavTabs, { NavItem } from "@/widgets/navTabs/NavTabs";
import FiltersBar from "@/widgets/filtersBar/FiltersBar";
import { CardsList } from "@/widgets/cardsList/CardsList";

import { AiOutlineBuild, AiOutlineCheck, AiOutlineStar } from "react-icons/ai";
import { Navbar } from "@/widgets/navbar/ui/Navbar";
import { AnalyticsCards } from "@/widgets/analyticsCards/AnalyticsCards";
import FeedbackForm from "@/widgets/feedbackForm/FeedbackForm";

const FixedAdBlock = ({ position = "left", title = "Реклама" }: { position?: "left" | "right"; title?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: position === "left" ? -50 : 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    style={{
      position: "fixed",
      [position]: "12px",
      top: "10%",
      width: "200px",
      height: "520px",
      background: "linear-gradient(135deg, #ececec, #cfcfcf)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "20px",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      textAlign: "center",
      cursor: "pointer",
      zIndex: 50,
    }}
  >
    {title}
  </motion.div>
);


const GreyAdBlock = ({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    style={{
      background: "linear-gradient(135deg, #e2e2e2, #d0d0d0)",
      width: "100%",
      height: "280px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      margin: "24px 0",
      fontWeight: "bold",
      fontSize: "20px",
      color: "#333",
      cursor: "pointer",
      borderRadius: "16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    }}
  >
    {title}
  </motion.div>
);
export default function Page() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("new-builds");
  const [isMobile, setIsMobile] = useState(false);
  const perPage = 24;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adItems = [
    { id: 1, image: "https://cdn.ananasposter.ru/image/cache/catalog/poster/film/83/10267-1000x830.jpg", title: "Новостройки премиум-класса", text: "Лучшие предложения в вашем городе" },
    { id: 2, image: "https://cdn.ananasposter.ru/image/cache/catalog/poster/film/83/10267-1000x830.jpg", title: "Скидки на готовые квартиры", text: "Выгодные ипотечные ставки" },
  ];

  const navItems: Array<NavItem> = [
    { id: "new-builds", label: "Новостройки", icon: <AiOutlineStar /> },
    { id: "under-construction", label: "Строится", icon: <AiOutlineBuild /> },
    { id: "ready", label: "Готовые к заселению", icon: <AiOutlineCheck /> },
  ];

  const cards = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    image: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
    title: `Квартира ${i + 1}`,
    price: `${300 + i * 10} 000 000 сум`,
    address: "Район " + ((i % 5) + 1),
    rooms: String(1 + (i % 4)),
    area: String(40 + (i % 60)),
  }));

  const pages = Math.ceil(cards.length / perPage);
  const items = cards.slice((page - 1) * perPage, page * perPage);

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 700, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
        {!isMobile && <FixedAdBlock position="left" title="Место для вашей рекламы" />}
        {!isMobile && <FixedAdBlock position="right" title="Место для вашей рекламы" />}
        <div className="container">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Marquee />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <AdBlock items={adItems} />
          </motion.div>
          <NavTabs
            items={navItems.map((item) => ({ ...item, icon: item.icon }))}
            active={activeTab}
            onChange={(id) => setActiveTab(id)}
          />
          <FiltersBar />
          {isMobile && <GreyAdBlock title="Место для вашей рекламы" />}
          <CardsList
            items={items.map((card, index) => ({
              ...card,
              motionProps: {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.4, delay: index * 0.05 },
              },
            }))}
            page={page}
            pages={pages}
            onPageChange={changePage}
          />
          {isMobile && <GreyAdBlock title="Место для вашей рекламы" />}
          <AnalyticsCards />
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
}
