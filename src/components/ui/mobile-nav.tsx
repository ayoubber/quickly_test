'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useTranslations, useLocale } from 'next-intl';

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const tNav = useTranslations('nav');
    const tCommon = useTranslations('common');
    const locale = useLocale();

    const navLinks = [
        { name: tNav('store'), href: '/store' },
        { name: tNav('services'), href: '/services' },
        { name: tNav('howItWorks'), href: '/how-it-works' },
        { name: tNav('blog'), href: '/blog' },
        { name: tNav('contact'), href: '/contact' },
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile menu dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-brand-navy/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
                    <nav className="flex flex-col px-6 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-gray-300 hover:text-white transition px-4 py-3 rounded-lg hover:bg-white/5"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                            <div className="flex justify-center mb-2">
                                <LanguageToggle locale={locale} />
                            </div>
                            <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                                <Button variant="ghost" className="w-full">{tCommon('login')}</Button>
                            </Link>
                            <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                                <Button className="w-full">{tCommon('register')}</Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
