import React from "react";
import styles from "./CardsList.module.css";
import { CardItem } from "./CardItem";
import { Pagination } from "./Pagination";
import { motion } from "framer-motion";

interface Card {
    id: number;
    title: string;
    price: string;
    address: string;
    rooms: string;
    area: string;
    image: string;
}

interface Props {
    items: Card[];
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
}

export const CardsList: React.FC<Props> = ({ items, page, pages, onPageChange }) => {
    return (
        <div className="container">
            <motion.div
                className={styles.grid}
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.08,
                        },
                    },
                }}
            >
                {items.map((card) => (
                    <motion.div
                        key={card.id}
                        variants={{
                            hidden: { opacity: 0, y: 20, scale: 0.96 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: { duration: 0.35, ease: "easeOut" },
                            },
                        }}
                    >
                        <CardItem
                            {...card}
                            images={[
                                "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
                                "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
                                "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
                                "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
                            ]}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <Pagination page={page} pages={pages} onChange={onPageChange} />
        </div>
    );
};
