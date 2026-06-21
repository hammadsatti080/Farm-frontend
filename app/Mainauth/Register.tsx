"use client";

import { useState } from "react";
import "./Auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerAdmin = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://farm-backend-lac.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Admin Registered Successfully!");
        setUsername("");
        setPassword("");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Register</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={registerAdmin} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}