'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/actions/auth';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

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
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
                        <Zap className="w-7 h-7 text-brand-navy" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">Quickly</span>
                </Link>

                <div className="glass rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-gray-400">Start sharing your links today</p>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        <Input
                            name="full_name"
                            type="text"
                            label="Full Name"
                            placeholder="John Doe"
                            required
                        />

                        <Input
                            name="email"
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            required
                        />

                        <Input
                            name="password"
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />

                        <Input
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-brand-gold hover:text-brand-gold-light transition font-semibold">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
