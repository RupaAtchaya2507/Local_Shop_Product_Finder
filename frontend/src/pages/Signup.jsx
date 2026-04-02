import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { name, email, password, user_type: userType });
      navigate("/login");
    } catch { setError("Signup failed. Email may already be in use."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @keyframes fadeDown   { from{opacity:0;transform:translateY(-22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft   { from{opacity:0;transform:translateX(-28px)} to{opacity:1;transform:translateX(0)} }
        @keyframes checkFade  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes formSlide  { from{opacity:0;transform:translateX(32px)}  to{opacity:1;transform:translateX(0)} }

        @keyframes bgPan      { 0%,100%{transform:scale(1.07) translateX(0)} 50%{transform:scale(1.07) translateX(-3%)} }
        @keyframes glowLogo   { 0%,100%{text-shadow:0 0 8px rgba(167,139,250,0.3)} 50%{text-shadow:0 0 24px rgba(167,139,250,0.9), 0 0 48px rgba(167,139,250,0.4)} }
        @keyframes floatCheck { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        @keyframes borderPulse{ 0%,100%{border-color:rgba(255,255,255,0.15)} 50%{border-color:rgba(167,139,250,0.65)} }
        @keyframes pulseRing  { 0%{box-shadow:0 0 0 0 rgba(124,58,237,0.5)} 70%{box-shadow:0 0 0 12px rgba(124,58,237,0)} 100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} }
        @keyframes shimmerBtn { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

        .signup-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.2) !important; outline: none; }
        .signup-input { transition: border-color 0.2s, box-shadow 0.2s; }

        .create-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 40%, #7c3aed 60%, #6366f1 100%);
          background-size: 300% 100%;
          animation: shimmerBtn 3s linear infinite;
        }
        .create-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,58,237,0.5) !important; }
      `}</style>

      {/* LEFT — background image */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85"
          alt="signup bg"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", animation: "bgPan 20s ease-in-out infinite" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(15,23,42,0.78) 0%, rgba(109,40,217,0.45) 100%)" }} />

        {/* TOP-LEFT — logo */}
        <div onClick={() => navigate("/")} style={{ position: "absolute", top: "44px", left: "52px", cursor: "pointer", animation: "fadeDown 0.6s 0.1s ease both" }}>
          <span style={{ fontSize: "40px", fontFamily: "'Great Vibes', cursive", color: "#a78bfa", animation: "glowLogo 3s ease-in-out infinite" }}>ShopEase</span>
        </div>

        {/* CENTER — headline */}
        <div style={{ position: "absolute", top: "50%", left: "52px", right: "52px", transform: "translateY(-55%)" }}>
          <h2 style={{ fontSize: "46px", fontWeight: "800", color: "#fff", lineHeight: "1.15", marginBottom: "20px", animation: "fadeLeft 0.7s 0.3s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Join thousands of<br />smart shoppers
          </h2>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "16px", lineHeight: "1.9", maxWidth: "420px", animation: "fadeLeft 0.7s 0.5s ease both", opacity: 0, animationFillMode: "forwards" }}>
            Create your free account and start finding the best products at local shops near you in seconds.
          </p>
        </div>

        {/* BOTTOM — floating checklist */}
        <div style={{ position: "absolute", bottom: "52px", left: "52px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            ["✅", "Search any product across nearby shops"],
            ["✅", "Compare prices and check live stock"],
            ["✅", "Save favourites to your wishlist"],
          ].map(([icon, text], i) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: "12px",
              opacity: 0,
              animation: `checkFade 0.5s ${0.6 + i * 0.15}s ease forwards`
            }}>
              <span style={{ fontSize: "18px" }}>{icon}</span>
              <span style={{
                color: "rgba(255,255,255,0.88)", fontSize: "14px", fontWeight: "500",
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "9px 18px"
              }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ width: "480px", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px", background: "#0f172a", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "380px", animation: "formSlide 0.7s 0.2s ease both", opacity: 0, animationFillMode: "forwards" }}>

          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#f1f5f9", marginBottom: "6px" }}>Create your account</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "28px" }}>Join ShopEase for free today</p>

          {error && (
            <div style={{ background: "#450a0a", border: "1px solid #dc2626", color: "#fca5a5", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
              {error}
            </div>
          )}

          {/* ROLE SELECTOR */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            {[
              { value: "customer", label: "Customer", icon: "🛍️", desc: "Find products" },
              { value: "shop_owner", label: "Shop Owner", icon: "🏪", desc: "List your shop" }
            ].map(role => (
              <div key={role.value} onClick={() => setUserType(role.value)} style={{
                flex: 1, padding: "14px 12px", borderRadius: "12px", cursor: "pointer", textAlign: "center",
                border: userType === role.value ? "2px solid #7c3aed" : "2px solid #334155",
                background: userType === role.value ? "rgba(124,58,237,0.15)" : "#1e293b",
                transition: "all 0.2s",
                boxShadow: userType === role.value ? "0 0 16px rgba(124,58,237,0.25)" : "none"
              }}>
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>{role.icon}</div>
                <div style={{ fontWeight: "600", fontSize: "13px", color: "#f1f5f9" }}>{role.label}</div>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{role.desc}</div>
              </div>
            ))}
          </div>

          <label style={labelStyle}>Full Name</label>
          <input className="signup-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Email Address</label>
          <input className="signup-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Password</label>
          <input className="signup-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && signup()} style={inputStyle} />

          <button onClick={signup} disabled={loading} className={loading ? "" : "create-btn"} style={{
            width: "100%", padding: "14px", marginTop: "24px",
            background: loading ? "#334155" : undefined,
            color: "white", border: "none", borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "15px", fontWeight: "600", transition: "transform 0.2s, box-shadow 0.2s"
          }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {!loading && <div style={{ width: "60px", height: "4px", borderRadius: "2px", background: "linear-gradient(90deg,#7c3aed,#6366f1)", margin: "10px auto 0", animation: "pulseRing 2s ease-out infinite" }} />}

          <p style={{ textAlign: "center", marginTop: "24px", color: "#64748b", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: "600" }}>Sign in</Link>
          </p>
          <p style={{ textAlign: "center", marginTop: "10px" }}>
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#475569", fontSize: "13px" }}>← Back to Home</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px", marginTop: "14px" };
const inputStyle = { width: "100%", padding: "13px 16px", background: "#1e293b", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", outline: "none" };

export default Signup;
