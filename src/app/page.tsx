"use client";

import { useState } from "react";

import RootLayout from "./layout";
import { Marquee } from "@/widgets/marquee/Marquee";
import { AdBlock } from "@/widgets/adBlock/AdBlock";
import NavTabs, { NavItem } from "@/widgets/navTabs/NavTabs";
import FiltersBar from "@/widgets/filtersBar/FiltersBar";
import { CardsList } from "@/widgets/cardsList/CardsList";

import { AiOutlineHome, AiOutlineStar } from "react-icons/ai";
import { Navbar } from "@/widgets/navbar/ui/Navbar";
import { AnalyticsCards } from "@/widgets/analyticsCards/AnalyticsCards";
import FeedbackForm from "@/widgets/feedbackForm/FeedbackForm";

export default function Page() {

  const [page, setPage] = useState(1);
  const perPage = 24;


  const adItems = [
    {
      id: 1,
      image:
        "https://cdn.ananasposter.ru/image/cache/catalog/poster/film/83/10267-1000x830.jpg",
      title: "Новостройки премиум-класса",
      text: "Лучшие предложения в вашем городе",
    },
    {
      id: 3,
      image:
        "https://cdn.ananasposter.ru/image/cache/catalog/poster/film/83/10267-1000x830.jpg",
      title: "Скидки на готовые квартиры",
      text: "Выгодные ипотечные ставки",
    },
  ];

  const navItems: Array<NavItem> = [
    { id: "main", label: "Главная", icon: <AiOutlineHome /> },
    { id: "design", label: "Дизайн", icon: <AiOutlineStar /> },
    { id: "studio", label: "Студия", icon: <AiOutlineStar /> },
    { id: "draft", label: "Черновой", icon: <AiOutlineStar /> },
    { id: "news", label: "Новинки", icon: <AiOutlineStar /> },
    { id: "left", label: "Левый берег", icon: <AiOutlineStar /> },
    { id: "right", label: "Правый берег", icon: <AiOutlineStar /> },
  ];


  const cards = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
      title: "3-комнатная на Ц-5",
      price: "880 000 000 сум",
      address: "Юнусабадский район",
      rooms: "3",
      area: "86",
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/259600/pexels-photo-259600.jpeg",
      title: "Евро-двушка возле метро",
      price: "530 000 000 сум",
      address: "Мирзо-Улугбек",
      rooms: "2",
      area: "54",
    },

    ...Array.from({ length: 148 }).map((_, i) => {
      const id = i + 3;

      const images = [
        "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
        "https://images.pexels.com/photos/259600/pexels-photo-259600.jpeg",
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
        "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
        "https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg",
        "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
        "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg",
        "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
      ];

      const titles = [
        "Евро-двушка в центре",
        "Студия с ремонтом",
        "3-комнатная уютная",
        "4-комнатная премиум",
        "Квартира с мебелью",
        "Элитная квартира",
        "Светлая евродвушка",
        "Панорамная студия",
      ];

      const districts = [
        "Юнусабадский район",
        "Мирзо-Улугбек",
        "Чиланзар",
        "Учтепа",
        "Яккасарай",
        "Сергели",
        "Шайхантахур",
        "Яшнабад",
      ];

      const rand = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

      return {
        id,
        image: rand(images),
        title: rand(titles),
        price: `${Math.floor(350 + Math.random() * 900)} 000 000 сум`,
        address: rand(districts),
        rooms: String(1 + Math.floor(Math.random() * 5)),
        area: String(40 + Math.floor(Math.random() * 90)),
      };
    }),
  ];


  const pages = Math.ceil(cards.length / perPage);
  const items = cards.slice((page - 1) * perPage, page * perPage);

  const changePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 700, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <Marquee />
      <AdBlock items={adItems} />
      <NavTabs
        items={navItems}
        active="main"
        onChange={(id) => console.log(id)}
      />
      <FiltersBar />
      <CardsList items={items} page={page} pages={pages} onPageChange={changePage} />
      <AnalyticsCards />
      <FeedbackForm />
    </div>
  );
}
