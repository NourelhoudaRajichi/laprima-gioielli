import { cookies } from "next/headers";
import LoginFormClient from "./_login";
import DashboardSidebar from "./_sidebar";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("dashboard_auth")?.value === "1";

  if (!isAuthed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#fff",
        fontFamily: "'Barlow Condensed', sans-serif" }}>
        <LoginFormClient />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f9fb",
      fontFamily: "'Barlow Condensed', sans-serif" }}>
      <DashboardSidebar />
      <main style={{ flex: 1, minWidth: 0, padding: "32px 36px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
