import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function CardRedirectPage({ params }: { params: { uid: string } }) {
    const supabase = await createClient();

    // Find the card by UID
    const { data: card } = await supabase
        .from('cards')
        .select('assigned_to')
        .eq('card_uid', params.uid)
        .single();

    if (!card || !card.assigned_to) {
        // Card not found or not assigned - redirect to home with error
        redirect('/?error=card_not_found');
    }

    // Get the username for the assigned user
    const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', card.assigned_to)
        .single();

    if (!profile || !profile.username) {
        // User has no username set
        redirect('/?error=profile_not_setup');
    }

    // Redirect to the user's public profile
    redirect(`/u/${profile.username}`);
}
