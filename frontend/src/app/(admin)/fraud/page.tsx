"use client";

import { useState } from "react";
import { fraudCases } from "@/lib/mock/data";
import { SectionHeader } from "@/components/ui";
import { AlertTriangle, CheckCircle, XCircle, Eye, Zap, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const fraudStats = [
    { label: "Flagged This Month", value: "12", sub: "↑ 3 from last month", color: "text-accent-alert" },
    { label: "Detection Accuracy", value: "94.2%", sub: "AI model v3.1", color: "text-accent-live" },
    { label: "Amount Saved", value: "₹1.2L", sub: "Fraudulent payouts blocked", color: "text-accent-blue" },
    { label: "Common Type", value: "GPS Spoof", sub: "67% of cases", color: "text-accent-warn" },
];

export default function FraudPage() {
    const [cases, setCases] = useState(fraudCases);
    const [simulating, setSimulating] = useState(false);
    const [simDone, setSimDone] = useState(false);

    const simulateGpsSpoof = () => {
        if (simulating) return;
        setSimulating(true);
        setTimeout(() => {
            setCases(c => [{
                id: 99,
                worker: "New Alert: Ramu V.",
                workerId: "GIG-2099",
                fraudType: "GPS Spoofing",
                evidence: "Device GPS 14km from claimed disruption zone. VPN detected. Speed: 0km/h.",
                confidence: "HIGH",
                status: "pending",
                amount: 1800,
                claimedZone: "Velachery",
                actualZone: "Tambaram",
            }, ...c]);
            setSimulating(false);
            setSimDone(true);
        }, 2000);
    };

    const handleAction = (id: number, action: "approved" | "rejected") => {
        setCases(c => c.filter(x => x.id !== id));
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Fraud Detection</h1>
                    <p className="text-sm text-text-muted mt-0.5">AI-powered anomaly detection and claim verification</p>
                </div>
                <button
                    onClick={simulateGpsSpoof}
                    disabled={simulating}
                    className="flex items-center gap-2 bg-accent-alert/20 border border-accent-alert/40 text-accent-alert hover:bg-accent-alert/30 disabled:opacity-50 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                >
                    <Zap className="w-4 h-4" />
                    {simulating ? "Detecting…" : "Simulate GPS Spoof"}
                </button>
            </div>

            {/* Alert banner */}
            {cases.length > 0 && (
                <div className="bg-accent-alert/10 border border-accent-alert/30 rounded-xl p-3.5 flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-accent-alert shrink-0" />
                    <span className="text-sm text-accent-alert font-medium">{cases.filter(c => c.status === "pending").length} suspicious claims flagged — Review required</span>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
                {fraudStats.map(s => (
                    <div key={s.label} className="glass rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-text-muted">{s.label}</p>
                        <p className={cn("font-display font-bold text-2xl mt-2", s.color)}>{s.value}</p>
                        <p className="text-xs text-text-muted mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Fraud cases */}
            <div>
                <SectionHeader title="Flagged Cases" sub={`${cases.length} active cases`} />
                <div className="space-y-3">
                    {cases.map((c, i) => (
                        <div
                            key={c.id}
                            className={cn("glass-flush overflow-hidden border transition-all slide-in-stagger-slow",
                                c.id === 99 ? "border-accent-alert/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "border-border hover:border-border-bright"
                            )}
                            style={{ "--slide-delay": `${i * 60}ms` } as React.CSSProperties}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 flex-wrap mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-alert/30 to-red-700/30 flex items-center justify-center text-accent-alert text-sm font-bold border border-accent-alert/30">
                                                    {c.worker[0]}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-text-primary text-sm">{c.worker}</span>
                                                    <span className="ml-2 font-mono text-[10px] text-text-muted">{c.workerId}</span>
                                                </div>
                                            </div>
                                            <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                                                c.fraudType === "GPS Spoofing" ? "text-accent-alert border-accent-alert/40 bg-accent-alert/10" :
                                                    c.fraudType === "Multi-Device" ? "text-accent-warn border-accent-warn/40 bg-accent-warn/10" :
                                                        "text-accent-blue border-accent-blue/40 bg-accent-blue/10"
                                            )}>{c.fraudType}</span>
                                            <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full",
                                                c.confidence === "HIGH" ? "bg-accent-alert/20 text-accent-alert" :
                                                    c.confidence === "MEDIUM" ? "bg-accent-warn/20 text-accent-warn" :
                                                        "bg-accent-live/20 text-accent-live"
                                            )}>{c.confidence} CONFIDENCE</span>
                                        </div>
                                        <p className="text-xs text-text-muted leading-relaxed max-w-2xl">{c.evidence}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Claimed: <span className="text-text-secondary ml-1">{c.claimedZone}</span></span>
                                            <span className="flex items-center gap-1">Actual: <span className="text-text-secondary ml-1">{c.actualZone}</span></span>
                                            <span className="text-accent-alert font-mono font-semibold">₹{c.amount.toLocaleString("en-IN")}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button onClick={() => handleAction(c.id, "approved")} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-live/10 border border-accent-live/30 text-accent-live rounded-lg text-xs hover:bg-accent-live/20 transition-colors">
                                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                                        </button>
                                        <button onClick={() => handleAction(c.id, "rejected")} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-alert/10 border border-accent-alert/30 text-accent-alert rounded-lg text-xs hover:bg-accent-alert/20 transition-colors">
                                            <XCircle className="w-3.5 h-3.5" /> Reject
                                        </button>
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated border border-border text-text-secondary rounded-lg text-xs hover:text-text-primary transition-colors">
                                            <Eye className="w-3.5 h-3.5" /> Investigate
                                        </button>
                                    </div>
                                </div>

                                {/* GPS timeline visualization */}
                                <div className="mt-3 pt-3 border-t border-border/50">
                                    <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">GPS Track vs Claimed Zone</p>
                                    <div className="grid grid-cols-2 gap-2 h-20">
                                        <div className="bg-bg-primary rounded-lg p-2 flex items-center justify-center border border-border">
                                            <div className="text-center">
                                                <div className="w-3 h-3 rounded-full bg-accent-alert mx-auto mb-1" />
                                                <p className="text-[10px] text-text-muted">Device at {c.actualZone}</p>
                                            </div>
                                        </div>
                                        <div className="bg-bg-primary rounded-lg p-2 flex items-center justify-center border border-accent-alert/20">
                                            <div className="text-center">
                                                <div className="w-3 h-3 rounded-full bg-accent-warn mx-auto mb-1 animate-pulse" />
                                                <p className="text-[10px] text-text-muted">Claimed: {c.claimedZone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {cases.length === 0 && (
                        <div className="glass rounded-2xl p-12 text-center">
                            <CheckCircle className="w-12 h-12 text-accent-live mx-auto mb-3 opacity-60" />
                            <p className="text-text-secondary font-medium">✅ No suspicious activity detected this week</p>
                            <p className="text-text-muted text-sm mt-1">All cases have been reviewed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
