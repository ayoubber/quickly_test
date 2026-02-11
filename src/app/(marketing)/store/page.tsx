import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

// Revalidate every minute
export const revalidate = 60;

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    images: string[] | null;
    is_active: boolean;
    created_at: string;
}

async function getProducts() {
    const supabase = createClient();
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

    return data || [];
}

export default async function StorePage() {
    const products = await getProducts();
    const t = await getTranslations('store');

    return (
        <div className="py-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t('title')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {products.map((product: Product) => (
                            <Card key={product.id} className="group overflow-hidden border-white/5 hover:border-brand-gold/30 transition-all duration-300">
                                <div className="aspect-[4/3] bg-gradient-to-br from-brand-navy-dark to-brand-navy relative overflow-hidden">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <CreditCard className="w-16 h-16 text-white/10 group-hover:text-brand-gold/50 transition-colors" />
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-5">
                                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">{product.description}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="font-bold text-xl text-white">
                                            {product.price.toLocaleString()} <span className="text-sm text-brand-gold">DZD</span>
                                        </div>
                                        <Link href={`/checkout/${product.id}`}>
                                            <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0">
                                                <ShoppingCart className="w-4 h-4 me-2" />
                                                {t('orderNow')}
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl mb-16">
                        <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-300">{t('noProducts')}</h3>
                    </div>
                )}

                {/* Order Process */}
                <div className="glass rounded-2xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold mb-8 text-center">{t('howItWorksTitle')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-brand-gold">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">{t('step1Title')}</h3>
                            <p className="text-gray-400 text-sm">{t('step1Desc')}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-brand-gold">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">{t('step2Title')}</h3>
                            <p className="text-gray-400 text-sm">{t('step2Desc')}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-brand-gold">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">{t('step3Title')}</h3>
                            <p className="text-gray-400 text-sm">{t('step3Desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
