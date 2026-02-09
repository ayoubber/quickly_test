'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink, MapPin, Mail, Github, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TemplateProps {
    profile: Profile;
    links: LinkType[];
}

import { SocialIcon } from '@/components/ui/social-icon';

export function BentoTemplate({ profile, links }: TemplateProps) {
    const theme = profile.theme_json as any;
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setColumns(3);
            else setColumns(1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className={`min-h-screen py-12 px-4 md:px-8 font-sans text-white relative overflow-hidden`}>
            <AnimatedBackground theme={theme} />

            <motion.div
                className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Profile Card - Spans 2 cols on desktop */}
                <motion.div
                    variants={item}
                    className="md:col-span-2 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 flex flex-col justify-center items-start shadow-xl relative overflow-hidden group"
                    style={{
                        color: theme.text,
                        background: `linear-gradient(135deg, ${theme.bg2 || 'rgba(255,255,255,0.1)'}, rgba(255,255,255,0.05))`
                    }}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                        {/* Decorative pattern or huge icon */}
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-transparent blur-3xl" />
                    </div>

                    <div className="flex items-center gap-6 mb-6">
                        {profile.avatar_url && (
                            <div className="relative">
                                <Image
                                    src={profile.avatar_url}
                                    alt={profile.full_name || ''}
                                    width={100}
                                    height={100}
                                    className="rounded-full shadow-lg object-cover aspect-square border-2 border-white/20"
                                />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">{profile.full_name}</h1>
                            <p className="opacity-80 font-medium text-lg">{profile.username ? `@${profile.username}` : ''}</p>
                        </div>
                    </div>

                    <p className="text-lg opacity-90 leading-relaxed max-w-lg mb-6">
                        {profile.bio}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-auto">
                        {profile.location && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 text-sm font-medium">
                                <MapPin className="w-4 h-4" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile.contact_email && (
                            <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 hover:bg-black/30 transition text-sm font-medium">
                                <Mail className="w-4 h-4" />
                                <span>Email</span>
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Map or secondary info card (Placeholder for now, maybe a 'Contact' block) */}
                <motion.div
                    variants={item}
                    className="md:col-span-1 bg-black/40 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center shadow-xl hover:bg-black/50 transition duration-300"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-orange-500 mb-4 flex items-center justify-center text-black">
                        <span className="text-3xl font-bold">Q</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">My Links</h3>
                    <p className="opacity-60 text-sm">Check out my curated resources below.</p>
                </motion.div>

                {/* Links Grid */}
                {links.map((link, i) => (
                    <motion.a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={item}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
              relative overflow-hidden rounded-3xl p-6 border border-white/10 shadow-lg group flex flex-col justify-between
              ${i % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'} 
              min-h-[160px]
            `}
                        style={{
                            backgroundColor: theme.primary,
                            color: '#0B0F1A' // dark text on cards usually looks best for bento
                        }}
                        onClick={() => {
                            fetch('/api/track-click', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ linkId: link.id }),
                            });
                        }}
                    >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                <SocialIcon icon={link.icon} className="w-6 h-6" />
                            </div>
                            <ExternalLink className="w-5 h-5 opacity-40 group-hover:opacity-100 transition" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-1 leading-tight">{link.title}</h3>
                            <p className="text-sm opacity-60 truncate">{new URL(link.url).hostname}</p>
                        </div>
                    </motion.a>
                ))}

            </motion.div>

            <div className="mt-12 text-center opacity-30 hover:opacity-100 transition duration-500">
                <p className="text-sm font-medium">Powered by Quickly</p>
            </div>
        </div>
    );
}
