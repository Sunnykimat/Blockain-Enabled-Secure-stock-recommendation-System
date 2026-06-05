// ─────────────────────────────────────────────
//  pages/ForgotPassword.jsx
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Zap, ArrowLeft, CheckCircle } from "lucide-react";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #0f1e3d 0%, #03050a 60%)",
      }}
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,209,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,209,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="glass rounded-2xl p-8 w-full max-w-md relative z-10 animate-slide-up"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,209,0.1)" }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #00ffd1, #00c9a0)" }}>
            <Zap size={20} style={{ color: "#03050a" }} />
          </div>
          <span className="text-lg font-bold gradient-text-cyan" style={{ fontFamily: "'Syne', sans-serif" }}>
            SecureStock AI
          </span>
        </div>

        {!sent ? (
          <>
            <h2 className="text-2xl font-bold text-white/90 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
              Reset password
            </h2>
            <p className="text-sm text-white/40 mb-6">
              Enter your email and we'll send reset instructions.
            </p>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4 text-sm"
                style={{ background: "rgba(255,69,96,0.1)", border: "1px solid rgba(255,69,96,0.3)", color: "#ff4560" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="alex@example.com" required
                    className="input-dark w-full pl-9 pr-4 py-3 rounded-lg text-sm" />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 rounded-lg text-sm font-semibold disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Sending…
                  </span>
                ) : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,255,148,0.1)", border: "1px solid rgba(0,255,148,0.3)" }}>
              <CheckCircle size={28} style={{ color: "#00ff94" }} />
            </div>
            <h3 className="text-xl font-bold text-white/90 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              Check your inbox
            </h3>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Reset instructions have been sent to<br />
              <span style={{ color: "#00ffd1", fontFamily: "'DM Mono'" }}>{email}</span>
            </p>
          </div>
        )}

        <div className="flex items-center justify-center mt-6">
          <Link to="/login" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft size={13} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
