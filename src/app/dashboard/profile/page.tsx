import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileEditPageClient from './page-client';

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return <ProfileEditPageClient initialProfile={profile} />;
}
