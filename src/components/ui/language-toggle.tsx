'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';

export function LanguageToggle({ locale }: { locale: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <button
            onClick={toggleLanguage}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-medium disabled:opacity-50"
            title={locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
        >
            <Languages className="w-4 h-4" />
            <span>{locale === 'en' ? 'عربي' : 'EN'}</span>
        </button>
    );
}
