'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/actions/orders';

export default function CheckoutPageClient({ product }: { product: any }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        shipping_address: '',
        payment_method: 'cod',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await createOrder({
            product_id: product.id,
            quantity: 1,
            ...formData,
        });

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success('Order placed! We will contact you soon.');
            router.push('/dashboard');
        }

        setIsSubmitting(false);
    }

    return (
        <div className="min-h-screen pt-24 pb-12">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="bg-brand-navy-light/50 p-6 rounded-lg border border-white/10 mb-8 flex gap-6 items-center">
                    {/* Product Image placeholder if needed */}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-gray-400 mb-2">{product.description}</p>
                        <div className="text-2xl font-bold text-brand-gold">${product.price}</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Shipping Address</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.shipping_address}
                            onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                            placeholder="Full Name&#10;Street Address&#10;City, State, ZIP&#10;Phone Number"
                            className="w-full px-4 py-3 rounded-lg bg-brand-navy-light border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/50 placeholder:text-gray-500"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">Payment Method</label>

                        <label className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all ${formData.payment_method === 'cod'
                                ? 'border-brand-gold bg-brand-gold/5'
                                : 'border-white/10 bg-brand-navy-light hover:border-white/20'
                            }`}>
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked={formData.payment_method === 'cod'}
                                onChange={() => setFormData({ ...formData, payment_method: 'cod' })}
                                className="w-5 h-5 text-brand-gold border-gray-600 focus:ring-brand-gold bg-transparent"
                            />
                            <div>
                                <div className="font-semibold">Cash on Delivery</div>
                                <div className="text-sm text-gray-400">Pay when you receive the card</div>
                            </div>
                        </label>

                        <label className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border transition-all ${formData.payment_method === 'whatsapp'
                                ? 'border-brand-gold bg-brand-gold/5'
                                : 'border-white/10 bg-brand-navy-light hover:border-white/20'
                            }`}>
                            <input
                                type="radio"
                                name="payment"
                                value="whatsapp"
                                checked={formData.payment_method === 'whatsapp'}
                                onChange={() => setFormData({ ...formData, payment_method: 'whatsapp' })}
                                className="w-5 h-5 text-brand-gold border-gray-600 focus:ring-brand-gold bg-transparent"
                            />
                            <div>
                                <div className="font-semibold">WhatsApp Order</div>
                                <div className="text-sm text-gray-400">Complete payment via WhatsApp chat</div>
                            </div>
                        </label>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg mt-8" isLoading={isSubmitting}>
                        Place Order - ${product.price}
                    </Button>

                    <p className="text-center text-sm text-gray-400 mt-4">
                        Secure checkout. Your data is protected.
                    </p>
                </div>
            </form>
        </div>
    );
}
