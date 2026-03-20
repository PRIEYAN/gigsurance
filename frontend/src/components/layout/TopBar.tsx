"use client";

import { useState } from "react";
import { Bell, CloudRain, ChevronDown } from "lucide-react";
import { cities } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

interface TopBarProps {
    selectedCity: string;
    onCityChange: (city: string) => void;
    sidebarExpanded: boolean;
}

export default function TopBar({ selectedCity, onCityChange, sidebarExpanded }: TopBarProps) {
    const [cityOpen, setCityOpen] = useState(false);

    return (
        <header
            className="fixed right-0 top-0 z-30 flex items-center justify-between gap-4 px-8 lg:px-12 border-b border-border bg-bg-surface/95 backdrop-blur-sm topbar-height transition-all duration-300"
            style={{ left: sidebarExpanded ? '240px' : '72px' }}
        >
            {/* Left: Wordmark */}
            <div className="flex items-center gap-2.5">
                <span className="font-display font-bold text-xl text-text-primary tracking-tight hidden md:block">
                    Gigs<span className="text-accent-primary">urance</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-text-muted border border-border rounded-md px-1.5 py-0.5 font-mono">
                    Admin
                </span>
            </div>

            {/* Center: City Selector */}
            <div className="relative">
                <button
                    onClick={() => setCityOpen(!cityOpen)}
                    className="flex items-center gap-2 bg-bg-elevated border border-border rounded-xl px-3.5 py-2 text-sm text-text-primary hover:border-accent-primary/60 transition-colors shadow-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-accent-live pulse-dot inline-block" />
                    <span className="font-medium">{selectedCity}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-text-muted transition-transform", cityOpen && "rotate-180")} />
                </button>
                {cityOpen && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-bg-surface border border-border rounded-xl overflow-hidden shadow-xl z-50 min-w-[150px]">
                        {cities.map((city) => (
                            <button
                                key={city}
                                onClick={() => { onCityChange(city); setCityOpen(false); }}
                                className={cn(
                                    "w-full text-left px-4 py-2.5 text-sm transition-colors",
                                    city === selectedCity
                                        ? "text-accent-primary bg-orange-50 font-medium"
                                        : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                )}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Weather pill */}
                <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1.5 text-xs">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-blue-700 font-medium font-mono">{selectedCity}: 87mm</span>
                    <span className="text-blue-400">— Heavy Rain</span>
                </div>

                {/* Notifications */}
                <button className="relative w-9 h-9 rounded-xl bg-bg-elevated border border-border flex items-center justify-center hover:border-accent-primary/40 transition-colors shadow-sm">
                    <Bell className="w-4 h-4 text-text-secondary" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-alert text-white text-[9px] flex items-center justify-center font-mono font-bold">3</span>
                </button>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-primary to-orange-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer shadow-sm">
                    A
                </div>
            </div>
        </header>
    );
}
