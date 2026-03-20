"use client";

import { useState, useEffect, useCallback } from "react";
import { dashboardStats, payouts, disruptions, agentLogs, zones } from "@/lib/mock/data";
import { StatCard, SeverityBadge, PayoutStatusChip, AgentStatusPill, ProgressBar, ScrollingLogView, LiveDot, SectionHeader, GigsBadge } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Activity, Zap, TrendingUp, DollarSign, ChevronRight, RefreshCw, Eye } from "lucide-react";
import dynamic from "next/dynamic";

const ZoneMapMini = dynamic(() => import("@/components/map/ZoneMapMini"), { ssr: false, loading: () => <div className="h-full bg-bg-elevated animate-pulse rounded-xl" /> });

// Types for agent state
type AgentStatus = "ACTIVE" | "QUEUED" | "STANDBY" | "DONE";
interface AgentState { status: AgentStatus; progress: number; }
interface AgentStates { agent1: AgentState; agent2: AgentState; agent3: AgentState; agent4: AgentState; }

// Simulated scenario state
type SimPhase = "idle" | "running" | "done";

const AGENTS = [
    { key: "agent1", name: "Data Collector", tools: ["Weather API ✓", "News API ✓", "AQI API ⟳", "Disaster API ✓"] },
    { key: "agent2", name: "Zone Classifier", tools: ["Disruption: Heavy Rain+Flood", "Zone: Velachery", "Severity: HIGH"] },
    { key: "agent3", name: "Auditor", tools: ["Worker DB", "Trust Scorer", "Eligibility Engine"] },
    { key: "agent4", name: "Executor", tools: ["UPI Mock Ready", "247 workers queued"] },
] as const;

