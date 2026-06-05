// ─────────────────────────────────────────────
//  pages/Settings.jsx
// ─────────────────────────────────────────────
import React, { useState } from "react";
import {
  User, Bell, Shield, Key, Palette, Globe,
  CheckCircle, Save,
} from "lucide-react";
import { currentUser } from "../utils/mockData";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <Icon size={16} style={{ color: "#00ffd1" }} />
        <h2 className="text-sm font-bold text-white/90" style={{ fontFamily: "'Syne'" }}>
          {title}
        </h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white/80">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
        style={{ background: checked ? "rgba(0,255,209,0.3)" : "rgba(255,255,255,0.1)" }}>
        <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-all duration-300 shadow"
          style={{
            background: checked ? "#00ffd1" : "rgba(255,255,255,0.4)",
            transform: checked ? "translateX(20px)" : "translateX(0)",
          }} />
      </button>
    </div>
  );
}

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: currentUser.name, email: currentUser.email });
  const [notifs, setNotifs] = useState({ email: true, push: true, recommendations: true, blockchain: true, alerts: false });
  const [security, setSecurity] = useState({ twofa: false, sessionLogs: true });
  const [apiKey] = useState("sk-ss-" + "x".repeat(32));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-6 max-w-2xl">
      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white/90" style={{ fontFamily: "'Syne'" }}>
            Settings
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Manage your account and preferences</p>
        </div>
        <button onClick={handleSave}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold">
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      {/* ── Profile ── */}
      <Section title="Profile" icon={User}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #00ffd1, #00c9a0)", color: "#03050a", fontFamily: "'Syne'" }}>
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-white/80">{profile.name}</p>
            <p className="text-xs text-white/40 mt-0.5">{currentUser.plan} Plan · Member since {new Date(currentUser.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs badge-verified">
              Verified Account
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Full Name</label>
            <input type="text" value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              className="input-dark w-full px-4 py-2.5 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1.5 block">Email Address</label>
            <input type="email" value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              className="input-dark w-full px-4 py-2.5 rounded-lg text-sm" />
          </div>
        </div>
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications" icon={Bell}>
        <ToggleRow label="Email Notifications" description="Receive daily digest via email"
          checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
        <ToggleRow label="Push Notifications" description="Browser push for real-time alerts"
          checked={notifs.push} onChange={v => setNotifs(n => ({ ...n, push: v }))} />
        <ToggleRow label="New Recommendations" description="Alert when AI generates new signals"
          checked={notifs.recommendations} onChange={v => setNotifs(n => ({ ...n, recommendations: v }))} />
        <ToggleRow label="Blockchain Confirmations" description="Notify on verification status changes"
          checked={notifs.blockchain} onChange={v => setNotifs(n => ({ ...n, blockchain: v }))} />
        <ToggleRow label="Price Alerts" description="Notify when stocks hit your watchlist targets"
          checked={notifs.alerts} onChange={v => setNotifs(n => ({ ...n, alerts: v }))} />
      </Section>

      {/* ── Security ── */}
      <Section title="Security" icon={Shield}>
        <ToggleRow label="Two-Factor Authentication" description="Require 2FA on every login (recommended)"
          checked={security.twofa} onChange={v => setSecurity(s => ({ ...s, twofa: v }))} />
        <ToggleRow label="Session Activity Logs" description="Keep logs of all login sessions"
          checked={security.sessionLogs} onChange={v => setSecurity(s => ({ ...s, sessionLogs: v }))} />
        <div className="pt-2">
          <button className="btn-ghost px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Key size={13} /> Change Password
          </button>
        </div>
      </Section>

      {/* ── API Key ── */}
      <Section title="API Access" icon={Key}>
        <p className="text-xs text-white/40 mb-3">
          Use this key to access the SecureStock AI API from your own applications.
        </p>
        <div className="flex gap-3">
          <input type="password" value={apiKey} readOnly
            className="input-dark flex-1 px-4 py-2.5 rounded-lg text-sm"
            style={{ fontFamily: "'DM Mono'", fontSize: "11px" }} />
          <button className="btn-ghost px-4 py-2.5 rounded-lg text-sm"
            onClick={() => navigator.clipboard?.writeText(apiKey)}>
            Copy
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "#ff4560" }}>
          ⚠ Never share your API key. Regenerate it if compromised.
        </p>
      </Section>

      {/* ── Danger zone ── */}
      <div className="rounded-xl p-5"
        style={{ border: "1px solid rgba(255,69,96,0.2)", background: "rgba(255,69,96,0.04)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "#ff4560", fontFamily: "'Syne'" }}>
          Danger Zone
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Delete Account</p>
            <p className="text-xs text-white/40 mt-0.5">Permanently remove your account and all data</p>
          </div>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "rgba(255,69,96,0.15)", color: "#ff4560", border: "1px solid rgba(255,69,96,0.3)" }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
