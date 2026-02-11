import { Zap } from 'lucide-react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    showText?: boolean;
    textClassName?: string;
}

export default function Logo({ className = "w-10 h-10", showText = true, textClassName = "text-xl" }: LogoProps) {
    // UNCOMMENT THIS BLOCK TO USE AN IMAGE LOGO
    /*
    return (
        <div className="flex items-center gap-2">
            <div className={`relative ${className}`}>
                <Image 
                    src="/logo.png" 
                    alt="Quickly Logo" 
                    fill 
                    className="object-contain"
                />
            </div>
            {showText && <span className={`font-bold gradient-text ${textClassName}`}>Quickly</span>}
        </div>
    );
    */

    // DEFAULT ICON LOGO
    return (
        <div className="flex items-center gap-2">
            <div className={`${className} bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center`}>
                <Zap className="w-3/5 h-3/5 text-brand-navy" />
            </div>
            {showText && <span className={`font-bold gradient-text ${textClassName}`}>Quickly</span>}
        </div>
    );
}
