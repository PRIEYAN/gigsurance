import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatNumber(num: number): string {
    return num.toLocaleString("en-IN");
}

export function getTrustColor(score: number): string {
    if (score >= 75) return "#22C55E";
    if (score >= 40) return "#F59E0B";
    return "#EF4444";
}

export function getSeverityColor(severity: string): string {
    switch (severity) {
        case "CATASTROPHIC": return "#EF4444";
        case "HIGH": return "#F97316";
        case "MEDIUM": return "#F59E0B";
        case "LOW": return "#22C55E";
        default: return "#475569";
    }
}

export function getZoneStatusColor(status: string): string {
    switch (status) {
        case "disruption": return "#EF4444";
        case "monitoring": return "#F59E0B";
        case "clear": return "#22C55E";
        default: return "#475569";
    }
}
