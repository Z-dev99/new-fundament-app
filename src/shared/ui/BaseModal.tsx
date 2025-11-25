"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface BaseModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: number | string;
    classNameBackdrop?: string; // чтобы можно было добавить свои стили
    classNameModal?: string;
}

export const BaseModal = ({
    open,
    onClose,
    children,
    width = 420,
    classNameBackdrop,
    classNameModal,
}: BaseModalProps) => {

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
    }, [open]);

    if (typeof window === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    onClick={onClose}
                    className={classNameBackdrop} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className={classNameModal} 
                        style={{ width }}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
