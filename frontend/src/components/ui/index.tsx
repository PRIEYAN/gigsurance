"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── StatCard ───────────────────────────────────────────────
interface StatCardProps {
    title: string;
    value: string;
    sub: string;
    accent: "orange" | "red" | "green" | "blue";
    badge?: string;
    pulsing?: boolean;
    delay?: number;
    icon?: React.ReactNode;
}

export function StatCard({ title, value, sub, accent, pulsing, delay = 0, icon }: StatCardProps) {
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

    const accentColors: Record<string, string> = {
        orange: "border-accent-primary shadow-[0_0_20px_rgba(255,107,43,0.08)]",
        red: "border-accent-alert shadow-[0_0_20px_rgba(239,68,68,0.1)]",
        green: "border-accent-live shadow-[0_0_20px_rgba(34,197,94,0.08)]",
        blue: "border-accent-blue shadow-[0_0_20px_rgba(59,130,246,0.08)]",
    };
    const accentText: Record<string, string> = {
        orange: "text-accent-primary",
        red: "text-accent-alert",
        green: "text-accent-live",
        blue: "text-accent-blue",
    };

    return (
        <div
            className={cn(
                "glass rounded-2xl p-5 lg:p-6 border-l-2 stat-card-reveal hover:-translate-y-0.5 hover:border-l-4 transition-all duration-300",
                accentColors[accent],
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ "--card-delay": `${delay}ms` } as React.CSSProperties}
        >
            <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-widest text-text-muted font-medium">{title}</p>
                {icon && <div className={cn("opacity-60", accentText[accent])}>{icon}</div>}
            </div>
            <div className="mt-3 flex items-end gap-2">
                <span className={cn("font-display font-bold text-3xl leading-none", accentText[accent])}>{value}</span>
                {pulsing && <span className="w-2.5 h-2.5 rounded-full bg-accent-alert mb-1 shrink-0 pulsing-alert-dot" />}
            </div>
            <p className="mt-2 text-sm text-text-muted">{sub}</p>
        </div>
    );
}

// ─── AgentStatusPill ─────────────────────────────────────────
type AgentStatus = "ACTIVE" | "QUEUED" | "STANDBY" | "DONE" | "ERROR" | "PROCESSING";

interface AgentStatusPillProps {
    status: AgentStatus;
}

export function AgentStatusPill({ status }: AgentStatusPillProps) {
    const map: Record<AgentStatus, { label: string; cls: string; dot: string }> = {
        ACTIVE: { label: "ACTIVE", cls: "status-active border", dot: "bg-accent-live pulse-dot" },
        QUEUED: { label: "QUEUED", cls: "status-queued border", dot: "bg-accent-warn" },
        STANDBY: { label: "STANDBY", cls: "status-standby border", dot: "bg-text-muted" },
        DONE: { label: "DONE", cls: "status-done border", dot: "bg-accent-blue" },
        ERROR: { label: "ERROR", cls: "status-error border", dot: "bg-accent-alert" },
        PROCESSING: { label: "PROCESSING", cls: "status-active border", dot: "bg-accent-live pulse-dot" },
    };
    const s = map[status];
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider", s.cls)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
            {s.label}
        </span>
    );
}

// ─── SeverityBadge ───────────────────────────────────────────
export function SeverityBadge({ severity }: { severity: string }) {
    const map: Record<string, string> = {
        CATASTROPHIC: "bg-accent-alert/20 text-accent-alert border border-accent-alert/40",
        HIGH: "bg-orange-500/20 text-orange-400 border border-orange-500/40",
        MEDIUM: "bg-accent-warn/20 text-accent-warn border border-accent-warn/40",
        LOW: "bg-accent-live/20 text-accent-live border border-accent-live/40",
        NONE: "bg-text-muted/20 text-text-muted border border-text-muted/20",
    };
    return (
        <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase", map[severity] || map.NONE)}>
            {severity}
        </span>
    );
}

