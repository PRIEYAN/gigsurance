"use client";

import { useState } from "react";
import { workers } from "@/lib/mock/data";
import { GigsBadge, TrustScoreMeter, SectionHeader } from "@/components/ui";
import { Search, Filter, X, MapPin, Phone, Calendar, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Food Delivery", "Quick Commerce", "Ecommerce", "Flagged"];

export default function WorkersPage() {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedWorker, setSelectedWorker] = useState<typeof workers[0] | null>(null);

    const filtered = workers.filter(w => {
        const q = search.toLowerCase();
        const matchSearch = w.name.toLowerCase().includes(q) || w.zone.toLowerCase().includes(q) || w.phone.includes(q);
        const matchFilter =
            activeFilter === "All" ? true :
                activeFilter === "Flagged" ? w.policyStatus === "flagged" || w.policyStatus === "suspended" :
                    activeFilter === "Food Delivery" ? w.persona === "food" :
                        activeFilter === "Quick Commerce" ? w.persona === "quick" :
                            activeFilter === "Ecommerce" ? w.persona === "ecom" : true;
        return matchSearch && matchFilter;
    });

    return (
        <div className="flex gap-4 lg:gap-5 h-full">
            <div className={cn("flex-1 space-y-4 lg:space-y-5 transition-all", selectedWorker ? "" : "")}>
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="font-display font-bold text-2xl text-text-primary">Worker Management</h1>
                        <p className="text-sm text-text-muted mt-0.5">{workers.length} registered workers · Chennai</p>
                    </div>
                    <button className="bg-accent-primary hover:bg-orange-500 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all shadow-[0_0_20px_rgba(255,107,43,0.3)]">
                        + Add Worker
                    </button>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search workers by name, zone, phone…"
                            className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)} className={cn("px-3 py-2 rounded-xl text-xs font-medium transition-all border whitespace-nowrap",
                                activeFilter === f ? "bg-accent-primary/15 border-accent-primary/40 text-accent-primary" : "bg-bg-elevated border-border text-text-muted hover:text-text-primary"
                            )}>{f}</button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="glass-flush overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    {["#", "Worker", "Phone", "Zone", "Type", "Trust Score", "Policy", "Premium", ""].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-text-muted font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((w, i) => (
                                    <tr
                                        key={w.id}
                                        onClick={() => setSelectedWorker(w.id === selectedWorker?.id ? null : w)}
                                        className={cn("border-b border-border/50 cursor-pointer transition-all slide-in-stagger",
                                            selectedWorker?.id === w.id ? "bg-accent-primary/5" :
                                                w.policyStatus === "flagged" || w.policyStatus === "suspended" ? "bg-accent-warn/5 hover:bg-accent-warn/10" :
                                                    "hover:bg-bg-elevated/40"
                                        )}
                                        style={{ "--slide-delay": `${i * 40}ms` } as React.CSSProperties}
                                    >
                                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{w.id}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-primary/60 to-orange-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                    {w.name[0]}
                                                </div>
                                                <span className="font-medium text-text-primary text-sm">{w.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{w.phone}</td>
                                        <td className="px-4 py-3 text-xs text-text-secondary">{w.city}/{w.zone}</td>
                                        <td className="px-4 py-3"><GigsBadge persona={w.persona} /></td>
                                        <td className="px-4 py-3"><TrustScoreMeter score={w.trustScore} /></td>
                                        <td className="px-4 py-3">
                                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border capitalize",
                                                w.policyStatus === "active" ? "text-accent-live border-accent-live/30 bg-accent-live/10" :
                                                    w.policyStatus === "suspended" ? "text-accent-alert border-accent-alert/30 bg-accent-alert/10" :
                                                        "text-accent-warn border-accent-warn/30 bg-accent-warn/10"
                                            )}>{w.policyStatus}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn("text-[10px] font-mono", w.premiumStatus === "paid" ? "text-accent-live" : "text-accent-alert")}>
                                                {w.premiumStatus === "paid" ? "✅ Week " + w.weeksPaid : "❌ Missed"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="text-xs text-accent-primary hover:underline">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Worker Detail Drawer */}
            {selectedWorker && (
                <div className="w-80 xl:w-96 glass rounded-2xl flex flex-col overflow-hidden shrink-0 drawer-slide-in">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary">Worker Profile</h3>
                        <button onClick={() => setSelectedWorker(null)} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Profile */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary to-orange-600 flex items-center justify-center text-white text-lg font-bold">
                                {selectedWorker.name[0]}
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary">{selectedWorker.name}</h4>
                                <div className="flex gap-1 mt-0.5">
                                    {selectedWorker.platform.map(p => <span key={p} className="text-[10px] bg-bg-elevated border border-border rounded px-1.5 py-0.5 text-text-muted">{p}</span>)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-text-muted"><Phone className="w-3.5 h-3.5" /> {selectedWorker.phone}</div>
                            <div className="flex items-center gap-2 text-text-muted"><MapPin className="w-3.5 h-3.5" /> {selectedWorker.city} / {selectedWorker.zone}</div>
                            <div className="flex items-center gap-2 text-text-muted"><Calendar className="w-3.5 h-3.5" /> Joined {selectedWorker.joinedDate}</div>
                        </div>

                        {/* Trust Score */}
                        <div className="bg-bg-elevated/60 rounded-xl p-3 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-text-primary flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent-primary" /> Trust Score</span>
                                <span className={cn(
                                    "font-mono font-bold text-lg",
                                    selectedWorker.trustScore >= 75 ? "trust-high" : selectedWorker.trustScore >= 40 ? "trust-mid" : "trust-low"
                                )}>{selectedWorker.trustScore}</span>
                            </div>
                            {[["GPS Consistency", "92%"], ["Delivery Patterns", "88%"], ["Claim History", "75%"], ["Platform Verified", "100%"]].map(([k, v]) => (
                                <div key={k} className="flex justify-between text-xs py-1 border-b border-border/50 last:border-0">
                                    <span className="text-text-muted">{k}</span>
                                    <span className="font-mono text-text-secondary">{v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Policy */}
                        <div className="bg-bg-elevated/60 rounded-xl p-3 border border-border">
                            <p className="text-xs font-medium text-text-primary mb-2">Policy Details</p>
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between"><span className="text-text-muted">Plan</span><span className="text-accent-primary font-medium">Standard — ₹59/week</span></div>
                                <div className="flex justify-between"><span className="text-text-muted">Coverage</span><span className="text-text-secondary">₹1,800/event</span></div>
                                <div className="flex justify-between"><span className="text-text-muted">UPI</span><span className="font-mono text-text-secondary">{selectedWorker.upiId}</span></div>
                                <div className="flex justify-between"><span className="text-text-muted">Weeks Paid</span><span className="text-accent-live font-mono">{selectedWorker.weeksPaid}</span></div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2">
                            {[["Suspend Policy", "border-accent-alert/40 text-accent-alert hover:bg-accent-alert/10"],
                            ["Send Alert", "border-border text-text-secondary hover:bg-bg-elevated"],
                            ["View Logs", "border-border text-text-secondary hover:bg-bg-elevated"],
                            ["Override Location", "border-accent-warn/40 text-accent-warn hover:bg-accent-warn/10"]].map(([label, cls]) => (
                                <button key={label} className={cn("py-2 rounded-xl border text-xs font-medium transition-all", cls)}>{label}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
