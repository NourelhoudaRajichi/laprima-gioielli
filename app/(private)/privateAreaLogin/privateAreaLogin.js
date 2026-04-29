"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPrivateArea() {
  const [checking, setChecking] = useState(true); // true until auth check completes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const backgroundImages = [
    "https://laprimagioielli.com/wp-content/uploads/2025/08/LaPrimaGioielli_SS26_1613-scaled.jpg",
    "https://laprimagioielli.com/wp-content/uploads/2025/08/LaPrimaGioielli_SS26_2200-scaled.jpg",
    "https://laprimagioielli.com/wp-content/uploads/2025/08/LaPrimaGioielli_SS26_2418-scaled.jpg",
  ];

  // Check auth before rendering anything
  useEffect(() => {
    const paToken =
      localStorage.getItem("pa_token") || sessionStorage.getItem("pa_token");
    if (paToken) { router.replace("/privateArea"); return; }

    const wpToken = localStorage.getItem("wp_auth_token");
    if (wpToken) {
      localStorage.setItem("pa_token", wpToken);
      const wpUser = localStorage.getItem("wp_user");
      if (wpUser) localStorage.setItem("pa_user", wpUser);
      router.replace("/privateArea");
      return;
    }

    setChecking(false); // not logged in — show the form
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((i) => (i + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Get JWT token via our server-side proxy
      const tokenRes = await fetch("/api/wp/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData.error || "Invalid credentials");

      const token = tokenData.token;

      // 2. Verify role — server checks for "private-area" or "administrator"
      const verifyRes = await fetch("/api/wp/private-files", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(
          err.error === "Forbidden"
            ? "Your account does not have access to the Private Area."
            : "Access denied. Contact your administrator."
        );
      }

      const { user } = await verifyRes.json();

      // 3. Store token + user info
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("pa_token", token);
      storage.setItem("pa_user", JSON.stringify(user));

      router.push("/privateArea");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden mt-20">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0 -mt-20">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: currentImageIndex === index ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-white/50" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#004065] mb-3 uppercase tracking-wide font-barlow">
              Private Area
            </h1>
            <p className="text-[#004065] text-sm">
              Use your credentials to log in or contact us to request access.
            </p>
            <button
              onClick={() => (window.location.href = "mailto:marketing@laprimagioielli.it")}
              className="text-[#004065] text-sm font-semibold underline mt-2 hover:text-[#ec9cb2] transition"
            >
              CONTACT US
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-left">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="text-left">
                <label className="block text-sm text-[#004065] mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded focus:border-[#ec9cb2] focus:outline-none transition"
                  required
                />
              </div>

              <div className="text-left">
                <label className="block text-sm text-[#004065] mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded focus:border-[#ec9cb2] focus:outline-none transition"
                  required
                />
              </div>

              <div className="flex items-center text-left">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-[#004065]">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-auto px-12 py-3 bg-[#004065] text-white rounded-full font-medium hover:bg-[#ec9cb2] transition duration-200 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in…" : "Log in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
