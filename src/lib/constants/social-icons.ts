// Social icon mappings for link detection
export const SOCIAL_ICONS: Record<string, { icon: string; name: string; color: string }> = {
    'instagram.com': {
        icon: 'instagram',
        name: 'Instagram',
        color: '#E4405F',
    },
    'tiktok.com': {
        icon: 'tiktok',
        name: 'TikTok',
        color: '#000000',
    },
    'twitter.com': {
        icon: 'twitter',
        name: 'Twitter',
        color: '#1DA1F2',
    },
    'x.com': {
        icon: 'twitter',
        name: 'X',
        color: '#000000',
    },
    'facebook.com': {
        icon: 'facebook',
        name: 'Facebook',
        color: '#1877F2',
    },
    'linkedin.com': {
        icon: 'linkedin',
        name: 'LinkedIn',
        color: '#0A66C2',
    },
    'youtube.com': {
        icon: 'youtube',
        name: 'YouTube',
        color: '#FF0000',
    },
    'github.com': {
        icon: 'github',
        name: 'GitHub',
        color: '#181717',
    },
    'wa.me': {
        icon: 'whatsapp',
        name: 'WhatsApp',
        color: '#25D366',
    },
    'whatsapp.com': {
        icon: 'whatsapp',
        name: 'WhatsApp',
        color: '#25D366',
    },
    't.me': {
        icon: 'telegram',
        name: 'Telegram',
        color: '#26A5E4',
    },
    'telegram.org': {
        icon: 'telegram',
        name: 'Telegram',
        color: '#26A5E4',
    },
    'snapchat.com': {
        icon: 'snapchat',
        name: 'Snapchat',
        color: '#FFFC00',
    },
    'pinterest.com': {
        icon: 'pinterest',
        name: 'Pinterest',
        color: '#E60023',
    },
    'spotify.com': {
        icon: 'spotify',
        name: 'Spotify',
        color: '#1DB954',
    },
    'soundcloud.com': {
        icon: 'soundcloud',
        name: 'SoundCloud',
        color: '#FF5500',
    },
    'discord.gg': {
        icon: 'discord',
        name: 'Discord',
        color: '#5865F2',
    },
    'discord.com': {
        icon: 'discord',
        name: 'Discord',
        color: '#5865F2',
    },
    'twitch.tv': {
        icon: 'twitch',
        name: 'Twitch',
        color: '#9146FF',
    },
};

export function detectSocialIcon(url: string): { icon: string; name: string; color: string } | null {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        return SOCIAL_ICONS[hostname] || null;
    } catch {
        return null;
    }
}

export function getSocialIconColor(url: string): string {
    const social = detectSocialIcon(url);
    return social?.color || '#D4AF37';
}
