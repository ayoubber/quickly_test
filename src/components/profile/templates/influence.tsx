'use client';

import { Profile, Link as LinkType } from '@/types/theme';
import Image from 'next/image';
import { ExternalLink, Instagram, Twitter, Youtube, Facebook, Mail } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { motion } from 'framer-motion';
import { SocialIcon } from '@/components/ui/social-icon';

interface TemplateProps {
    profile: Profile;
    links: LinkType[];
}

export function InfluenceTemplate({ profile, links }: TemplateProps) {
    const theme = profile.theme_json as any;

    // Influence template works best with an image, but fallback to a dark luxurious gradient
    const bgImage = theme.bgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } as any }
    };

    return (
        <div className="min-h-screen font-sans text-white relative overflow-hidden flex flex-col items-center justify-between py-12 px-6">

            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transform scale-105"
                style={{
                    backgroundImage: `url(${bgImage})`,
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/90" />
            </div>

            <motion.div
                className="max-w-md w-full relative z-10 flex flex-col items-center"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Header Section */}
                <motion.div variants={item} className="text-center mb-10">
                    {profile.avatar_url ? (
                        <div className="mb-6 relative inline-block group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                            <Image
                                src={profile.avatar_url}
                                alt={profile.full_name || ''}
                                width={128}
                                height={128}
                                className="relative rounded-full border-2 border-white/50 object-cover aspect-square"
                            />
                        </div>
                    ) : null}

                    <h1 className="text-4xl font-black tracking-tight mb-2 drop-shadow-lg">
                        {profile.full_name}
                    </h1>
                    <p className="text-lg font-medium opacity-90 drop-shadow-md max-w-xs mx-auto">
                        {profile.bio}
                    </p>
                </motion.div>

                {/* Links Section */}
                <div className="w-full space-y-4">
                    {links.map((link) => (
                        <motion.a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variants={item}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                fetch('/api/track-click', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ linkId: link.id }),
                                });
                            }}
                            className="block w-full py-4 px-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-center font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-white/10 hover:border-white/40 group relative overflow-hidden"
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                            <div className="flex items-center justify-center gap-3 relative z-10">
                                {link.icon && <SocialIcon icon={link.icon} className="w-5 h-5 opacity-90" />}
                                <span>{link.title}</span>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Social Icons row (Mockup for now, could be dynamic later) */}
                <motion.div variants={item} className="mt-12 flex gap-6 justify-center">
                    {[Instagram, Twitter, Youtube, Mail].map((Icon, i) => (
                        <div key={i} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition cursor-pointer backdrop-blur-sm">
                            <Icon className="w-6 h-6" />
                        </div>
                    ))}
                </motion.div>

            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="mt-8 text-xs font-semibold tracking-widest uppercase"
            >
                Quickly.
            </motion.div>
        </div>
    );
}
