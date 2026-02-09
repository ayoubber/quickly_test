'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import { profileSchema } from '@/lib/utils/validators';
import { revalidatePath } from 'next/cache';
import { ThemeConfig, TemplateId } from '@/types/theme';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const validatedFields = profileSchema.safeParse({
    full_name: formData.get('full_name') as string,
    username: formData.get('username') as string,
    bio: formData.get('bio') as string,
    contact_email: formData.get('contact_email') as string,
    contact_phone: formData.get('contact_phone') as string,
    location: formData.get('location') as string,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  const updates = validatedFields.data;

  // Check username uniqueness if provided
  if (updates.username) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', updates.username)
      .neq('id', user.id)
      .single();

    if (existing) {
      return { error: 'Username already taken' };
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function updateTheme(theme: ThemeConfig) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ theme_json: theme as any })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  // Revalidate profile page and public page
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }
  revalidatePath('/dashboard/profile');

  return { success: true };
}

export async function updateTemplate(template_id: TemplateId) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ template_id })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  // Revalidate profile page and public page
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    revalidatePath(`/u/${profile.username}`);
  }
  revalidatePath('/dashboard/profile');

  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' };
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: 'File size must be less than 5MB' };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('public')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage
    .from('public')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: data.publicUrl })
    .eq('id', user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath('/dashboard/profile');
  return { success: true, url: data.publicUrl };
}

export async function checkUsernameAvailability(username: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!username || username.length < 3) {
    return { available: false, message: 'Username too short' };
  }

  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .neq('id', user?.id || '')
    .single();

  if (data) {
    return { available: false, message: 'Username already taken' };
  }

  return { available: true };
}
