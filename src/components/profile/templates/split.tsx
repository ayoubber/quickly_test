'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink, Share2, MapPin, Mail, Phone, Check } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';

interface TemplateProps {
  profile: Profile;
  links: LinkType[];
}

export function SplitTemplate({ profile, links }: TemplateProps) {
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
        await navigator.share({ title: profile.full_name || '', url });
      } catch (err) { }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied!');
    }
  }

  return (
    <div className={`min-h-screen ${fontClass} text-white relative overflow-hidden flex flex-col md:flex-row`}>
      <AnimatedBackground theme={theme} />

      {/* Left/Top Panel - Profile Info */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full md:w-1/2 min-h-[40vh] md:min-h-screen flex flex-col items-center justify-center p-8 relative z-10"
      >
        {/* Glass Card for Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl text-center max-w-md w-full relative overflow-hidden">
          {/* Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

          {profile.avatar_url && (
            <motion.div
              className="mb-6 relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || ''}
                width={140}
                height={140}
                className="rounded-full border-4 border-white/20 shadow-xl object-cover aspect-square"
              />
            </motion.div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight" style={{ color: theme.text }}>
            {profile.full_name}
          </h1>

          {profile.bio && (
            <p className="text-lg opacity-80 leading-relaxed mb-6" style={{ color: theme.text }}>
              {profile.bio}
            </p>
          )}

          {/* Contact Chips */}
          <div className="flex flex-wrap justify-center gap-3 text-sm" style={{ color: theme.text }}>
            {profile.location && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.contact_email && (
              <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 hover:bg-black/30 transition">
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Right/Bottom Panel - Links */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="w-full md:w-1/2 min-h-[60vh] md:min-h-screen p-8 flex flex-col relative z-10"
      >
        {/* Share absolute top right on desktop */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition border border-white/5"
            style={{ color: theme.text }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span className="text-sm font-medium">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto space-y-4 mt-12 md:mt-0">
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full py-5 px-6 relative overflow-hidden group shadow-lg"
              style={{
                backgroundColor: theme.primary,
                color: '#0B0F1A',
                borderRadius: buttonRadius,
              }}
              onClick={() => {
                fetch('/api/track-click', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ linkId: link.id }),
                });
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  {link.icon && <SocialIcon icon={link.icon} className="w-6 h-6" />}
                  <span className="font-bold text-lg">{link.title}</span>
                </div>
                <ExternalLink className="w-5 h-5 opacity-40 group-hover:opacity-100 transition duration-300" />
              </div>

              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </motion.a>
          ))}
        </div>

        <div className="mt-8 text-center md:text-right opacity-30 text-sm p-4">
          <p>Powered by Quickly</p>
        </div>
      </motion.div>
    </div>
  );
}
