"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3-force";
import { content } from "@/lib/content";
import { X, Cpu, Globe, Server, Database, Layout, Terminal } from "lucide-react";

// Types for our graph
interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: string;
    radius: number;
    x?: number;
    y?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    value: number;
}

// Map categories to icons
const categoryIcons: Record<string, any> = {
    "Cloud & AWS": Globe,
    "AI-Driven Dev": Cpu,
    "Frontend & Motion": Layout,
    "Automation": Server,
    "System & Linux": Terminal,
};

const categoryColors: Record<string, string> = {
    "Cloud & AWS": "#FF9900", // AWS Orange
    "AI-Driven Dev": "#8E55EA", // AI Purple
    "Frontend & Motion": "#61DAFB", // React Blue
    "Automation": "#FF4F81", // n8n Pink
    "System & Linux": "#4EAA25", // Terminal Green
};

export default function TechStack() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | "All">("All");
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);

    // Initialize Data
    useEffect(() => {
        const newNodes: Node[] = [];
        const newLinks: Link[] = [];

        content.skills.forEach((group) => {
            // Add Category Node (Hub)
            newNodes.push({
                id: group.category,
                group: "hub",
                radius: 40,
            });

            // Add Skill Nodes
            group.items.forEach((item) => {
                newNodes.push({
                    id: item,
                    group: group.category,
                    radius: 25,
                });

                // Link Skill to Category
                newLinks.push({
                    source: group.category,
                    target: item,
                    value: 1,
                });
            });
        });

        // Create some cross-links for "SOTA" complexity (optional, can be refined)
        // For now, simple hub-spoke model
        setNodes(newNodes);
        setLinks(newLinks);
    }, []);

    return (
        <section className="relative w-full min-h-screen py-20 overflow-hidden" ref={containerRef}>
            {/* Background Elements */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />

            <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row gap-8">

                {/* Sidebar / Filter */}
                <div className="w-full md:w-64 flex flex-col gap-4 z-10">
                    <h2 className="text-4xl font-display font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                        Tech Stack
                    </h2>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveCategory("All")}
                            className={`text-left px-4 py-3 rounded-lg border transition-all duration-300 ${activeCategory === "All"
                                ? "bg-white/10 border-accent text-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]"
                                : "border-transparent hover:bg-white/5 text-muted-foreground hover:text-white"
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <Layout className="w-4 h-4" /> All Skills
                            </span>
                        </button>

                        {content.skills.map(group => (
                            <button
                                key={group.category}
                                onClick={() => setActiveCategory(group.category)}
                                className={`text-left px-4 py-3 rounded-lg border transition-all duration-300 ${activeCategory === group.category
                                    ? "bg-white/10 border-white/20 text-white"
                                    : "border-transparent hover:bg-white/5 text-muted-foreground hover:text-white"
                                    }`}
                                style={{
                                    borderColor: activeCategory === group.category ? categoryColors[group.category] : undefined,
                                    color: activeCategory === group.category ? categoryColors[group.category] : undefined
                                }}
                            >
                                <span className="flex items-center gap-3">
                                    {/* Icon Component */}
                                    {categoryIcons[group.category] && React.createElement(categoryIcons[group.category], { className: "w-4 h-4" })}
                                    {group.category}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Stats Box */}
                    <div className="mt-auto p-6 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">System Status</div>
                        <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            ONLINE
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                            Latency: <span className="text-white">12ms</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            FPS: <span className="text-white">60</span>
                        </div>
                    </div>
                </div>

                {/* Graph Area */}
                <div className="flex-1 relative h-[600px] md:h-[800px] border border-white/5 rounded-3xl bg-black/40 backdrop-blur-sm overflow-hidden shadow-2xl">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* SVG Layer for Links */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {links.map((link, i) => {
                            const source = typeof link.source === 'object' ? link.source : nodes.find(n => n.id === link.source);
                            const target = typeof link.target === 'object' ? link.target : nodes.find(n => n.id === link.target);

                            if (!source?.x || !target?.x) return null;

                            // Check if link should be visible based on filter
                            const isVisible = activeCategory === "All" ||
                                (source.group === activeCategory || target.group === activeCategory);

                            return (
                                <motion.line
                                    key={i}
                                    x1={source.x}
                                    y1={source.y}
                                    x2={target.x}
                                    y2={target.y}
                                    stroke={isVisible ? (categoryColors[source.group as string] || "#fff") : "#333"}
                                    strokeWidth={isVisible ? 1.5 : 0.5}
                                    strokeOpacity={isVisible ? 0.4 : 0.1}
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1 }}
                                />
                            );
                        })}
                    </svg>

                    {/* Nodes */}
                    <AnimatePresence>
                        {nodes.map((node) => {
                            const isHub = node.group === "hub";
                            const isVisible = activeCategory === "All" || node.group === activeCategory || (isHub && node.id === activeCategory);
                            const color = categoryColors[isHub ? node.id : node.group] || "#fff";

                            if (!isVisible) return null;

                            return (
                                <motion.div
                                    key={node.id}
                                    layoutId={node.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        x: (node.x || 0) - (isHub ? 40 : 25),
                                        y: (node.y || 0) - (isHub ? 40 : 25),
                                        scale: 1,
                                        opacity: 1
                                    }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={`absolute flex items-center justify-center cursor-pointer group`}
                                    style={{
                                        width: isHub ? 80 : 50,
                                        height: isHub ? 80 : 50,
                                    }}
                                    onClick={() => setSelectedNode(node)}
                                >
                                    {/* Hexagon Shape */}
                                    <div
                                        className={`w-full h-full flex items-center justify-center transition-all duration-300 ${selectedNode?.id === node.id ? "scale-110 z-50" : "hover:scale-110 z-10"
                                            }`}
                                    >
                                        <div
                                            className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                                            style={{
                                                backgroundColor: color,
                                                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
                                            }}
                                        />
                                        <div
                                            className="absolute inset-[2px] bg-black/80 flex items-center justify-center backdrop-blur-md"
                                            style={{
                                                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                                                border: `1px solid ${color}`
                                            }}
                                        >
                                            {/* Border Glow */}
                                            <div className="absolute inset-0 opacity-50" style={{ boxShadow: `inset 0 0 15px ${color}` }} />

                                            <span className={`text-[10px] md:text-xs font-medium text-center px-1 ${isHub ? "font-bold text-sm" : ""}`} style={{ color }}>
                                                {isHub ? node.id.split(" ")[0] : node.id}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Detail Panel (Right Side - Desktop) or Modal (Mobile) */}
                <AnimatePresence>
                    {selectedNode && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute right-6 top-6 bottom-6 w-80 bg-black/90 border border-white/10 backdrop-blur-xl rounded-2xl p-6 z-50 shadow-2xl hidden md:block"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{selectedNode.id}</h3>
                                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                                        {selectedNode.group === "hub" ? "Category" : selectedNode.group}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-2">Proficiency</h4>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "85%" }}
                                            className="h-full bg-accent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-white mb-2">Related Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {links
                                            .filter(l => (typeof l.source === 'object' ? l.source.id : l.source) === selectedNode.id || (typeof l.target === 'object' ? l.target.id : l.target) === selectedNode.id)
                                            .map(l => {
                                                const relatedId = (typeof l.source === 'object' ? l.source.id : l.source) === selectedNode.id
                                                    ? (typeof l.target === 'object' ? l.target.id : l.target)
                                                    : (typeof l.source === 'object' ? l.source.id : l.source);
                                                return (
                                                    <span key={relatedId as string} className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10">
                                                        {relatedId as string}
                                                    </span>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
