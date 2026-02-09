import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Check, Star } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 4500,
        currency: 'DZD',
        description: 'Perfect for individuals',
        features: [
            '1 NFC + QR Card',
            'Unlimited links',
            'Basic analytics',
            'Classic template',
            'Email support',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Premium',
        price: 7500,
        currency: 'DZD',
        description: 'For professionals',
        features: [
            '1 Metal NFC + QR Card',
            'Unlimited links',
            'Advanced analytics',
            'All templates',
            'Custom colors',
            'Priority support',
            'Remove branding',
        ],
        cta: 'Go Premium',
        popular: true,
    },
    {
        name: 'Business',
        price: 25000,
        currency: 'DZD',
        description: 'For teams & companies',
        features: [
            '5 NFC + QR Cards',
            'Team management',
            'Unlimited links',
            'Advanced analytics',
            'Custom branding',
            'All templates',
            'API access',
            'Dedicated support',
        ],
        cta: 'Contact Us',
        popular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Simple <span className="gradient-text">Pricing</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        One-time payment. No hidden fees. Lifetime access.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`relative ${plan.popular ? 'border-brand-gold' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-gold text-brand-navy text-sm font-bold rounded-full flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    Popular
                                </div>
                            )}
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price.toLocaleString()}</span>
                                    <span className="text-gray-400 ml-1">{plan.currency}</span>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                                            <Check className="w-4 h-4 text-brand-gold flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/store">
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? 'primary' : 'outline'}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQ */}
                <div className="glass rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div>
                            <h4 className="font-semibold mb-2">Is it a subscription?</h4>
                            <p className="text-gray-400 text-sm">
                                No! It's a one-time payment. You own your card and profile forever.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">How do I pay?</h4>
                            <p className="text-gray-400 text-sm">
                                Cash on delivery (COD) or bank transfer. Contact us via WhatsApp.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Can I update my links?</h4>
                            <p className="text-gray-400 text-sm">
                                Yes! Update your links anytime from your dashboard at no extra cost.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">What if my card breaks?</h4>
                            <p className="text-gray-400 text-sm">
                                We offer replacement cards at a discounted rate. Contact support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
