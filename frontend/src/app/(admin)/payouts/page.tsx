"use client";

import { useState } from "react";
import { payouts, analyticsData } from "@/lib/mock/data";
import { PayoutStatusChip, SectionHeader } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUSES = ["verification", "fraud_check", "upi_dispatch", "confirmed"];

const queueWorkers = [
    { name: "Ravi Kumar", zone: "Velachery", amount: 1800, step: 2 },
    { name: "Meena S.", zone: "T.Nagar", amount: 1200, step: 3 },
    { name: "Priya V.", zone: "Porur", amount: 1800, step: 1 },
    { name: "Anjali M.", zone: "Nungambakkam", amount: 960, step: 0 },
];

export default function PayoutsPage() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl text-text-primary">Payout Center</h1>
                    <p className="text-sm text-text-muted mt-0.5">Real-time UPI payout management</p>
                </div>
                <button className="flex items-center gap-2 border border-border rounded-xl px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:border-border-bright transition-all">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
                {[
                    { label: "Total This Month", value: "₹8.4L", sub: "1,923 workers" },
                    { label: "Avg Per Worker", value: "₹1,482", sub: "Based on 30 days" },
                    { label: "Pending", value: "47", sub: "In queue now", alert: true },
                    { label: "Failed / Retry", value: "3", sub: "Auto-retry active" },
                ].map(s => (
                    <div key={s.label} className="glass rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-text-muted">{s.label}</p>
                        <p className={cn("font-display font-bold text-2xl mt-2", s.alert ? "text-accent-warn" : "text-text-primary")}>{s.value}</p>
                        <p className="text-xs text-text-muted mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Live Queue */}
            <div className="glass-flush overflow-hidden">
                <div className="p-4 border-b border-border">
                    <SectionHeader title="Live Payout Queue" sub="Workers currently being processed" />
                </div>
                <div className="divide-y divide-border/50">
                    {queueWorkers.map((w, i) => (
                        <div key={w.name} className="px-4 py-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-primary/60 to-orange-700 flex items-center justify-center text-white text-xs font-bold">{w.name[0]}</div>
                                    <div>
                                        <span className="text-sm font-medium text-text-primary">{w.name}</span>
                                        <span className="text-xs text-text-muted ml-2">{w.zone}</span>
                                    </div>
                                </div>
                                <span className="font-mono font-semibold text-accent-live text-sm">₹{w.amount.toLocaleString("en-IN")}</span>
                            </div>
                            {/* Pipeline steps */}
                            <div className="flex gap-1">
                                {["Verification", "Fraud Check", "UPI Dispatch", "Confirmed"].map((step, si) => (
                                    <div key={step} className={cn("flex-1 h-1.5 rounded-full transition-all",
                                        si < w.step ? "bg-accent-live" :
                                            si === w.step ? "bg-accent-primary animate-pulse" :
                                                "bg-bg-elevated"
                                    )} />
                                ))}
                            </div>
                            <p className="text-[10px] text-text-muted mt-1">{["Verification", "Fraud Check", "UPI Dispatch", "Confirmed"][w.step]}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts + History */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
                <div className="glass rounded-2xl p-4">
                    <SectionHeader title="Daily Payout Volume" sub="Last 30 days" />
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={analyticsData.dailyPayouts.slice(0, 14)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                            <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                            <Tooltip contentStyle={{ background: "#1C2537", border: "1px solid #1E293B", borderRadius: 8, fontSize: 11 }} />
                            <Bar dataKey="amount" fill="#22C55E" radius={[4, 4, 0, 0]} name="Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-flush overflow-hidden">
                    <div className="p-4 border-b border-border">
                        <SectionHeader title="Payout History" sub="Recent transactions" />
                    </div>
                    <div className="overflow-y-auto max-h-[260px] divide-y divide-border/50">
                        {payouts.map(p => (
                            <div key={p.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-bg-elevated/30 transition-colors">
                                <div>
                                    <p className="text-sm text-text-primary font-medium">{p.worker}</p>
                                    <p className="text-xs text-text-muted">{p.zone} · {p.reason}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-semibold text-text-primary text-sm">₹{p.amount.toLocaleString("en-IN")}</p>
                                    <PayoutStatusChip status={p.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
