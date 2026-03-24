import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        height: "60px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        marginBottom: "20px"
      }}
    >
      {/* Logo / Title */}
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#111"
        }}
      >
        Local Shop Finder
      </h2>

      {/* Navigation Links */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center"
        }}
      >
        <Link
          to="/customer"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500"
          }}
        >
          Home
        </Link>

        <Link
          to="/wishlist"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500"
          }}
        >
          Wishlist
        </Link>

        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#333",
            fontWeight: "500"
          }}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Navbar;