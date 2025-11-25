'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

interface NavLinkProps extends Omit<LinkProps, 'href'> {
    href: LinkProps['href'];
    children: ReactNode;
    activeClassName?: string;
    className?: string;
}

export default function NavLink({
    href,
    children,
    activeClassName,
    className,
    ...rest
}: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;
    const combinedClassName = [className, isActive ? activeClassName : '']
        .filter(Boolean)
        .join(' ');

    return (
        <Link href={href} className={combinedClassName} {...rest}>
            {children}
        </Link>
    );
}
