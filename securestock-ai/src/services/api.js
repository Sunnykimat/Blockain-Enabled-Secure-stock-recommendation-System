// ─────────────────────────────────────────────
//  services/api.js
//  API placeholder functions – all return mock data.
//  When a real backend is ready, replace the mock
//  imports with actual axios calls.
// ─────────────────────────────────────────────

import axios from "axios";
import {
  stockHistories,
  stockDetails,
  aiRecommendations,
  blockchainRecords,
  recommendationHistory,
  marketOverview,
} from "../utils/mockData";

// Base URL – swap this for real backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "https://api.securestock.ai/v1";

// Axios instance pre-configured with auth headers
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Inject JWT on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ss_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Utility: simulate network latency ─────────
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────
//  AUTH
// ─────────────────────────────────────────────

/**
 * Login with email + password.
 * Returns a mock JWT and user object.
 */
export const loginUser = async ({ email, password }) => {
  await delay(800);
  // Placeholder validation – accept any non-empty credentials
  if (!email || !password) throw new Error("Email and password are required");
  return {
    token: "mock_jwt_token_" + Date.now(),
    user: { id: "usr_001", name: "Alex Morgan", email, plan: "Pro" },
  };
};

/**
 * Register a new user account.
 */
export const registerUser = async ({ name, email, password }) => {
  await delay(1000);
  if (!name || !email || !password) throw new Error("All fields are required");
  return {
    token: "mock_jwt_token_" + Date.now(),
    user: { id: "usr_002", name, email, plan: "Free" },
  };
};

/**
 * Send password reset email.
 */
export const forgotPassword = async ({ email }) => {
  await delay(800);
  return { message: `Password reset instructions sent to ${email}` };
};

// ─────────────────────────────────────────────
//  STOCK DATA
// ─────────────────────────────────────────────

/**
 * Fetch price history for a given stock symbol.
 * @param {string} symbol – e.g. "AAPL"
 * @returns {{ symbol, history, currentPrice, details }}
 */
export const fetchStockData = async (symbol) => {
  await delay(700);
  const upper = symbol.toUpperCase();
  const history = stockHistories[upper];
  if (!history) throw new Error(`Symbol "${upper}" not found`);
  const details = stockDetails[upper] || {};
  const currentPrice = history[history.length - 1].price;
  const prevPrice = history[history.length - 2].price;
  return {
    symbol: upper,
    history,
    currentPrice,
    change: parseFloat((currentPrice - prevPrice).toFixed(2)),
    changePct: parseFloat((((currentPrice - prevPrice) / prevPrice) * 100).toFixed(2)),
    details,
  };
};

/**
 * Fetch market overview stats (indices + crypto).
 */
export const fetchMarketOverview = async () => {
  await delay(400);
  return marketOverview;
};

// ─────────────────────────────────────────────
//  AI RECOMMENDATIONS
// ─────────────────────────────────────────────

/**
 * Fetch AI recommendation for a specific stock symbol.
 * @param {string} symbol
 */
export const fetchRecommendation = async (symbol) => {
  await delay(900);
  const upper = symbol.toUpperCase();
  const rec = aiRecommendations.find((r) => r.symbol === upper);
  if (!rec) {
    // Return a generic placeholder if symbol not in mock set
    return {
      id: `rec_live_${upper}`,
      symbol: upper,
      recommendation: "HOLD",
      confidence: 65,
      riskLevel: "Medium",
      targetPrice: null,
      currentPrice: null,
      aiAnalysis:
        "Insufficient historical data for high-confidence analysis. Recommendation based on sector trends and macro indicators only.",
      timestamp: new Date().toISOString(),
      blockchainStatus: "Pending",
      modelVersion: "SecureStock-AI v3.2",
    };
  }
  return rec;
};

/**
 * Fetch all current AI recommendations.
 */
export const fetchAllRecommendations = async () => {
  await delay(600);
  return aiRecommendations;
};

// ─────────────────────────────────────────────
//  BLOCKCHAIN VERIFICATION
// ─────────────────────────────────────────────

/**
 * Verify a recommendation record on the blockchain.
 * @param {string} recommendationId – e.g. "rec_001"
 * @returns {BlockchainRecord}
 */
export const verifyBlockchain = async (recommendationId) => {
  await delay(1200); // Longer delay simulates on-chain query
  const record = blockchainRecords.find(
    (r) => r.recommendationId === recommendationId
  );
  if (!record) throw new Error(`No blockchain record found for ID "${recommendationId}"`);
  return {
    ...record,
    verifiedAt: new Date().toISOString(),
    message:
      record.status === "Verified"
        ? "✓ Data integrity confirmed. Record has not been tampered with."
        : "⚠ Verification pending or failed. Contact support.",
  };
};

/**
 * Verify by transaction hash directly.
 * @param {string} txHash
 */
export const verifyByTxHash = async (txHash) => {
  await delay(1200);
  const record = blockchainRecords.find((r) => r.txHash === txHash);
  if (!record) throw new Error("Transaction hash not found on chain");
  return { ...record, verifiedAt: new Date().toISOString() };
};

// ─────────────────────────────────────────────
//  HISTORY
// ─────────────────────────────────────────────

/**
 * Fetch paginated recommendation history with optional filters.
 * @param {{ page, limit, symbol, recommendation, blockchainStatus }} params
 */
export const getRecommendationHistory = async (params = {}) => {
  await delay(500);
  const { page = 1, limit = 10, symbol, recommendation, blockchainStatus } = params;
  let data = [...recommendationHistory];

  // Apply filters
  if (symbol) data = data.filter((r) => r.symbol.includes(symbol.toUpperCase()));
  if (recommendation) data = data.filter((r) => r.recommendation === recommendation);
  if (blockchainStatus) data = data.filter((r) => r.blockchainStatus === blockchainStatus);

  // Paginate
  const total = data.length;
  const start = (page - 1) * limit;
  const paginated = data.slice(start, start + limit);

  return { data: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
};
