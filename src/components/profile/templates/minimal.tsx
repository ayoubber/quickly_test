'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion } from 'framer-motion';

interface TemplateProps {
    profile: Profile;
    links: LinkType[];
}

export function MinimalTemplate({ profile, links }: TemplateProps) {
    const theme = profile.theme_json as any;
    const isDark = theme.bgType === 'solid' && theme.bg1 === '#000000'; // Simple check, ideally check contrast

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" as any } }
    };

    return (
        <div className={`min-h-screen py-24 px-8 md:px-32 font-serif ${isDark ? 'text-white' : 'text-neutral-900'} relative`}>
            <AnimatedBackground theme={theme} />

            <motion.div
                className="max-w-2xl mx-auto relative z-10"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Header - Left Aligned, Editorial Style */}
                <header className="mb-20">
                    {profile.avatar_url && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: 'circOut' }}
                            className="mb-8"
                        >
                            <Image
                                src={profile.avatar_url}
                                alt={profile.full_name || ''}
                                width={80}
                                height={80}
                                className="grayscale rounded-full"
                            />
                        </motion.div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-light tracking-tight mb-6 leading-none"
                    >
                        {profile.full_name}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col md:flex-row gap-8 md:items-start text-lg opacity-60 font-sans font-light"
                    >
                        <p className="max-w-md leading-relaxed">{profile.bio}</p>

                        <div className="flex flex-col gap-2 text-sm pt-1">
                            {profile.location && <span>{profile.location}</span>}
                            {profile.contact_email && <a href={`mailto:${profile.contact_email}`} className="hover:underline">Contact</a>}
                        </div>
                    </motion.div>
                </header>

                {/* Divider */}
                <motion.hr
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
                    className={`border-t ${isDark ? 'border-white/20' : 'border-black/10'} mb-12 origin-left`}
                />

                {/* Links List - Text only, minimal hover */}
                <div className="flex flex-col gap-2">
                    {links.map((link, i) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (i * 0.1), duration: 0.5 }}
                            className="group py-6 flex items-baseline justify-between border-b border-transparent hover:border-current transition-colors duration-300"
                            onClick={() => {
                                fetch('/api/track-click', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ linkId: link.id }),
                                });
                            }}
                        >
                            <div className="flex items-baseline gap-6">
                                <span className="text-xs font-sans opacity-40">0{i + 1}</span>
                                <span className="text-3xl md:text-4xl font-light group-hover:italic transition-all duration-300">
                                    {link.title}
                                </span>
                            </div>

                            <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </motion.a>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-32 text-xs font-sans opacity-20 uppercase tracking-widest"
                >
                    Quickly Portfolio System
                </motion.div>

            </motion.div>
        </div>
    );
}
