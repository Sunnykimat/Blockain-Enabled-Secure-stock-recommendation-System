// ─────────────────────────────────────────────
//  pages/Login.jsx
// ─────────────────────────────────────────────
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle } from "lucide-react";
import { AuthContext } from "../App";
import { loginUser } from "../services/api";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await loginUser(form);
      if (form.remember) localStorage.setItem("ss_email", form.email);
      login(token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 30% 50%, #0f1e3d 0%, #03050a 60%), radial-gradient(ellipse at 80% 20%, #003d2e 0%, transparent 50%)",
      }}
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,209,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,209,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orbs */}
      <div
        className="absolute top-20 left-20 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,209,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,100,80,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Glass card */}
      <div
        className="glass rounded-2xl p-8 w-full max-w-md relative z-10 animate-slide-up"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,209,0.1)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00ffd1, #00c9a0)" }}
          >
            <Zap size={20} style={{ color: "#03050a" }} />
          </div>
          <div>
            <h1
              className="text-lg font-bold gradient-text-cyan"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              SecureStock AI
            </h1>
            <p
              className="text-xs text-white/30"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Blockchain · Intelligence
            </p>
          </div>
        </div>

        <h2
          className="text-2xl font-bold text-white/90 mb-1"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Welcome back
        </h2>
        <p className="text-sm text-white/40 mb-6">Sign in to your trading dashboard</p>

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4 text-sm"
            style={{ background: "rgba(255,69,96,0.1)", border: "1px solid rgba(255,69,96,0.3)", color: "#ff4560" }}
          >
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                required
                className="input-dark w-full pl-9 pr-4 py-3 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="input-dark w-full pl-9 pr-10 py-3 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-cyan-400"
                style={{ accentColor: "#00ffd1" }}
              />
              <span className="text-xs text-white/50">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs hover:underline transition-colors"
              style={{ color: "#00ffd1" }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-lg text-sm font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Authenticating…
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="hover:underline font-semibold" style={{ color: "#00ffd1" }}>
            Create account
          </Link>
        </p>

        {/* Demo hint */}
        <div
          className="mt-4 px-3 py-2 rounded-lg text-center text-xs text-white/30"
          style={{ background: "rgba(255,255,255,0.03)", fontFamily: "'DM Mono', monospace" }}
        >
          Demo: any email + password works
        </div>
      </div>
    </div>
  );
}
