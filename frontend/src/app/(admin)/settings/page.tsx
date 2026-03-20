"use client";

export default function SettingsPage() {
    return (
        <div className="space-y-5">
            <div>
                <h1 className="font-display font-bold text-2xl text-text-primary">Settings</h1>
                <p className="text-sm text-text-muted mt-0.5">Platform configuration and API integrations</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                {[
                    { title: "API Integrations", items: ["IMD Weather API — Connected ✅", "NewsAPI — Connected ✅", "NDMA Disaster Feed — Connected ✅", "UPI Gateway (Mock) — Active ✅", "Razorpay (Production) — Configure"] },
                    { title: "Notification Settings", items: ["Email alerts on disruption — Enabled", "SMS to workers — Enabled", "WhatsApp Business API — Configure", "Slack ops channel — Connected ✅"] },
                    { title: "Payout Thresholds", items: ["Min rainfall trigger: 50mm", "Max payout per event: ₹3,500", "Cooldown period: 6 hours", "Fraud score cutoff: 30/100"] },
                    { title: "Zone Management", items: ["Active zones: 8", "Last zone boundary update: Dec 18", "Zone polygon editor — Open", "Import from QGIS — Upload"] },
                ].map(section => (
                    <div key={section.title} className="glass rounded-2xl p-4">
                        <h3 className="font-semibold text-text-primary mb-3">{section.title}</h3>
                        <div className="space-y-2">
                            {section.items.map(item => (
                                <div key={item} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                                    <span className="text-sm text-text-secondary">{item}</span>
                                    <button className="text-xs text-accent-primary hover:underline">Edit</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
