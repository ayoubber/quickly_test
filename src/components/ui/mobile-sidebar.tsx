'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function MobileSidebar({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Hamburger button - only visible on mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-brand-navy-dark/90 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile sidebar drawer */}
            <div
                className={`
                    md:hidden fixed inset-y-0 left-0 z-[80] w-64
                    bg-brand-navy-dark border-r border-white/10
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* Close button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
                    aria-label="Close menu"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Sidebar content - clicks on links close the menu */}
                <div onClick={() => setIsOpen(false)} className="h-full flex flex-col">
                    {children}
                </div>
            </div>
        </>
    );
}
