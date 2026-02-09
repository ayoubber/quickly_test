import {
    Instagram,
    Twitter,
    Youtube,
    Facebook,
    Linkedin,
    Github,
    Globe,
    Mail,
    Phone,
    MapPin,
    Link as LinkIcon,
    Music2, // Placeholder for TikTok
    Video, // Placeholder for TikTok/Twitch
    Send // Telegram
} from 'lucide-react';
// I'll stick to Lucide for now to avoid dependency issues unless user asks. 
// I'll stick to Lucide for now to avoid dependency issues unless user asks. 
// Actually, let's just use a custom SVG for Tiktok if needed or a generic one.
// For now, I'll use Lucide's `Music2` or `Video` as a fallback for TikTok, or just text.
// Better: I'll map "tiktok" to a specific Lucide icon or just let it be text if I can't find a perfect match.
// Wait, I can make a custom SVG component inside here for TikTok!

export function SocialIcon({ icon, className = "w-5 h-5" }: { icon: string | null, className?: string }) {
    if (!icon) return <LinkIcon className={className} />;

    const lowerIcon = icon.toLowerCase().trim();

    // Custom TikTok SVG
    if (lowerIcon === 'tiktok') {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0" // TikTok logo usually filled
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 3.13-2.6 5.7-5.8 5.76-3.23.07-5.96-2.43-6.14-5.6-.17-3.07 2.22-5.74 5.3-5.93.99-.06 1.99.16 2.92.54v4.29c-.43-.37-1-.54-1.57-.54-1.42.06-2.58 1.25-2.55 2.67.0 1.4.99 2.58 2.38 2.65 1.39.06 2.57-.96 2.66-2.35.04-3.32.01-6.64.01-9.96 0-1.55-.03-3.1.04-3.65-.01-.36-.02-.73-.02-1.09.0-.36.0-.73.0-1.1z" />
            </svg>
        );
    }

    // Lucide mappings
    switch (lowerIcon) {
        case 'instagram':
        case 'ig':
            return <Instagram className={className} />;
        case 'twitter':
        case 'x':
            return <Twitter className={className} />;
        case 'youtube':
        case 'yt':
            return <Youtube className={className} />;
        case 'facebook':
        case 'fb':
            return <Facebook className={className} />;
        case 'linkedin':
        case 'in':
            return <Linkedin className={className} />;
        case 'github':
        case 'git':
            return <Github className={className} />;
        case 'website':
        case 'web':
            return <Globe className={className} />;
        case 'email':
        case 'mail':
            return <Mail className={className} />;
        case 'phone':
        case 'call':
        case 'whatsapp': // Use Phone for now
            return <Phone className={className} />;
        case 'telegram':
            return <Send className={className} />;
        case 'map':
        case 'location':
            return <MapPin className={className} />;
        default:
            // If it's a single emoji (or short text), render it as text
            if (icon && icon.length < 5 && /\p{Emoji}/u.test(icon)) {
                return <span className="text-xl leading-none">{icon}</span>;
            }
            // If it's not a known key and not an emoji, default to generic link
            return <LinkIcon className={className} />;
    }
}

// Helper function to detect social platform from URL
export function detectSocialPlatform(url: string): string | null {
    if (!url) return null;
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes('instagram.com')) return 'instagram';
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube';
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) return 'facebook';
    if (lowerUrl.includes('linkedin.com')) return 'linkedin';
    if (lowerUrl.includes('github.com')) return 'github';
    if (lowerUrl.includes('tiktok.com')) return 'tiktok';
    if (lowerUrl.includes('t.me') || lowerUrl.includes('telegram.org')) return 'telegram';
    if (lowerUrl.includes('wa.me') || lowerUrl.includes('whatsapp.com')) return 'whatsapp';
    if (lowerUrl.includes('mailto:')) return 'email';

    return null;
}
