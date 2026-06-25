"use client";

import { CSSProperties } from "react";
import Aboutheader from "./Aboutheader";

export default function Aboutsec() {
  return (
    <div style={pageStyle}>
      {/* CONTENT */}    
          <Aboutheader />

      {/* STATS */}
      <div style={gridStyle}>
        <Card number="2+" text="Years Experience" delay="0s" />
        <Card number="200+" text="Happy Visitors" delay="0.2s" />
        <Card number="10+" text="Expert Team" delay="0.4s" />
        <Card number="20+" text="Farm Animals" delay="0.6s" />
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ================= CARD ================= */
function Card({
  number,
  text,
  delay,
}: {
  number: string;
  text: string;
  delay: string;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        animation: "float 3s ease-in-out infinite",
        animationDelay: delay,
      }}
    >
      <h2 style={numberStyle}>{number}</h2>
      <p style={cardTextStyle}>{text}</p>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle: CSSProperties = {
  minHeight: "50vh",
  padding: "70px 20px",
  color: "#0f172a",
  background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)", // light blue mix
};

const gridStyle: CSSProperties = {
  maxWidth: "1000px",
  margin: "60px auto 0",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
};

const cardStyle: CSSProperties = {
  background: "#ffffff",
  padding: "28px",
  borderRadius: "16px",
  textAlign: "center",
  border: "1px solid #bfdbfe",
  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.12)",
  cursor: "pointer",
  transition: "0.3s ease",
};

const numberStyle: CSSProperties = {
  fontSize: "34px",
  fontWeight: "bold",
  color: "#2563eb", // blue
};

const cardTextStyle: CSSProperties = {
  color: "#475569",
  marginTop: "6px",
};