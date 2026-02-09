'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink, MapPin, Mail, Phone, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';

interface TemplateProps {
  profile: Profile;
  links: LinkType[];
}

export function ClassicTemplate({ profile, links }: TemplateProps) {
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
    md: '8px',
    lg: '12px',
    full: '9999px',
  };

  const buttonRadius = radiusMap[theme.radius as keyof typeof radiusMap] || '8px';

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.full_name || '',
          text: profile.bio || '',
          url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied to clipboard!');
    }
  }

  async function handleLinkClick(link: LinkType) {
    // Track click (fire and forget)
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId: link.id }),
    });
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen py-12 px-6 ${fontClass} text-white relative overflow-hidden`}>
      <AnimatedBackground theme={theme} />

      <motion.div
        className="max-w-md mx-auto relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Top Controls */}
        <motion.div variants={item} className="flex justify-end mb-8">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition border border-white/5 active:scale-95 duration-200"
            style={{ color: theme.text }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span className="text-sm font-medium">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          variants={item}
          className="backdrop-blur-xl bg-black/20 rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />

          {/* Avatar */}
          {profile.avatar_url && (
            <motion.div
              className="mb-6 flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-lg transform scale-110" />
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || ''}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white/10 shadow-xl relative z-10 object-cover aspect-square"
                />
              </div>
            </motion.div>
          )}

          {/* Name & Bio */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight" style={{ color: theme.text }}>
              {profile.full_name}
            </h1>
            {profile.bio && (
              <p className="text-lg opacity-80 mb-6 leading-relaxed font-light" style={{ color: theme.text }}>
                {profile.bio}
              </p>
            )}

            {/* Contact Info Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm" style={{ color: theme.text }}>
              {profile.location && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <MapPin className="w-3.5 h-3.5 opacity-70" />
                  <span className="opacity-90">{profile.location}</span>
                </div>
              )}
              {profile.contact_email && (
                <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition">
                  <Mail className="w-3.5 h-3.5 opacity-70" />
                  <span className="opacity-90">{profile.contact_email}</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Links List */}
        <motion.div variants={container} className="space-y-4">
          {links.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              variants={item}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full py-4 px-6 relative overflow-hidden group"
              style={{
                backgroundColor: theme.primary,
                color: '#0B0F1A', // Always dark text on button for contrast, or customizable? Assuming primary is light/gold.
                borderRadius: buttonRadius,
                boxShadow: `0 4px 20px -5px ${theme.primary}50` // Coloured shadow
              }}
            >
              {/* Button inner shine/gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  <SocialIcon icon={link.icon} className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-3 pl-10"> {/* Added pl-10 to make space for the icon */}
                  <span className="font-bold text-lg">{link.title}</span>
                </div>
                <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div variants={item} className="mt-16 text-center">
          <a href="/" className="inline-flex items-center gap-2 opacity-40 hover:opacity-100 transition duration-300 group">
            <span className="text-sm font-medium tracking-wide">Powered by</span>
            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-gold to-brand-gold-light group-hover:scale-105 transition">Quickly</span>
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
