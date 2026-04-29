"use client";

import { useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { formatPrice } from "@/lib/formatPrice";

const navy  = "#004065";
const pink  = "#ec9cb2";
const blush = "#f8e3e8";

const COUNTRY_NAMES = {
  IT:"Italy",DE:"Germany",FR:"France",US:"United States",GB:"United Kingdom",
  AE:"UAE",SA:"Saudi Arabia",CH:"Switzerland",AT:"Austria",BE:"Belgium",
  NL:"Netherlands",ES:"Spain",PT:"Portugal",GR:"Greece",TR:"Turkey",
  CN:"China",JP:"Japan",KR:"South Korea",IN:"India",AU:"Australia",
  CA:"Canada",BR:"Brazil",RU:"Russia",PL:"Poland",SE:"Sweden",
  NO:"Norway",DK:"Denmark",FI:"Finland",CZ:"Czech Republic",HU:"Hungary",
  RO:"Romania",BG:"Bulgaria",HR:"Croatia",SK:"Slovakia",SI:"Slovenia",
  LT:"Lithuania",LV:"Latvia",EE:"Estonia",LU:"Luxembourg",MT:"Malta",
  CY:"Cyprus",IE:"Ireland",IL:"Israel",EG:"Egypt",ZA:"South Africa",
  MA:"Morocco",TN:"Tunisia",NG:"Nigeria",KE:"Kenya",GH:"Ghana",
  MX:"Mexico",AR:"Argentina",CL:"Chile",CO:"Colombia",PE:"Peru",
  SG:"Singapore",MY:"Malaysia",TH:"Thailand",ID:"Indonesia",PH:"Philippines",
  VN:"Vietnam",HK:"Hong Kong",TW:"Taiwan",UA:"Ukraine",RS:"Serbia",
};

const COUNTRY_FLAGS = {
  IT:"🇮🇹",DE:"🇩🇪",FR:"🇫🇷",US:"🇺🇸",GB:"🇬🇧",AE:"🇦🇪",SA:"🇸🇦",
  CH:"🇨🇭",AT:"🇦🇹",BE:"🇧🇪",NL:"🇳🇱",ES:"🇪🇸",PT:"🇵🇹",GR:"🇬🇷",
  TR:"🇹🇷",CN:"🇨🇳",JP:"🇯🇵",KR:"🇰🇷",IN:"🇮🇳",AU:"🇦🇺",CA:"🇨🇦",
  BR:"🇧🇷",RU:"🇷🇺",PL:"🇵🇱",SE:"🇸🇪",NO:"🇳🇴",DK:"🇩🇰",FI:"🇫🇮",
  CZ:"🇨🇿",HU:"🇭🇺",RO:"🇷🇴",BG:"🇧🇬",HR:"🇭🇷",SK:"🇸🇰",SI:"🇸🇮",
  LT:"🇱🇹",LV:"🇱🇻",EE:"🇪🇪",LU:"🇱🇺",MT:"🇲🇹",CY:"🇨🇾",IE:"🇮🇪",
  IL:"🇮🇱",EG:"🇪🇬",ZA:"🇿🇦",MA:"🇲🇦",TN:"🇹🇳",NG:"🇳🇬",KE:"🇰🇪",
  GH:"🇬🇭",MX:"🇲🇽",AR:"🇦🇷",CL:"🇨🇱",CO:"🇨🇴",PE:"🇵🇪",SG:"🇸🇬",
  MY:"🇲🇾",TH:"🇹🇭",ID:"🇮🇩",PH:"🇵🇭",VN:"🇻🇳",HK:"🇭🇰",TW:"🇹🇼",
  UA:"🇺🇦",RS:"🇷🇸",
};

function countryLabel(code) {
  const flag = COUNTRY_FLAGS[code] || "🌍";
  const name = COUNTRY_NAMES[code] || code;
  return `${flag} ${name}`;
}
const green = "#4caf50";
const amber = "#ff9800";

const STATUS_COLORS = {
  completed:  green,
  processing: "#2196f3",
  "on-hold":  amber,
  pending:    "#9e9e9e",
  cancelled:  "#f44336",
  refunded:   "#9c27b0",
};

function getAgentRef(order) {
  const m = (order.meta_data ?? []).find(m => m.key === "agent_ref" || m.key === "_agent_ref");
  return m?.value || null;
}

function formatCurrency(val) {
  return formatPrice(val);
}

function StatCard({ label, value, sub, color = navy }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
      padding: "20px 24px", flex: 1, minWidth: 160 }}>
      <p style={{ fontSize: 11, color: navy, opacity: 0.4, textTransform: "uppercase",
        letterSpacing: "0.12em", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 700, color, marginBottom: 4 }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: navy, opacity: 0.45 }}>{sub}</p>}
    </div>
  );
}

