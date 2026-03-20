"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { zones, disruptions } from "@/lib/mock/data";
import { SeverityBadge, LiveDot, SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Users, DollarSign, AlertTriangle, MapPin, X } from "lucide-react";

const ZoneMapMini = dynamic(() => import("@/components/map/ZoneMapMini"), { ssr: false, loading: () => <div className="h-full bg-bg-elevated animate-pulse" /> });

export default function MapPage() {
    const [selectedZone, setSelectedZone] = useState<typeof zones[0] | null>(null);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="flex flex-col gap-4 map-viewport overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Live Zone Map</h1>
                    <p className="text-sm text-text-muted mt-0.5">Real-time disruption monitoring across Chennai</p>
                </div>
                <div className="flex gap-2">
                    {["All", "Rain", "Flood", "App Crash", "Curfew"].map(f => (
                        <button key={f} className="px-3 py-1.5 rounded-lg text-xs bg-bg-elevated border border-border text-text-secondary hover:text-text-primary hover:border-border-bright transition-colors">{f}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-5 min-h-0">
                {/* Zone List */}
                <div className="glass-flush overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-border">
                        <SectionHeader title="Zones" sub={`${zones.length} monitored areas`} />
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                        {zones.map(zone => (
                            <button
                                key={zone.id}
                                onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
                                className={`w-full text-left px-4 py-3 hover:bg-bg-elevated/50 transition-all ${selectedZone?.id === zone.id ? "bg-accent-primary/5 border-l-2 border-accent-primary" : ""}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-text-primary">{zone.name}</span>
                                    <SeverityBadge severity={zone.severity} />
                                </div>
                                <div className="flex items-center gap-3 text-xs text-text-muted">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{zone.workers}</span>
                                    {zone.payout > 0 && <span className="flex items-center gap-1 text-accent-live"><DollarSign className="w-3 h-3" />{formatCurrency(zone.payout)}</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Map */}
                <div className="xl:col-span-3 glass-flush overflow-hidden relative">
                    <ZoneMapMini zones={zones} disruptions={disruptions} fullScreen />

                    {/* Selected zone panel */}
                    {selectedZone && (
                        <div className="absolute bottom-4 left-4 right-4 glass-elevated rounded-2xl p-4 border border-border-bright shadow-2xl">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-accent-primary" />
                                        <h3 className="font-semibold text-text-primary">{selectedZone.name}</h3>
                                        <SeverityBadge severity={selectedZone.severity} />
                                    </div>
                                    <p className="text-xs text-text-muted mt-0.5">Status: <span className="capitalize">{selectedZone.status}</span></p>
                                </div>
                                <button onClick={() => setSelectedZone(null)} className="text-text-muted hover:text-text-primary">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                                <div><p className="text-[10px] text-text-muted uppercase tracking-widest">Workers</p><p className="font-mono font-bold text-text-primary mt-0.5">{selectedZone.workers}</p></div>
                                <div><p className="text-[10px] text-text-muted uppercase tracking-widest">Est. Payout</p><p className="font-mono font-bold text-accent-live mt-0.5">{formatCurrency(selectedZone.payout)}</p></div>
                                <div><p className="text-[10px] text-text-muted uppercase tracking-widest">Active Since</p><p className="font-mono font-bold text-text-primary mt-0.5">16:03</p></div>
                            </div>
                            {selectedZone.status === "disruption" && (
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full bg-accent-primary hover:bg-orange-500 text-white rounded-xl py-2 text-sm font-semibold transition-all shadow-[0_0_20px_rgba(255,107,43,0.3)]"
                                >
                                    ⚡ Trigger Manual Payout
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Payout Confirmation Modal */}
            {showModal && selectedZone && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="glass-elevated border border-border-bright rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-alert/20 border border-accent-alert/40 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-accent-alert" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-text-primary">Confirm Manual Payout</h3>
                                <p className="text-xs text-text-muted">This action cannot be undone</p>
                            </div>
                        </div>
                        <div className="bg-bg-primary rounded-xl p-4 mb-4 space-y-2">
                            <div className="flex justify-between"><span className="text-sm text-text-muted">Zone</span><span className="text-sm font-medium text-text-primary">{selectedZone.name}</span></div>
                            <div className="flex justify-between"><span className="text-sm text-text-muted">Workers</span><span className="text-sm font-mono text-text-primary">{selectedZone.workers}</span></div>
                            <div className="flex justify-between"><span className="text-sm text-text-muted">Total Payout</span><span className="text-sm font-mono font-bold text-accent-live">{formatCurrency(selectedZone.payout)}</span></div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 border border-border rounded-xl py-2.5 text-sm text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
                            <button onClick={() => { setShowModal(false); setSelectedZone(null); }} className="flex-1 bg-accent-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-orange-500 transition-all">Confirm Payout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
