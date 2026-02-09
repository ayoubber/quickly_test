'use client';

import { motion } from 'framer-motion';
import { ThemeConfig } from '@/types/theme';

interface AnimatedBackgroundProps {
    theme: ThemeConfig;
}

export function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
    // If image background, just show image
    if (theme.bgType === 'image' && theme.bgImage) {
        return (
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: `url(${theme.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>
        );
    }

    // If solid, just show solid color
    // Special case for Glitch: usually pure black or very dark grey
    // Special case for Minimal: solid color (usually white/off-white or black)
    if (theme.bgType === 'solid') {
        return (
            <div
                className="fixed inset-0 -z-10"
                style={{ backgroundColor: theme.bg1 }}
            />
        );
    }

    // Gradient / Dynamic Mesh (Default for Classic & Bento)
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: theme.bg1 }}>
            {/* Base Gradient */}
            <div
                className="absolute inset-0 opacity-80"
                style={{
                    background: `linear-gradient(${theme.bgGradientAngle || 135}deg, ${theme.bg1}, ${theme.bg2 || theme.bg1})`
                }}
            />

            {/* Floating Orbs / Mesh Effect - Only if not specific themes that might want clean */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px]"
                style={{ backgroundColor: theme.primary || '#D4AF37' }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -50, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px]"
                style={{ backgroundColor: theme.bg2 || '#1F2937' }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full blur-[80px]"
                style={{ backgroundColor: theme.primary || '#D4AF37' }}
            />

            {/* Noise Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
            />
        </div>
    );
}
