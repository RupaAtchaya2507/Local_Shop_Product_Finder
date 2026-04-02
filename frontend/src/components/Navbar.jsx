import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ search, setSearch, onSearch, viewMode, setViewMode }) {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "User";
  const userType = localStorage.getItem("user_type");

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dropdownRef = useRef(null);
  const searchWrapRef = useRef(null);
  const recognitionRef = useRef(null);
  const suggestTimer = useRef(null);

  const logout = () => { localStorage.clear(); navigate("/"); };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = (val) => {
    clearTimeout(suggestTimer.current);
    if (!val.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    suggestTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/customer/suggest?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch { setSuggestions([]); }
    }, 200);
  };

  const handleSuggestionClick = (productName) => {
    setSearch(productName);
    setSuggestions([]);
    setShowSuggestions(false);
    setTimeout(() => onSearch?.(), 100);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice search not supported in this browser."); return; }
    if (listening) { recognitionRef.current?.stop(); return; }
    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearch(transcript);
      setTimeout(() => onSearch?.(), 100);
    };
    rec.onerror = () => setListening(false);
    rec.start();
  };

  return (
    <div style={{
      height: "60px", background: "#0f1623",
      borderBottom: "1px solid #1e293b",
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: "16px",
      position: "sticky", top: 0, zIndex: 1000,
      boxShadow: "0 2px 20px rgba(0,0,0,0.4)"
    }}>
      <style>{`
        @keyframes navFadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.6)} 50%{box-shadow:0 0 0 6px rgba(239,68,68,0)} }
        .nav-root { animation: navFadeIn 0.4s ease both; }
        .search-input::placeholder { color: #4b5563; }
        .nav-action-btn { transition: all 0.2s; }
        .nav-action-btn:hover { background: rgba(99,102,241,0.15) !important; color: #a5b4fc !important; border-color: #6366f1 !important; }
        .view-pill { transition: all 0.2s; }
        .view-pill:hover { background: rgba(99,102,241,0.12) !important; color: #a5b4fc !important; }
        .view-pill.active { background: rgba(99,102,241,0.2) !important; color: #a5b4fc !important; border-color: #6366f1 !important; }
        .profile-btn:hover { border-color: #6366f1 !important; }
        .drop-item:hover { background: #1e293b !important; }
        .mic-btn-listening { animation: pulse 1s infinite; }
        .suggest-item:hover { background: rgba(99,102,241,0.15) !important; }
      `}</style>

      {/* LOGO */}
      <div className="nav-root" onClick={() => navigate(userType === "shop_owner" ? "/shop" : "/customer")}
        style={{ cursor: "pointer", flexShrink: 0 }}>
        <span style={{ fontSize: "34px", fontFamily: "'Great Vibes', cursive", color: "#6d28d9", fontWeight: "400", lineHeight: 1 }}>ShopEase</span>
      </div>

      {/* SEARCH BAR */}
      {userType !== "shop_owner" && setSearch && (
        <div ref={searchWrapRef} style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

          {/* INPUT + DROPDOWN */}
          <div style={{ width: "380px", position: "relative" }}>
            <input
              className="search-input"
              placeholder="Search for products near you..."
              value={search || ""}
              onChange={e => { setSearch(e.target.value); fetchSuggestions(e.target.value); }}
              onKeyDown={e => { if (e.key === "Enter") { setShowSuggestions(false); onSearch?.(); } }}
              onFocus={() => { setSearchFocused(true); if (suggestions.length > 0) setShowSuggestions(true); }}
              style={{
                width: "100%", padding: "9px 18px",
                background: "#1a2236",
                border: searchFocused ? "1px solid #6366f1" : "1px solid #2d3748",
                borderRadius: showSuggestions && suggestions.length > 0 ? "10px 0 0 0" : "10px 0 0 10px",
                color: "#f1f5f9", fontSize: "13px",
                outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: searchFocused ? "0 0 0 3px rgba(99,102,241,0.15)" : "none"
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                background: "#1a2236", border: "1px solid #6366f1",
                borderTop: "none", borderRadius: "0 0 10px 10px",
                zIndex: 2000, overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
              }}>
                {suggestions.map((s, i) => (
                  <div key={i} className="suggest-item"
                    onMouseDown={() => handleSuggestionClick(s.product_name)}
                    style={{
                      padding: "9px 16px", cursor: "pointer", fontSize: "13px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      borderBottom: i < suggestions.length - 1 ? "1px solid #2d3748" : "none",
                      background: "transparent", transition: "background 0.15s"
                    }}>
                    <span style={{ color: "#f1f5f9" }}>🔍 {s.product_name}</span>
                    <span style={{ fontSize: "10px", color: "#6366f1", background: "rgba(99,102,241,0.15)", padding: "2px 8px", borderRadius: "10px" }}>{s.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MIC BUTTON */}
          <button
            onClick={startVoiceSearch}
            className={listening ? "mic-btn-listening" : ""}
            title={listening ? "Listening... click to stop" : "Voice search"}
            style={{
              width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
              background: listening ? "#ef4444" : "#1a2236",
              border: listening ? "2px solid #ef4444" : "1px solid #2d3748",
              cursor: "pointer", fontSize: "15px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>{listening ? "⏹" : "🎤"}</button>

          {/* SEARCH BUTTON */}
          <button onClick={() => { setShowSuggestions(false); onSearch?.(); }} style={{
            padding: "9px 18px", background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            border: "none", borderRadius: "0 10px 10px 0",
            color: "white", fontSize: "12px", fontWeight: "700",
            cursor: "pointer", letterSpacing: "0.3px", height: "36px", flexShrink: 0
          }}>Search</button>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* VIEW TOGGLE */}
      {userType !== "shop_owner" && setViewMode && (
        <div style={{ display: "flex", gap: "4px", background: "#1a2236", borderRadius: "8px", padding: "3px", border: "1px solid #2d3748" }}>
          {[["list", "List View"], ["map", "Map View"]].map(([mode, label]) => (
            <button key={mode} className={`view-pill${viewMode === mode ? " active" : ""}`}
              onClick={() => setViewMode(mode)}
              style={{
                padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600",
                border: viewMode === mode ? "1px solid #6366f1" : "1px solid transparent",
                background: viewMode === mode ? "rgba(99,102,241,0.2)" : "transparent",
                color: viewMode === mode ? "#a5b4fc" : "#cbd5e1",
                cursor: "pointer"
              }}>{label}</button>
          ))}
        </div>
      )}

      {/* WISHLIST */}
      {userType !== "shop_owner" && (
        <button className="nav-action-btn" onClick={() => navigate("/wishlist")} style={{
          padding: "7px 16px", borderRadius: "8px",
          background: "transparent", border: "1px solid #2d3748",
          color: "#cbd5e1", fontSize: "12px", fontWeight: "600",
          cursor: "pointer", letterSpacing: "0.3px"
        }}>Wishlist</button>
      )}

      {/* PROFILE */}
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <button className="profile-btn" onClick={() => setProfileOpen(o => !o)} style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "6px 14px 6px 8px",
          background: "#1a2236", border: "1px solid #2d3748",
          borderRadius: "10px", cursor: "pointer", transition: "border-color 0.2s"
        }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: "700", color: "white", flexShrink: 0
          }}>{name.charAt(0).toUpperCase()}</div>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>{name}</span>
          <span style={{ fontSize: "9px", color: "#6b7280", marginLeft: "2px" }}>▼</span>
        </button>

        {profileOpen && (
          <div style={{
            position: "absolute", right: 0, top: "48px",
            background: "#0f1623", border: "1px solid #1e293b",
            borderRadius: "12px", padding: "8px", minWidth: "180px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.6)", zIndex: 999,
            animation: "navFadeIn 0.2s ease both"
          }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid #1e293b", marginBottom: "6px" }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#f1f5f9" }}>{name}</div>
              <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>{userType === "shop_owner" ? "Shop Owner" : "Customer"}</div>
            </div>
            {userType !== "shop_owner" && <DropItem onClick={() => { navigate("/wishlist"); setProfileOpen(false); }}>Wishlist</DropItem>}
            {userType === "shop_owner" && <DropItem onClick={() => { navigate("/shop"); setProfileOpen(false); }}>My Shop</DropItem>}
            <DropItem onClick={() => { navigate("/"); setProfileOpen(false); }}>Home</DropItem>
            <div style={{ height: "1px", background: "#1e293b", margin: "6px 0" }} />
            <DropItem onClick={logout} danger>Sign Out</DropItem>
          </div>
        )}
      </div>
    </div>
  );
}

function DropItem({ children, onClick, danger }) {
  return (
    <div className="drop-item" onClick={onClick} style={{
      padding: "9px 12px", borderRadius: "8px", cursor: "pointer",
      fontSize: "13px", fontWeight: "500",
      color: danger ? "#f87171" : "#cbd5e1",
      transition: "background 0.15s"
    }}>{children}</div>
  );
}

export default Navbar;
