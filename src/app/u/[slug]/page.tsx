import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ClassicTemplate } from '@/components/profile/templates/classic';
import { CardTemplate } from '@/components/profile/templates/card';
import { SplitTemplate } from '@/components/profile/templates/split';
import { BentoTemplate } from '@/components/profile/templates/bento';
import { GlitchTemplate } from '@/components/profile/templates/glitch';
import { MinimalTemplate } from '@/components/profile/templates/minimal';
import { InfluenceTemplate } from '@/components/profile/templates/influence';
import { WaveTemplate } from '@/components/profile/templates/wave';
import type { Metadata } from 'next';

// Template registry
const TEMPLATES = {
  classic: ClassicTemplate,
  card: CardTemplate,
  split: SplitTemplate,
  bento: BentoTemplate,
  glitch: GlitchTemplate,
  minimal: MinimalTemplate,
  influence: InfluenceTemplate,
  wave: WaveTemplate,
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, avatar_url')
    .eq('username', params.slug)
    .eq('is_active', true)
    .single();

  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }

  return {
    title: `${profile.full_name || params.slug} - Quickly`,
    description: profile.bio || `Connect with ${profile.full_name || params.slug}`,
    openGraph: {
      title: profile.full_name || params.slug,
      description: profile.bio || '',
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.slug)
    .eq('is_active', true)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch active links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  // Log page view (fire and forget)
  supabase
    .from('page_views')
    .insert({
      user_id: profile.id,
      referrer: '',
      country: '',
    })
    .then(() => { }); // Ignore errors

  // Select template component
  const Template = TEMPLATES[profile.template_id as keyof typeof TEMPLATES] || TEMPLATES.classic;

  return <Template profile={profile as any} links={links || []} />;
}
