'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/actions/auth';
import Logo from '@/components/ui/logo';
import OAuthButtons from '@/components/auth/oauth-buttons';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('auth');

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const result = await signUp(formData);

        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-6">
                        <Link href="/">
                            <Logo className="w-12 h-12" textClassName="text-3xl" />
                        </Link>
                    </div>
                </div>

                <div className="glass rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">{t('registerTitle')}</h1>
                        <p className="text-gray-400">{t('registerSubtitle')}</p>
                    </div>

                    <OAuthButtons />

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#1f2937] px-2 text-gray-400">
                                {t('orContinueWith')}
                            </span>
                        </div>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        <Input
                            name="full_name"
                            type="text"
                            label={t('fullNameLabel')}
                            placeholder={t('fullNamePlaceholder')}
                            required
                        />

                        <Input
                            name="email"
                            type="email"
                            label={t('emailLabel')}
                            placeholder={t('emailPlaceholder')}
                            required
                        />

                        <Input
                            name="password"
                            type="password"
                            label={t('passwordLabel')}
                            placeholder={t('passwordPlaceholder')}
                            required
                            minLength={8}
                        />

                        <Input
                            name="confirmPassword"
                            type="password"
                            label={t('passwordLabel')}
                            placeholder={t('passwordPlaceholder')}
                            required
                            minLength={8}
                        />

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            {isLoading ? t('signingUp') : t('signUp')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        {t('hasAccount')}{' '}
                        <Link href="/auth/login" className="text-brand-gold hover:text-brand-gold-light transition font-semibold">
                            {t('signIn')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
