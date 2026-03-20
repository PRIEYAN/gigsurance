"use client";

import { useState } from "react";
import { agentLogs } from "@/lib/mock/data";
import { AgentStatusPill, ProgressBar, ScrollingLogView, LiveDot, SectionHeader } from "@/components/ui";
import { ChevronDown, Cpu, Play, RotateCcw, Activity, Zap, Shield, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type AgentKey = "agent1" | "agent2" | "agent3" | "agent4";
type AgentStatus = "ACTIVE" | "QUEUED" | "STANDBY" | "DONE" | "ERROR";

const agentDefs = [
    {
        key: "agent1" as AgentKey,
        icon: Activity,
        name: "Data Collector",
        desc: "Fetches real-time data from weather, news, AQI, and disaster APIs",
        tools: [
            { name: "Weather API (IMD)", status: "ok" },
            { name: "NewsAPI NLP", status: "ok" },
            { name: "AQI Monitor", status: "loading" },
            { name: "Disaster.io", status: "ok" },
            { name: "NDMA Feed", status: "ok" },
        ],
        output: { rainfall_mm: 112, zone: "Velachery", ndma_alert: true, news_count: 3 }
    },
    {
        key: "agent2" as AgentKey,
        icon: Zap,
        name: "Zone Classifier",
        desc: "Classifies disruption type, affected zones, and severity using ML model",
        tools: [
            { name: "ML Classifier v2.4", status: "ok" },
            { name: "Zone DB Lookup", status: "ok" },
            { name: "Severity Threshold", status: "ok" },
        ],
        output: { disruption_type: "HEAVY_RAIN+FLOOD", primary_zone: "Velachery", severity: "HIGH", payout_trigger: 1800 }
    },
    {
        key: "agent3" as AgentKey,
        icon: Shield,
        name: "Auditor",
        desc: "Validates claims, checks eligibility, and runs fraud pre-screening",
        tools: [
            { name: "Worker DB", status: "ok" },
            { name: "Trust Scorer", status: "ok" },
            { name: "Eligibility Engine", status: "ok" },
            { name: "Fraud Pre-Check", status: "ok" },
        ],
        output: { total_workers: 247, eligible: 232, flagged: 15, total_payout_inr: 417600 }
    },
    {
        key: "agent4" as AgentKey,
        icon: Send,
        name: "UPI Executor",
        desc: "Dispatches micro-payments via UPI rails to all eligible workers",
        tools: [
            { name: "UPI Gateway", status: "ok" },
            { name: "Batch Dispatcher", status: "ok" },
            { name: "Receipt Logger", status: "ok" },
        ],
        output: { dispatched: 231, failed: 1, retry_queued: 1, latency_ms: 340 }
    },
];

interface AgentStateMap {
    agent1: { status: AgentStatus; progress: number; confidence: number };
    agent2: { status: AgentStatus; progress: number; confidence: number };
    agent3: { status: AgentStatus; progress: number; confidence: number };
    agent4: { status: AgentStatus; progress: number; confidence: number };
}

const executionHistory = [
    { id: 1, datetime: "2024-12-19 16:03", trigger: "IMD Heavy Rain Alert", agents: 4, outcome: "SUCCESS", payout: 417600, duration: "12.4s" },
    { id: 2, datetime: "2024-12-18 14:22", trigger: "Swiggy App Crash", agents: 4, outcome: "SUCCESS", payout: 195000, duration: "8.1s" },
    { id: 3, datetime: "2024-12-17 09:45", trigger: "Ambattur Flash Flood", agents: 4, outcome: "PARTIAL", payout: 89000, duration: "15.2s" },
    { id: 4, datetime: "2024-12-15 18:30", trigger: "Strong Wind Warning", agents: 2, outcome: "NO_ACTION", payout: 0, duration: "3.3s" },
];

const pipelineSteps = [
    { label: "WORLD", sub: "Input", agentKey: null },
    { label: "COLLECT", sub: "Agent 1", agentKey: "agent1" as AgentKey },
    { label: "CLASSIFY", sub: "Agent 2", agentKey: "agent2" as AgentKey },
    { label: "AUDIT", sub: "Agent 3", agentKey: "agent3" as AgentKey },
    { label: "EXECUTE", sub: "Agent 4", agentKey: "agent4" as AgentKey },
    { label: "PAYOUT", sub: "Output", agentKey: null },
];

export default function AgentsPage() {
    const [agentStates, setAgentStates] = useState<AgentStateMap>({
        agent1: { status: "ACTIVE", progress: 82, confidence: 94 },
        agent2: { status: "ACTIVE", progress: 67, confidence: 87 },
        agent3: { status: "QUEUED", progress: 0, confidence: 0 },
        agent4: { status: "STANDBY", progress: 0, confidence: 0 },
    });
    const [expanded, setExpanded] = useState<AgentKey | null>(null);
    const [running, setRunning] = useState(false);

    const runPipeline = () => {
        if (running) return;
        setRunning(true);
        setAgentStates({
            agent1: { status: "ACTIVE", progress: 0, confidence: 0 },
            agent2: { status: "QUEUED", progress: 0, confidence: 0 },
            agent3: { status: "STANDBY", progress: 0, confidence: 0 },
            agent4: { status: "STANDBY", progress: 0, confidence: 0 },
        });

        const seq: Array<[AgentKey, AgentStatus, number, number, number]> = [
            ["agent1", "ACTIVE", 100, 94, 1500],
            ["agent2", "ACTIVE", 100, 87, 1500],
            ["agent3", "ACTIVE", 100, 91, 1500],
            ["agent4", "DONE", 100, 99, 1800],
        ];
        let delay = 0;
        seq.forEach(([key, status, progress, confidence, dur], i) => {
            delay += i === 0 ? 200 : seq[i - 1][4];
            setTimeout(() => {
                setAgentStates(s => ({ ...s, [key]: { status, progress, confidence } }));
                if (i === seq.length - 1) setTimeout(() => setRunning(false), 500);
            }, delay);
        });
    };

    return (
        <div className="space-y-6 px-1">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="font-display font-bold text-xl lg:text-2xl text-text-primary leading-tight">
                        Agent Workflow Monitor
                    </h1>
                    <p className="text-sm text-text-muted">
                        Real-time agentic pipeline — AI-driven payout automation
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-accent-live font-medium">
                        <LiveDot color="green" />
                        Pipeline Online
                    </div>
                    <button
                        onClick={runPipeline}
                        disabled={running}
                        className="flex items-center gap-2 bg-accent-primary hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all shadow-[0_0_20px_rgba(255,107,43,0.3)]"
                    >
                        {running
                            ? <><RotateCcw className="w-4 h-4 animate-spin" /> Running…</>
                            : <><Play className="w-4 h-4" /> Run Pipeline</>
                        }
                    </button>
                </div>
            </div>

            {/* ── Pipeline Diagram ── */}
            <div className="glass rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-text-muted mb-4 font-medium">
                    Execution Flow
                </p>
                <div className="flex items-center justify-between gap-1 min-w-0 overflow-x-auto pb-1">
                    {pipelineSteps.map((step, i) => {
                        const state = step.agentKey ? agentStates[step.agentKey] : null;
                        const isActive = state?.status === "ACTIVE";
                        const isDone = state?.status === "DONE";
                        const isEndpoint = !step.agentKey;

                        return (
                            <div key={step.label} className="flex items-center gap-1 shrink-0">
                                {/* Node */}
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className={cn(
                                        "relative px-3 py-2 rounded-xl border text-xs font-mono font-semibold transition-all duration-500 whitespace-nowrap",
                                        isActive
                                            ? "border-accent-live bg-accent-live/10 text-accent-live shadow-[0_0_16px_rgba(34,197,94,0.25)]"
                                            : isDone
                                                ? "border-accent-blue bg-accent-blue/10 text-accent-blue"
                                                : isEndpoint
                                                    ? "border-border-bright bg-bg-elevated text-text-secondary"
                                                    : "border-border/50 bg-bg-surface/50 text-text-muted"
                                    )}>
                                        {isActive && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-live pulse-dot" />
                                        )}
                                        {step.label}
                                    </div>
                                    <span className="text-[9px] text-text-muted tracking-wide">{step.sub}</span>
                                </div>

                                {/* Connector */}
                                {i < pipelineSteps.length - 1 && (
                                    <div className={cn(
                                        "h-px w-6 lg:w-10 shrink-0 transition-all duration-500 mt-[-10px]",
                                        isActive || isDone ? "bg-accent-live/40" : "bg-border/40"
                                    )} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Agent Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {agentDefs.map((agent) => {
                    const state = agentStates[agent.key];
                    const isExpanded = expanded === agent.key;
                    const Icon = agent.icon;

                    return (
                        <div
                            key={agent.key}
                            className={cn(
                                "glass-flush overflow-hidden flex flex-col transition-all duration-300",
                                state.status === "ACTIVE"
                                    ? "border border-accent-live/30 shadow-[0_0_24px_rgba(34,197,94,0.07)]"
                                    : ""
                            )}
                        >
                            {/* Card Header */}
                            <div className="p-5 flex-1 space-y-4">
                                {/* Title row */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                            state.status === "ACTIVE"
                                                ? "bg-accent-live/15 text-accent-live"
                                                : "bg-bg-elevated text-text-muted"
                                        )}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-text-primary leading-tight">
                                                {agent.name}
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-0.5 font-mono">
                                                {agent.key.toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <AgentStatusPill status={state.status} />
                                </div>

                                {/* Description */}
                                <p className="text-xs text-text-muted leading-relaxed">
                                    {agent.desc}
                                </p>

                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                                        <span>Progress</span>
                                        <span className="font-mono">{Math.round(state.progress)}%</span>
                                    </div>
                                    <ProgressBar value={Math.round(state.progress)} />
                                </div>

                                {/* Confidence */}
                                {state.confidence > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] text-text-muted">
                                            <span>Confidence</span>
                                            <span className="font-mono text-accent-live">{state.confidence}%</span>
                                        </div>
                                        <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                                            <div
                                                className="confidence-fill"
                                                style={{ "--confidence": `${state.confidence}%` } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Tool List */}
                                <div className="space-y-1.5 pt-1 border-t border-border/50">
                                    {agent.tools.map(t => (
                                        <div key={t.name} className="flex items-center gap-2 text-[11px]">
                                            <span className={cn(
                                                "shrink-0 font-mono",
                                                t.status === "ok"
                                                    ? "text-accent-live"
                                                    : t.status === "loading"
                                                        ? "text-accent-warn animate-pulse"
                                                        : "text-accent-alert"
                                            )}>
                                                {t.status === "ok" ? "✓" : t.status === "loading" ? "⟳" : "✗"}
                                            </span>
                                            <span className="text-text-muted truncate">{t.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Expand Toggle */}
                            <button
                                onClick={() => setExpanded(isExpanded ? null : agent.key)}
                                className="w-full flex items-center justify-center gap-1.5 px-5 py-3 text-[10px] font-medium uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-bg-elevated/40 border-t border-border/50 transition-colors"
                            >
                                {isExpanded ? "Hide" : "Show"} Details
                                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", isExpanded && "rotate-180")} />
                            </button>

                            {/* Expanded Section */}
                            {isExpanded && (
                                <div className="border-t border-border bg-bg-surface/30 p-5 space-y-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
                                            Live Log
                                        </p>
                                        <ScrollingLogView logs={agentLogs[agent.key]} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-text-muted mb-2">
                                            Last Output
                                        </p>
                                        <pre className="text-[10px] font-mono text-accent-live bg-black/30 rounded-xl p-3 overflow-x-auto leading-relaxed">
                                            {JSON.stringify(agent.output, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Execution History ── */}
            <div className="glass-flush overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <SectionHeader title="Execution History" sub="Past pipeline runs" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/60">
                                {["Date / Time", "Trigger Event", "Agents", "Outcome", "Total Payout", "Duration"].map(h => (
                                    <th
                                        key={h}
                                        className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-text-muted font-medium whitespace-nowrap"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {executionHistory.map(row => (
                                <tr key={row.id} className="hover:bg-bg-elevated/20 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-text-muted whitespace-nowrap">
                                        {row.datetime}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-primary">
                                        {row.trigger}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-text-secondary text-center">
                                        {row.agents}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-block text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap",
                                            row.outcome === "SUCCESS"
                                                ? "text-accent-live border-accent-live/30 bg-accent-live/10"
                                                : row.outcome === "PARTIAL"
                                                    ? "text-accent-warn border-accent-warn/30 bg-accent-warn/10"
                                                    : "text-text-muted border-border bg-bg-elevated"
                                        )}>
                                            {row.outcome}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm font-semibold text-accent-live whitespace-nowrap">
                                        {row.payout > 0 ? `₹${row.payout.toLocaleString("en-IN")}` : "—"}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-text-muted">
                                        {row.duration}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}