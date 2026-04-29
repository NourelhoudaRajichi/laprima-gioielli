"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

const navy  = "#004065";
const pink  = "#ec9cb2";
const blush = "#f8e3e8";

const STATUS_OPTIONS = ["pending", "processing", "on-hold", "completed", "cancelled", "refunded"];

const STATUS_STYLE = {
  completed:  { bg: "#e8f5e9", color: "#2e7d32" },
  processing: { bg: "#e3f2fd", color: "#1565c0" },
  "on-hold":  { bg: "#fff3e0", color: "#e65100" },
  pending:    { bg: "#f5f5f5", color: "#616161" },
  cancelled:  { bg: "#ffebee", color: "#c62828" },
  refunded:   { bg: "#f3e5f5", color: "#6a1b9a" },
};

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: blush, color: navy };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
      background: s.bg, color: s.color, borderRadius: 4, padding: "3px 8px" }}>
      {status}
    </span>
  );
}

function OrderRow({ order, onStatusChange }) {
  const [open,    setOpen]    = useState(false);
  const [status,  setStatus]  = useState(order.status);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  const customer = [order.billing?.first_name, order.billing?.last_name].filter(Boolean).join(" ")
    || order.billing?.email || "—";

  const changeStatus = async (newStatus) => {
    if (newStatus === status) return;
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/dashboard/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus(data.status);
      onStatusChange(order.id, data.status);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr style={{ borderBottom: `1px solid ${blush}`, cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}>
        <td style={{ padding: "12px 16px", fontSize: 13, color: navy, fontWeight: 600 }}>
          #{order.id}
        </td>
        <td style={{ padding: "12px 16px", fontSize: 13, color: navy }}>{customer}</td>
        <td style={{ padding: "12px 16px", fontSize: 12, color: navy, opacity: 0.6 }}>
          {order.billing?.email || "—"}
        </td>
        <td style={{ padding: "12px 16px" }}>
          <StatusBadge status={status} />
        </td>
        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: navy }}>
          € {formatPrice(order.total || 0)}
        </td>
        <td style={{ padding: "12px 16px", fontSize: 12, color: navy, opacity: 0.55 }}>
          {fmt(order.date_created)}
        </td>
        <td style={{ padding: "12px 16px", textAlign: "center" }}>
          {open ? <ChevronUp size={14} style={{ color: pink }} /> : <ChevronDown size={14} style={{ color: navy, opacity: 0.4 }} />}
        </td>
      </tr>

      {open && (
        <tr style={{ background: "#f7f9fb" }}>
          <td colSpan={7} style={{ padding: "16px 24px" }}>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>

              {/* Items */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: "uppercase",
                  letterSpacing: "0.1em", marginBottom: 10 }}>Items</p>
                {(order.line_items || []).map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center",
                    gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${blush}` }}>
                    {item.image?.src && (
                      <img src={item.image.src} alt={item.name}
                        style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 4,
                          border: `1px solid ${blush}`, flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 13, color: navy, fontWeight: 600, display: "block" }}>{item.name}</span>
                      {item.sku && (
                        <span style={{ fontSize: 11, color: navy, opacity: 0.45, display: "block", marginTop: 2 }}>
                          SKU: {item.sku}
                        </span>
                      )}
                      <span style={{ fontSize: 12, color: navy, opacity: 0.6, display: "block", marginTop: 2 }}>
                        × {item.quantity} — € {formatPrice(item.total || 0)}
                      </span>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${blush}`, marginTop: 8, paddingTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: navy }}>Total</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: navy }}>
                      € {formatPrice(order.total || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing */}
              <div style={{ minWidth: 180 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: "uppercase",
                  letterSpacing: "0.1em", marginBottom: 10 }}>Billing</p>
                {[
                  order.billing?.address_1,
                  order.billing?.city,
                  order.billing?.state,
                  order.billing?.postcode,
                  order.billing?.country,
                ].filter(Boolean).map((line, i) => (
                  <p key={i} style={{ fontSize: 12, color: navy, opacity: 0.65, marginBottom: 2 }}>{line}</p>
                ))}
                {order.billing?.phone && (
                  <p style={{ fontSize: 12, color: navy, opacity: 0.55, marginTop: 6 }}>
                    📞 {order.billing.phone}
                  </p>
                )}
              </div>

              {/* Status change */}
              <div style={{ minWidth: 200 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: "uppercase",
                  letterSpacing: "0.1em", marginBottom: 10 }}>Change Status</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={(e) => { e.stopPropagation(); changeStatus(s); }}
                      disabled={saving || s === status}
                      style={{ padding: "7px 14px", borderRadius: 6, border: `1.5px solid ${s === status ? navy : blush}`,
                        background: s === status ? navy : "#fff", color: s === status ? "#fff" : navy,
                        fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                        cursor: s === status ? "default" : "pointer", opacity: saving ? 0.6 : 1,
                        fontFamily: "'Barlow Condensed',sans-serif", textAlign: "left" }}>
                      {s === status && saving ? "Saving…" : s}
                      {s === status && !saving && " ✓"}
                    </button>
                  ))}
                </div>
                {error && <p style={{ fontSize: 12, color: "#f44336", marginTop: 8 }}>{error}</p>}
                <p style={{ fontSize: 11, color: navy, opacity: 0.4, marginTop: 8 }}>
                  WooCommerce sends email notifications automatically on status change.
                </p>
              </div>

              {/* Notes */}
              {order.customer_note && (
                <div style={{ minWidth: 180 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: navy, textTransform: "uppercase",
                    letterSpacing: "0.1em", marginBottom: 10 }}>Customer Note</p>
                  <p style={{ fontSize: 13, color: navy, opacity: 0.7, fontStyle: "italic" }}>
                    "{order.customer_note}"
                  </p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

const PER_PAGE = 25;

export default function OrdersClient({ initialOrders }) {
  const [orders,       setOrders]       = useState(initialOrders);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page,         setPage]         = useState(1);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchSearch = !q || [
        o.id?.toString(),
        o.billing?.first_name,
        o.billing?.last_name,
        o.billing?.email,
      ].some(v => v?.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const statusCounts = useMemo(() => {
    const m = { all: orders.length };
    for (const o of orders) m[o.status] = (m[o.status] || 0) + 1;
    return m;
  }, [orders]);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: navy, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 4 }}>Orders</h1>
        <p style={{ fontSize: 13, color: navy, opacity: 0.4 }}>{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        {/* Status filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[["all", "All"], ...STATUS_OPTIONS.map(s => [s, s])].map(([key, label]) => (
            <button key={key} onClick={() => { setStatusFilter(key); setPage(1); }}
              style={{ padding: "7px 14px", borderRadius: 8,
                border: `1.5px solid ${statusFilter === key ? navy : blush}`,
                background: statusFilter === key ? navy : "#fff",
                color: statusFilter === key ? "#fff" : navy,
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
                cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif" }}>
              {label}
              {statusCounts[key] !== undefined && (
                <span style={{ marginLeft: 6, opacity: 0.6 }}>({statusCounts[key] || 0})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginLeft: "auto" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)", color: navy, opacity: 0.4 }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, ID…"
            style={{ paddingLeft: 30, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              border: `1.5px solid ${blush}`, borderRadius: 8, fontSize: 13, color: navy,
              outline: "none", fontFamily: "'Barlow Condensed',sans-serif", width: 240 }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: blush }}>
              {["Order", "Customer", "Email", "Status", "Total", "Date", ""].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11,
                  fontWeight: 700, color: navy, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: navy, opacity: 0.4, fontSize: 14 }}>
                No orders found.
              </td></tr>
            ) : paginated.map(order => (
              <OrderRow key={order.id} order={order} onStatusChange={updateOrderStatus} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24, flexWrap: "wrap" }}>
          {page > 1 && (
            <button onClick={() => setPage(p => p - 1)} style={pageBtnStyle(false)}>← Prev</button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} style={pageBtnStyle(n === page)}>{n}</button>
          ))}
          {page < totalPages && (
            <button onClick={() => setPage(p => p + 1)} style={pageBtnStyle(false)}>Next →</button>
          )}
        </div>
      )}
    </div>
  );
}

const pageBtnStyle = (active) => ({
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  minWidth: 36, height: 36, padding: "0 10px", borderRadius: 6,
  border: `1.5px solid ${active ? navy : blush}`, cursor: "pointer",
  background: active ? navy : "#fff", color: active ? "#fff" : navy,
  fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700,
});
