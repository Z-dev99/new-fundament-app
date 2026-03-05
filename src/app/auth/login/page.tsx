// Временная страница: просто редиректит на главную,
// авторизация теперь происходит через модальное окно из Navbar.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/");
    }, [router]);

    return null;
}

