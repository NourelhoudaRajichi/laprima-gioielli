export default function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      height: "60vh", gap: 12, fontFamily: "'Barlow Condensed',sans-serif" }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ec9cb2",
        animation: "lpgPulse 0.9s ease-in-out infinite" }} />
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ec9cb2",
        animation: "lpgPulse 0.9s ease-in-out 0.2s infinite" }} />
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ec9cb2",
        animation: "lpgPulse 0.9s ease-in-out 0.4s infinite" }} />
      <style>{`
        @keyframes lpgPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
