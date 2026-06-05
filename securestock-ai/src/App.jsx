// ─────────────────────────────────────────────
//  App.jsx – Root component with React Router
// ─────────────────────────────────────────────
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import SearchStock from "./pages/SearchStock";
import Recommendations from "./pages/Recommendations";
import BlockchainVerify from "./pages/BlockchainVerify";
import History from "./pages/History";
import Settings from "./pages/Settings";
import AppLayout from "./components/AppLayout";

// Simple auth context via local state (replace with real auth in production)
export const AuthContext = React.createContext(null);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("ss_token")
  );

  const login = (token) => {
    localStorage.setItem("ss_token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("ss_token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes wrapped in AppLayout */}
          <Route
            path="/"
            element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="search" element={<SearchStock />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="blockchain" element={<BlockchainVerify />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
