import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import CheckoutPageClient from './page-client';

export default async function CheckoutPage({ params }: { params: { productId: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.productId)
        .single();

    if (!product) {
        notFound();
    }

    return <CheckoutPageClient product={product} />;
}