// ─── GigsBadge (Worker persona chip) ──────────────────────────
export function GigsBadge({ persona }: { persona: string }) {
    const map: Record<string, { icon: string; label: string; cls: string }> = {
        food: { icon: "🍕", label: "Food", cls: "bg-accent-primary/15 text-accent-primary border border-accent-primary/30" },
        quick: { icon: "⚡", label: "Quick", cls: "bg-purple-500/15 text-purple-400 border border-purple-500/30" },
        ecom: { icon: "📦", label: "Ecom", cls: "bg-accent-blue/15 text-accent-blue border border-accent-blue/30" },
    };
    const p = map[persona] || map.food;
    return (
        <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", p.cls)}>
            {p.icon} {p.label}
        </span>
    );
}

// ─── TrustScoreMeter (desktop bar + tooltip) ─────────────────
export function TrustScoreMeter({ score }: { score: number }) {
    const textClass = score >= 75 ? "trust-high" : score >= 40 ? "trust-mid" : "trust-low";
    const colorHex = score >= 75 ? "#16A34A" : score >= 40 ? "#D97706" : "#DC2626";
    return (
        <div className="flex items-center gap-2 group relative">
            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                    className="trust-score-fill"
                    style={{ "--trust-width": `${score}%`, "--trust-color": colorHex } as React.CSSProperties}
                />
            </div>
            <span className={cn("font-mono text-xs", textClass)}>{score}</span>
        </div>
    );
}

// ─── PayoutStatusChip ────────────────────────────────────────
export function PayoutStatusChip({ status }: { status: string }) {
    const map: Record<string, { icon: string; cls: string }> = {
        paid: { icon: "✅ Paid", cls: "bg-accent-live/10 text-accent-live border border-accent-live/30" },
        processing: { icon: "⏳ Processing", cls: "bg-accent-warn/10 text-accent-warn border border-accent-warn/30" },
        flagged: { icon: "🚨 Flagged", cls: "bg-accent-alert/10 text-accent-alert border border-accent-alert/30" },
        failed: { icon: "❌ Failed", cls: "bg-accent-alert/10 text-accent-alert border border-accent-alert/30" },
    };
    const s = map[status] || { icon: status, cls: "bg-bg-elevated text-text-muted" };
    return (
        <span className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border whitespace-nowrap", s.cls)}>
            {s.icon}
        </span>
    );
}

// ─── LiveDot ─────────────────────────────────────────────────
export function LiveDot({ color = "green" }: { color?: "green" | "red" | "orange" }) {
    const dotClass: Record<string, string> = {
        green: "live-dot-green",
        red: "live-dot-red",
        orange: "live-dot-orange",
    };
    return (
        <span className="relative inline-flex">
            <span className={cn("w-2 h-2 rounded-full", dotClass[color])} />
            <span className={cn("absolute inset-0 rounded-full animate-ping opacity-50", dotClass[color])} />
        </span>
    );
}

// ─── SectionHeader ───────────────────────────────────────────
export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="font-display font-semibold text-base lg:text-lg text-text-primary">{title}</h2>
                {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
            </div>
            {action}
        </div>
    );
}

// ─── ProgressBar ─────────────────────────────────────────────
export function ProgressBar({ value, color = "#FF6B2B", label }: { value: number; color?: string; label?: string }) {
    return (
        <div className="flex items-center gap-2">
            {label && <span className="text-xs text-text-muted w-16 shrink-0">{label}</span>}
            <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                <div
                    className="progress-fill"
                    style={{ "--progress": `${value}%`, "--progress-color": color } as React.CSSProperties}
                />
            </div>
            <span className="text-xs font-mono text-text-muted w-8 text-right">{value}%</span>
        </div>
    );
}

// ─── ScrollingLogView ────────────────────────────────────────
export function ScrollingLogView({ logs }: { logs: string[] }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
    }, [logs]);

    return (
        <div ref={ref} className="h-32 overflow-y-auto font-mono text-[11px] text-accent-live bg-slate-900 rounded-lg p-2 space-y-0.5">
            {logs.map((line, i) => (
                <div key={i} className="leading-relaxed">{line}</div>
            ))}
        </div>
    );
}
