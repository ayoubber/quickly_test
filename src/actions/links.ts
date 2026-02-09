'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import { linkSchema } from '@/lib/utils/validators';
import { sanitizeUrl } from '@/lib/utils/validators';
import { revalidatePath } from 'next/cache';

export async function createLink(formData: FormData) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const url = (formData.get('url') as string) || '';
  const sanitizedUrl = sanitizeUrl(url);

  const validatedFields = linkSchema.safeParse({
    title: (formData.get('title') as string) || '',
    url: sanitizedUrl,
    icon: (formData.get('icon') as string) || undefined,
    is_active: formData.get('is_active') !== 'false',
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const { title, url: finalUrl, icon, is_active } = validatedFields.data;

  // Get max sort_order
  const { data: maxLink } = await supabase
    .from('links')
    .select('sort_order')
    .eq('user_id', user.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const sort_order = (maxLink?.sort_order ?? -1) + 1;

  const { error } = await supabase.from('links').insert({
    user_id: user.id,
    title,
    url: sanitizeUrl(url as string),
    icon,
    is_active,
    sort_order,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/links');

  // Revalidate public page if username exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }

  return { success: true };
}

export async function updateLink(linkId: string, formData: FormData) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const url = (formData.get('url') as string) || '';
  const sanitizedUrl = sanitizeUrl(url);

  const validatedFields = linkSchema.safeParse({
    title: (formData.get('title') as string) || '',
    url: sanitizedUrl,
    icon: (formData.get('icon') as string) || undefined,
    is_active: formData.get('is_active') !== 'false',
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const { title, url: finalUrl, icon, is_active } = validatedFields.data;

  const { error } = await supabase
    .from('links')
    .update({
      title,
      url: sanitizeUrl(url as string),
      icon,
      is_active,
    })
    .eq('id', linkId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/links');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }

  return { success: true };
}

export async function deleteLink(linkId: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/links');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }

  return { success: true };
}

export async function toggleLink(linkId: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Get current state
  const { data: link } = await supabase
    .from('links')
    .select('is_active')
    .eq('id', linkId)
    .eq('user_id', user.id)
    .single();

  if (!link) {
    return { error: 'Link not found' };
  }

  const { error } = await supabase
    .from('links')
    .update({ is_active: !link.is_active })
    .eq('id', linkId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/links');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }

  return { success: true };
}

export async function reorderLinks(linkIds: string[]) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Update sort_order for each link
  const updates = linkIds.map((id, index) =>
    supabase
      .from('links')
      .update({ sort_order: index })
      .eq('id', id)
      .eq('user_id', user.id)
  );

  await Promise.all(updates);

  revalidatePath('/dashboard/links');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }

  return { success: true };
}
