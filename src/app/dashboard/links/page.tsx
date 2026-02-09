import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LinksPageClient from './page-client';

export default async function LinksPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

    return <LinksPageClient initialLinks={links || []} />;
}
