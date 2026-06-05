// ─────────────────────────────────────────────
//  components/RecommendationCard.jsx
// ─────────────────────────────────────────────
import React from "react";
import { ShieldCheck, Clock, Target, AlertTriangle } from "lucide-react";
import clsx from "clsx";

/**
 * @param {{ rec, compact }} props
 * compact = true → minimal card for dashboard preview
 */
export default function RecommendationCard({ rec, compact = false }) {
  const {
    symbol, name, recommendation, confidence, riskLevel,
    targetPrice, currentPrice, upside, aiAnalysis,
    timestamp, blockchainStatus, modelVersion,
  } = rec;

  const badgeClass =
    recommendation === "BUY"
      ? "badge-buy"
      : recommendation === "SELL"
      ? "badge-sell"
      : "badge-hold";

  const confidenceColor =
    confidence >= 85 ? "#00ff94" : confidence >= 70 ? "#ffb020" : "#ff4560";

  const riskColor =
    riskLevel === "Low" ? "#00ff94" : riskLevel === "Medium" ? "#ffb020" : "#ff4560";

  return (
    <div
      className="glass rounded-xl p-4 hover:scale-[1.01] transition-all duration-200 group relative overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      {/* Top: symbol + badge */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-lg font-bold text-white/90"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {symbol}
            </span>
            <span
              className={clsx("px-2 py-0.5 rounded text-xs font-bold tracking-wider", badgeClass)}
            >
              {recommendation}
            </span>
          </div>
          {!compact && (
            <p className="text-xs text-white/40 mt-0.5">{name}</p>
          )}
        </div>

        {/* Blockchain status */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck
            size={13}
            style={{ color: blockchainStatus === "Verified" ? "#00ffd1" : "#ffb020" }}
          />
          <span
            className="text-xs"
            style={{
              fontFamily: "'DM Mono', monospace",
              color: blockchainStatus === "Verified" ? "#00ffd1" : "#ffb020",
            }}
          >
            {blockchainStatus}
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/40">AI Confidence</span>
          <span
            className="text-xs font-bold"
            style={{ fontFamily: "'DM Mono', monospace", color: confidenceColor }}
          >
            {confidence}%
          </span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${confidence}%`,
              background: `linear-gradient(90deg, ${confidenceColor}80, ${confidenceColor})`,
              boxShadow: `0 0 8px ${confidenceColor}60`,
            }}
          />
        </div>
      </div>

      {!compact && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-xs text-white/30 mb-0.5">Risk</p>
              <p className="text-xs font-bold" style={{ color: riskColor, fontFamily: "'DM Mono'" }}>
                {riskLevel}
              </p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-xs text-white/30 mb-0.5">Target</p>
              <p className="text-xs font-bold text-white/70" style={{ fontFamily: "'DM Mono'" }}>
                ${targetPrice?.toFixed(0) ?? "—"}
              </p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              <p className="text-xs text-white/30 mb-0.5">Upside</p>
              <p
                className="text-xs font-bold"
                style={{
                  fontFamily: "'DM Mono'",
                  color: upside > 0 ? "#00ff94" : "#ff4560",
                }}
              >
                {upside > 0 ? "+" : ""}{upside?.toFixed(1) ?? "—"}%
              </p>
            </div>
          </div>

          {/* Analysis */}
          <p className="text-xs text-white/50 leading-relaxed line-clamp-3 mb-3">
            {aiAnalysis}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span
              className="text-xs text-white/30"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {modelVersion}
            </span>
            <span className="text-xs text-white/30 flex items-center gap-1">
              <Clock size={10} />
              {new Date(timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </>
      )}

      {compact && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/30" style={{ fontFamily: "'DM Mono'" }}>
            Risk: <span style={{ color: riskColor }}>{riskLevel}</span>
          </span>
          <span className="text-xs text-white/30" style={{ fontFamily: "'DM Mono'" }}>
            {new Date(timestamp).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}
