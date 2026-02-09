'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink, Terminal, ChevronRight } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SocialIcon } from '@/components/ui/social-icon';


interface TemplateProps {
    profile: Profile;
    links: LinkType[];
}

export function GlitchTemplate({ profile, links }: TemplateProps) {
    const theme = profile.theme_json as any;
    const [text, setText] = useState('');
    const fullText = profile.bio || "System Online...";

    // Typing effect for bio
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setText(fullText.slice(0, i + 1));
            i++;
            if (i > fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, [fullText]);

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className={`min-h-screen py-12 px-6 font-mono text-[#0f0] relative overflow-hidden bg-black selection:bg-[#0f0] selection:text-black`}>
            {/* Scanlines Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] animate-scanlines" />

            <AnimatedBackground theme={{ ...theme, bgType: 'solid', bg1: '#000' }} />

            <motion.div
                className="max-w-md mx-auto relative z-10"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Header */}
                <div className="mb-12 border-b-2 border-[#0f0] pb-6 relative">
                    <div className="absolute -bottom-1.5 left-0 w-3 h-3 bg-[#0f0]" />
                    <div className="absolute -bottom-1.5 right-0 w-3 h-3 bg-[#0f0]" />

                    <motion.div variants={item} className="flex justify-center mb-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#0f0] rounded-none blur opacity-40 group-hover:opacity-75 transition duration-100 animate-pulse" />
                            <Image
                                src={profile.avatar_url || 'https://github.com/shadcn.png'}
                                alt="Avatar"
                                width={120}
                                height={120}
                                className="relative z-10 border-2 border-[#0f0] bg-black grayscale group-hover:grayscale-0 transition duration-300"
                            />
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={item}
                        className="text-4xl font-bold text-center uppercase tracking-tighter mb-2"
                        style={{ textShadow: '2px 2px 0px #ff00ff' }}
                    >
                        {profile.full_name}
                    </motion.h1>

                    <motion.div variants={item} className="bg-[#0f0]/10 p-4 border-l-4 border-[#0f0]">
                        <div className="flex items-center gap-2 mb-2 text-xs uppercase opacity-70">
                            <Terminal className="w-3 h-3" />
                            <span>Bio.exe</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            {text}<span className="animate-pulse">_</span>
                        </p>
                    </motion.div>
                </div>

                {/* Links */}
                <div className="space-y-4">
                    {links.map((link) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={item}
                            whileHover={{ x: 10, backgroundColor: 'rgba(0, 255, 0, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            className="block w-full border border-[#0f0] p-4 relative group overflow-hidden bg-black"
                            onClick={() => {
                                fetch('/api/track-click', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ linkId: link.id }),
                                });
                            }}
                        >
                            {/* Glitch Hover Effect Elements */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#0f0] transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-200" />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="mr-6 text-[#0f0] group-hover:text-white transition-colors duration-100 relative z-10">
                                        <SocialIcon icon={link.icon} className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-[#0f0] group-hover:text-white transition-colors">
                                        {link.title}
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#ff00ff]" />
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Footer */}
                <motion.div variants={item} className="mt-16 text-center border-t border-[#0f0]/30 pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition cursor-help">
                        System ID: QCKLY-v1.0
                    </p>
                </motion.div>

            </motion.div>
        </div>
    );
}
