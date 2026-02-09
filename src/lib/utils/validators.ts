import { z } from 'zod';

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize URL to prevent XSS
 */
export function sanitizeUrl(url: string): string {
  // Remove javascript: and data: protocols
  const dangerous = /^(javascript|data|vbscript):/i;
  if (dangerous.test(url.trim())) {
    return '';
  }
  
  // Ensure protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  return url.trim();
}

/**
 * Validate username format (alphanumeric, dash, underscore)
 */
export function isValidUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_-]{3,30}$/;
  return regex.test(username);
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Zod schemas for validation
 */
export const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  url: z.string().min(1, 'URL is required').refine(isValidUrl, 'Invalid URL format'),
  icon: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const profileSchema = z.object({
  full_name: z.string().max(100, 'Name too long').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, dash, and underscore')
    .optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  contact_phone: z.string().max(20, 'Phone too long').optional(),
  location: z.string().max(100, 'Location too long').optional(),
});

export const activationCodeSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters').max(50),
});

export const orderSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().min(1).max(10),
  shipping_address: z.string().min(10, 'Please provide a complete address'),
  payment_method: z.enum(['cod', 'whatsapp']),
});

export type LinkInput = z.infer<typeof linkSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ActivationCodeInput = z.infer<typeof activationCodeSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
