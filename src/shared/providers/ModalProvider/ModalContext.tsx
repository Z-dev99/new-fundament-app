"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalName = string | null;

interface ModalContextProps {
    modal: ModalName;
    openModal: (name: ModalName) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export const useModal = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error("useModal must be used inside ModalProvider");
    return ctx;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modal, setModal] = useState<ModalName>(null);

    return (
        <ModalContext.Provider
            value={{
                modal,
                openModal: (name) => setModal(name),
                closeModal: () => setModal(null),
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
