"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Users, ShoppingBag, Link2, LogOut } from "lucide-react";

const navy  = "#004065";
const pink  = "#ec9cb2";
const blush = "#f8e3e8";

const navItems = [
  { href: "/dashboard",              label: "Analytics",       icon: BarChart2   },
  { href: "/dashboard/users",        label: "Users",           icon: Users       },
  { href: "/dashboard/orders",       label: "Orders",          icon: ShoppingBag },
  { href: "/dashboard/agent-orders", label: "Agent Orders",    icon: Link2       },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/dashboard/logout", { method: "POST" });
    window.location.reload();
  };

  return (
    <aside style={{ width: 220, flexShrink: 0, background: "#fff", borderRight: `1px solid ${blush}`,
      display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0, height: "100vh" }}>

      {/* Logo */}
      <div style={{ padding: "28px 20px 24px", borderBottom: `1px solid ${blush}` }}>
        <img src="/img/La-Prima-Logo.png" alt="La Prima Gioielli" style={{ height: 22, display: "block" }} />
        <span style={{ fontSize: 10, color: navy, opacity: 0.35, letterSpacing: "0.15em",
          textTransform: "uppercase", display: "block", marginTop: 8 }}>Management</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 10px" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 8, marginBottom: 4, textDecoration: "none",
                background: isActive ? blush : "transparent",
                color: isActive ? navy : `${navy}88`,
                fontWeight: isActive ? 700 : 400,
                fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase",
                transition: "all 0.15s" }}>
              <Icon size={16} style={{ flexShrink: 0, color: isActive ? pink : `${navy}66` }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 10px", borderTop: `1px solid ${blush}` }}>
        <button onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            width: "100%", background: "none", border: "none", cursor: "pointer",
            color: `${navy}66`, fontSize: 13, letterSpacing: "0.05em",
            textTransform: "uppercase", borderRadius: 8, fontFamily: "'Barlow Condensed',sans-serif" }}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
