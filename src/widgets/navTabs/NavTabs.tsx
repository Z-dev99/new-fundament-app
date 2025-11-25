"use client";

import React from "react";
import styles from "./NavTabs.module.scss";

export type NavItem = {
    id: string;
    label: string;
    icon: React.ReactNode;
};

type Props = {
    items: NavItem[];
    active: string;
    onChange: (id: string) => void;
};

const NavTabs: React.FC<Props> = ({ items, active, onChange }) => {
    return (
        <div className={`${styles.wrapper} container`}>
            <div className={styles.list}>
                {items.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.item} ${active === item.id ? styles.active : ""
                            }`}
                        onClick={() => onChange(item.id)}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NavTabs;
