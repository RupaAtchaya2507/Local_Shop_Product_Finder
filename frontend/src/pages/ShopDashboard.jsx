import { useState, useEffect, useRef } from "react";
import axios from "axios";

const CATEGORIES = ["General", "Grocery", "Electronics", "Clothing", "Food", "Medicine", "Stationery"];

function ShopDashboard() {
  const userId = localStorage.getItem("user_id");
  const [tab, setTab] = useState("setup");
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // Setup form
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Add product form
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("General");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("100");
  const [imageUrl, setImageUrl] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  // Messages
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMsg, setReplyMsg] = useState("");
  const msgEndRef = useRef(null);
  const shopRef = useRef(null);

  useEffect(() => { shopRef.current = shop; }, [shop]);
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => { fetchMyShop(); }, []);

  useEffect(() => {
    if (tab === "messages" && shop) {
      fetchConversations(shop.id);
      const id = setInterval(() => fetchConversations(shopRef.current?.id), 3000);
      return () => clearInterval(id);
    }
  }, [tab, shop]); // eslint-disable-line

  useEffect(() => {
    if (!selectedUser || !shop) return;
    const id = setInterval(() => {
      if (shopRef.current) fetchMessages(selectedUser, false, shopRef.current.id);
    }, 3000);
    return () => clearInterval(id);
  }, [selectedUser, shop]); // eslint-disable-line

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchMyShop = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/shop/my-shop", { params: { owner_id: userId } });
      if (res.data) { setShop(res.data); setTab("products"); }
    } catch { /* no shop yet */ }
    finally { setLoading(false); }
  };

  const getLocation = () => {
    if (!navigator.geolocation) { showToast("Geolocation not supported"); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setLocLoading(false); showToast("✅ Location captured!"); },
      () => { showToast("Location access denied"); setLocLoading(false); }
    );
  };

  const saveShop = async () => {
    if (!shopName.trim()) { showToast("Enter shop name"); return; }
    if (!lat || !lng) { showToast("Capture your location first"); return; }
    setSaving(true);
    try {
      await axios.post("http://localhost:5000/api/shop/add", {
        owner_id: userId, shop_name: shopName, address, phone, latitude: lat, longitude: lng, products: []
      });
      showToast("🎉 Shop registered!");
      fetchMyShop();
    } catch { showToast("Error saving shop"); }
    finally { setSaving(false); }
  };

  const addProduct = async () => {
    if (!productName.trim() || !price) { showToast("Fill product name and price"); return; }
    setAddingProduct(true);
    try {
      await axios.post("http://localhost:5000/api/shop/add-product", {
        shop_id: shop.id, product_name: productName, category, price: Number(price), stock: Number(stock), image_url: imageUrl
      });
      showToast("✅ Product added!");
      setProductName(""); setPrice(""); setStock("100"); setImageUrl(""); setCategory("General");
      fetchMyShop();
    } catch { showToast("Error adding product"); }
    finally { setAddingProduct(false); }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await axios.put("http://localhost:5000/api/shop/update-stock", { product_id: productId, stock: Number(newStock) });
      showToast("Stock updated");
      fetchMyShop();
    } catch { showToast("Error updating stock"); }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/shop/delete-product/${productId}`);
      showToast("Product removed");
      fetchMyShop();
    } catch { showToast("Error deleting product"); }
  };

  const fetchConversations = async (shopId) => {
    if (!shopId) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/shop/${shopId}`);
      setConversations(res.data);
    } catch {}
  };

  const fetchMessages = async (custUserId, select = true, shopId) => {
    const sid = shopId ?? shopRef.current?.id;
    if (!sid) return;
    if (select) setSelectedUser(custUserId);
    try {
      const res = await axios.get("http://localhost:5000/api/messages/conversation", { params: { user_id: custUserId, shop_id: sid } });
      setMessages(res.data);
    } catch {}
  };

  const sendReply = async () => {
    if (!replyMsg.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/messages/send", {
        user_id: selectedUser, shop_id: shop.id, sender: "shop", message: replyMsg
      });
      setReplyMsg("");
      fetchMessages(selectedUser, false, shopRef.current?.id);
    } catch { showToast("Failed to send reply"); }
  };

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748b" }}>Loading...</p>
    </div>
  );

  // ── REGISTER SHOP FULL-PAGE ──
  if (!shop) return (
    <div style={{ minHeight: "calc(100vh - 64px)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @keyframes bgPan { 0%,100%{transform:scale(1.07) translateX(0)} 50%{transform:scale(1.07) translateX(-2%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatCard { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        .reg-input:focus { border-color: #22c55e !important; box-shadow: 0 0 0 3px rgba(34,197,94,0.2) !important; outline: none; }
        .reg-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .reg-input::placeholder { color: #6b7280; }
      `}</style>

      {/* BG IMAGE */}
      <img
        src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1800&q=90"
        alt="bg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "bgPan 20s ease-in-out infinite" }}
      />
      {/* OVERLAY */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.52) 0%, rgba(15,23,42,0.42) 50%, rgba(0,20,10,0.55) 100%)" }} />

      {/* LEFT PANEL */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, padding: "60px", maxWidth: "560px", animation: "fadeUp 0.7s 0.2s ease both", opacity: 0, animationFillMode: "forwards" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: "20px", padding: "6px 16px", marginBottom: "24px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span style={{ color: "#86efac", fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>SHOP OWNER PORTAL</span>
        </div>
        <h1 style={{ fontSize: "clamp(36px,4vw,56px)", fontWeight: "900", color: "#fff", lineHeight: 1.1, marginBottom: "20px", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
          List Your Shop<br /><span style={{ color: "#4ade80" }}>on ShopEase</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "16px", lineHeight: 1.8, maxWidth: "420px", marginBottom: "40px" }}>
          Reach thousands of local customers searching for products near them. Register your shop in minutes.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[["🛒", "Get discovered by nearby customers"], ["📦", "List unlimited products with live stock"], ["💬", "Chat directly with your customers"], ["⭐", "Build your reputation with reviews"]].map(([icon, text]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{icon}</div>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: "500" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div style={{ position: "relative", zIndex: 1, width: "440px", flexShrink: 0, margin: "40px", background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", padding: "40px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", animation: "fadeUp 0.7s 0.4s ease both", opacity: 0, animationFillMode: "forwards" }}>
        {/* top accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #22c55e, #16a34a, #4ade80)", borderRadius: "24px 24px 0 0" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🏪</div>
          <div>
            <h2 style={{ color: "#f1f5f9", fontSize: "20px", fontWeight: "800" }}>Register Your Shop</h2>
            <p style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>Fill in your shop details below</p>
          </div>
        </div>

        {[["Shop Name *", shopName, setShopName, "e.g. Fresh Mart", "text"],
          ["Address", address, setAddress, "Street, City", "text"],
          ["Phone Number", phone, setPhone, "+91 9876543210", "text"]
        ].map(([label, val, setter, ph, type]) => (
          <div key={label} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px" }}>{label}</label>
            <input className="reg-input" placeholder={ph} value={val} type={type} onChange={e => setter(e.target.value)}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}

        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "6px" }}>Location *</label>
        <button onClick={getLocation} disabled={locLoading} style={{
          width: "100%", padding: "12px",
          background: lat ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #3b82f6, #2563eb)",
          border: lat ? "1px solid #22c55e" : "none",
          borderRadius: "10px", color: lat ? "#4ade80" : "white",
          cursor: "pointer", fontSize: "14px", fontWeight: "600", marginBottom: "6px"
        }}>
          {locLoading ? "Getting location..." : lat ? "✅ Location Captured" : "📍 Use My Location"}
        </button>
        {lat && <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "12px" }}>{Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}</p>}

        <button onClick={saveShop} disabled={saving} style={{
          width: "100%", padding: "14px", marginTop: "8px",
          background: saving ? "#334155" : "linear-gradient(135deg, #22c55e, #16a34a)",
          border: "none", borderRadius: "12px", color: "white",
          cursor: saving ? "not-allowed" : "pointer", fontSize: "15px", fontWeight: "700",
          boxShadow: saving ? "none" : "0 8px 24px rgba(34,197,94,0.35)",
          transition: "all 0.2s"
        }}>
          {saving ? "Registering..." : "🚀 Register Shop"}
        </button>
      </div>

      {toast && (
        <div style={{
          position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9",
          padding: "12px 24px", borderRadius: "10px", zIndex: 9999, fontSize: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
        }}>{toast}</div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#0f172a", padding: "32px" }}>

      {toast && (
        <div style={{
          position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9",
          padding: "12px 24px", borderRadius: "10px", zIndex: 9999, fontSize: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
        }}>{toast}</div>
      )}

      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f1f5f9" }}>Shop Dashboard</h1>
        {shop && <p style={{ color: "#64748b", marginTop: "4px" }}>Managing: <span style={{ color: "#3b82f6" }}>{shop.name}</span></p>}
      </div>

      {/* TABS */}
      {shop && (
        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "#1e293b", padding: "6px", borderRadius: "12px", border: "1px solid #334155", width: "fit-content" }}>
          {[["products", "📦 Products"], ["add", "➕ Add Product"], ["messages", "💬 Messages"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer",
              background: tab === t ? "#334155" : "transparent",
              color: tab === t ? "#f1f5f9" : "#cbd5e1", fontSize: "14px", fontWeight: "600"
            }}>{label}</button>
          ))}
        </div>
      )}

      {/* SETUP TAB - now handled above as full page */}

      {/* PRODUCTS TAB */}
      {shop && tab === "products" && (
        <div>
          {shop.products?.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", background: "#1e293b", borderRadius: "16px", border: "1px solid #334155" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
              <p style={{ color: "#64748b" }}>No products yet. Add your first product!</p>
              <button onClick={() => setTab("add")} style={{ marginTop: "16px", padding: "10px 24px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "600" }}>
                + Add Product
              </button>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {shop.products?.map(p => (
              <div key={p.id} style={{ background: "#1e293b", borderRadius: "14px", border: "1px solid #334155", overflow: "hidden" }}>
                <div style={{ height: "160px", background: "linear-gradient(135deg, #1e3a5f, #0f172a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {p.image_url ? <img src={p.image_url} alt={p.product_name} style={{ width: "100%", height: "160px", objectFit: "contain", padding: "8px" }} onError={e => { e.target.style.display = "none"; }} /> : <span style={{ fontSize: "36px" }}>📦</span>}
                </div>
                <div style={{ padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <h4 style={{ color: "#f1f5f9", fontSize: "14px", fontWeight: "700" }}>{p.product_name}</h4>
                    <span style={{ background: "#1e3a5f", color: "#60a5fa", padding: "2px 7px", borderRadius: "4px", fontSize: "10px" }}>{p.category}</span>
                  </div>
                  <p style={{ color: "#22c55e", fontSize: "16px", fontWeight: "800", margin: "6px 0" }}>₹{p.price}</p>

                  {/* STOCK UPDATE */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                    <span style={{ color: "#94a3b8", fontSize: "12px" }}>Stock:</span>
                    <input
                      type="number" defaultValue={p.stock} min="0"
                      onBlur={e => { if (Number(e.target.value) !== p.stock) updateStock(p.id, e.target.value); }}
                      style={{ width: "70px", padding: "5px 8px", background: "#0f172a", border: "1px solid #334155", borderRadius: "6px", color: "#f1f5f9", fontSize: "13px", outline: "none" }}
                    />
                    <span style={{ color: p.stock > 10 ? "#22c55e" : p.stock > 0 ? "#f59e0b" : "#ef4444", fontSize: "11px" }}>
                      {p.stock > 0 ? "In Stock" : "Out"}
                    </span>
                  </div>

                  <button onClick={() => deleteProduct(p.id)} style={{
                    marginTop: "10px", width: "100%", padding: "7px",
                    background: "#450a0a", border: "1px solid #dc2626",
                    color: "#fca5a5", borderRadius: "7px", cursor: "pointer", fontSize: "12px"
                  }}>🗑️ Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD PRODUCT TAB */}
      {shop && tab === "add" && (
        <div style={{ maxWidth: "520px", background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", padding: "32px" }}>
          <h3 style={{ color: "#f1f5f9", fontSize: "18px", fontWeight: "700", marginBottom: "24px" }}>➕ Add New Product</h3>

          <label style={labelStyle}>Product Name *</label>
          <input placeholder="e.g. Basmati Rice 1kg" value={productName} onChange={e => setProductName(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Price (₹) *</label>
              <input placeholder="0.00" type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Stock</label>
              <input placeholder="100" type="number" value={stock} onChange={e => setStock(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>Image URL (optional)</label>
          <input placeholder="https://example.com/image.jpg" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
          {imageUrl && (
            <img src={imageUrl} alt="preview" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }}
              onError={e => { e.target.style.display = "none"; }} />
          )}

          <button onClick={addProduct} disabled={addingProduct} style={{
            width: "100%", padding: "14px", marginTop: "20px",
            background: addingProduct ? "#334155" : "linear-gradient(135deg, #3b82f6, #2563eb)",
            border: "none", borderRadius: "10px", color: "white",
            cursor: addingProduct ? "not-allowed" : "pointer", fontSize: "15px", fontWeight: "700"
          }}>
            {addingProduct ? "Adding..." : "➕ Add Product"}
          </button>
        </div>
      )}

      {/* MESSAGES TAB */}
      {shop && tab === "messages" && (
        <div style={{ display: "flex", gap: "20px", height: "500px" }}>
          {/* CONVERSATIONS LIST */}
          <div style={{ width: "260px", background: "#1e293b", borderRadius: "14px", border: "1px solid #334155", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #334155" }}>
              <h3 style={{ color: "#f1f5f9", fontSize: "14px", fontWeight: "700" }}>Conversations</h3>
            </div>
            <div style={{ overflowY: "auto", height: "calc(100% - 53px)" }}>
              {conversations.length === 0 && <p style={{ color: "#64748b", padding: "20px", fontSize: "13px" }}>No messages yet</p>}
              {conversations.map(c => (
                <div key={c.user_id} onClick={() => fetchMessages(c.user_id, true, shopRef.current?.id)} style={{
                  padding: "14px 20px", cursor: "pointer", borderBottom: "1px solid #1e293b",
                  background: selectedUser === c.user_id ? "#334155" : "transparent"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "13px" }}>
                      {c.customer_name?.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ color: "#f1f5f9", fontSize: "13px", fontWeight: "600" }}>{c.customer_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div style={{ flex: 1, background: "#1e293b", borderRadius: "14px", border: "1px solid #334155", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {!selectedUser ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#64748b" }}>Select a conversation</p>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ display: "flex", justifyContent: m.sender === "shop" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "70%", padding: "10px 14px", borderRadius: "12px",
                        background: m.sender === "shop" ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "#334155",
                        color: "#f1f5f9", fontSize: "14px"
                      }}>
                        <p>{m.message}</p>
                        <p style={{ color: m.sender === "shop" ? "#bfdbfe" : "#64748b", fontSize: "10px", marginTop: "4px", textAlign: "right" }}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={msgEndRef} />
                </div>
                <div style={{ padding: "16px 20px", borderTop: "1px solid #334155", display: "flex", gap: "10px" }}>
                  <input
                    placeholder="Type a reply..."
                    value={replyMsg}
                    onChange={e => setReplyMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendReply()}
                    style={{ flex: 1, padding: "12px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", outline: "none" }}
                  />
                  <button onClick={sendReply} style={{ padding: "12px 20px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                    Reply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "12px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px", marginTop: "16px" };
const inputStyle = { width: "100%", padding: "12px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", outline: "none", marginBottom: "4px" };

export default ShopDashboard;
