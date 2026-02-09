'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/actions/auth';
import { Zap, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
                        <Zap className="w-7 h-7 text-brand-navy" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">Quickly</span>
                </Link>

                <div className="glass rounded-2xl p-8">
                    {isSuccess ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
                            <p className="text-gray-400 mb-6">
                                We've sent a password reset link to your email address.
                            </p>
                            <Link href="/auth/login">
                                <Button variant="outline" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                                <p className="text-gray-400">Enter your email to receive a reset link</p>
                            </div>

                            <form action={handleSubmit} className="space-y-6">
                                <Input
                                    name="email"
                                    type="email"
                                    label="Email"
                                    placeholder="you@example.com"
                                    required
                                />

                                <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                    Send Reset Link
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition inline-flex items-center gap-1">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to login
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
