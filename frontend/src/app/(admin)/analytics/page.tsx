"use client";

import { useState } from "react";
import { analyticsData } from "@/lib/mock/data";
import { SectionHeader } from "@/components/ui";
import { BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = ["Platform Overview", "Disruption Trends", "Worker Behavior", "Financial"];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-bg-elevated border border-border rounded-xl p-3 shadow-xl text-xs font-mono">
            <p className="text-text-muted mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}</p>
            ))}
        </div>
    );
};

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="font-display font-bold text-2xl text-text-primary">Analytics & Reports</h1>
                <p className="text-sm text-text-muted mt-0.5">Platform intelligence · Last 30 days</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-bg-elevated border border-border rounded-xl p-1 w-fit flex-wrap">
                {TABS.map((t, i) => (
                    <button key={t} onClick={() => setActiveTab(i)} className={cn("px-4 py-2 rounded-lg text-sm transition-all",
                        activeTab === i ? "bg-accent-primary text-white font-semibold shadow-[0_0_12px_rgba(255,107,43,0.3)]" : "text-text-muted hover:text-text-primary"
                    )}>{t}</button>
                ))}
            </div>

            {activeTab === 0 && (
                <div className="space-y-4">
                    {/* KPI row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
                        {[
                            { icon: <Activity />, label: "Total Policies", value: "12,847", change: "+18%", color: "text-accent-primary" },
                            { icon: <Users />, label: "Active Workers", value: "8,934", change: "+9%", color: "text-accent-live" },
                            { icon: <DollarSign />, label: "Total Payouts", value: "₹8.4L", change: "+34%", color: "text-accent-blue" },
                            { icon: <TrendingUp />, label: "Onboarding Rate", value: "73%", change: "+5%", color: "text-accent-warn" },
                        ].map(k => (
                            <div key={k.label} className="glass rounded-2xl p-4">
                                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-3 [&>svg]:w-4 [&>svg]:h-4", k.color, "opacity-70")}>{k.icon}</div>
                                <p className="text-xs text-text-muted">{k.label}</p>
                                <p className={cn("font-display font-bold text-2xl mt-1", k.color)}>{k.value}</p>
                                <p className="text-[10px] text-accent-live mt-0.5">↑ {k.change} this month</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
                        {/* Policy growth area chart */}
                        <div className="glass rounded-2xl p-4">
                            <SectionHeader title="Policy Growth" sub="Active policies over time" />
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={analyticsData.policyGrowth}>
                                    <defs>
                                        <linearGradient id="polGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF6B2B" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#FF6B2B" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                    <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="policies" stroke="#FF6B2B" strokeWidth={2} fill="url(#polGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Worker persona donut */}
                        <div className="glass rounded-2xl p-4">
                            <SectionHeader title="Worker Personas" sub="Distribution by delivery type" />
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie data={analyticsData.workerPersona} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                                        {analyticsData.workerPersona.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend formatter={(v) => <span className="chart-legend-text">{v}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payout by disruption */}
                    <div className="glass rounded-2xl p-4">
                        <SectionHeader title="Payout by Disruption Type" sub="Total amount paid per event category" />
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={analyticsData.payoutByDisruption} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                                <XAxis type="number" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                                <YAxis type="category" dataKey="type" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="amount" fill="#FF6B2B" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 3 && (
                <div className="space-y-4">
                    {/* Daily payouts */}
                    <div className="glass rounded-2xl p-4">
                        <SectionHeader title="Daily Payout Volume" sub="Last 30 days" />
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={analyticsData.dailyPayouts}>
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="amount" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Payout (₹)" />
                                <Line type="monotone" dataKey="workers" stroke="#FF6B2B" strokeWidth={2} dot={false} name="Workers" yAxisId="right" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Premium trend */}
                    <div className="glass rounded-2xl p-4">
                        <SectionHeader title="Dynamic Premium Pricing" sub="Plan price changes over 30 days" />
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={analyticsData.premiumTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line dataKey="basic" stroke="#94A3B8" strokeWidth={1.5} dot={false} name="Basic" />
                                <Line dataKey="standard" stroke="#FF6B2B" strokeWidth={2} dot={false} name="Standard" />
                                <Line dataKey="premium" stroke="#22C55E" strokeWidth={1.5} dot={false} name="Premium" />
                                <Legend formatter={(v) => <span className="chart-legend-text">{v}</span>} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {(activeTab === 1 || activeTab === 2) && (
                <div className="glass rounded-2xl p-16 text-center">
                    <div className="text-5xl mb-4">{activeTab === 1 ? "🌧" : "👷"}</div>
                    <h3 className="font-display font-semibold text-text-primary text-lg mb-2">{TABS[activeTab]}</h3>
                    <p className="text-text-muted text-sm">Detailed analytics for this tab are coming soon</p>
                </div>
            )}
        </div>
    );
}
