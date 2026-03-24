import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      if (res.data.user_type === "shop_owner") {
        navigate("/shop");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div style={{
      height: "100vh",
      background: "#e5e5e5", // ✔ light grey like image
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>

      {/* LOGO */}
      <h1 style={{
        fontFamily: "cursive",
        fontSize: "48px",
        marginBottom: "10px",
        color: "#000"
      }}>
        ShopEase
      </h1>

      <h2 style={{
        marginBottom: "30px",
        fontWeight: "500",
        color: "#111"
      }}>
        Login To Your Shop Account
      </h2>

      {/* FORM */}
      <div style={{
        width: "350px",
        display: "flex",
        flexDirection: "column",
        gap: "18px"
      }}>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={login} style={btnStyle}>
          Login
        </button>

        <p style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#000"
        }}>
          Create an Account
        </p>

        <Link to="/signup" style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#000",
          textDecoration: "none"
        }}>
          Sign Up
        </Link>

      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const inputStyle = {
  padding: "14px",
  borderRadius: "2px",
  border: "none",
  background: "#000",
  color: "#fff",
  outline: "none",
  fontSize: "14px"
};

const btnStyle = {
  padding: "12px",
  borderRadius: "20px",
  border: "none",
  background: "#000",
  color: "#fff",
  cursor: "pointer",
  fontSize: "16px"
};

export default Login;