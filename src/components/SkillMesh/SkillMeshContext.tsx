"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SkillMeshContextValue {
    selectedSkillId: string | null;
    hoveredSkillId: string | null;
    searchQuery: string;
    setSelectedSkillId: (id: string | null) => void;
    setHoveredSkillId: (id: string | null) => void;
    setSearchQuery: (query: string) => void;
}

const SkillMeshContext = createContext<SkillMeshContextValue | null>(null);

export function SkillMeshProvider({ children }: { children: ReactNode }) {
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
    const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SkillMeshContext.Provider
            value={{
                selectedSkillId,
                hoveredSkillId,
                searchQuery,
                setSelectedSkillId,
                setHoveredSkillId,
                setSearchQuery,
            }}
        >
            {children}
        </SkillMeshContext.Provider>
    );
}

export function useSkillMeshContext() {
    const context = useContext(SkillMeshContext);
    if (!context) {
        throw new Error("useSkillMeshContext must be used within SkillMeshProvider");
    }
    return context;
}
