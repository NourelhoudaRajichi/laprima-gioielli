"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "lpg_currency";
const TTL_MS      = 6 * 60 * 60 * 1000; // 6 hours

const DEFAULT = { code: "EUR", rate: 1 };

// Parses both Italian ("3.670,00") and US/WC ("3,670.00" / "3670.00") formats
function parseEur(val) {
  if (typeof val === "number") return isNaN(val) ? NaN : val;
  const s = String(val).trim();
  if (!s || s === "—") return NaN;
  const dotIdx   = s.lastIndexOf(".");
  const commaIdx = s.lastIndexOf(",");
  if (commaIdx > dotIdx) {
    // Italian: comma is decimal separator
    return parseFloat(s.replace(/\./g, "").replace(",", "."));
  }
  // US / WC raw: period is decimal, optional comma as thousands
  return parseFloat(s.replace(/,/g, ""));
}

function formatAmount(eur, code, rate) {
  const n = parseEur(eur);
  if (isNaN(n) || n === 0) return typeof eur === "string" && eur === "—" ? "—" : "—";
  const converted = n * rate;

  if (code === "EUR") {
    const [int, dec] = converted.toFixed(2).split(".");
    const thousands  = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return thousands + "," + dec + " €";
  }

  const noDecimals = ["JPY", "KRW", "VND", "IDR"];
  return new Intl.NumberFormat("en-US", {
    style:                 "currency",
    currency:              code,
    minimumFractionDigits: noDecimals.includes(code) ? 0 : 2,
    maximumFractionDigits: noDecimals.includes(code) ? 0 : 2,
  }).format(converted);
}

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(DEFAULT);

  // Currency auto-detection disabled — always EUR
  // To re-enable, restore the useEffect that fetches /api/currency

  const format = (val) => formatAmount(val, currency.code, currency.rate);

  return (
    <CurrencyContext.Provider value={{ currency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
