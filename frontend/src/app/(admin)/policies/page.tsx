"use client";

export default function PoliciesPage() {
    const plans = [
        { name: "BASIC", price: 29, coverage: 800, workers: 3241, color: "border-border", features: ["Heavy rain payouts", "App crash coverage"], missing: ["Cyclone/flood coverage", "Priority payout"] },
        { name: "STANDARD", price: 59, coverage: 1800, workers: 7849, color: "border-accent-primary", popular: true, features: ["All weather events", "App crash coverage", "Curfew/lockdown", "Flood coverage"], missing: ["AQI/pollution events", "Priority payout"] },
        { name: "PREMIUM", price: 99, coverage: 3500, workers: 1757, color: "border-accent-live", features: ["Everything in Standard", "AQI/pollution events", "Priority payout (<5min)", "Dedicated support"], missing: [] },
    ];

    return (
        <div className="space-y-5">
            <div>
                <h1 className="font-display font-bold text-2xl text-text-primary">Policy Manager</h1>
                <p className="text-sm text-text-muted mt-0.5">Coverage plan configuration and worker distribution</p>
            </div>

            {/* Plan Tier Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                {plans.map((plan) => (
                    <div key={plan.name} className={`glass rounded-2xl p-5 border ${plan.color} relative ${plan.popular ? "shadow-[0_0_30px_rgba(255,107,43,0.15)]" : ""}`}>
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_12px_rgba(255,107,43,0.4)]">
                                ⭐ Most Popular
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-text-muted font-medium">{plan.name}</p>
                                <p className="font-display font-bold text-3xl text-text-primary mt-1">₹{plan.price}<span className="text-sm font-normal text-text-muted">/week</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-text-muted">Coverage up to</p>
                                <p className="font-mono font-bold text-accent-primary">₹{plan.coverage.toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                        <div className="mb-4 pb-4 border-b border-border">
                            <p className="text-xs text-text-muted mb-1">Active workers</p>
                            <p className="font-display font-bold text-xl text-text-primary">{plan.workers.toLocaleString("en-IN")}</p>
                            <div className="mt-2 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                                <div className="policy-fill" style={{ "--policy-pct": `${(plan.workers / 12847 * 100).toFixed(0)}%` } as React.CSSProperties} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            {plan.features.map(f => (
                                <div key={f} className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="text-accent-live text-sm">✓</span>{f}
                                </div>
                            ))}
                            {plan.missing.map(f => (
                                <div key={f} className="flex items-center gap-2 text-xs text-text-muted">
                                    <span className="text-text-muted text-sm">✗</span>{f}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Policy Rules */}
            <div className="glass-flush overflow-hidden">
                <div className="p-4 border-b border-border">
                    <h2 className="font-display font-semibold text-text-primary">Policy Rules Configuration</h2>
                    <p className="text-xs text-text-muted mt-0.5">Configure triggers, thresholds, and payout formulas</p>
                </div>
                <div className="divide-y divide-border">
                    {[
                        { title: "Disruption Triggers", desc: "Rain > 50mm, App downtime > 10min, AQI > 300, Flood alert ACTIVE, Curfew orders" },
                        { title: "Payout Calculation", desc: "Base: ₹800 (Basic), ₹1,800 (Standard), ₹3,500 (Premium). Multiplier: 1.5x for Catastrophic events" },
                        { title: "Cooldown Period", desc: "6 hours between payouts per worker. 24-hour freeze after fraud flag" },
                        { title: "Coverage Exclusions", desc: "Pre-existing zone blacklists, workers with trust score < 25, suspended accounts" },
                    ].map(rule => (
                        <div key={rule.title} className="p-4 hover:bg-bg-elevated/30 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-text-primary">{rule.title}</p>
                                    <p className="text-xs text-text-muted mt-0.5">{rule.desc}</p>
                                </div>
                                <button className="text-xs text-accent-primary hover:underline shrink-0 ml-4">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
