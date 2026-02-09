'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink, Share2, Check, MapPin, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';

interface TemplateProps {
  profile: Profile;
  links: LinkType[];
}

export function CardTemplate({ profile, links }: TemplateProps) {
  const theme = profile.theme_json as any;
  const [copied, setCopied] = useState(false);

  const fontClass = {
    inter: 'font-inter',
    poppins: 'font-poppins',
    'space-grotesk': 'font-space-grotesk',
    'work-sans': 'font-work-sans',
  }[theme.font as string] || 'font-inter';

  const radiusMap = {
    sm: '4px',
    md: '12px',
    lg: '24px',
    full: '32px',
  };

  const buttonRadius = radiusMap[theme.radius as keyof typeof radiusMap] || '12px';

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: profile.full_name || '', url });
      } catch (err) { }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied!');
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen py-12 px-6 ${fontClass} text-white relative overflow-hidden`}>
      <AnimatedBackground theme={theme} />

      <motion.div
        className="max-w-xl mx-auto relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Simple Header with Share */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-10" /> {/* Spacer */}
          <h1 className="text-sm font-bold tracking-widest uppercase opacity-50">Profile</h1>
          <button
            onClick={handleShare}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition border border-white/5 active:scale-95"
            style={{ color: theme.text }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Profile Card */}
        <motion.div
          variants={item}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 mb-8 shadow-2xl relative overflow-hidden"
          style={{ borderRadius: radiusMap['lg'] }} // Force large radius for card look
        >
          {/* Gradient glow behind avatar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-gold/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center text-center relative z-10">
            {profile.avatar_url && (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="mb-6 relative"
              >
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || ''}
                  width={110}
                  height={110}
                  className="rounded-2xl shadow-xl object-cover aspect-square"
                />
              </motion.div>
            )}

            <h2 className="text-3xl font-extrabold mb-2" style={{ color: theme.text }}>
              {profile.full_name}
            </h2>

            {profile.bio && (
              <p className="opacity-70 leading-relaxed max-w-sm mb-6 font-medium" style={{ color: theme.text }}>
                {profile.bio}
              </p>
            )}

            {(profile.location || profile.contact_email) && (
              <div className="flex gap-4 text-xs font-semibold opacity-60 uppercase tracking-wider" style={{ color: theme.text }}>
                {profile.location && <span>{profile.location}</span>}
                {profile.contact_email && <span>Email Me</span>}
              </div>
            )}
          </div>
        </motion.div>

        {/* Links Grid - 2 columns on mobile too? No, stuck to 1 for readability, maybe 2 for card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={item}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                fetch('/api/track-click', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ linkId: link.id }),
                });
              }}
              className="p-6 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group shadow-lg transition-colors duration-300"
              style={{
                backgroundColor: theme.primary,
                color: '#0B0F1A',
                borderRadius: buttonRadius,
                minHeight: '140px'
              }}
            >
              {/* Icon Bubble */}
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                {link.icon ? <SocialIcon icon={link.icon} className="w-6 h-6" /> : <ExternalLink className="w-5 h-5 opacity-70" />}
              </div>

              <span className="font-bold text-lg leading-tight">{link.title}</span>

              <ExternalLink className="absolute top-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-50 transition" />
            </motion.a>
          ))}
        </div>

        <motion.div variants={item} className="mt-12 text-center opacity-30 text-xs uppercase tracking-widest">
          Quickly Card
        </motion.div>

      </motion.div>
    </div>
  );
}
