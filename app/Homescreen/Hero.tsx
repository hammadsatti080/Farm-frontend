"use client";

import { useEffect, useState } from "react";

/* ✅ Move outside component (IMPORTANT FIX) */
const images = ["./cow.avif", "./cow1.avif"];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);

      return () => clearTimeout(timeout);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${images[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.8s ease-in-out",
          opacity: fade ? 1 : 0,
          transform: "scale(1.05)",
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          color: "white",
          textAlign: "center",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            animation: "slideUp 1s ease-in-out",
          }}
        >
          Farm House
        </h1>

        <p
          style={{
            fontSize: "18px",
            marginTop: "10px",
            opacity: 0.9,
          }}
        >
          Fresh & Natural Farming Experience
        </p>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}