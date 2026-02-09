'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import { activationCodeSchema } from '@/lib/utils/validators';
import { revalidatePath } from 'next/cache';

export async function activateCard(code: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const validatedFields = activationCodeSchema.safeParse({ code });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  // Check if code exists and is not used
  const { data: activation, error: fetchError } = await supabase
    .from('card_activations')
    .select('*, cards(*)')
    .eq('activation_code', code)
    .eq('is_used', false)
    .single();

  if (fetchError || !activation) {
    return { error: 'Invalid or already used activation code' };
  }

  // Check if card is available
  const card = Array.isArray(activation.cards) ? activation.cards[0] : activation.cards;

  if (!card || card.status !== 'in_stock') {
    return { error: 'Card is not available for activation' };
  }

  // Start transaction: update card and activation
  const { error: cardError } = await supabase
    .from('cards')
    .update({
      status: 'assigned',
      assigned_to: user.id,
      activated_at: new Date().toISOString(),
    })
    .eq('id', activation.card_id);

  if (cardError) {
    return { error: 'Failed to activate card' };
  }

  const { error: activationError } = await supabase
    .from('card_activations')
    .update({
      user_id: user.id,
      is_used: true,
      used_at: new Date().toISOString(),
    })
    .eq('id', activation.id);

  if (activationError) {
    // Rollback card update
    await supabase
      .from('cards')
      .update({
        status: 'in_stock',
        assigned_to: null,
        activated_at: null,
      })
      .eq('id', activation.card_id);

    return { error: 'Failed to complete activation' };
  }

  revalidatePath('/dashboard/cards');

  return { success: true, cardUid: card.card_uid };
}

export async function getUserCards() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: cards, error } = await supabase
    .from('cards')
    .select('*')
    .eq('assigned_to', user.id)
    .order('activated_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { cards };
}
