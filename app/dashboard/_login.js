"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const navy  = "#004065";
const pink  = "#ec9cb2";
const blush = "#f8e3e8";

export default function LoginFormClient() {
  const [password, setPassword]   = useState("");
  const [error,    setError]      = useState("");
  const [loading,  setLoading]    = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", maxWidth: 360, width: "100%", padding: 40,
      border: `1px solid ${blush}`, borderRadius: 16, boxShadow: "0 4px 32px rgba(0,64,101,0.07)" }}>
      <img src="/img/La-Prima-Logo.png" alt="La Prima Gioielli" style={{ height: 28, marginBottom: 28 }} />
      <h1 style={{ fontSize: 26, fontWeight: 700, color: navy, textTransform: "uppercase",
        letterSpacing: "0.1em", marginBottom: 6 }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: navy, opacity: 0.4, marginBottom: 32 }}>Enter your password to continue</p>
      {error && <p style={{ fontSize: 13, color: pink, marginBottom: 14 }}>{error}</p>}
      <form onSubmit={submit}>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Password" autoFocus
          style={{ width: "100%", border: `1.5px solid #dde4ea`, borderRadius: 8, padding: "11px 14px",
            fontSize: 15, color: navy, outline: "none", boxSizing: "border-box", marginBottom: 14,
            fontFamily: "'Barlow Condensed',sans-serif" }} />
        <button type="submit" disabled={loading}
          style={{ width: "100%", background: navy, color: "#fff", border: "none", borderRadius: 8,
            padding: "13px 0", fontSize: 14, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif",
            opacity: loading ? 0.6 : 1 }}>
          {loading ? "Logging in…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
