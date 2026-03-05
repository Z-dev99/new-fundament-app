// Временная страница: просто редиректит на главную,
// регистрация теперь происходит через модальное окно из Navbar.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/");
    }, [router]);

    return null;
}

