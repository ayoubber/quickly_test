import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Palette, Code, Megaphone, Wrench, ArrowRight } from 'lucide-react';

const services = [
    {
        icon: Palette,
        title: 'Custom Card Design',
        description: 'Get a unique card design that perfectly represents your brand. Our designers create stunning visuals that make lasting impressions.',
        features: ['Brand alignment', 'Multiple revisions', 'Print-ready files'],
    },
    {
        icon: Code,
        title: 'Profile Setup',
        description: 'We help you set up and optimize your digital profile for maximum engagement. Get more clicks and connections.',
        features: ['Profile optimization', 'Link strategy', 'Analytics setup'],
    },
    {
        icon: Megaphone,
        title: 'Bulk Orders',
        description: 'Perfect for businesses and events. Order cards for your entire team with volume discounts and consistent branding.',
        features: ['Volume discounts', 'Team management', 'Custom packaging'],
    },
    {
        icon: Wrench,
        title: 'Enterprise Solutions',
        description: 'Custom integrations, dedicated support, and advanced features for large organizations.',
        features: ['API access', 'White-label options', 'Priority support'],
    },
];

export default function ServicesPage() {
    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Our <span className="gradient-text">Services</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Beyond NFC cards, we offer comprehensive solutions to elevate your digital presence.
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                        Contact us to discuss your needs. We'll help you find the perfect solution.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">
                            Contact Us
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
