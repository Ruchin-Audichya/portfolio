"use client";

import { createContext, useContext } from "react";

interface SoundContextType {
  playHover: () => void;
  playClick: () => void;
  playSuccess: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | null>(null);

const noopContext: SoundContextType = {
  playHover: () => {},
  playClick: () => {},
  playSuccess: () => {},
  toggleMute: () => {},
  isMuted: true,
};

export function useSound() {
  return useContext(SoundContext) ?? noopContext;
}

export function SoundManager({ children }: { children: React.ReactNode }) {
  return <SoundContext.Provider value={noopContext}>{children}</SoundContext.Provider>;
}
