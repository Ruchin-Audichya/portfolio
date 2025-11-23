"use client";

import { useEffect, useState, createContext, useContext, useRef } from "react";
import { Howl } from "howler";
import { Volume2, VolumeX } from "lucide-react";

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
    const [isMuted, setIsMuted] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    // Refs for sound instances
    const ambientRef = useRef<Howl | null>(null);
    const hoverRef = useRef<Howl | null>(null);
    const clickRef = useRef<Howl | null>(null);
    const successRef = useRef<Howl | null>(null);

    useEffect(() => {
        // Initialize sounds
        ambientRef.current = new Howl({
            src: ['/sounds/ambient-loop.mp3'], // We'll need to ensure these exist or use placeholders
            loop: true,
            volume: 0.3,
            autoplay: false,
        });

        hoverRef.current = new Howl({
            src: ['/sounds/hover.mp3'],
            volume: 0.1,
        });

        clickRef.current = new Howl({
            src: ['/sounds/click.mp3'],
            volume: 0.2,
        });

        successRef.current = new Howl({
            src: ['/sounds/success.mp3'],
            volume: 0.4,
        });

        setIsLoaded(true);

        return () => {
            ambientRef.current?.unload();
            hoverRef.current?.unload();
            clickRef.current?.unload();
            successRef.current?.unload();
        };
    }, []);

    useEffect(() => {
        if (!isLoaded || !ambientRef.current) return;

        if (isMuted) {
            ambientRef.current.pause();
        } else {
            ambientRef.current.play();
            ambientRef.current.fade(0, 0.3, 2000);
        }
    }, [isMuted, isLoaded]);

    const playHover = () => {
        if (!isMuted && hoverRef.current) {
            hoverRef.current.stop();
            hoverRef.current.play();
        }
    };

    const playClick = () => {
        if (!isMuted && clickRef.current) {
            clickRef.current.stop();
            clickRef.current.play();
        }
    };

    const playSuccess = () => {
        if (!isMuted && successRef.current) {
            successRef.current.play();
        }
    };

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <SoundContext.Provider value={{ playHover, playClick, playSuccess, toggleMute, isMuted }}>
            {children}

            {/* Sound Toggle Button - Fixed to bottom right */}
            <button
                onClick={toggleMute}
                className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-background/80 backdrop-blur-md border border-white/10 shadow-lg hover:scale-110 transition-transform group"
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? (
                    <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                    <Volume2 className="w-5 h-5 text-primary animate-pulse" />
                )}
            </button>
        </SoundContext.Provider>
    );
}
