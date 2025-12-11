"use client";

import { useEffect, useState } from "react";
import { ModalProvider } from "@/shared/providers/ModalProvider/ModalContext";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoaded = () => {
            setTimeout(() => setLoading(false), 500);
        };

        if (document.readyState === "complete") handleLoaded();
        else window.addEventListener("load", handleLoaded);

        return () => window.removeEventListener("load", handleLoaded);
    }, []);

    return (
        <ReduxProvider store={store}>
            <ModalProvider>
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 9999,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "white",
                                transition: "opacity 0.5s ease",
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                                style={{
                                    width: "75px",
                                    height: "75px",
                                    borderRadius: "50%",
                                    border: "6px solid rgba(0,0,0,0.08)",
                                    borderTop: "6px solid transparent",
                                    background: `
                                        linear-gradient(90deg,
                                        #ff3d79 0%,
                                        #ff6a5c 30%,
                                        #ff9f3f 65%,
                                        #ffc93b 100%)
                                    `,
                                    backgroundClip: "border-box",
                                    WebkitMask:
                                        "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
                                    mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))"
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {children}
                <Toaster position="bottom-center" />
            </ModalProvider>
        </ReduxProvider>
    );
}
