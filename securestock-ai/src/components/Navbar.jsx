// ─────────────────────────────────────────────
//  components/Navbar.jsx
// ─────────────────────────────────────────────
import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Menu, ChevronDown, LogOut, User, Shield } from "lucide-react";
import { AuthContext } from "../App";
import { notifications, currentUser } from "../utils/mockData";

export default function Navbar({ onMenuToggle }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const notifsRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchVal.trim()) {
      navigate(`/search?q=${searchVal.trim().toUpperCase()}`);
      setSearchVal("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const notifTypeColor = (type) => {
    if (type === "recommendation") return "#00ffd1";
    if (type === "blockchain") return "#ffd166";
    if (type === "alert") return "#ff4560";
    return "rgba(255,255,255,0.4)";
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 flex-shrink-0 relative z-10"
      style={{
        background: "rgba(6,12,20,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
        >
          <Menu size={18} />
        </button>

        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search symbol… (Enter)"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value.toUpperCase())}
            onKeyDown={handleSearch}
            className="input-dark pl-9 pr-4 py-2 rounded-lg text-sm w-52 focus:w-64 transition-all duration-300"
            style={{ fontFamily: "'DM Mono', monospace" }}
          />
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                style={{
                  background: "#ff4560",
                  color: "#fff",
                  fontSize: "9px",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
              style={{
                background: "#0a1428",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/80">Notifications</span>
                <span className="text-xs text-[#00ffd1]" style={{ fontFamily: "'DM Mono'" }}>
                  {unreadCount} new
                </span>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: n.read ? "transparent" : "#00ffd1" }}
                    />
                    <div>
                      <p className="text-xs text-white/70 leading-relaxed">{n.message}</p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: notifTypeColor(n.type), fontFamily: "'DM Mono'" }}
                      >
                        {n.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #00ffd1, #00c9a0)",
                color: "#03050a",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white/80 leading-none">
                {currentUser.name}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(0,255,209,0.6)", fontFamily: "'DM Mono'" }}
              >
                {currentUser.plan}
              </p>
            </div>
            <ChevronDown size={12} className="text-white/30" />
          </button>

          {showProfile && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
              style={{
                background: "#0a1428",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs text-white/80 font-semibold">{currentUser.name}</p>
                <p className="text-xs text-white/40 mt-0.5 truncate">{currentUser.email}</p>
              </div>
              <button
                onClick={() => { navigate("/settings"); setShowProfile(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors"
              >
                <User size={13} /> Profile & Settings
              </button>
              <button
                onClick={() => { navigate("/blockchain"); setShowProfile(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-white/60 hover:text-white/90 hover:bg-white/5 transition-colors"
              >
                <Shield size={13} /> Blockchain Status
              </button>
              <div className="border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs hover:bg-white/5 transition-colors"
                  style={{ color: "#ff4560" }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
