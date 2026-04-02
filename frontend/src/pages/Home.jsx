import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const WORDS = ["Groceries", "Medicine", "Electronics", "Bakery", "Stationery", "Cosmetics"];

const FEATURES = [
  { icon: "🛒", label: "Find products at local shops near you" },
  { icon: "📍", label: "Discover stores within your neighbourhood" },
  { icon: "💸", label: "Compare prices before you step out" },
  { icon: "📦", label: "Check live stock availability instantly" },
  { icon: "⭐", label: "Read real reviews from local shoppers" },
  { icon: "🏪", label: "Support your local shop owners" },
  { icon: "🔍", label: "Search groceries, medicine, electronics & more" },
  { icon: "❤️", label: "Save your favourites to your wishlist" },
];

const STEPS = [
  { step: "01", icon: "🔍", title: "Search a Product", desc: "Type any product name — groceries, medicine, electronics, anything." },
  { step: "02", icon: "🏪", title: "Browse Nearby Shops", desc: "See all local shops with prices, ratings and distance from you." },
  { step: "03", icon: "🚶", title: "Visit & Buy", desc: "Pick the best deal, check live stock, and head straight to the shop." },
];

export default function Home() {
  const navigate = useNavigate();
  const [wordIdx, setWordIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setFade(true); }, 350);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: "hidden", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes scrollBob {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%      { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
        }

        .ticker-wrap { overflow: hidden; }
        .ticker-inner { display: flex; width: max-content; animation: ticker 55s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }

        .nav-btn-outline:hover { background: rgba(255,255,255,0.25) !important; }
        .nav-btn-solid:hover   { opacity: 0.88; transform: scale(1.03); }
        .cta-primary:hover     { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(37,99,235,0.45) !important; }
        .cta-secondary:hover   { background: rgba(255,255,255,0.22) !important; }
        .step-card:hover { transform: translateY(-8px); background: rgba(255,255,255,0.07) !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: "14px", left: "50%", transform: "translateX(-50%)",
        width: "calc(100% - 48px)", maxWidth: "1080px", height: "58px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.18)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.35)",
        borderRadius: "14px", zIndex: 1000,
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.12)" : "none",
        transition: "all 0.3s"
      }}>
        <div style={{ fontSize: "42px", color: "#6d28d9", fontFamily: "'Edwardian Script ITC', 'Great Vibes', cursive", fontWeight: "400" }}>
          ShopEase
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          {["Features", "How it works", "About"].map(l => (
            <span key={l} style={{ fontSize: "14px", fontWeight: "500", color: scrolled ? "#475569" : "rgba(255,255,255,0.85)", cursor: "pointer", transition: "color 0.2s" }}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => navigate("/login")} className="nav-btn-outline" style={{
            padding: "8px 20px", background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px",
            color: scrolled ? "#1e293b" : "#fff", fontSize: "13px", fontWeight: "600",
            cursor: "pointer", transition: "all 0.2s"
          }}>Login</button>
          <button onClick={() => navigate("/signup")} className="nav-btn-solid" style={{
            padding: "8px 20px", background: "#2563eb",
            border: "none", borderRadius: "8px", color: "#fff",
            fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s"
          }}>Register Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

        {/* BACKGROUND IMAGE — full brightness */}
        <img
          src="https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=1800&q=90"
          alt="hero bg"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top"
          }}
        />

        {/* LIGHT overlay — just enough to read text, image stays visible */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(100deg, rgba(15,23,60,0.62) 0%, rgba(15,23,60,0.28) 55%, rgba(15,23,60,0.05) 100%)"
        }} />

        {/* HERO CONTENT */}
        <div style={{ position: "relative", zIndex: 2, padding: "120px 80px 80px", maxWidth: "680px" }}>

          {/* LIVE BADGE */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "20px", padding: "6px 16px", marginBottom: "24px",
            fontSize: "11px", color: "#fff", fontWeight: "700", letterSpacing: "1px",
            animation: "fadeUp 0.7s 0.1s both"
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            NOW LIVE IN YOUR CITY
          </div>

          {/* HEADLINE */}
          <h1 style={{
            fontSize: "clamp(40px, 5vw, 68px)", fontWeight: "900",
            color: "#fff", lineHeight: "1.08", marginBottom: "20px",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            animation: "fadeUp 0.7s 0.2s both"
          }}>
            Find{" "}
            <span style={{
              display: "inline-block",
              color: "#60a5fa",
              opacity: fade ? 1 : 0,
              transform: fade ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.35s, transform 0.35s",
              minWidth: "260px"
            }}>{WORDS[wordIdx]}</span>
            <br />at Shops Near You
          </h1>

          <p style={{
            fontSize: "17px", color: "rgba(255,255,255,0.82)", lineHeight: "1.75",
            marginBottom: "40px", maxWidth: "460px",
            textShadow: "0 1px 8px rgba(0,0,0,0.2)",
            animation: "fadeUp 0.7s 0.35s both"
          }}>
            Search products, compare prices, check live stock and connect with trusted local shop owners — all in one place.
          </p>

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", animation: "fadeUp 0.7s 0.5s both" }}>
            <button onClick={() => navigate("/signup")} className="cta-primary" style={{
              padding: "15px 38px", background: "#2563eb",
              border: "none", borderRadius: "12px", color: "#fff",
              fontSize: "16px", fontWeight: "700", cursor: "pointer",
              boxShadow: "0 8px 28px rgba(37,99,235,0.5)", transition: "all 0.25s"
            }}>Get Started Free →</button>
            <button onClick={() => navigate("/login")} className="cta-secondary" style={{
              padding: "15px 38px",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.4)", borderRadius: "12px",
              color: "#fff", fontSize: "16px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.25s"
            }}>Sign In</button>
          </div>

          {/* STATS */}
          <div style={{ display: "flex", gap: "32px", marginTop: "56px", flexWrap: "wrap", animation: "fadeUp 0.7s 0.65s both" }}>
            {[["500+", "Local Shops"], ["10K+", "Products"], ["25K+", "Users"], ["4.8★", "Rating"]].map(([v, l]) => (
              <div key={l} style={{ borderLeft: "2px solid rgba(255,255,255,0.25)", paddingLeft: "14px" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#fff" }}>{v}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FLOATING CARDS — right side */}
        <div style={{ position: "absolute", right: "72px", top: "18%", zIndex: 2, animation: "floatY 4s ease-in-out infinite, fadeIn 0.8s 0.9s both", opacity: 0, animationFillMode: "forwards" }}>
          <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 12px 32px rgba(0,0,0,0.15)", minWidth: "200px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>📍</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>500+ Shops Nearby</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Within 10 km of you</div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: "120px", top: "44%", zIndex: 2, animation: "floatY 5s 1s ease-in-out infinite, fadeIn 0.8s 1.1s both", opacity: 0, animationFillMode: "forwards" }}>
          <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 12px 32px rgba(0,0,0,0.15)", minWidth: "210px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#3b82f6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🔍</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Search Any Product</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>10,000+ products listed</div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: "60px", top: "68%", zIndex: 2, animation: "floatY 4.5s 0.5s ease-in-out infinite, fadeIn 0.8s 1.3s both", opacity: 0, animationFillMode: "forwards" }}>
          <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", borderRadius: "16px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", boxShadow: "0 12px 32px rgba(0,0,0,0.15)", minWidth: "200px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>⭐</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>4.8 Avg Rating</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>From 25,000+ users</div>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div style={{
          position: "absolute", bottom: "28px", left: "50%",
          animation: "scrollBob 2s ease-in-out infinite",
          zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px"
        }}>
          <div style={{ width: "24px", height: "38px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: "12px", display: "flex", justifyContent: "center", paddingTop: "6px" }}>
            <div style={{ width: "4px", height: "8px", background: "rgba(255,255,255,0.7)", borderRadius: "2px" }} />
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div style={{ background: "#0f172a", padding: "18px 0", borderTop: "1px solid #1e293b", borderBottom: "1px solid #1e293b" }} className="ticker-wrap">
        <div className="ticker-inner">
          {[...FEATURES, ...FEATURES, ...FEATURES, ...FEATURES].map((f, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#1e293b", border: "1px solid #334155",
              borderRadius: "20px", padding: "10px 22px", margin: "0 10px",
              color: "#cbd5e1", fontSize: "14px", fontWeight: "500",
              fontFamily: "'Georgia', serif",
              whiteSpace: "nowrap", letterSpacing: "0.2px"
            }}>
              {f.icon} {f.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding: "96px 80px", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", position: "relative", overflow: "hidden" }}>

        {/* background glow blobs */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ textAlign: "center", marginBottom: "64px", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-block", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "20px", padding: "5px 16px", color: "#a5b4fc", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", marginBottom: "16px" }}>HOW IT WORKS</span>
          <h2 style={{ fontSize: "42px", fontWeight: "800", color: "#f1f5f9", marginBottom: "12px", lineHeight: "1.15" }}>Three steps to find what you need</h2>
          <p style={{ color: "#64748b", fontSize: "16px" }}>Simple, fast, and always nearby</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {[
            { step: "01", icon: "🔍", title: "Search a Product", desc: "Type any product name — groceries, medicine, electronics, anything.", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)", glow: "rgba(99,102,241,0.12)" },
            { step: "02", icon: "🏪", title: "Browse Nearby Shops", desc: "See all local shops offering that product with prices, ratings and distance.", gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)", glow: "rgba(37,99,235,0.12)" },
            { step: "03", icon: "🚶", title: "Visit & Buy", desc: "Pick the best deal, check live stock, and head straight to the shop.", gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)", glow: "rgba(124,58,237,0.12)" },
          ].map((s, i) => (
            <div key={i} className="step-card" style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "24px", padding: "36px 28px",
              backdropFilter: "blur(12px)",
              boxShadow: `0 8px 32px ${s.glow}`,
              transition: "all 0.3s", cursor: "default",
              position: "relative", overflow: "hidden"
            }}>
              {/* top gradient bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: s.gradient, borderRadius: "24px 24px 0 0" }} />

              {/* step number badge */}
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", background: s.gradient, marginBottom: "20px", boxShadow: `0 4px 14px ${s.glow}` }}>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: "800" }}>{s.step}</span>
              </div>

              <div style={{ fontSize: "40px", marginBottom: "16px" }}>{s.icon}</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", marginBottom: "10px" }}>{s.title}</div>
              <div style={{ fontSize: "14px", color: "#94a3b8", lineHeight: "1.75" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA SECTION with background image ── */}
      <div style={{ position: "relative", minHeight: "460px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1800&q=90"
          alt="cta"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* light tint only */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,30,80,0.55)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,50px)", fontWeight: "900", color: "#fff", marginBottom: "14px", textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
            Start finding products near you
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "17px", marginBottom: "36px" }}>
            Join thousands of smart shoppers already using ShopEase
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/signup")} className="cta-primary" style={{
              padding: "15px 44px", background: "#fff", border: "none",
              borderRadius: "12px", color: "#1e3a8a", fontSize: "16px",
              fontWeight: "800", cursor: "pointer", transition: "all 0.25s",
              boxShadow: "0 8px 28px rgba(0,0,0,0.2)"
            }}>Create Free Account</button>
            <button onClick={() => navigate("/login")} className="cta-secondary" style={{
              padding: "15px 44px", background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.45)", borderRadius: "12px",
              color: "#fff", fontSize: "16px", fontWeight: "600",
              cursor: "pointer", transition: "all 0.25s"
            }}>Sign In →</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        padding: "24px 80px", background: "#0f172a",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px"
      }}>
        <span style={{ fontSize: "16px", fontWeight: "800", color: "#f1f5f9" }}>🏪 ShopEase</span>
        <span style={{ color: "#475569", fontSize: "13px" }}>© 2025 ShopEase. All rights reserved.</span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Login", "Register"].map(l => (
            <span key={l} onClick={() => navigate(l === "Login" ? "/login" : "/signup")}
              style={{ color: "#64748b", fontSize: "13px", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
