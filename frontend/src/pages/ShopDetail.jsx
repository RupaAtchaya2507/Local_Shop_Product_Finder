import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CATEGORY_IMAGES = {
  Grocery:     "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80",
  Medicine:    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80",
  Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80",
  Food:        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80",
  Clothing:    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80",
  Stationery:  "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=300&q=80",
  General:     "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300&q=80",
};

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onChange(s)} style={{
          fontSize: "28px", cursor: "pointer",
          color: s <= value ? "#f59e0b" : "#334155",
          transition: "color 0.15s"
        }}>★</span>
      ))}
    </div>
  );
}

function StarDisplay({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#f59e0b" : "#334155", fontSize: "14px" }}>★</span>
      ))}
      <span style={{ color: "#64748b", fontSize: "12px", marginLeft: "4px" }}>{Number(rating).toFixed(1)}</span>
    </span>
  );
}

function ShopDetail() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("user_id"));

  const [shop, setShop] = useState(null);
  const [tab, setTab] = useState("products");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const msgEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => { fetchShop(); }, [shopId]);

  useEffect(() => {
    if (tab === "chat") {
      fetchMessages();
      pollRef.current = setInterval(fetchMessages, 3000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [tab]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchShop = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/shop/${shopId}`);
      setShop(res.data);
    } catch { showToast("Failed to load shop"); }
    finally { setLoading(false); }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages/conversation", {
        params: { user_id: userId, shop_id: shopId }
      });
      setMessages(res.data);
    } catch {}
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      await axios.post("http://localhost:5000/api/messages/send", {
        user_id: userId, shop_id: parseInt(shopId), sender: "customer", message: newMsg.trim()
      });
      setNewMsg("");
      fetchMessages();
    } catch { showToast("Failed to send message"); }
    finally { setSending(false); }
  };

  const submitRating = async () => {
    if (!myRating) { showToast("Please select a star rating first"); return; }
    const userId = parseInt(localStorage.getItem("user_id"));
    if (!userId || isNaN(userId)) { showToast("Please log in to submit a rating"); return; }
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/ratings/shop/${shopId}`, {
        user_id: userId, rating: myRating, review: myReview.trim()
      });
      showToast("✅ Rating submitted successfully!");
      setMyRating(0); setMyReview("");
      fetchShop();
    } catch (err) {
      showToast("Failed to submit rating. Try again.");
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748b" }}>Loading shop...</p>
    </div>
  );

  if (!shop) return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748b" }}>Shop not found</p>
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "#0a0f1a", padding: "28px 36px", fontFamily: "'Poppins', sans-serif" }}>

      {toast && (
        <div style={{
          position: "fixed", top: "76px", left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9",
          padding: "12px 24px", borderRadius: "10px", zIndex: 9999, fontSize: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
        }}>{toast}</div>
      )}

      {/* BACK */}
      <button onClick={() => navigate("/customer")} style={{
        background: "transparent", border: "1px solid #1e293b", color: "#64748b",
        padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px",
        marginBottom: "24px", transition: "all 0.2s"
      }}>← Back to Search</button>

      {/* SHOP HEADER */}
      <div style={{ background: "#0d1420", borderRadius: "16px", border: "1px solid #1a2535", padding: "28px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "16px",
              background: "linear-gradient(135deg, #0d9488, #0f766e)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px",
              flexShrink: 0
            }}>🏪</div>
            <div>
              <h1 style={{ color: "#f1f5f9", fontSize: "24px", fontWeight: "800", fontFamily: "'Georgia', serif" }}>{shop.name}</h1>
              <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>📍 {shop.address || "Address not provided"}</p>
              {shop.phone && <p style={{ color: "#64748b", fontSize: "14px", marginTop: "2px" }}>📞 {shop.phone}</p>}
              <div style={{ marginTop: "8px" }}><StarDisplay rating={shop.rating || 0} /></div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              [Number(shop.rating || 0).toFixed(1), "Rating",   "#f59e0b"],
              [shop.products?.length || 0,           "Products", "#0d9488"],
              [shop.ratings?.length || 0,            "Reviews",  "#22c55e"],
            ].map(([val, label, color]) => (
              <div key={label} style={{ background: "#111827", borderRadius: "12px", padding: "16px 20px", textAlign: "center", border: "1px solid #1a2535" }}>
                <p style={{ color, fontSize: "22px", fontWeight: "800" }}>{val}</p>
                <p style={{ color: "#64748b", fontSize: "12px" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "#0d1420", padding: "5px", borderRadius: "12px", border: "1px solid #1a2535", width: "fit-content" }}>
        {[["products", "Products"], ["reviews", "Reviews"], ["chat", "Chat"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "9px 22px", borderRadius: "8px", border: "none", cursor: "pointer",
            background: tab === t ? "linear-gradient(135deg,#0d9488,#0f766e)" : "transparent",
            color: tab === t ? "white" : "#64748b", fontSize: "13px", fontWeight: "600",
            transition: "all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {shop.products?.length === 0 && <p style={{ color: "#64748b" }}>No products listed</p>}
          {shop.products?.map(p => (
            <div key={p.id} style={{ background: "#0d1420", borderRadius: "14px", border: "1px solid #1a2535", overflow: "hidden", transition: "transform 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#0d9488"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#1a2535"; }}
            >
              <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
                <img
                  src={p.image_url || CATEGORY_IMAGES[p.category] || CATEGORY_IMAGES.General}
                  alt={p.product_name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.src = CATEGORY_IMAGES.General; }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
                <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(13,148,136,0.85)", color: "white", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px" }}>{p.category}</span>
              </div>
              <div style={{ padding: "12px" }}>
                <h4 style={{ color: "#f1f5f9", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>{p.product_name}</h4>
                <p style={{ color: "#0d9488", fontSize: "16px", fontWeight: "800", margin: "4px 0" }}>₹{p.price}</p>
                <p style={{ color: p.stock > 10 ? "#22c55e" : p.stock > 0 ? "#f59e0b" : "#ef4444", fontSize: "11px" }}>
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── REVIEWS TAB ── */}
      {tab === "reviews" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* SUBMIT */}
          <div style={{ background: "#0d1420", borderRadius: "16px", border: "1px solid #1a2535", padding: "24px" }}>
            <h3 style={{ color: "#f1f5f9", fontSize: "16px", fontWeight: "700", marginBottom: "20px", fontFamily: "'Georgia', serif" }}>Rate this Shop</h3>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "10px" }}>Your Rating *</p>
            <StarPicker value={myRating} onChange={setMyRating} />
            {myRating > 0 && <p style={{ color: "#0d9488", fontSize: "12px", marginTop: "6px" }}>You selected {myRating} star{myRating > 1 ? "s" : ""}</p>}
            <textarea
              placeholder="Write your review (optional)..."
              value={myReview}
              onChange={e => setMyReview(e.target.value)}
              rows={4}
              style={{
                width: "100%", marginTop: "16px", padding: "12px", background: "#111827",
                border: "1px solid #1a2535", borderRadius: "10px", color: "#f1f5f9",
                fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box"
              }}
            />
            <button onClick={submitRating} disabled={submitting} style={{
              marginTop: "16px", width: "100%", padding: "12px",
              background: submitting ? "#334155" : "linear-gradient(135deg, #0d9488, #0f766e)",
              border: "none", borderRadius: "10px", color: "white",
              cursor: submitting ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "700",
              transition: "opacity 0.2s"
            }}>{submitting ? "Submitting..." : "Submit Rating ⭐"}</button>
          </div>

          {/* REVIEWS LIST */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
            {(!shop.ratings || shop.ratings.length === 0) && (
              <div style={{ background: "#0d1420", borderRadius: "16px", border: "1px solid #1a2535", padding: "40px", textAlign: "center" }}>
                <p style={{ color: "#94a3b8" }}>No reviews yet. Be the first!</p>
              </div>
            )}
            {shop.ratings?.map(r => (
              <div key={r.id} style={{ background: "#0d1420", borderRadius: "12px", border: "1px solid #1a2535", padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "34px", height: "34px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #0d9488, #0f766e)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: "700", fontSize: "13px"
                    }}>{r.reviewer_name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={{ color: "#f1f5f9", fontSize: "13px", fontWeight: "600" }}>{r.reviewer_name}</p>
                      <p style={{ color: "#94a3b8", fontSize: "11px" }}>{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarDisplay rating={r.rating} />
                </div>
                {r.review && <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "1.6" }}>{r.review}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {tab === "chat" && (
        <div style={{ background: "#0d1420", borderRadius: "16px", border: "1px solid #1a2535", overflow: "hidden", maxWidth: "700px" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a2535", background: "#111827", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <h3 style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: "700" }}>Chat with {shop.name}</h3>
          </div>
          <div style={{ height: "380px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", background: "#0a0f1a" }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", margin: "auto" }}>
                <p style={{ color: "#64748b", fontSize: "14px" }}>No messages yet. Start the conversation!</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: m.sender === "customer" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "70%", padding: "10px 14px", borderRadius: "12px",
                  background: m.sender === "customer" ? "linear-gradient(135deg, #0d9488, #0f766e)" : "#1a2535",
                  color: "#f1f5f9", fontSize: "14px"
                }}>
                  <p>{m.message}</p>
                  <p style={{ color: m.sender === "customer" ? "rgba(255,255,255,0.6)" : "#64748b", fontSize: "10px", marginTop: "4px", textAlign: "right" }}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={msgEndRef} />
          </div>
          <div style={{ padding: "14px 16px", borderTop: "1px solid #1a2535", display: "flex", gap: "10px", background: "#0d1420" }}>
            <input
              placeholder="Type a message..."
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              style={{ flex: 1, padding: "11px 16px", background: "#111827", border: "1px solid #1a2535", borderRadius: "10px", color: "#f1f5f9", fontSize: "14px", outline: "none" }}
            />
            <button onClick={sendMessage} disabled={sending} style={{
              padding: "11px 20px", background: sending ? "#334155" : "linear-gradient(135deg, #0d9488, #0f766e)",
              border: "none", borderRadius: "10px", color: "white",
              cursor: sending ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "600"
            }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopDetail;
