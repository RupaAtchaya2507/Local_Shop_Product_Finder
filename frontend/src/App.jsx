import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShopDashboard from "./pages/ShopDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Wishlist from "./pages/Wishlist";
import ShopDetail from "./pages/ShopDetail";

const NO_NAVBAR = ["/", "/login", "/signup"];

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = NO_NAVBAR.includes(location.pathname);
  const isCustomer = location.pathname === "/customer";

  const [navSearch, setNavSearch] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(0);
  const [viewMode, setViewMode] = useState("list");

  const handleNavSearch = () => {
    if (location.pathname !== "/customer") navigate("/customer");
    setTriggerSearch(t => t + 1);
  };

  return (
    <>
      {!hideNavbar && (
        <Navbar
          search={isCustomer ? navSearch : undefined}
          setSearch={isCustomer ? setNavSearch : undefined}
          onSearch={handleNavSearch}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      )}
      <div style={{ width: "100%", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop" element={<ShopDashboard />} />
          <Route path="/customer" element={
            <CustomerDashboard
              navSearch={navSearch}
              setNavSearch={setNavSearch}
              triggerSearch={triggerSearch}
              viewMode={viewMode}
            />
          } />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/shop-detail/:shopId" element={<ShopDetail />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
