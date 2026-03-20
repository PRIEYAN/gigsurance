"use client";

import { useEffect, useRef } from "react";
import { zones as allZones, disruptions as allDisruptions } from "@/lib/mock/data";

interface Zone { id: string; name: string; status: string; workers: number; severity: string; payout: number; lat: number; lng: number; }
interface Disruption { id: number; type: string; icon: string; title: string; zone: string; severity: string; confidence: number; timestamp: string; affectedWorkers: number; estimatedPayout: number; lat: number; lng: number; }

interface ZoneMapMiniProps {
    zones?: Zone[];
    disruptions?: Disruption[];
    fullScreen?: boolean;
}

export default function ZoneMapMini({ zones = allZones, disruptions = allDisruptions, fullScreen = false }: ZoneMapMiniProps) {
    const mapRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (mapRef.current) return;

        // Inject Leaflet CSS without going through PostCSS
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        const L = require("leaflet");

        const map = L.map(containerRef.current!, {
            center: [13.0827, 80.2707],
            zoom: 11,
            zoomControl: false,
            attributionControl: false,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: "",
            maxZoom: 19,
        }).addTo(map);

        const severityColors: Record<string, string> = {
            CATASTROPHIC: "#EF4444",
            HIGH: "#F97316",
            MEDIUM: "#F59E0B",
            LOW: "#22C55E",
            NONE: "#22C55E",
        };

        const statusColors: Record<string, string> = {
            disruption: "#EF4444",
            monitoring: "#F59E0B",
            clear: "#22C55E",
        };

        zones.forEach((zone) => {
            const color = statusColors[zone.status] || "#475569";
            const radius = zone.status === "disruption" ? 1800 : zone.status === "monitoring" ? 1400 : 1000;

            const circle = L.circle([zone.lat, zone.lng], {
                color,
                fillColor: color,
                fillOpacity: zone.status === "disruption" ? 0.18 : 0.1,
                weight: zone.status === "disruption" ? 2 : 1,
                radius,
            }).addTo(map);

            circle.bindTooltip(
                `<div style="background:#1C2537;border:1px solid #2D3F59;border-radius:8px;padding:8px 12px;color:#F8FAFC;font-family:'DM Sans',sans-serif;font-size:12px;min-width:160px">
          <div style="font-weight:600;margin-bottom:4px">${zone.name}</div>
          <div style="color:${color};font-size:11px;font-weight:700;margin-bottom:2px">● ${zone.severity}</div>
          <div style="color:#94A3B8;font-size:11px">${zone.workers} workers</div>
          ${zone.payout > 0 ? `<div style="color:#22C55E;font-size:11px;margin-top:2px">Est. ₹${(zone.payout / 100000).toFixed(1)}L payout</div>` : ""}
        </div>`,
                { className: "custom-tooltip", sticky: true, opacity: 1 }
            );

            // Pulsing ring for disruption zones
            if (zone.status === "disruption") {
                const pulseCircle = L.circle([zone.lat, zone.lng], {
                    color,
                    fillColor: "transparent",
                    weight: 1.5,
                    radius: radius * 1.5,
                    opacity: 0.4,
                    fillOpacity: 0,
                }).addTo(map);
            }
        });

        // Add disruption markers
        disruptions.forEach((d) => {
            if (!d.lat || !d.lng) return;
            const color = severityColors[d.severity] || "#475569";
            const marker = L.circleMarker([d.lat, d.lng], {
                radius: 7,
                fillColor: color,
                color: color,
                fillOpacity: 0.9,
                weight: 2,
            }).addTo(map);

            marker.bindPopup(
                `<div style="background:#1C2537;border:1px solid #2D3F59;border-radius:10px;padding:10px 14px;color:#F8FAFC;font-family:'DM Sans',sans-serif;min-width:180px">
          <div style="font-size:18px;margin-bottom:4px">${d.icon}</div>
          <div style="font-weight:700;font-size:13px">${d.title}</div>
          <div style="color:#94A3B8;font-size:11px">${d.zone}</div>
          <div style="display:flex;gap:8px;margin-top:6px">
            <span style="background:${color}22;color:${color};font-size:10px;padding:2px 6px;border-radius:4px;border:1px solid ${color}44">${d.severity}</span>
            <span style="color:#94A3B8;font-size:10px">${d.confidence}% conf</span>
          </div>
          <div style="color:#F8FAFC;font-size:12px;margin-top:4px">👷 ${d.affectedWorkers} workers</div>
        </div>`,
                { className: "custom-popup", closeButton: false }
            );
        });

        mapRef.current = map;
        return () => { map.remove(); mapRef.current = null; };
    }, []);

    return (
        <>
            <style>{`
        .custom-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; }
        .custom-popup .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .custom-popup .leaflet-popup-tip { display: none !important; }
        .custom-popup .leaflet-popup-content { margin: 0 !important; }
        .leaflet-container { background: #0A0E1A !important; }
      `}</style>
            <div ref={containerRef} className="w-full h-full" />
        </>
    );
}
