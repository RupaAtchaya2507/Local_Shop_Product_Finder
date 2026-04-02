import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.id);
      localStorage.setItem("user_type", res.data.user_type);
      localStorage.setItem("name", res.data.name);
      if (res.data.user_type === "shop_owner") navigate("/shop");
      else navigate("/customer");
    } catch { setError("Invalid email or password"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @keyframes fadeDown  { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn     { from{opacity:0;transform:scale(0.82)}       to{opacity:1;transform:scale(1)} }
        @keyframes formSlide { from{opacity:0;transform:translateX(32px)}  to{opacity:1;transform:translateX(0)} }

        @keyframes bgPan     { 0%,100%{transform:scale(1.07) translateX(0)} 50%{transform:scale(1.07) translateX(-3%)} }
        @keyframes floatPill { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes glowLogo  { 0%,100%{text-shadow:0 0 8px rgba(167,139,250,0.3)} 50%{text-shadow:0 0 24px rgba(167,139,250,0.9), 0 0 48px rgba(167,139,250,0.4)} }
        @keyframes pulseRing { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.5)} 70%{box-shadow:0 0 0 12px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }
        @keyframes shimmerBtn{ 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes borderPulse{ 0%,100%{border-color:rgba(255,255,255,0.2)} 50%{border-color:rgba(167,139,250,0.7)} }
        @keyframes inputGlow { 0%,100%{box-shadow:none} 50%{box-shadow:0 0 0 3px rgba(99,102,241,0.15)} }

        .pill-anim { animation: floatPill 3.5s ease-in-out infinite, borderPulse 4s ease-in-out infinite; }
        .pill-anim:nth-child(2) { animation-delay: 0.6s; }
        .pill-anim:nth-child(3) { animation-delay: 1.2s; }

        .login-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.2) !important; outline: none; }
        .login-input { transition: border-color 0.2s, box-shadow 0.2s; }

        .sign-btn {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 40%, #6366f1 60%, #2563eb 100%);
          background-size: 300% 100%;
          animation: shimmerBtn 3s linear infinite;
        }
        .sign-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.5) !important; }
      `}</style>

      {/* LEFT — background image */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&q=85"
          alt="login bg"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", animation: "bgPan 18s ease-in-out infinite" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,23,42,0.78) 0%, rgba(30,58,95,0.55) 100%)" }} />

        {/* TOP-LEFT — logo with glow */}
        <div onClick={() => navigate("/")} style={{ position: "absolute", top: "44px", left: "52px", cursor: "pointer", animation: "fadeDown 0.6s 0.1s ease both" }}>
          <span style={{ fontSize: "40px", fontFamily: "'Great Vibes', cursive", color: "#a78bfa", animation: "glowLogo 3s ease-in-out infinite" }}>ShopEase</span>
        </div>

        {/* CENTER — headline */}
        <div style={{ position: "absolute", top: "50%", left: "52px", right: "52px", transform: "translateY(-55%)" }}>
          <h2 style={{ fontSize: "48px", fontWeight: "800", color: "#fff", lineHeight: "1.15", marginBottom: "20px", animation: "fadeLeft 0.7s 0.3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Discover products<br />at shops near you
          </h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "16px", lineHeight: "1.9", maxWidth: "420px", animation: "fadeLeft 0.7s 0.5s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Search, compare prices, check live stock and connect with trusted local shop owners — all in one place.
          </p>
        </div>

        {/* BOTTOM — floating pills */}
        <div style={{ position: "absolute", bottom: "52px", left: "52px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {[["🛍️", "Find Products"], ["📍", "Nearby Shops"], ["❤️", "Wishlist"]].map(([icon, label], i) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(255,255,255,0.13)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: "14px", padding: "13px 22px",
              opacity: 0,
              animation: `popIn 0.5s ${0.6 + i * 0.15}s ease forwards`
            }}>
              <span style={{ fontSize: "20px" }}>{icon}</span>
              <span style={{ color: "#fff", fontSize: "14px", fontWeight: "500" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ width: "460px", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 48px", background: "#0f172a", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "360px", animation: "formSlide 0.7s 0.2s ease both", opacity: 0, animationFillMode: "forwards" }}>

          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#f1f5f9", marginBottom: "6px" }}>Welcome back</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "36px" }}>Sign in to your account</p>

          {error && (
            <div style={{ background: "#450a0a", border: "1px solid #dc2626", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <label style={labelStyle}>Email address</label>
          <input className="login-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} style={inputStyle} />

          <label style={labelStyle}>Password</label>
          <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} style={inputStyle} />

          <button onClick={login} disabled={loading} className={loading ? "" : "sign-btn"} style={{
            width: "100%", padding: "14px", marginTop: "24px",
            background: loading ? "#334155" : undefined,
            color: "white", border: "none", borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "15px", fontWeight: "600", transition: "transform 0.2s, box-shadow 0.2s",
            animation: loading ? "none" : undefined
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* pulsing ring under button */}
          {!loading && <div style={{ width: "60px", height: "4px", borderRadius: "2px", background: "linear-gradient(90deg,#6366f1,#2563eb)", margin: "10px auto 0", animation: "pulseRing 2s ease-out infinite" }} />}

          <p style={{ textAlign: "center", marginTop: "28px", color: "#64748b", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>Create one</Link>
          </p>
          <p style={{ textAlign: "center", marginTop: "12px" }}>
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#475569", fontSize: "13px" }}>← Back to Home</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px", marginTop: "16px" };
const inputStyle = { width: "100%", padding: "13px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", outline: "none" };

export default Login;