export default function DashboardPage() {
    const [simPhase, setSimPhase] = useState<SimPhase>("idle");
    const [livePayouts, setLivePayouts] = useState(payouts.slice(0, 6));
    const [agentStates, setAgentStates] = useState<AgentStates>({
        agent1: { status: "ACTIVE", progress: 82 },
        agent2: { status: "ACTIVE", progress: 67 },
        agent3: { status: "QUEUED", progress: 0 },
        agent4: { status: "STANDBY", progress: 0 },
    });
    const [logs, setLogs] = useState<string[]>(agentLogs.agent1);
    const [liveStats, setLiveStats] = useState({ payouts: 482000, workers: 847, policies: 12847 });

    const runSimulation = useCallback(() => {
        if (simPhase === "running") return;
        setSimPhase("running");
        let phase = 0;

        const next = () => {
            phase++;
            if (phase === 1) {
                setAgentStates(s => ({ ...s, agent1: { status: "ACTIVE", progress: 100 }, agent2: { status: "ACTIVE", progress: 30 } }));
                setLogs(agentLogs.agent2);
            } else if (phase === 2) {
                setAgentStates(s => ({ ...s, agent2: { status: "ACTIVE", progress: 100 }, agent3: { status: "ACTIVE", progress: 50 } }));
                setLogs(agentLogs.agent3);
            } else if (phase === 3) {
                setAgentStates(s => ({ ...s, agent3: { status: "DONE", progress: 100 }, agent4: { status: "ACTIVE", progress: 60 } }));
                setLogs(agentLogs.agent4);
            } else if (phase === 4) {
                setAgentStates(s => ({ ...s, agent4: { status: "DONE", progress: 100 } }));
                setLiveStats(s => ({ payouts: s.payouts + 417600, workers: s.workers + 232, policies: s.policies }));
                setLivePayouts(prev => [
                    { id: 99, worker: "Live Batch #232", zone: "Velachery", reason: "Heavy Rain", amount: 417600, status: "paid", time: "just now", timestamp: "" },
                    ...prev.slice(0, 5),
                ]);
                setSimPhase("done");
                return;
            }
            if (phase < 5) setTimeout(next, 2000);
        };

        setTimeout(next, 1800);
    }, [simPhase]);

    useEffect(() => {
        const t = setInterval(() => {
            setAgentStates(s => ({
                ...s,
                agent1: s.agent1.status === "ACTIVE" ? { ...s.agent1, progress: Math.min(100, s.agent1.progress + 1) } : s.agent1,
                agent2: s.agent2.status === "ACTIVE" ? { ...s.agent2, progress: Math.min(100, s.agent2.progress + 0.7) } : s.agent2,
            }));
        }, 400);
        return () => clearInterval(t);
    }, []);

    return (
        /* Added max-width and centered the container with responsive horizontal padding */
        <div className="space-y-12 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
            
            {/* Page Header - Enhanced Spacing */}
            <div className="flex items-end justify-between flex-wrap gap-8 pb-4">
                <div>
                    <h1 className="font-display font-bold text-3xl lg:text-4xl text-text-primary tracking-tight">System Overview</h1>
                    <p className="text-base text-text-muted mt-2">Chennai Metropolitan Area · Live Monitoring · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</p>
                </div>
                <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-accent-live bg-accent-live/5 px-4 py-2 rounded-full border border-accent-live/20">
                        <LiveDot color="green" />
                        <span>System Live</span>
                    </div>
                    <button
                        onClick={runSimulation}
                        disabled={simPhase === "running"}
                        className="flex items-center gap-3 bg-accent-primary hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl px-8 py-3.5 text-sm font-bold transition-all shadow-[0_10px_25px_-5px_rgba(255,107,43,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(255,107,43,0.5)] active:scale-95"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        <span>{simPhase === "running" ? "Simulating…" : simPhase === "done" ? "Re-run Simulation" : "Simulate Rain Event"}</span>
                    </button>
                </div>
            </div>

            {/* Simulation banner - Improved visibility */}
            {simPhase === "done" && (
                <div className="bg-accent-live/10 border-2 border-accent-live/20 rounded-2xl p-6 flex items-center gap-6 text-base font-medium text-accent-live animate-in fade-in slide-in-from-top-4">
                    <div className="bg-accent-live text-white p-2 rounded-lg">
                        <Zap className="w-5 h-5" />
                    </div>
                    <span>Payout successful: <strong className="text-white">₹4,17,600</strong> dispatched to <strong className="text-white">232 workers</strong> in Velachery zone.</span>
                </div>
            )}

            {/* Stat Cards - Larger Gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-10">
                <StatCard title="Active Policies" value={formatNumber(liveStats.policies)} sub="↑ 234 this week" accent="orange" delay={0} icon={<Activity className="w-4 h-4" />} />
                <StatCard title="Live Disruptions" value={`${disruptions.filter(d => d.severity !== "NONE").length} Active`} sub="Velachery · T.Nagar · Ambattur" accent="red" pulsing delay={100} icon={<TrendingUp className="w-4 h-4" />} />
                <StatCard title="Payouts Today" value={formatCurrency(liveStats.payouts)} sub={`${formatNumber(liveStats.workers)} workers paid`} accent="green" delay={200} icon={<DollarSign className="w-4 h-4" />} />
                <StatCard title="Fund Pool Balance" value="₹2.4 Cr" sub="68% utilization" accent="blue" delay={300} />
            </div>

            {/* Map + Agent Pipeline - Optimized Ratio */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

                {/* Zone Map Panel - Flex Grow */}
                <div className="xl:col-span-8 glass-flush overflow-hidden shadow-xl rounded-3xl">
                    <div className="flex items-center justify-between p-8 border-b border-border bg-bg-elevated/20">
                        <SectionHeader title="Live Zone Map" sub="Chennai — Real-time disruption overlay" />
                        <div className="flex gap-2 text-sm">
                            {["Heat Map", "Zone View", "Worker Density"].map((t, i) => (
                                <button key={t} className={`px-4 py-2 rounded-lg transition-all ${i === 1 ? 'bg-accent-primary/10 text-accent-primary' : 'bg-bg-elevated text-text-muted hover:text-text-primary'}`}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[520px]">
                        <ZoneMapMini zones={zones} disruptions={disruptions} />
                    </div>
                    <div className="px-8 py-6 border-t border-border flex gap-10 bg-bg-elevated/10">
                        {[["bg-accent-alert", "Disruption"], ["bg-accent-warn", "Monitoring"], ["bg-accent-live", "Clear"]].map(([c, l]) => (
                            <div key={l} className="flex items-center gap-3 text-sm font-medium text-text-muted">
                                <span className={`w-3 h-3 rounded-full ${c} shadow-sm`} />{l}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agent Pipeline - Refined Spacing */}
                <div className="xl:col-span-4 glass rounded-3xl p-8 flex flex-col gap-8 shadow-xl">
                    <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-text-primary text-lg">Agentic Pipeline</span>
                        <span className="flex items-center gap-2 text-[12px] font-mono font-bold text-accent-live"><LiveDot color="green" /> LIVE_SYNC</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted overflow-x-auto pb-2 scrollbar-hide">
                        {["WORLD", "AGT 1", "AGT 2", "AGT 3", "AGT 4", "PAYOUT"].map((n, i, arr) => (
                            <span key={n} className="flex items-center gap-2 shrink-0">
                                <span className={`px-2.5 py-1.5 rounded border ${i === 1 ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary' : 'bg-bg-elevated border-border'}`}>{n}</span>
                                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-border shrink-0" />}
                            </span>
                        ))}
                    </div>

                    <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {AGENTS.map((agent) => {
                            const key = agent.key as keyof AgentStates;
                            const state = agentStates[key];
                            return (
                                <div key={agent.key} className="bg-bg-elevated/40 border border-border/60 rounded-2xl p-5 hover:border-accent-primary/30 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-bold text-text-primary">{agent.name}</span>
                                        <AgentStatusPill status={state.status} />
                                    </div>
                                    <ProgressBar value={Math.round(state.progress)} />
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {agent.tools.map((t) => (
                                            <span key={t} className="text-[10px] font-mono text-text-muted bg-bg-primary/80 border border-border/40 rounded-md px-2 py-1">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-border/50">
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-text-muted mb-3">Live Log Stream</p>
                        <ScrollingLogView logs={logs} />
                    </div>
                </div>
            </div>

            {/* Payouts Table + Disruption Feed - Increased Padding */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

                <div className="xl:col-span-2 glass-flush overflow-hidden rounded-3xl shadow-lg">
                    <div className="p-8 border-b border-border flex items-center justify-between bg-bg-elevated/10">
                        <SectionHeader title="Recent Payouts" sub="Auto-triggered by AI agents" />
                        <button className="text-sm font-bold text-accent-primary hover:text-orange-400 flex items-center gap-2 transition-colors">
                            View All Payouts <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr className="bg-bg-elevated/30">
                                    {["Worker", "Zone", "Reason", "Amount", "Status", "Time"].map(h => (
                                        <th key={h} className="px-8 py-5 text-left text-[11px] uppercase tracking-widest text-text-muted font-bold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {livePayouts.map((p, i) => (
                                    <tr
                                        key={p.id}
                                        className={`border-b border-border/40 hover:bg-bg-elevated/50 transition-all cursor-pointer group slide-in-stagger ${p.status === "flagged" ? "bg-accent-warn/5" : ""}`}
                                        style={{ "--slide-delay": `${i * 50}ms` } as React.CSSProperties}
                                    >
                                        <td className="px-8 py-5 font-bold text-text-primary text-sm group-hover:text-accent-primary transition-colors">{p.worker}</td>
                                        <td className="px-8 py-5 text-text-secondary text-sm font-mono">{p.zone}</td>
                                        <td className="px-8 py-5 text-text-muted text-sm">{p.reason}</td>
                                        <td className="px-8 py-5 font-mono font-bold text-text-primary text-base">₹{p.amount.toLocaleString("en-IN")}</td>
                                        <td className="px-8 py-5"><PayoutStatusChip status={p.status} /></td>
                                        <td className="px-8 py-5 text-sm text-text-muted font-mono">{p.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-flush overflow-hidden rounded-3xl shadow-lg">
                    <div className="p-8 border-b border-border flex items-center justify-between bg-bg-elevated/10">
                        <SectionHeader title="Disruption Feed" sub="Live event stream" />
                        <div className="p-2 bg-bg-elevated rounded-full">
                           <RefreshCw className="w-4 h-4 text-accent-primary spin-slow" />
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] disruption-feed-scroll custom-scrollbar">
                        {disruptions.map((d, i) => (
                            <div key={d.id} className="flex items-start gap-6 px-8 py-6 border-b border-border/40 hover:bg-bg-elevated/40 transition-colors slide-in-stagger" style={{ "--slide-delay": `${i * 80}ms` } as React.CSSProperties}>
                                <div className="text-2xl bg-bg-elevated w-12 h-12 flex items-center justify-center rounded-2xl shadow-inner shrink-0 mt-0.5">{d.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-base font-bold text-text-primary">{d.title}</span>
                                        <SeverityBadge severity={d.severity} />
                                    </div>
                                    <div className="text-sm font-medium text-text-muted mb-3">{d.zone}</div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded uppercase tracking-tighter">{d.timestamp}</span>
                                        <span className="text-[10px] font-mono font-bold bg-accent-live/10 rounded px-2 py-0.5 text-accent-live">{d.confidence}% match</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}