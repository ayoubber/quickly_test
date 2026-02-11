import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Palette, Code, Megaphone, Wrench, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ServicesPage() {
    const t = await getTranslations('services');

    const services = [
        {
            icon: Palette,
            title: t('personalCards'),
            description: t('personalCardsDesc'),
            features: ['Brand alignment', 'Multiple revisions', 'Print-ready files'],
        },
        {
            icon: Code,
            title: t('businessCards'),
            description: t('businessCardsDesc'),
            features: ['Profile optimization', 'Link strategy', 'Analytics setup'],
        },
        {
            icon: Megaphone,
            title: t('customDesign'),
            description: t('customDesignDesc'),
            features: ['Volume discounts', 'Team management', 'Custom packaging'],
        },
        {
            icon: Wrench,
            title: t('integration'),
            description: t('integrationDesc'),
            features: ['API access', 'White-label options', 'Priority support'],
        },
    ];

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">{t('title')}</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Card key={service.title} className="p-6">
                                <CardContent className="p-0">
                                    <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-brand-gold" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                    <p className="text-gray-400 mb-4">{service.description}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                                                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="glass rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('support')}</h2>
                    <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                        {t('supportDesc')}
                    </p>
                    <Link href="/contact">
                        <Button size="lg">
                            Contact Us
                            <ArrowRight className="w-5 h-5 ms-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
