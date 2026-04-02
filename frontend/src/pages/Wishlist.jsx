import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Wishlist() {
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => { fetchWishlist(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
      setItems(res.data);
    } catch { showToast("Failed to load wishlist"); }
    finally { setLoading(false); }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/remove/${id}`);
      setItems(items.filter(item => item.id !== id));
      showToast("Removed from wishlist");
    } catch { showToast("Failed to remove item"); }
  };

  const totalValue = items.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "#0f172a", padding: "32px" }}>

      {toast && (
        <div style={{
          position: "fixed", top: "80px", left: "50%", transform: "translateX(-50%)",
          background: "#1e293b", border: "1px solid #334155", color: "#f1f5f9",
          padding: "12px 24px", borderRadius: "10px", zIndex: 9999, fontSize: "14px"
        }}>{toast}</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f1f5f9" }}>❤️ My Wishlist</h1>
          <p style={{ color: "#64748b", marginTop: "6px" }}>Products you've saved for later</p>
        </div>
        {items.length > 0 && (
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "16px 24px", textAlign: "right" }}>
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>Total Value</p>
            <p style={{ color: "#22c55e", fontSize: "24px", fontWeight: "800" }}>₹{totalValue.toFixed(2)}</p>
            <p style={{ color: "#94a3b8", fontSize: "12px" }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px" }}>
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "#64748b" }}>Loading wishlist...</p>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", background: "#1e293b", borderRadius: "20px", border: "1px solid #334155" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>💔</div>
          <h2 style={{ color: "#f1f5f9", fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>Your wishlist is empty</h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Search for products and add them to your wishlist</p>
          <button onClick={() => navigate("/customer")} style={{
            padding: "12px 28px", background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontWeight: "600"
          }}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {items.map(item => (
            <div key={item.id} style={{ background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", overflow: "hidden" }}>
              <div style={{ height: "110px", background: "linear-gradient(135deg, #4c0519, #1e293b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.product_name} style={{ width: "100%", height: "110px", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                  : <span style={{ fontSize: "40px" }}>🛍️</span>
                }
              </div>
              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3 style={{ color: "#f1f5f9", fontSize: "15px", fontWeight: "700" }}>{item.product_name}</h3>
                  {item.category && <span style={{ background: "#1e3a5f", color: "#60a5fa", padding: "2px 7px", borderRadius: "4px", fontSize: "10px" }}>{item.category}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "12px" }}>🏪</span>
                  <span style={{ color: "#94a3b8", fontSize: "13px" }}>{item.shop_name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: "#052e16", color: "#22c55e", padding: "6px 14px", borderRadius: "8px", fontSize: "16px", fontWeight: "800" }}>
                    ₹{item.price}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => navigate(`/shop-detail/${item.shop_id}`)} style={{
                      background: "#334155", border: "none", color: "#94a3b8",
                      padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px"
                    }}>View Shop</button>
                    <button onClick={() => removeItem(item.id)} style={{
                      background: "#450a0a", border: "1px solid #dc2626",
                      color: "#fca5a5", padding: "8px 12px", borderRadius: "8px",
                      cursor: "pointer", fontSize: "12px", fontWeight: "600"
                    }}>🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
