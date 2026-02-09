'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/ui/social-icon';

interface TemplateProps {
    profile: Profile;
    links: LinkType[];
}

export function WaveTemplate({ profile, links }: TemplateProps) {
    const theme = profile.theme_json as any;
    const primaryColor = theme.primary || '#FF6B6B';
    const bgColor = theme.bg1 || '#FFF5F5';

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen font-sans relative overflow-x-hidden" style={{ backgroundColor: bgColor, color: theme.text || '#000' }}>

            {/* SVG Wave Header */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(116%+1.3px)] h-[300px] md:h-[400px]">
                    <defs>
                        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: theme.bg2 || primaryColor, stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: primaryColor, stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="url(#headerGrad)"></path>
                </svg>
            </div>

            <motion.div
                className="max-w-xl mx-auto relative z-10 pt-32 px-6 pb-12"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Profile Card Floating over Wave */}
                <motion.div
                    variants={item}
                    className="flex flex-col items-center text-center mb-12"
                >
                    {profile.avatar_url && (
                        <div className="mb-6 p-2 bg-white rounded-full shadow-xl">
                            <Image
                                src={profile.avatar_url}
                                alt={profile.full_name || ''}
                                width={140}
                                height={140}
                                className="rounded-full object-cover aspect-square"
                                style={{ border: `4px solid ${primaryColor}` }}
                            />
                        </div>
                    )}

                    <div className={`py-4 px-8 rounded-3xl shadow-lg bg-white/90 backdrop-blur-sm border border-white/50 -mt-4`}>
                        <h1 className="text-3xl font-bold mb-1 text-gray-900">
                            {profile.full_name}
                        </h1>
                        <p className="text-lg text-gray-600 font-medium">
                            {profile.username ? `@${profile.username}` : ''}
                        </p>
                    </div>

                    {profile.bio && (
                        <p className="mt-6 text-lg max-w-sm leading-relaxed opacity-80 font-medium">
                            {profile.bio}
                        </p>
                    )}
                </motion.div>

                {/* Links with 'Blob' or Organic Shapes */}
                <div className="space-y-5">
                    {links.map((link, i) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={item}
                            whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                fetch('/api/track-click', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ linkId: link.id }),
                                });
                            }}
                            className="group block w-full py-5 px-8 rounded-[2rem] shadow-md border-2 border-transparent hover:border-current transition-all duration-300 relative overflow-hidden"
                            style={{
                                backgroundColor: 'white',
                                color: '#333'
                            }}
                        >
                            {/* Colorful border effect via background gradient trick or inset shadow? Let's use simple left border accent */}
                            <div className="absolute left-0 top-0 bottom-0 w-3" style={{ backgroundColor: primaryColor }} />

                            <div className="flex items-center justify-between pl-4">
                                <div className="flex items-center gap-4">
                                    {link.icon && (
                                        <div className="group-hover:scale-125 transition-transform" style={{ color: primaryColor }}>
                                            <SocialIcon icon={link.icon} className="w-6 h-6" />
                                        </div>
                                    )}
                                    <span className="font-bold text-lg group-hover:text-black transition-colors">
                                        {link.title}
                                    </span>
                                </div>
                                <ExternalLink className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: primaryColor }} />
                            </div>
                        </motion.a>
                    ))}
                </div>

            </motion.div>

            {/* Footer Pattern */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(${primaryColor} 2px, transparent 2px)`,
                    backgroundSize: '20px 20px'
                }}
            />
        </div>
    );
}