function buildVisitStats(visits) {
  const now  = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const byDay = {};
  for (const d of days) byDay[d] = { date: d.slice(5), website: 0, melissa: 0, vip: 0 };

  const countryMap = {};

  for (const page of ["website", "melissa", "vip"]) {
    for (const v of (visits[page] || [])) {
      const d = v.ts?.slice(0, 10);
      if (byDay[d]) byDay[d][page]++;
      if (v.country) countryMap[v.country] = (countryMap[v.country] || 0) + 1;
    }
  }

  const countryData = Object.entries(countryMap)
    .map(([country, count]) => ({ country, visits: count }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 15);

  return {
    websiteTotal: (visits.website || []).length,
    melissaTotal: (visits.melissa || []).length,
    vipTotal:     (visits.vip    || []).length,
    dailyData:    days.map(d => byDay[d]),
    countryData,
  };
}

export default function AnalyticsClient({ orders, visits = {} }) {
  const visitStats = useMemo(() => buildVisitStats(visits), [visits]);
  const stats = useMemo(() => {
    const total     = orders.length;
    const revenue   = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
    const agentOrds = orders.filter(o => getAgentRef(o));
    const agentRev  = agentOrds.reduce((s, o) => s + parseFloat(o.total || 0), 0);

    // Orders per day (last 30 days)
    const now  = new Date();
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().slice(0, 10);
    });
    const byDay = {};
    for (const d of days) byDay[d] = { date: d.slice(5), orders: 0, revenue: 0 };
    for (const o of orders) {
      const d = o.date_created?.slice(0, 10);
      if (byDay[d]) {
        byDay[d].orders++;
        byDay[d].revenue += parseFloat(o.total || 0);
      }
    }
    const dailyData = days.map(d => byDay[d]);

    // By status
    const statusMap = {};
    for (const o of orders) {
      statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    }
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // By agent
    const agentMap = {};
    for (const o of agentOrds) {
      const ref = getAgentRef(o);
      if (!agentMap[ref]) agentMap[ref] = { agent: ref, orders: 0, revenue: 0 };
      agentMap[ref].orders++;
      agentMap[ref].revenue += parseFloat(o.total || 0);
    }
    const agentData = Object.values(agentMap).sort((a, b) => b.revenue - a.revenue);

    // Monthly revenue (last 6 months)
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
               label: d.toLocaleString("en", { month: "short" }) };
    });
    const monthlyMap = {};
    for (const { key, label } of months) monthlyMap[key] = { month: label, revenue: 0, orders: 0 };
    for (const o of orders) {
      const key = o.date_created?.slice(0, 7);
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += parseFloat(o.total || 0);
        monthlyMap[key].orders++;
      }
    }
    const monthlyData = months.map(m => monthlyMap[m.key]);

    return { total, revenue, agentOrds: agentOrds.length, agentRev, dailyData, statusData, agentData, monthlyData };
  }, [orders]);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: navy, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: navy, opacity: 0.4 }}>Overview of store performance</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard label="Total Orders"   value={stats.total}                              sub="All time" />
        <StatCard label="Total Revenue"  value={`€ ${formatCurrency(stats.revenue)}`}    sub="All time" color={green} />
        <StatCard label="Agent Orders"   value={stats.agentOrds}                          sub="Via agent links" color={pink} />
        <StatCard label="Agent Revenue"  value={`€ ${formatCurrency(stats.agentRev)}`}   sub="Via agent links" color="#9c27b0" />
      </div>

      {/* Page visits */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
          padding: "20px 24px", flex: 1, minWidth: 160 }}>
          <p style={{ fontSize: 11, color: navy, opacity: 0.4, textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 8 }}>Website visits</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: green, marginBottom: 4 }}>
            {visitStats.websiteTotal}
          </p>
          <p style={{ fontSize: 12, color: navy, opacity: 0.45 }}>Since tracking started</p>
        </div>
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
          padding: "20px 24px", flex: 1, minWidth: 160 }}>
          <p style={{ fontSize: 11, color: navy, opacity: 0.4, textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 8 }}>/melissa visits</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: pink, marginBottom: 4 }}>
            {visitStats.melissaTotal}
          </p>
          <p style={{ fontSize: 12, color: navy, opacity: 0.45 }}>Since tracking started</p>
        </div>
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
          padding: "20px 24px", flex: 1, minWidth: 160 }}>
          <p style={{ fontSize: 11, color: navy, opacity: 0.4, textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 8 }}>/vip visits</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: navy, marginBottom: 4 }}>
            {visitStats.vipTotal}
          </p>
          <p style={{ fontSize: 12, color: navy, opacity: 0.45 }}>Since tracking started</p>
        </div>
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
          padding: "20px 24px", flex: 1, minWidth: 160 }}>
          <p style={{ fontSize: 11, color: navy, opacity: 0.4, textTransform: "uppercase",
            letterSpacing: "0.12em", marginBottom: 8 }}>Agent link visits</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#2196f3", marginBottom: 4 }}>
            {visitStats.melissaTotal + visitStats.vipTotal}
          </p>
          <p style={{ fontSize: 12, color: navy, opacity: 0.45 }}>Melissa + VIP combined</p>
        </div>
      </div>

      {/* Website visits over time */}
      <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
        padding: "20px 16px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: navy, textTransform: "uppercase",
          letterSpacing: "0.1em", marginBottom: 20 }}>Website Visits — Last 30 Days</h3>
        {visitStats.websiteTotal === 0 ? (
          <p style={{ fontSize: 13, color: navy, opacity: 0.4, textAlign: "center", padding: "32px 0" }}>
            No website visits recorded yet
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={visitStats.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={blush} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: navy, opacity: 0.5 }}
                axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: navy, opacity: 0.6 }}
                axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, borderRadius: 8 }} />
              <Line type="monotone" dataKey="website" stroke={green} strokeWidth={2} dot={false} name="Website" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Agent link visits over time */}
      {(visitStats.melissaTotal + visitStats.vipTotal) > 0 && (
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
          padding: "20px 16px", marginBottom: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: navy, textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 20 }}>Agent Link Visits — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={visitStats.dailyData} barSize={8} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={blush} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: navy, opacity: 0.5 }}
                axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: navy, opacity: 0.6 }}
                axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, borderRadius: 8 }} />
              <Bar dataKey="melissa" fill={pink} name="Melissa" radius={[3,3,0,0]} />
              <Bar dataKey="vip"     fill={navy} name="VIP"     radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: pink, fontWeight: 700 }}>■ Melissa</span>
            <span style={{ fontSize: 12, color: navy, fontWeight: 700 }}>■ VIP</span>
          </div>
        </div>
      )}

      {/* Visits by country (all sources) */}
      <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12,
        padding: "20px 16px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: navy, textTransform: "uppercase",
          letterSpacing: "0.1em", marginBottom: 4 }}>Visitors by Country</h3>
        <p style={{ fontSize: 11, color: navy, opacity: 0.4, marginBottom: 20 }}>
          Website + Melissa + VIP combined
        </p>
        {visitStats.countryData.length === 0 ? (
          <p style={{ fontSize: 13, color: navy, opacity: 0.4, textAlign: "center", padding: "32px 0" }}>
            No country data yet — country detection works automatically in production
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visitStats.countryData.map((row, i) => {
              const pct = Math.round((row.visits / visitStats.countryData[0].visits) * 100);
              return (
                <div key={row.country}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 4 }}>
                    <span style={{ fontSize: 14, color: navy, fontWeight: i === 0 ? 700 : 400 }}>
                      {countryLabel(row.country)}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: pink }}>
                      {row.visits}
                    </span>
                  </div>
                  <div style={{ height: 6, background: blush, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pink, borderRadius: 4,
                      transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Monthly revenue */}
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12, padding: "20px 16px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: navy, textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 20 }}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.monthlyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={blush} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: navy, opacity: 0.6 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: navy, opacity: 0.6 }} axisLine={false} tickLine={false}
                tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`€ ${formatCurrency(v)}`, "Revenue"]}
                contentStyle={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, borderRadius: 8 }} />
              <Bar dataKey="revenue" fill={navy} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status */}
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12, padding: "20px 16px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: navy, textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 20 }}>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stats.statusData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={50} outerRadius={80} paddingAngle={3}>
                {stats.statusData.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || "#ccc"} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]}
                contentStyle={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, borderRadius: 8 }} />
              <Legend iconType="circle" iconSize={10}
                formatter={(v) => <span style={{ fontSize: 12, color: navy, textTransform: "capitalize" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily orders (last 30 days) */}
      <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12, padding: "20px 16px", marginBottom: 20 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: navy, textTransform: "uppercase",
          letterSpacing: "0.1em", marginBottom: 20 }}>Orders — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={stats.dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={blush} />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: navy, opacity: 0.5 }} axisLine={false} tickLine={false}
              interval={4} />
            <YAxis tick={{ fontSize: 11, fill: navy, opacity: 0.6 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, borderRadius: 8 }} />
            <Line type="monotone" dataKey="orders" stroke={pink} strokeWidth={2} dot={false} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Agent performance */}
      {stats.agentData.length > 0 && (
        <div style={{ background: "#fff", border: `1px solid ${blush}`, borderRadius: 12, padding: "20px 24px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: navy, textTransform: "uppercase",
            letterSpacing: "0.1em", marginBottom: 20 }}>Agent Performance</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {stats.agentData.map(a => (
              <div key={a.agent} style={{ background: blush, borderRadius: 10, padding: "16px 18px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: navy, textTransform: "uppercase",
                  letterSpacing: "0.1em", marginBottom: 8 }}>{a.agent}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: navy }}>{a.orders}
                  <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.5, marginLeft: 4 }}>orders</span></p>
                <p style={{ fontSize: 13, color: navy, opacity: 0.6, marginTop: 2 }}>€ {formatCurrency(a.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
