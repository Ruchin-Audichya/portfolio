"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Eye, Grid3x3 } from 'lucide-react';

// Dynamic import with SSR disabled to prevent OrbitControls crashes
const SkillsConstellationClient = dynamic(
    () => import('./SkillsConstellationClient').then(mod => ({ default: mod.SkillsConstellationClient })),
    {
        ssr: false,
        loading: () => (
            <div className="h-[700px] w-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-black/60 via-purple-900/10 to-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 relative mx-auto">
                        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-white/50 font-medium">Initializing 3D Constellation...</p>
                </div>
            </div>
        )
    }
);

// 2D Grid View Component
const SkillsGridView = dynamic(() => import('./SkillsGridView'), {
    ssr: false,
    loading: () => (
        <div className="h-[700px] w-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
    )
});

export function SkillsGalaxy() {
    const [isMounted, setIsMounted] = useState(false);
    const [view, setView] = useState<'3d' | '2d'>('3d');

    useEffect(() => {
        setIsMounted(true);

        // Auto-detect: use 2D on mobile for better performance
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setView('2d');
        }
    }, []);

    if (!isMounted) {
        return (
            <div className="h-[700px] w-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-black/60 via-purple-900/10 to-black/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-white/50">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* View Toggle */}
            <div className="flex justify-end mb-4 gap-2">
                <button
                    onClick={() => setView('3d')}
                    className={`
                        px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2
                        ${view === '3d'
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-100'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}
                    `}
                >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">3D Constellation</span>
                </button>
                <button
                    onClick={() => setView('2d')}
                    className={`
                        px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2
                        ${view === '2d'
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-100'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}
                    `}
                >
                    <Grid3x3 className="w-4 h-4" />
                    <span className="text-sm font-medium">2D Grid</span>
                </button>
            </div>

            {/* Content */}
            {view === '3d' ? <SkillsConstellationClient /> : <SkillsGridView />}
        </div>
    );
}
