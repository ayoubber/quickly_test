import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Star, Sparkles, CreditCard } from 'lucide-react';

const products = [
    {
        id: 'classic-black',
        name: 'Classic Black',
        price: 4500,
        currency: 'DZD',
        description: 'Elegant matte black NFC card with gold accent',
        image: '/templates/classic-black.jpg',
        badge: 'Best Seller',
        features: ['NFC + QR', 'Premium PVC', 'Custom design'],
    },
    {
        id: 'premium-gold',
        name: 'Premium Gold',
        price: 6500,
        currency: 'DZD',
        description: 'Luxurious gold finish with brushed metal texture',
        image: '/templates/premium-gold.jpg',
        badge: 'Premium',
        features: ['NFC + QR', 'Metal card', 'Laser engraving'],
    },
    {
        id: 'holographic',
        name: 'Holographic',
        price: 5500,
        currency: 'DZD',
        description: 'Eye-catching holographic design that stands out',
        image: '/templates/holographic.jpg',
        features: ['NFC + QR', 'Special coating', 'UV resistant'],
    },
    {
        id: 'custom-design',
        name: 'Custom Design',
        price: 8000,
        currency: 'DZD',
        description: 'Your brand, your design, your way',
        image: '/templates/custom.jpg',
        badge: 'Personalized',
        features: ['NFC + QR', 'Full custom', 'Brand assets'],
    },
];

export default function StorePage() {
    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Choose Your <span className="gradient-text">Card</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Premium NFC & QR cards designed to make an impression.
                        Order now and start connecting digitally.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden">
                            <div className="aspect-[4/3] bg-gradient-to-br from-brand-navy-dark to-brand-navy relative">
                                {product.badge && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded">
                                        {product.badge}
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CreditCard className="w-24 h-24 text-gray-600 group-hover:text-brand-gold transition-colors" />
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-400 mb-3">{product.description}</p>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {product.features.map((feature) => (
                                        <span key={feature} className="text-xs px-2 py-1 bg-white/5 rounded">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold">
                                        {product.price.toLocaleString()} <span className="text-sm text-gray-400">{product.currency}</span>
                                    </span>
                                    <Button size="sm">
                                        <ShoppingCart className="w-4 h-4 mr-1" />
                                        Order
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Order Process */}
                <div className="glass rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">How to Order</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-brand-gold">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">Choose Your Card</h3>
                            <p className="text-gray-400 text-sm">Select from our premium collection or request a custom design</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-brand-gold">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">Contact Us</h3>
                            <p className="text-gray-400 text-sm">Reach out via WhatsApp to confirm your order details</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-brand-gold">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">Receive & Activate</h3>
                            <p className="text-gray-400 text-sm">Get your card delivered and activate it in seconds</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <Button size="lg">
                            <Sparkles className="w-5 h-5 mr-2" />
                            Order via WhatsApp
                        </Button>
                        <p className="mt-3 text-sm text-gray-400">Cash on delivery available</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
