import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShopDashboard from "./pages/ShopDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Wishlist from "./pages/Wishlist";

/* ===== LAYOUT COMPONENT ===== */
function Layout() {
  const location = useLocation();

  // Hide navbar on login & signup
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div style={{ width: "100%", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop" element={<ShopDashboard />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
    </>
  );
}

/* ===== APP ===== */
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;