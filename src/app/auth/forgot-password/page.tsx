'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/actions/auth';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Logo from '@/components/ui/logo';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const t = useTranslations('auth');

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);

        const email = formData.get('email') as string;
        const result = await resetPassword(email);

        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
        } else {
            setIsSuccess(true);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
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
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">{t('checkEmail')}</h1>
                            <p className="text-gray-400 mb-6">
                                {t('checkEmail')}
                            </p>
                            <Link href="/auth/login">
                                <Button variant="outline" className="w-full">
                                    {t('backToLogin')}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-2">{t('forgotTitle')}</h1>
                                <p className="text-gray-400">{t('forgotSubtitle')}</p>
                            </div>

                            <form action={handleSubmit} className="space-y-6">
                                <Input
                                    name="email"
                                    type="email"
                                    label={t('emailLabel')}
                                    placeholder={t('emailPlaceholder')}
                                    required
                                />

                                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                    {isLoading ? t('sending') : t('sendReset')}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition inline-flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" />
                                    {t('backToLogin')}
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
