import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const navigate = useNavigate();

  const signup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        user_type: userType
      });

      alert("Signup successful");
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        width: "350px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#111"
        }}>
          Signup
        </h1>

        {/* NAME */}
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #d1d5db"
          }}
        />

        {/* EMAIL */}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #d1d5db"
          }}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #d1d5db"
          }}
        />

        {/* USER TYPE */}
        <select
          value={userType}
          onChange={e => setUserType(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #d1d5db"
          }}
        >
          <option value="customer">Customer</option>
          <option value="shop_owner">Shop Owner</option>
        </select>

        {/* BUTTON */}
        <button
          onClick={signup}
          style={{
            width: "100%",
            padding: "12px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Signup
        </button>

        {/* LOGIN LINK */}
        <p style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px"
        }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#4CAF50" }}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;