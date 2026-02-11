import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { MobileNav } from '@/components/ui/mobile-nav';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { getTranslations, getLocale } from 'next-intl/server';

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = await getTranslations('nav');
    const tCommon = await getTranslations('common');
    const tFooter = await getTranslations('footer');
    const locale = await getLocale();

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-brand-navy" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Quickly</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/store" className="text-gray-300 hover:text-white transition">
                            {t('store')}
                        </Link>
                        <Link href="/services" className="text-gray-300 hover:text-white transition">
                            {t('services')}
                        </Link>
                        <Link href="/how-it-works" className="text-gray-300 hover:text-white transition">
                            {t('howItWorks')}
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <LanguageToggle locale={locale} />
                        <Link href="/auth/login">
                            <Button variant="ghost">{tCommon('login')}</Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button>{tCommon('register')}</Button>
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <MobileNav />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-brand-navy-dark border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-brand-navy" />
                                </div>
                                <span className="text-lg font-bold gradient-text">Quickly</span>
                            </Link>
                            <p className="text-gray-400 text-sm">
                                {tFooter('description')}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">{tFooter('product')}</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/store" className="hover:text-white transition">{t('store')}</Link></li>
                                <li><Link href="/how-it-works" className="hover:text-white transition">{t('howItWorks')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">{tFooter('company')}</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/services" className="hover:text-white transition">{t('services')}</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition">{t('contact')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">{tFooter('legal')}</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/privacy" className="hover:text-white transition">{tFooter('privacy')}</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition">{tFooter('terms')}</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
                        {tFooter('copyright', { year: new Date().getFullYear() })}
                    </div>
                </div>
            </footer>
        </div>
    );
}
