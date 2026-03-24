import { useState, useEffect } from "react";
import axios from "axios";

function ShopDashboard() {

  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const [products, setProducts] = useState([]);

  const [shopExists, setShopExists] = useState(false);

  /* ===== CHECK IF SHOP EXISTS ===== */
  useEffect(() => {
    checkShop();
  }, []);

  const checkShop = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/shop/my-shop",
        {
          params: { user_id: 1 } // ⚠️ replace later with logged user
        }
      );

      if (res.data) {
        setShopExists(true);
      }

    } catch (err) {
      console.log(err);
    }
  };

  /* ===== GET LOCATION ===== */
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          alert("Location captured successfully");
        },
        () => {
          alert("Location access denied");
        }
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  /* ===== ADD PRODUCT ===== */
  const addProduct = () => {
    if (productName.trim() === "" || price.trim() === "") return;

    setProducts([
      ...products,
      { name: productName, price: price }
    ]);

    setProductName("");
    setPrice("");
  };

  /* ===== SAVE SHOP ===== */
  const saveShop = async () => {
    try {
      await axios.post("http://localhost:5000/api/shop/add", {
        shop_name: shopName,
        address: address,
        latitude: lat,
        longitude: lng,
        products: products
      });

      alert("Shop saved successfully");

      setShopExists(true); // 🔥 hide form after saving

    } catch (err) {
      console.log(err);
      alert("Error saving shop");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: "20px"
    }}>

      <h1 style={{
        textAlign: "center",
        marginBottom: "30px",
        fontWeight: "600",
        color: "#111"
      }}>
        Shop Owner Dashboard
      </h1>

      <div style={{
        display: "flex",
        gap: "25px",
        alignItems: "flex-start"
      }}>

        {/* ===== SHOP DETAILS (HIDDEN IF EXISTS) ===== */}
        {!shopExists && (
          <div style={{
            width: "40%",
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}>

            <h3 style={{ marginBottom: "15px" }}>Shop Details</h3>

            <input
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Shop Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
            />

            <button onClick={getLocation} style={btnStyle}>
              Use My Location 📍
            </button>

            <p style={{ marginTop: "10px" }}>Latitude: {lat}</p>
            <p>Longitude: {lng}</p>

            <button onClick={saveShop} style={{
              ...btnStyle,
              background: "#4CAF50",
              marginTop: "15px"
            }}>
              Save Shop
            </button>

          </div>
        )}

        {/* ===== MESSAGE IF SHOP EXISTS ===== */}
        {shopExists && (
          <div style={{
            width: "40%",
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ color: "green" }}>
              Shop already registered ✅
            </h3>
          </div>
        )}

        {/* ===== PRODUCTS SECTION ===== */}
        <div style={{
          width: "60%",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
        }}>

          <h3 style={{ marginBottom: "15px" }}>Add Products</h3>

          <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px"
          }}>
            <input
              placeholder="Product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={{ ...inputStyle, marginBottom: "0" }}
            />

            <input
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{ ...inputStyle, marginBottom: "0" }}
            />

            <button onClick={addProduct} style={{
              ...btnStyle,
              background: "#4CAF50"
            }}>
              Add
            </button>
          </div>

          <div style={{
            maxHeight: "350px",
            overflowY: "auto"
          }}>
            {products.length === 0 && <p>No products added</p>}

            {products.map((p, i) => (
              <div key={i} style={{
                padding: "12px",
                marginBottom: "10px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: "#fafafa"
              }}>
                <strong>{p.name}</strong> - ₹{p.price}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}

/* ===== COMMON STYLES ===== */
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none"
};

const btnStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer"
};

export default ShopDashboard;