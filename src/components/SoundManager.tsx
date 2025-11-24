"use client";

import { createContext, useContext } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * NO-OP Sound Manager
 * All audio functionality disabled to prevent 404 errors and resource exhaustion.
 * Maintains API compatibility with the rest of the codebase.
 */

interface SoundContextType {
    playHover: () => void;
    playClick: () => void;
    playSuccess: () => void;
    toggleMute: () => void;
    isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function useSound() {
    const context = useContext(SoundContext);
    if (!context) {
        // Return no-op functions if used outside provider
        return {
            playHover: () => { },
            playClick: () => { },
            playSuccess: () => { },
            toggleMute: () => { },
            isMuted: true,
        };
    }
    return context;
}

export function SoundManager({ children }: { children: React.ReactNode }) {
    // All audio disabled - no Howl, no audio loading, no side effects
    const isMuted = true; // Always muted

    // No-op functions - maintains API compatibility
    const playHover = () => { };
    const playClick = () => { };
    const playSuccess = () => { };
    const toggleMute = () => { };

    return (
        <SoundContext.Provider value={{ playHover, playClick, playSuccess, toggleMute, isMuted }}>
            {children}

            {/* Sound Toggle Button - Shows disabled state */}
            <button
                onClick={toggleMute}
                disabled
                className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-background/80 backdrop-blur-md border border-white/10 shadow-lg opacity-50 cursor-not-allowed"
                aria-label="Sound disabled"
                title="Sound system disabled"
            >
                <VolumeX className="w-5 h-5 text-muted-foreground" />
            </button>
        </SoundContext.Provider>
    );
}
