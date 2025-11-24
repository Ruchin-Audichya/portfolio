import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export type QualityTier = 'high' | 'medium' | 'low'

interface PerfState {
    dpr: number
    tier: QualityTier
    fps: number
    setDpr: (dpr: number) => void
    setTier: (tier: QualityTier) => void
    setFps: (fps: number) => void
}

export const usePerf = create<PerfState>()(
    subscribeWithSelector((set) => ({
        dpr: 1, // Will be updated on mount
        tier: 'high',
        fps: 60,
        setDpr: (dpr) => set({ dpr }),
        setTier: (tier) => set({ tier }),
        setFps: (fps) => set({ fps }),
    }))
)

// Adaptive quality logic
export const getAdaptiveDpr = (pixelRatio: number) => {
    // Clamp DPR to max 1.25 for iPad/mobile performance
    return Math.min(pixelRatio, 1.25)
}

export const determineInitialTier = (gpuTier?: string): QualityTier => {
    if (typeof window === 'undefined') return 'high'
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) return 'medium'
    return 'high'
}

export const useFPSMonitor = () => {
    const setFps = usePerf((state) => state.setFps)
    const frames = useRef(0)
    const lastTime = useRef(performance.now())

    useFrame(() => {
        frames.current++
        const time = performance.now()
        if (time >= lastTime.current + 500) {
            const fps = Math.round((frames.current * 1000) / (time - lastTime.current))
            setFps(fps)
            if (process.env.NODE_ENV === 'development') {
                console.log(`[FPS] ${fps}`)
            }
            frames.current = 0
            lastTime.current = time
        }
    })
}

export const useAdaptiveQuality = () => {
    const setTier = usePerf((state) => state.setTier)
    const tier = usePerf((state) => state.tier)
    const fps = usePerf((state) => state.fps)

    // Check FPS every 3 seconds to avoid rapid toggling
    useEffect(() => {
        const interval = setInterval(() => {
            const currentFps = usePerf.getState().fps
            const currentTier = usePerf.getState().tier

            if (currentFps < 45 && currentTier === 'high') {
                console.warn('[Performance] Downgrading to medium tier due to low FPS:', currentFps)
                setTier('medium')
            } else if (currentFps < 30 && currentTier === 'medium') {
                console.warn('[Performance] Downgrading to low tier due to low FPS:', currentFps)
                setTier('low')
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [setTier])
}
