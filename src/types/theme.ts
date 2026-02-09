import { TemplateId } from './database';
export type { TemplateId };

export interface ThemeConfig {
  bgType: 'solid' | 'gradient' | 'image';
  bg1: string; // Primary background color or solid color
  bg2?: string; // Secondary color for gradient
  bgGradientAngle?: number; // Gradient angle (default 135deg)
  bgImage?: string; // URL for background image
  primary: string; // Button color
  text: string; // Text color
  radius: 'sm' | 'md' | 'lg'; // Border radius
  font: 'inter' | 'poppins' | 'space-grotesk' | 'work-sans';
}

export interface Profile {
  id: string;
  role: 'admin' | 'client';
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  template_id: TemplateId;
  theme_json: ThemeConfig;
  is_active: boolean;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  clicks_count: number;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  profile: Profile;
  links: Link[];
}

export const DEFAULT_THEME: ThemeConfig = {
  bgType: 'gradient',
  bg1: '#0B0F1A',
  bg2: '#1F2937',
  bgGradientAngle: 135,
  primary: '#D4AF37',
  text: '#FFFFFF',
  radius: 'lg',
  font: 'inter',
};

export const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter', className: 'font-sans' },
  { value: 'poppins', label: 'Poppins', className: 'font-sans' },
  { value: 'space-grotesk', label: 'Space Grotesk', className: 'font-mono' },
  { value: 'work-sans', label: 'Work Sans', className: 'font-sans' },
];

export const RADIUS_OPTIONS = [
  { value: 'sm', label: 'Small', className: 'rounded-sm' },
  { value: 'md', label: 'Medium', className: 'rounded-md' },
  { value: 'lg', label: 'Large', className: 'rounded-lg' },
];
