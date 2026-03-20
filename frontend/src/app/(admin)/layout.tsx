"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [selectedCity, setSelectedCity] = useState("Chennai");
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    return (
        <div className="min-h-screen grid-bg bg-bg-primary">
            <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
            <TopBar selectedCity={selectedCity} onCityChange={setSelectedCity} sidebarExpanded={sidebarExpanded} />
            <main
                className="transition-all duration-300"
                style={{
                    paddingLeft: sidebarExpanded ? '240px' : '72px',
                    paddingTop: '68px'
                }}
            >
                <div className="px-8 py-8 lg:px-12 lg:py-10 xl:px-16 xl:py-12 max-w-[1920px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
