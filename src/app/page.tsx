'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { MobileNav } from '@/components/ui/mobile-nav';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { ArrowRight, Shield, Sparkles, Nfc, QrCode, Smartphone, Zap } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition">
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="/store" className="text-gray-300 hover:text-white transition">
                {tNav('store')}
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition">
                {tNav('services')}
              </Link>
              <Link href="/how-it-works" className="text-gray-300 hover:text-white transition">
                {tNav('howItWorks')}
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <LanguageToggle locale={locale} />
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">{tCommon('login')}</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">{tCommon('register')}</Button>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30">
              <span className="text-brand-gold font-semibold">{t('badge')}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('title')}{' '}
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/store">
                <Button size="lg" className="group">
                  {t('shopCards')}
                  <ArrowRight className="ms-2 w-5 h-5 group-hover:translate-x-1 transition" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  {t('seeHowItWorks')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">10K+</div>
                <div className="text-gray-400 text-sm">{t('trustedBy')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-brand-navy-light">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('featuresSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Nfc className="w-8 h-8" />}
              title={t('feature1Title')}
              description={t('feature1Desc')}
            />
            <FeatureCard
              icon={<QrCode className="w-8 h-8" />}
              title={t('feature2Title')}
              description={t('feature2Desc')}
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title={t('feature3Title')}
              description={t('feature3Desc')}
            />
            <FeatureCard
              icon={<Smartphone className="w-8 h-8" />}
              title={t('feature4Title')}
              description={t('feature4Desc')}
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title={t('feature5Title')}
              description={t('feature5Desc')}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title={t('feature6Title')}
              description={t('feature6Desc')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              {t('ctaSubtitle')}
            </p>
            <Link href="/store">
              <Button size="lg">
                {t('ctaButton')}
                <ArrowRight className="ms-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-navy" />
                </div>
                <span className="font-bold gradient-text">Quickly</span>
              </div>
              <p className="text-gray-400 text-sm">
                {tFooter('description')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{tFooter('product')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/store" className="hover:text-white transition">{tNav('store')}</Link></li>
                <li><Link href="/services" className="hover:text-white transition">{tNav('services')}</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition">{tNav('howItWorks')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{tFooter('company')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/contact" className="hover:text-white transition">{tNav('contact')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{tFooter('legal')}</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">{tFooter('privacy')}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">{tFooter('terms')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Quickly. {tFooter('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
      <div className="w-14 h-14 bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
        <div className="text-brand-gold">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
