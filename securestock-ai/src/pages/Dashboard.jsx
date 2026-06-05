// ─────────────────────────────────────────────
//  pages/Dashboard.jsx
// ─────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, TrendingUp, BrainCircuit, ShieldCheck,
  Activity, RefreshCw,
} from "lucide-react";
import StockCard from "../components/StockCard";
import RecommendationCard from "../components/RecommendationCard";
import { MultiLineChart } from "../components/ChartComponent";
import { fetchMarketOverview, fetchAllRecommendations } from "../services/api";
import { dashboardChartData, blockchainRecords, currentUser } from "../utils/mockData";

// ── Stat card (total verified, active recs, etc.)
function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-lg font-bold text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Blockchain feed row
function ChainRow({ rec }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-1 rounded transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(0,255,209,0.08)" }}>
          <ShieldCheck size={12} style={{ color: "#00ffd1" }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-white/80" style={{ fontFamily: "'DM Mono'" }}>
            {rec.symbol}
          </p>
          <p className="text-xs text-white/30 truncate max-w-[140px]" style={{ fontFamily: "'DM Mono'" }}>
            {rec.txHash?.slice(0, 18)}…
          </p>
        </div>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded ${
        rec.status === "Verified" ? "badge-verified" :
        rec.status === "Pending"  ? "badge-pending"  : "badge-failed"
      }`}>
        {rec.status}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const [market, setMarket]   = useState([]);
  const [recs, setRecs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartSeries, setChartSeries] = useState("sp500");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const [mkt, recommendations] = await Promise.all([
        fetchMarketOverview(),
        fetchAllRecommendations(),
      ]);
      if (mounted) {
        setMarket(mkt);
        setRecs(recommendations);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const seriesConfig = [
    { key: "sp500",  color: "#00ffd1", name: "S&P 500" },
    { key: "nasdaq", color: "#ffd166", name: "NASDAQ" },
    { key: "btc",    color: "#ff9f43", name: "BTC" },
  ];

  const activeSeriesFilter = seriesConfig.filter(s =>
    chartSeries === "all" || s.key === chartSeries
  );

  const verifiedCount  = blockchainRecords.filter(r => r.status === "Verified").length;
  const pendingCount   = blockchainRecords.filter(r => r.status === "Pending").length;

  return (
    <div className="space-y-6 pb-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
            Good morning, {currentUser.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <button className="btn-ghost flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          onClick={() => window.location.reload()}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Market overview cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass rounded-xl p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {market.map(item => <StockCard key={item.id} {...item} />)}
        </div>
      )}

      {/* ── Stat badges ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge icon={BrainCircuit}  label="AI Recommendations" value={recs.length}      color="#00ffd1" />
        <StatBadge icon={ShieldCheck}   label="Blockchain Verified" value={verifiedCount}   color="#00ff94" />
        <StatBadge icon={Activity}      label="Pending Verification" value={pendingCount}   color="#ffb020" />
        <StatBadge icon={TrendingUp}    label="Active BUY Signals"
          value={recs.filter(r => r.recommendation === "BUY").length} color="#ffd166" />
      </div>

      {/* ── Main chart + blockchain feed ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="xl:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
                Market Trend — 30 Days
              </h2>
              <p className="text-xs text-white/40 mt-0.5">Normalized index performance</p>
            </div>
            {/* Series selector */}
            <div className="flex gap-1">
              {[{ key: "all", label: "All" }, ...seriesConfig].map(s => (
                <button key={s.key}
                  onClick={() => setChartSeries(s.key)}
                  className="px-2.5 py-1 rounded text-xs transition-all duration-200"
                  style={{
                    fontFamily: "'DM Mono'",
                    background: chartSeries === s.key ? "rgba(0,255,209,0.15)" : "rgba(255,255,255,0.05)",
                    color: chartSeries === s.key ? "#00ffd1" : "rgba(255,255,255,0.4)",
                    border: chartSeries === s.key ? "1px solid rgba(0,255,209,0.3)" : "1px solid transparent",
                  }}
                >
                  {s.label || s.name}
                </button>
              ))}
            </div>
          </div>
          <MultiLineChart
            data={dashboardChartData}
            series={activeSeriesFilter}
            height={260}
          />
        </div>

        {/* Blockchain feed */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
              Chain Activity
            </h2>
            <Link to="/blockchain" className="text-xs flex items-center gap-1 hover:underline"
              style={{ color: "#00ffd1" }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-0">
            {blockchainRecords.slice(0, 6).map(rec => (
              <ChainRow key={rec.recommendationId} rec={rec} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Top AI Recommendations ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white/90" style={{ fontFamily: "'Syne', sans-serif" }}>
            Top AI Recommendations
          </h2>
          <Link to="/recommendations" className="text-xs flex items-center gap-1 hover:underline"
            style={{ color: "#00ffd1" }}>
            View all <ArrowRight size={11} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="glass rounded-xl h-32 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recs.filter(r => r.recommendation === "BUY").slice(0, 3).map(rec => (
              <RecommendationCard key={rec.id} rec={rec} compact={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
