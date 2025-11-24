"use client";

import { useMemo, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { skills } from "@/data/skills";
import { useSkillMeshContext } from "./SkillMeshContext";

export function SkillList() {
    const {
        selectedSkillId,
        searchQuery,
        setSelectedSkillId,
        setHoveredSkillId,
        setSearchQuery,
    } = useSkillMeshContext();

    const listRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Fuzzy search filter with safety check
    const filteredSkills = useMemo(() => {
        if (!skills || !Array.isArray(skills) || skills.length === 0) return [];
        if (!searchQuery?.trim()) return skills;

        const query = searchQuery.toLowerCase();
        return skills.filter(
            (skill) =>
                skill?.displayName?.toLowerCase().includes(query) ||
                skill?.category?.toLowerCase().includes(query) ||
                skill?.shortDescription?.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    // Group by category with safety check
    const skillsByCategory = useMemo(() => {
        const grouped = new Map<string, typeof skills>();
        if (!filteredSkills || filteredSkills.length === 0) return grouped;

        filteredSkills.forEach((skill) => {
            if (!skill || !skill.category) return;
            const existing = grouped.get(skill.category) || [];
            grouped.set(skill.category, [...existing, skill]);
        });
        return grouped;
    }, [filteredSkills]);

    // Auto-scroll to selected skill
    useEffect(() => {
        if (selectedSkillId && skills) {
            const selectedSkill = skills.find((s) => s.id === selectedSkillId);
            if (selectedSkill) {
                const categoryEl = categoryRefs.current.get(selectedSkill.category);
                categoryEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }
    }, [selectedSkillId]);

    if (!skills || !Array.isArray(skills)) {
        return <div className="text-center py-12 text-muted-foreground">No skills data available</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search skills (e.g., React, AWS, AI)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-white/10"
                />
            </div>

            {/* Results count */}
            {searchQuery && (
                <div className="text-sm text-muted-foreground">
                    Found {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""}
                </div>
            )}

            {/* Skills by category */}
            <div ref={listRef} className="space-y-6" role="list" aria-label="Skills by category">
                {Array.from(skillsByCategory.entries()).map(([category, categorySkills]) => (
                    <div
                        key={category}
                        ref={(el) => {
                            if (el) categoryRefs.current.set(category, el);
                        }}
                        className="space-y-3"
                    >
                        <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                            {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {categorySkills && categorySkills.map((skill) => {
                                const isSelected = selectedSkillId === skill?.id;

                                return (
                                    <Badge
                                        key={skill?.id}
                                        variant={isSelected ? "default" : "secondary"}
                                        className={`
                      cursor-pointer transition-all hover:scale-105
                      ${isSelected ? "ring-2 ring-accent" : "hover:bg-white/20"}
                    `}
                                        style={{
                                            backgroundColor: isSelected ? skill?.colorAccent : undefined,
                                            borderColor: skill?.colorAccent,
                                        }}
                                        onClick={() => setSelectedSkillId(skill?.id || null)}
                                        onMouseEnter={() => setHoveredSkillId(skill?.id || null)}
                                        onMouseLeave={() => setHoveredSkillId(null)}
                                        onFocus={() => setHoveredSkillId(skill?.id || null)}
                                        onBlur={() => setHoveredSkillId(null)}
                                        tabIndex={0}
                                        role="button"
                                        aria-pressed={isSelected}
                                        aria-label={`${skill?.displayName}: ${skill?.shortDescription}`}
                                    >
                                        {skill?.displayName}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* No results */}
            {filteredSkills.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No skills found matching &quot;{searchQuery}&quot;
                </div>
            )}

            {/* Selected skill details */}
            {selectedSkillId && skills && (
                <div className="mt-6 p-4 rounded-xl bg-black/20 border border-white/10">
                    {(() => {
                        const skill = skills.find((s) => s.id === selectedSkillId);
                        if (!skill) return null;

                        return (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: skill.colorAccent }}
                                    />
                                    <h4 className="text-lg font-bold">{skill.displayName}</h4>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                                        {skill.category}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{skill.shortDescription}</p>
                                <div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                                        Example Uses:
                                    </div>
                                    <ul className="text-sm space-y-1">
                                        {skill.exampleUses && skill.exampleUses.map((use, i) => (
                                            <li key={i} className="text-muted-foreground">• {use}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
