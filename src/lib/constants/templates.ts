// Template configurations
export const TEMPLATES = {
    classic: {
        id: 'classic',
        name: 'Classic',
        description: 'Simple centered layout with stacked buttons',
        preview: '/templates/classic-preview.png',
    },
    card: {
        id: 'card',
        name: 'Card',
        description: 'Card-based sections with subtle shadows',
        preview: '/templates/card-preview.png',
    },
    split: {
        id: 'split',
        name: 'Split',
        description: 'Header banner with content area for a brand feel',
        preview: '/templates/split-preview.png',
    },
} as const;

export type TemplateId = keyof typeof TEMPLATES;

export const DEFAULT_TEMPLATE: TemplateId = 'classic';

export const DEFAULT_THEME = {
    bgType: 'gradient' as const,
    bg1: '#0B0F1A',
    bg2: '#1F2937',
    primary: '#D4AF37',
    text: '#FFFFFF',
    radius: 'lg' as const,
    font: 'inter' as const,
};

export const FONT_OPTIONS = [
    { value: 'inter', label: 'Inter' },
    { value: 'outfit', label: 'Outfit' },
    { value: 'roboto', label: 'Roboto' },
];

export const RADIUS_OPTIONS = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'full', label: 'Full' },
];

export const BG_TYPE_OPTIONS = [
    { value: 'solid', label: 'Solid Color' },
    { value: 'gradient', label: 'Gradient' },
];
