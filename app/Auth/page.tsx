"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css"
import toast from "react-hot-toast";
const Page = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin", JSON.stringify(data.admin));

        toast.success("Login Successful 🎉");

        setTimeout(() => {
          router.push("/Dashboard");
        }, 1200);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-card" >

        <h2 className="login-title">
          <span className="title-icon">🔐</span>
          Admin Login
        </h2>

        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
};

export default Page;