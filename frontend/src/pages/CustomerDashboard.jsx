import { useState, useEffect } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===== FIX LEAFLET ICON ISSUE ===== */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== USER MARKER ===== */
const userIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

/* ===== RECENTER MAP ===== */
function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 14);
    }
  }, [location]);

  return null;
}

function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const [shops, setShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  /* ===== FILTER STATES ===== */
  const [maxDistance, setMaxDistance] = useState(10);
  const [maxPrice, setMaxPrice] = useState(1000);

  /* ===== LIVE LOCATION ===== */
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
        alert("Location access failed");
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ===== SEARCH ===== */
  const searchProduct = async () => {
    console.log("Search clicked");

    if (!userLocation) {
      alert("Location not ready");
      return;
    }

    if (!search.trim()) {
      alert("Enter product name");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/customer/search",
        {
          params: {
            product: search,
            lat: userLocation.lat,
            lng: userLocation.lng,
          },
        }
      );

      console.log("API DATA:", res.data);

      // 🔥 Normalize data (NO backend change needed)
      const formatted = res.data.map((s) => ({
        ...s,
        lat: Number(s.lat || s.latitude),
        lng: Number(s.lng || s.longitude),
        price: Number(s.price || s.cost || 0),
        distance: s.distance ? Number(s.distance) : null,
      }));

      setShops(formatted);

    } catch (err) {
      console.log(err);
      alert("Search failed");
    }
  };

  /* ===== ADD TO WISHLIST ===== */
  const addToWishlist = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/wishlist/add",
        {
          user_id: 1,
          product_id: productId,
        }
      );

      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Error adding to wishlist");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* ===== FILTER PANEL ===== */}
      <div style={{
        width: "250px",
        background: "#0f172a",
        color: "white",
        padding: "20px"
      }}>
        <h3>Filters</h3>

        <p style={{ marginTop: "20px" }}>Max Distance (km)</p>
        <input
          type="range"
          min="1"
          max="20"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
        />
        <p>{maxDistance} km</p>

        <p style={{ marginTop: "20px" }}>Max Price (₹)</p>
        <input
          type="range"
          min="50"
          max="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
        <p>₹{maxPrice}</p>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>

        {/* SEARCH BAR */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px"
        }}>
          <input
            placeholder="Find your product here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={searchProduct}
            disabled={!userLocation}
            style={{
              padding: "10px 20px",
              background: "#22c55e",
              border: "none",
              color: "white",
              borderRadius: "10px",
              cursor: userLocation ? "pointer" : "not-allowed"
            }}
          >
            Search
          </button>
        </div>

        {/* NO RESULTS */}
        {shops.length === 0 && (
          <p>No shops found</p>
        )}

        <div style={{ display: "flex", gap: "20px" }}>

          {/* SHOP CARDS */}
          <div style={{
            width: "55%",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "15px"
          }}>

            {shops
              .filter(s =>
                (!s.distance || s.distance <= maxDistance) &&
                s.price <= maxPrice
              )
              .map((s, i) => (

                <div key={i} style={{
                  background: "#fff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}>

                  <img
                    src="https://source.unsplash.com/300x200/?shop,store"
                    alt="shop"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover"
                    }}
                  />

                  <div style={{ padding: "12px" }}>
                    <h4>{s.name}</h4>
                    <p>{s.product_name}</p>
                    <p>₹{s.price}</p>

                    <p style={{ color: "#f59e0b" }}>
                      ⭐ {(Math.random() * 2 + 3).toFixed(1)}
                    </p>

                    <p>
                      📍 {s.distance ? s.distance.toFixed(2) : "Nearby"} km
                    </p>

                    <button
                      onClick={() => addToWishlist(s.product_id)}
                      style={{
                        background: "#38bdf8",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        color: "white",
                        cursor: "pointer"
                      }}
                    >
                      ❤️ Add to Wishlist
                    </button>
                  </div>
                </div>

              ))}

          </div>

          {/* MAP */}
          <div style={{ width: "45%" }}>

            <MapContainer
              center={
                userLocation
                  ? [userLocation.lat, userLocation.lng]
                  : [13.0827, 80.2707]
              }
              zoom={13}
              style={{
                height: "500px",
                width: "100%",
                borderRadius: "10px"
              }}
            >

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {userLocation && <RecenterMap location={userLocation} />}

              {/* USER */}
              {userLocation && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={userIcon}
                >
                  <Popup>You are here</Popup>
                </Marker>
              )}

              {/* SHOPS */}
              {shops.map((s, i) =>
                s.lat && s.lng && (
                  <Marker key={i} position={[s.lat, s.lng]}>
                    <Popup>
                      <b>{s.name}</b><br />
                      {s.product_name}<br />
                      ₹{s.price}
                    </Popup>
                  </Marker>
                )
              )}

            </MapContainer>

          </div>

        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;