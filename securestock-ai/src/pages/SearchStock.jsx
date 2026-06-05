// ─────────────────────────────────────────────
//  pages/SearchStock.jsx
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search, TrendingUp, TrendingDown, BrainCircuit,
  ShieldCheck, AlertCircle, BarChart2, Info,
} from "lucide-react";
import { StockAreaChart } from "../components/ChartComponent";
import { fetchStockData, fetchRecommendation } from "../services/api";

// Quick-access popular symbols
const POPULAR = ["AAPL", "MSFT", "NVDA", "TSLA", "GOOGL", "AMZN", "META"];

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40">{label}</span>
      <span className="text-xs font-semibold text-white/70" style={{ fontFamily: "'DM Mono'" }}>
        {value}
      </span>
    </div>
  );
}

export default function SearchStock() {
  const [searchParams] = useSearchParams();
  const [query, setQuery]       = useState(searchParams.get("q") || "");
  const [input, setInput]       = useState(searchParams.get("q") || "");
  const [stockData, setStock]   = useState(null);
  const [rec, setRec]           = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Auto-search if ?q= param present
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) { setInput(q); doSearch(q); }
  }, []);

  const doSearch = async (sym) => {
    const s = (sym || input).trim().toUpperCase();
    if (!s) return;
    setQuery(s); setError(""); setLoading(true);
    setStock(null); setRec(null);
    try {
      const [sd, recommendation] = await Promise.all([
        fetchStockData(s),
        fetchRecommendation(s),
      ]);
      setStock(sd); setRec(recommendation);
    } catch (err) {
      setError(err.message || "Symbol not found");
    } finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") doSearch(); };

  const recBadge = rec?.recommendation === "BUY" ? "badge-buy"
    : rec?.recommendation === "SELL" ? "badge-sell" : "badge-hold";

  const confidenceColor = !rec ? "#fff"
    : rec.confidence >= 85 ? "#00ff94"
    : rec.confidence >= 70 ? "#ffb020" : "#ff4560";

  const isUp = stockData && stockData.change >= 0;

  return (
    <div className="space-y-6 pb-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
          Stock Search
        </h1>
        <p className="text-sm text-white/40 mt-0.5">Search any ticker for AI-powered analysis</p>
      </div>

      {/* ── Search bar ── */}
      <div className="glass rounded-xl p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text" value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Enter stock symbol (e.g. AAPL, MSFT, NVDA)"
              className="input-dark w-full pl-9 pr-4 py-3 rounded-lg text-sm"
              style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}
            />
          </div>
          <button onClick={() => doSearch()}
            className="btn-primary px-6 py-3 rounded-lg text-sm font-semibold">
            Analyze
          </button>
        </div>

        {/* Popular symbols */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-white/30 mr-1 self-center">Popular:</span>
          {POPULAR.map(sym => (
            <button key={sym} onClick={() => { setInput(sym); doSearch(sym); }}
              className="px-2.5 py-1 rounded text-xs transition-all hover:scale-105"
              style={{
                fontFamily: "'DM Mono'",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}>
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 glass rounded-xl h-72 animate-pulse" />
          <div className="glass rounded-xl h-72 animate-pulse" />
        </div>
      )}

      {/* ── Error state ── */}
      {error && (
        <div className="glass rounded-xl p-6 flex items-center gap-3"
          style={{ border: "1px solid rgba(255,69,96,0.3)" }}>
          <AlertCircle size={18} style={{ color: "#ff4560" }} />
          <div>
            <p className="text-sm font-semibold text-white/80">Symbol not found</p>
            <p className="text-xs text-white/40 mt-0.5">{error}. Try AAPL, MSFT, NVDA, TSLA, GOOGL.</p>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {stockData && !loading && (
        <>
          {/* Price header */}
          <div className="glass rounded-xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-white/90" style={{ fontFamily: "'Syne'" }}>
                    {stockData.symbol}
                  </h2>
                  {stockData.details?.name && (
                    <span className="text-sm text-white/40">{stockData.details.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-4xl font-bold" style={{ fontFamily: "'Syne'" }}>
                    ${stockData.currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isUp ? <TrendingUp size={16} style={{ color: "#00ff94" }} /> : <TrendingDown size={16} style={{ color: "#ff4560" }} />}
                    <span className="text-sm font-semibold" style={{ fontFamily: "'DM Mono'", color: isUp ? "#00ff94" : "#ff4560" }}>
                      {isUp ? "+" : ""}{stockData.change.toFixed(2)} ({isUp ? "+" : ""}{stockData.changePct.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                {stockData.details?.sector && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs text-white/50"
                    style={{ background: "rgba(255,255,255,0.06)", fontFamily: "'DM Mono'" }}>
                    {stockData.details.sector}
                  </span>
                )}
              </div>

              {/* AI rec badge */}
              {rec && (
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold tracking-wider ${recBadge}`}>
                    {rec.recommendation}
                  </span>
                  <p className="text-xs text-white/40 mt-1">AI Recommendation</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart + details grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Area chart */}
            <div className="xl:col-span-2 glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={14} style={{ color: "#00ffd1" }} />
                <h3 className="text-sm font-bold text-white/80" style={{ fontFamily: "'Syne'" }}>
                  Price History — 30 Days
                </h3>
              </div>
              <StockAreaChart
                data={stockData.history}
                dataKey="price"
                color={isUp ? "#00ffd1" : "#ff4560"}
                height={260}
              />
            </div>

            {/* Stock fundamentals */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Info size={14} style={{ color: "#ffd166" }} />
                <h3 className="text-sm font-bold text-white/80" style={{ fontFamily: "'Syne'" }}>
                  Fundamentals
                </h3>
              </div>
              <div>
                <InfoRow label="Market Cap"    value={stockData.details?.marketCap ?? "—"} />
                <InfoRow label="P/E Ratio"     value={stockData.details?.pe ?? "—"} />
                <InfoRow label="EPS"           value={stockData.details?.eps ? `$${stockData.details.eps}` : "—"} />
                <InfoRow label="52W High"      value={stockData.details?.week52High ? `$${stockData.details.week52High}` : "—"} />
                <InfoRow label="52W Low"       value={stockData.details?.week52Low  ? `$${stockData.details.week52Low}`  : "—"} />
                <InfoRow label="Avg Volume"    value={stockData.details?.avgVolume  ?? "—"} />
                <InfoRow label="Dividend/Share" value={stockData.details?.dividend ? `$${stockData.details.dividend}` : "—"} />
              </div>
            </div>
          </div>

          {/* AI analysis panel */}
          {rec && (
            <div className="glass-cyan rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,255,209,0.12)" }}>
                  <BrainCircuit size={18} style={{ color: "#00ffd1" }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-sm font-bold text-white/90" style={{ fontFamily: "'Syne'" }}>
                      AI Analysis
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${recBadge}`}>
                      {rec.recommendation}
                    </span>
                    {/* Confidence bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{ width: `${rec.confidence}%`, background: confidenceColor }} />
                      </div>
                      <span className="text-xs font-bold" style={{ fontFamily: "'DM Mono'", color: confidenceColor }}>
                        {rec.confidence}%
                      </span>
                    </div>
                    {/* Risk */}
                    <span className="text-xs text-white/40">
                      Risk: <span style={{ color: rec.riskLevel === "Low" ? "#00ff94" : rec.riskLevel === "Medium" ? "#ffb020" : "#ff4560" }}>
                        {rec.riskLevel}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{rec.aiAnalysis}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/5">
                    {rec.targetPrice && (
                      <span className="text-xs text-white/40">
                        Target: <span className="text-white/70" style={{ fontFamily: "'DM Mono'" }}>${rec.targetPrice}</span>
                      </span>
                    )}
                    {rec.upside !== undefined && (
                      <span className="text-xs text-white/40">
                        Upside: <span style={{ color: rec.upside >= 0 ? "#00ff94" : "#ff4560", fontFamily: "'DM Mono'" }}>
                          {rec.upside >= 0 ? "+" : ""}{rec.upside}%
                        </span>
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <ShieldCheck size={12} style={{ color: rec.blockchainStatus === "Verified" ? "#00ffd1" : "#ffb020" }} />
                      <span className="text-xs" style={{
                        fontFamily: "'DM Mono'",
                        color: rec.blockchainStatus === "Verified" ? "#00ffd1" : "#ffb020",
                      }}>
                        {rec.blockchainStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Empty state ── */}
      {!stockData && !loading && !error && (
        <div className="glass rounded-xl p-16 text-center">
          <Search size={40} className="mx-auto mb-4 text-white/20" />
          <h3 className="text-lg font-bold text-white/40 mb-2" style={{ fontFamily: "'Syne'" }}>
            Search a stock symbol
          </h3>
          <p className="text-sm text-white/30">
            Enter a ticker symbol above to view price charts, AI recommendations, and blockchain-verified analysis.
          </p>
        </div>
      )}
    </div>
  );
}
