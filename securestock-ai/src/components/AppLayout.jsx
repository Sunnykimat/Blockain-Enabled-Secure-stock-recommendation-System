// ─────────────────────────────────────────────
//  components/AppLayout.jsx
//  Shell that wraps all authenticated pages
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--obsidian-950)" }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen((v) => !v)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--obsidian-950)" }}>
          {/* Subtle mesh background */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 10% 20%, rgba(0,255,209,0.03) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(0,100,80,0.05) 0%, transparent 50%)",
              zIndex: 0,
            }}
          />
          <div className="relative z-10 max-w-screen-xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
