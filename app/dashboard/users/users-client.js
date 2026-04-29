"use client";

import { useState, useMemo } from "react";
import { Search, User, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

const navy  = "#004065";
const pink  = "#ec9cb2";
const blush = "#f8e3e8";

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UsersClient({ wpUsers, wcCustomers }) {
  const [tab,    setTab]    = useState("customers");
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return wcCustomers.filter(c =>
      (c.first_name + " " + c.last_name + " " + c.email).toLowerCase().includes(q)
    );
  }, [wcCustomers, search]);

  const filteredWP = useMemo(() => {
    const q = search.toLowerCase();
    return wpUsers.filter(u =>
      (u.name + " " + u.slug + " " + (u.email || "")).toLowerCase().includes(q)
    );
  }, [wpUsers, search]);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: navy, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 4 }}>Users</h1>
        <p style={{ fontSize: 13, color: navy, opacity: 0.4 }}>
          {wcCustomers.length} customers · {wpUsers.length} registered accounts
        </p>
      </div>

      {/* Tabs + Search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[["customers","Customers"], ["accounts","WP Accounts"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${tab === key ? navy : blush}`,
                background: tab === key ? navy : "#fff", color: tab === key ? "#fff" : navy,
                fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: navy, opacity: 0.4 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              border: `1.5px solid ${blush}`, borderRadius: 8, fontSize: 13, color: navy,
              outline: "none", fontFamily: "'Barlow Condensed',sans-serif", width: 200 }} />
        </div>
      </div>

      {/* Customers tab */}
      {tab === "customers" && (
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: blush }}>
                {["Name", "Email", "Orders", "Total Spent", "Registered", "Location"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11,
                    fontWeight: 700, color: navy, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: navy, opacity: 0.4, fontSize: 14 }}>
                  No customers found.
                </td></tr>
              ) : filteredCustomers.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${blush}`,
                  background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: blush,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <User size={14} style={{ color: pink }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: navy }}>
                        {c.first_name} {c.last_name}
                        {!c.first_name && !c.last_name && <span style={{ opacity: 0.4 }}>—</span>}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: navy, opacity: 0.7 }}>{c.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: 13, color: navy, fontWeight: 600 }}>
                      <ShoppingBag size={12} style={{ color: pink }} />
                      {c.orders_count ?? 0}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: navy, fontWeight: 600 }}>
                    € {formatPrice(c.total_spent || 0)}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: navy, opacity: 0.55 }}>
                    {fmt(c.date_created)}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: navy, opacity: 0.55 }}>
                    {[c.billing?.city, c.billing?.country].filter(Boolean).join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* WP Accounts tab */}
      {tab === "accounts" && (
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: blush }}>
                {["Name", "Username", "Email", "Role", "Registered"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11,
                    fontWeight: 700, color: navy, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredWP.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: navy, opacity: 0.4, fontSize: 14 }}>
                  No accounts found.
                </td></tr>
              ) : filteredWP.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${blush}`,
                  background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {u.avatar_urls?.["48"] ? (
                        <img src={u.avatar_urls["48"]} alt="" style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: blush,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <User size={14} style={{ color: pink }} />
                        </div>
                      )}
                      <span style={{ fontSize: 13, fontWeight: 600, color: navy }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: navy, opacity: 0.6 }}>{u.slug}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: navy, opacity: 0.7 }}>
                    {u.email || "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {(u.roles ?? []).map(r => (
                      <span key={r} style={{ fontSize: 11, background: blush, color: navy,
                        borderRadius: 4, padding: "2px 8px", textTransform: "capitalize",
                        letterSpacing: "0.05em", marginRight: 4 }}>{r}</span>
                    ))}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: navy, opacity: 0.55 }}>
                    {fmt(u.registered_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
