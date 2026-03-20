"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Map,
    Cpu,
    Users,
    FileText,
    DollarSign,
    ShieldAlert,
    BarChart3,
    Settings,
    ChevronRight,
    Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Map, label: "Live Zone Map", href: "/map" },
    { icon: Cpu, label: "Agent Monitor", href: "/agents" },
    { icon: Users, label: "Workers", href: "/workers" },
    { icon: FileText, label: "Policy Manager", href: "/policies" },
    { icon: DollarSign, label: "Payout Center", href: "/payouts" },
    { icon: ShieldAlert, label: "Fraud Detection", href: "/fraud" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
    expanded: boolean;
    setExpanded: (val: boolean) => void;
}

export default function Sidebar({ expanded, setExpanded }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-full flex flex-col bg-bg-surface border-r border-border sidebar-transition",
                expanded ? "w-[240px]" : "w-[72px]"
            )}
        >
            {/* Logo — height matches TopBar exactly (64px) */}
            <div
                className={cn(
                    "flex items-center border-b border-border shrink-0 topbar-height",
                    expanded ? "px-7 gap-5 justify-start" : "justify-center"
                )}
            >
                <div className="w-9 h-9 rounded-xl bg-accent-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                {expanded && (
                    <div className="overflow-hidden">
                        <span className="font-display font-bold text-text-primary text-[17px] leading-none tracking-tight whitespace-nowrap">
                            Gigs<span className="text-accent-primary">urance</span>
                        </span>
                        <div className="text-[10px] font-mono text-text-muted mt-1 uppercase tracking-widest">Admin</div>
                    </div>
                )}
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto overflow-x-hidden px-5">
                {navItems.map((item) => {
                    const active =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={!expanded ? item.label : undefined}
                            className={cn(
                                "relative flex items-center gap-4 rounded-xl transition-all duration-200 group",
                                expanded ? "px-5 py-4" : "justify-center px-0 py-4",
                                active
                                    ? "bg-accent-primary/10 text-accent-primary"
                                    : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated"
                            )}
                        >
                            {/* Active left bar */}
                            {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-accent-primary rounded-r-full" />
                            )}

                            <item.icon
                                className={cn(
                                    "w-[24px] h-[24px] shrink-0",
                                    active ? "text-accent-primary" : ""
                                )}
                            />

                            {expanded && (
                                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {!expanded && (
                                <div className="absolute left-full ml-5 px-4 py-2 bg-bg-surface border border-border shadow-lg text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Expand/Collapse button */}
            <div className="px-5 pb-6 shrink-0">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        "w-full flex items-center gap-4 rounded-xl py-4 text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all border border-border",
                        expanded ? "px-5 justify-start" : "justify-center px-0"
                    )}
                >
                    <ChevronRight
                        className={cn(
                            "w-4 h-4 shrink-0 transition-transform duration-300",
                            expanded && "rotate-180"
                        )}
                    />
                    {expanded && <span className="text-xs font-medium">Collapse</span>}
                </button>
            </div>
        </aside>
    );
}
