"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollTopButton() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setShow(window.scrollY > 200);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    onClick={scrollToTop}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background:
                            "linear-gradient(90deg, #ff375f 0%, #ff6b3d 30%, #ffa722 65%, #ffd60a 100%)",
                        color: "#fff",
                        fontSize: "22px",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                    aria-label="Наверх"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    ↑
                </motion.button>
            )}
        </AnimatePresence>
    );
}
