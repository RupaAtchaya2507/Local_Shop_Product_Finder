import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", iconSize: [32, 32], iconAnchor: [16, 32] });
const shopIcon = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", iconSize: [32, 32], iconAnchor: [16, 32] });
const shopIconHighlighted = new L.Icon({ iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png", iconSize: [40, 40], iconAnchor: [20, 40] });

function FitBounds({ shops, userLocation }) {
  const map = useMap();
  useEffect(() => {
    if (userLocation) map.setView([userLocation.lat, userLocation.lng], 14);
  }, [userLocation]);
  useEffect(() => {
    if (shops.length === 0) return;
    const points = shops.filter(s => s.lat && s.lng).map(s => [s.lat, s.lng]);
    if (userLocation) points.push([userLocation.lat, userLocation.lng]);
    if (points.length > 0) map.fitBounds(points, { padding: [40, 40] });
  }, [shops]);
  return null;
}

const CATEGORIES_SIDEBAR = [
  { label: "All",         key: "All",         emoji: "🏪" },
  { label: "Grocery",     key: "Grocery",      emoji: "🥦" },
  { label: "Medicine",    key: "Medicine",     emoji: "💊" },
  { label: "Electronics", key: "Electronics",  emoji: "📱" },
  { label: "Food",        key: "Food",         emoji: "🥐" },
  { label: "Clothing",    key: "Clothing",     emoji: "💄" },
  { label: "Stationery",  key: "Stationery",   emoji: "✏️" },
];

const CATEGORIES_IMG = [
  { label: "Groceries",   key: "Grocery",      emoji: "🥦", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80" },
  { label: "Pharmacy",    key: "Medicine",     emoji: "💊", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80" },
  { label: "Electronics", key: "Electronics",  emoji: "📱", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80" },
  { label: "Bakery",      key: "Food",         emoji: "🥐", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80" },
  { label: "Cosmetics",   key: "Clothing",     emoji: "💄", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80" },
  { label: "More",        key: "All",          emoji: "➕", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80" },
];

const SORT_OPTIONS = ["Distance ↑", "Price ↑", "Rating ↓"];

const SHOP_FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
  "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400&q=80",
  "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80",
  "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80",
];

function getPriceBadge(priceStats, productName, price) {
  const stats = priceStats[productName?.toLowerCase()];
  if (!stats) return null;
  if (price <= stats.min_price + 1) return { label: "🔥 Best Price", color: "#22c55e", bg: "rgba(34,197,94,0.15)" };
  if (price <= stats.avg_price * 1.1) return { label: "💰 Avg Price", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" };
  return { label: "⚠️ Pricey", color: "#ef4444", bg: "rgba(239,68,68,0.15)" };
}

export default function CustomerDashboard({ navSearch, triggerSearch, viewMode }) {
  const DEFAULT_LOCATION = { lat: 11.295485, lng: 77.663316 }; // matches seed.js BASE_LAT/BASE_LNG
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState("");
  const [activeShopId, setActiveShopId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [priceStats, setPriceStats] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const cardRefs = useRef({});

  // Filters
  const [maxDistance, setMaxDistance] = useState(50);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState("Distance ↑");

  // Pending
  const [pendingDistance, setPendingDistance] = useState(50);
  const [pendingMaxPrice, setPendingMaxPrice] = useState(10000);
  const [pendingRating, setPendingRating] = useState(0);

  useEffect(() => {
    setUserLocation(DEFAULT_LOCATION);
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(DEFAULT_LOCATION),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Auto-search on page refresh if a previous search term exists
  const autoSearched = useRef(false);
  useEffect(() => {
    if (userLocation && navSearch?.trim() && !autoSearched.current) {
      autoSearched.current = true;
      searchProduct();
    }
  }, [userLocation]);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const searchProduct = async (overrideCategory) => {
    const q = navSearch?.trim();
    if (!userLocation) { showToast("📍 Location not ready yet"); return; }
    if (!q) { showToast("Enter a product name"); return; }
    setLoading(true);
    try {
      const sortMap = { "Distance ↑": "distance", "Price ↑": "price", "Rating ↓": "rating" };
      const res = await axios.get("http://localhost:5000/api/customer/search", {
        params: { product: q, lat: userLocation.lat, lng: userLocation.lng, category: overrideCategory ?? activeCategory, sort: sortMap[sortOption] }
      });
      setShops(res.data); setSearched(true); setActiveShopId(null); setRouteCoords([]);
      const cat = overrideCategory ?? activeCategory;
      const [statsRes, recsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/customer/price-stats"),
        axios.get("http://localhost:5000/api/customer/recommendations", {
          params: { product_name: q, category: cat === "All" ? res.data[0]?.category ?? "Grocery" : cat, user_id: userId }
        })
      ]).catch(() => [null, null]);
      if (statsRes) setPriceStats(statsRes.data);
      if (recsRes) setRecommendations(recsRes.data);
    } catch { showToast("Search failed. Try again."); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (triggerSearch > 0) searchProduct(); }, [triggerSearch]);

  const handleApply = () => { setMaxDistance(pendingDistance); setMaxPrice(pendingMaxPrice); setMinRating(pendingRating); };

  const handleClearAll = () => {
    setPendingDistance(50); setPendingMaxPrice(10000); setPendingRating(0);
    setMaxDistance(50); setMaxPrice(10000); setMinRating(0); setActiveCategory("All");
  };

  const handleCategoryClick = key => {
    setActiveCategory(key);
    if (navSearch?.trim()) searchProduct(key);
  };

  const filtered = shops.filter(s =>
    s.distance <= maxDistance && s.price <= maxPrice && s.rating >= minRating &&
    (activeCategory === "All" || s.category === activeCategory)
  );

  const addToWishlist = async (productId, e) => {
    e.stopPropagation();
    try {
      const res = await axios.post("http://localhost:5000/api/wishlist/add", { user_id: userId, product_id: productId });
      showToast(res.data.message === "Already in wishlist" ? "Already in your wishlist" : "✅ Added to wishlist!");
    } catch { showToast("Error adding to wishlist"); }
  };

  const fetchRoute = async (shop) => {
    if (!userLocation || !shop.lat || !shop.lng) return;
    try {
      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${shop.lng},${shop.lat}?overview=full&geometries=geojson`
      );
      const coords = res.data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRouteCoords(coords);
    } catch { setRouteCoords([]); }
  };

  const handleMarkerClick = shopId => {
    setActiveShopId(shopId);
    const shop = filtered.find(s => s.shop_id === shopId);
    if (shop) fetchRoute(shop);
    cardRefs.current[shopId]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const showMap = viewMode === "map";

  // Active filter tags
  const activeTags = [];
  if (maxDistance < 100) activeTags.push(`Within ${maxDistance} km`);
  if (maxPrice < 10000) activeTags.push(`Max ₹${maxPrice}`);
  if (minRating > 0) activeTags.push(`${minRating}★+`);
  if (activeCategory !== "All") activeTags.push(activeCategory);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)", background: "#0d1117", overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        .shop-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 32px rgba(0,0,0,0.5) !important; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 8px rgba(239,68,68,0.7)} 50%{box-shadow:0 0 16px rgba(239,68,68,1)} }
        .cat-item:hover { background: rgba(255,255,255,0.06) !important; }
        .sort-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .view-btn:hover { color: #a5b4fc !important; }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: "76px", left: "50%", transform: "translateX(-50%)", background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9", padding: "12px 24px", borderRadius: "10px", zIndex: 9999, fontSize: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>{toast}</div>
      )}

      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: "220px", flexShrink: 0, background: "#10151f", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", overflowY: "auto" }}>

        {/* Filters header */}
        <div style={{ padding: "20px 18px 12px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #1e293b" }}>
          <span style={{ fontSize: "16px" }}>⚙️</span>
          <span style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: "700" }}>Filters</span>
        </div>

        {/* Search inside sidebar */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#1a2236", border: "1px solid #2d3748", borderRadius: "8px", padding: "8px 12px" }}>
            <span style={{ color: "#6b7280", fontSize: "13px" }}>🔍</span>
            <span style={{ color: "#4b5563", fontSize: "13px" }}>Search...</span>
          </div>
        </div>

        {/* CATEGORIES */}
        <div style={{ padding: "14px 14px 8px" }}>
          <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Categories</p>
          {CATEGORIES_SIDEBAR.map(cat => (
            <div key={cat.key} className="cat-item" onClick={() => handleCategoryClick(cat.key)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 10px", borderRadius: "7px", cursor: "pointer",
              background: activeCategory === cat.key ? "rgba(99,102,241,0.15)" : "transparent",
              marginBottom: "2px", transition: "background 0.15s"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {activeCategory === cat.key && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />}
                <span style={{ color: activeCategory === cat.key ? "#a5b4fc" : "#cbd5e1", fontSize: "13px", fontWeight: activeCategory === cat.key ? "600" : "400" }}>{cat.label}</span>
              </div>
              <span style={{ fontSize: "11px" }}>{cat.emoji}</span>
            </div>
          ))}
        </div>

        <div style={{ height: "1px", background: "#1e293b", margin: "8px 14px" }} />

        {/* PRICE */}
        <div style={{ padding: "8px 14px" }}>
          <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Price</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>₹0</span>
            <span style={{ color: "#a5b4fc", fontSize: "11px", fontWeight: "600" }}>₹{pendingMaxPrice.toLocaleString()}</span>
          </div>
          <input type="range" min="50" max="10000" step="50" value={pendingMaxPrice}
            onChange={e => setPendingMaxPrice(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>

        <div style={{ height: "1px", background: "#1e293b", margin: "8px 14px" }} />

        {/* DISTANCE */}
        <div style={{ padding: "8px 14px" }}>
          <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Distance</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#94a3b8", fontSize: "11px" }}>0 km</span>
            <span style={{ color: "#a5b4fc", fontSize: "11px", fontWeight: "600" }}>{pendingDistance} km</span>
          </div>
          <input type="range" min="1" max="100" value={pendingDistance}
            onChange={e => setPendingDistance(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#6366f1" }} />
        </div>

        <div style={{ height: "1px", background: "#1e293b", margin: "8px 14px" }} />

        {/* RATING */}
        <div style={{ padding: "8px 14px" }}>
          <p style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Rating</p>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1,2,3,4,5].map(s => (
              <span key={s} onClick={() => setPendingRating(s === pendingRating ? 0 : s)}
                style={{ fontSize: "20px", cursor: "pointer", color: s <= pendingRating ? "#f59e0b" : "#2d3748", transition: "color 0.15s" }}>★</span>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div style={{ padding: "16px 14px", marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={handleApply} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Apply</button>
          <button onClick={handleClearAll} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "transparent", border: "1px solid #2d3748", color: "#6b7280", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Clear All</button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* TOP BAR — title + filter tags + sort */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e293b", background: "#0d1117", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", flexShrink: 0 }}>
          <h2 style={{ color: "#f1f5f9", fontSize: "18px", fontWeight: "700", margin: 0, marginRight: "8px" }}>
            {searched ? `${filtered.length} Shops Found` : "Nearby Shops"}
          </h2>

          {/* Active filter tags */}
          {activeTags.map(tag => (
            <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1e293b", border: "1px solid #334155", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: "#a5b4fc" }}>
              {tag}
              <span onClick={() => {
                if (tag.includes("km")) { setPendingDistance(50); setMaxDistance(50); }
                else if (tag.includes("₹")) { setPendingMaxPrice(10000); setMaxPrice(10000); }
                else if (tag.includes("★")) { setPendingRating(0); setMinRating(0); }
                else { setActiveCategory("All"); }
              }} style={{ cursor: "pointer", color: "#6b7280", fontWeight: "700" }}>×</span>
            </span>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Sort */}
            <div style={{ display: "flex", gap: "4px" }}>
              {SORT_OPTIONS.map(opt => (
                <button key={opt} className="sort-btn" onClick={() => setSortOption(opt)} style={{
                  padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer",
                  background: sortOption === opt ? "rgba(99,102,241,0.2)" : "transparent",
                  border: sortOption === opt ? "1px solid #6366f1" : "1px solid #2d3748",
                  color: sortOption === opt ? "#a5b4fc" : "#cbd5e1", transition: "all 0.15s"
                }}>{opt}</button>
              ))}
            </div>
            {/* View toggle */}
            <div style={{ display: "flex", gap: "4px", marginLeft: "8px" }}>
              {[["list", "☰"], ["map", "🗺️"]].map(([mode, icon]) => (
                <button key={mode} className="view-btn" onClick={() => {}} style={{
                  width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #2d3748",
                  background: viewMode === mode ? "rgba(99,102,241,0.2)" : "transparent",
                  color: viewMode === mode ? "#a5b4fc" : "#6b7280", cursor: "pointer", fontSize: "14px"
                }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* CARDS PANEL */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* CATEGORIES IMAGE ROW */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ color: "#f1f5f9", fontSize: "16px", fontWeight: "700", marginBottom: "14px" }}>Categories</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
              {CATEGORIES_IMG.map(cat => (
                <div key={cat.key} onClick={() => handleCategoryClick(cat.key)} style={{
                  position: "relative", borderRadius: "16px", overflow: "hidden",
                  aspectRatio: "1 / 1", cursor: "pointer",
                  border: activeCategory === cat.key ? "2px solid #6366f1" : "2px solid transparent",
                  transform: activeCategory === cat.key ? "scale(1.04)" : "scale(1)",
                  transition: "all 0.15s"
                }}>
                  <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: activeCategory === cat.key ? "rgba(99,102,241,0.3)" : "rgba(0,0,0,0.45)" }} />
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "5px"
                  }}>
                    <span style={{ fontSize: "20px" }}>{cat.emoji}</span>
                    <span style={{ color: "#fff", fontSize: "12px", fontWeight: "700", textAlign: "center", textShadow: "0 1px 6px rgba(0,0,0,1)", lineHeight: "1.3", padding: "0 6px" }}>{cat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!searched && !loading && (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "#374151" }}>
                <div style={{ fontSize: "52px", marginBottom: "16px", opacity: 0.4 }}>🔍</div>
                <p style={{ fontSize: "15px", color: "#4b5563" }}>Search for a product to discover nearby shops</p>
              </div>
            )}
            {loading && (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "#4b5563", fontSize: "15px" }}>
                Searching nearby shops...
              </div>
            )}
            {searched && filtered.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.4 }}>🏪</div>
                <p style={{ fontSize: "15px", color: "#4b5563" }}>No shops match your filters</p>
                <button onClick={handleClearAll} style={{ marginTop: "14px", padding: "8px 20px", borderRadius: "8px", background: "linear-gradient(135deg,#6366f1,#4f46e5)", border: "none", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Clear Filters</button>
              </div>
            )}

            {/* GRID */}
            <div style={{ display: "grid", gridTemplateColumns: showMap ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: "16px" }}>
              {filtered.map((s, i) => (
                <div key={i} ref={el => cardRefs.current[s.shop_id] = el}
                  className="shop-card"
                  onClick={() => { setActiveShopId(s.shop_id); fetchRoute(s); }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    borderRadius: "10px", overflow: "hidden", cursor: "pointer",
                    background: "#161b27",
                    border: activeShopId === s.shop_id ? "1px solid #6366f1" : "1px solid #1e293b",
                    transition: "all 0.2s", position: "relative"
                  }}>

                  {/* IMAGE */}
                  <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                    <img
                      src={s.shop_image_url || SHOP_FALLBACK_IMGS[i % SHOP_FALLBACK_IMGS.length]}
                      alt={s.shop_name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s", transform: hoveredCard === i ? "scale(1.05)" : "scale(1)" }}
                      onError={e => { e.target.src = SHOP_FALLBACK_IMGS[i % SHOP_FALLBACK_IMGS.length]; }}
                    />
                    {/* Hover overlay — "View Shop" */}
                    {hoveredCard === i && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button onClick={e => { e.stopPropagation(); navigate(`/shop-detail/${s.shop_id}`); }}
                          style={{ padding: "10px 24px", background: "white", border: "none", borderRadius: "8px", color: "#0d1117", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                          View Shop
                        </button>
                      </div>
                    )}
                    {/* Wishlist icon */}
                    <button onClick={e => addToWishlist(s.product_id, e)}
                      style={{ position: "absolute", top: "10px", right: "10px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", fontSize: "14px", backdropFilter: "blur(4px)" }}>❤️</button>
                    {/* Distance badge */}
                    <span style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", color: "#f1f5f9", fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "20px" }}>📍 {s.distance} km</span>
                    {/* Low stock badge */}
                    {s.stock > 0 && s.stock < 10 && (
                      <span style={{ position: "absolute", bottom: "10px", left: "10px", background: "#ef4444", color: "white", fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", animation: "pulse 1.5s infinite", boxShadow: "0 0 8px rgba(239,68,68,0.7)" }}>🔔 Only {s.stock} left!</span>
                    )}
                  </div>

                  {/* CARD FOOTER */}
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <div>
                        <div style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "14px" }}>{s.product_name}</div>
                        <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "2px" }}>{s.shop_name}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "15px" }}>₹{s.price}</div>
                        <div style={{ color: "#f59e0b", fontSize: "11px" }}>⭐ {Number(s.rating).toFixed(1)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <span style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", fontSize: "10px", fontWeight: "600", padding: "3px 8px", borderRadius: "4px" }}>{s.category}</span>
                      <span style={{ color: s.stock > 10 ? "#22c55e" : "#f59e0b", fontSize: "11px" }}>{s.stock > 0 ? `${s.stock} in stock` : "Out of stock"}</span>
                    </div>
                    {(() => { const b = getPriceBadge(priceStats, s.product_name, s.price); return b ? (
                      <div style={{ marginTop: "8px" }}>
                        <span style={{ background: b.bg, color: b.color, fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>{b.label}</span>
                      </div>
                    ) : null; })()}
                  </div>
                </div>
              ))}
            </div>

            {/* RECOMMENDATIONS */}
            {recommendations.length > 0 && (
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #1e293b" }}>
                <h3 style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: "700", marginBottom: "14px" }}>✨ You might also need...</h3>
                <div style={{ display: "grid", gridTemplateColumns: showMap ? "repeat(3,1fr)" : "repeat(4,1fr)", gap: "12px" }}>
                  {recommendations.map((r, i) => (
                    <div key={i} onClick={() => navigate(`/shop-detail/${r.shop_id}`)}
                      style={{ background: "#161b27", border: "1px solid #1e293b", borderRadius: "10px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.transform = "translateY(0)"; }}>
                      <div style={{ height: "140px", overflow: "hidden" }}>
                        <img src={r.image_url || SHOP_FALLBACK_IMGS[i % SHOP_FALLBACK_IMGS.length]} alt={r.product_name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={e => { e.target.src = SHOP_FALLBACK_IMGS[i % SHOP_FALLBACK_IMGS.length]; }} />
                      </div>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: "600", marginBottom: "2px" }}>{r.product_name}</div>
                        <div style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "4px" }}>{r.shop_name}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#f1f5f9", fontWeight: "700", fontSize: "13px" }}>₹{r.price}</span>
                          <span style={{ color: "#f59e0b", fontSize: "10px" }}>⭐ {Number(r.rating).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MAP PANEL */}
          {showMap && (
            <div style={{ width: "42%", flexShrink: 0, borderLeft: "1px solid #1e293b" }}>
              <MapContainer center={userLocation ? [userLocation.lat, userLocation.lng] : [11.295485, 77.663316]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitBounds shops={filtered} userLocation={userLocation} />
                {userLocation && <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}><Popup>📍 You are here</Popup></Marker>}
                {routeCoords.length > 0 && (
                  <Polyline positions={routeCoords} pathOptions={{ color: "#ff6600", weight: 7, opacity: 1 }} />
                )}
                {filtered.map((s, i) => s.lat && s.lng && (
                  <Marker key={i} position={[s.lat, s.lng]}
                    icon={activeShopId === s.shop_id ? shopIconHighlighted : shopIcon}
                    eventHandlers={{ click: () => handleMarkerClick(s.shop_id) }}>
                    <Popup>
                      <div style={{ minWidth: "150px" }}>
                        <b>{s.shop_name}</b><br />
                        <span style={{ color: "#555" }}>📦 {s.product_name}</span><br />
                        <span style={{ color: "#16a34a", fontWeight: "bold" }}>₹{s.price}</span>
                        &nbsp;&nbsp;<span>⭐ {s.rating}</span><br />
                        <span style={{ color: "#888", fontSize: "12px" }}>📍 {s.distance} km away</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
