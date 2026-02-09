'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import { orderSchema } from '@/lib/utils/validators';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData: any) {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Calculate amount based on product price
    const { data: product } = await supabase
        .from('products')
        .select('price, is_active')
        .eq('id', formData.product_id)
        .single();

    if (!product || !product.is_active) {
        return { error: 'Product not available' };
    }

    const amount = product.price * (formData.quantity || 1);

    const validatedFields = orderSchema.safeParse({
        product_id: formData.product_id,
        quantity: formData.quantity,
        shipping_address: formData.shipping_address,
        payment_method: formData.payment_method,
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.errors[0].message,
        };
    }

    const { product_id, quantity, shipping_address, payment_method } = validatedFields.data;

    const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        product_id,
        quantity,
        amount,
        shipping_address,
        payment_method,
        status: 'pending',
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/dashboard');
    revalidatePath('/admin/orders');

    return { success: true };
}
