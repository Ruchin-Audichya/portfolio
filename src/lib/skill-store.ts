import { create } from 'zustand';

interface SkillState {
    selectedSkill: string | null;
    searchQuery: string;
    setSelectedSkill: (skill: string | null) => void;
    setSearchQuery: (query: string) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
    selectedSkill: null,
    searchQuery: '',
    setSelectedSkill: (skill) => set({ selectedSkill: skill }),
    setSearchQuery: (query) => set({ searchQuery: query }),
}));
