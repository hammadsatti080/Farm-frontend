"use client";

import { CSSProperties } from "react";

export default function About() {
  return (
    <div
      style={{
        minHeight: "50vh",
        background: "linear-gradient(135deg, #16a34a, #22c55e)",
        padding: "60px 20px",
        color: "white",
      }}
    >
      {/* CONTENT */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "45px", fontWeight: "bold" }}>
          About Our Farm
        </h1>

        <p style={{ fontSize: "18px", lineHeight: "1.7", opacity: 0.95 }}>
         Our farm has over <b>20+ years of experience</b> in agriculture and livestock management. We are proud to be one of the most trusted and top-rated farms in the region, delivering fresh, natural, and high-quality products. Our mission is to promote healthy farming and sustainable agriculture for future generations.
        </p>
      </div>

      {/* STATS */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "60px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        <Card number="20+" text="Years Experience" delay="0s" />
        <Card number="50K+" text="Happy Visitors" delay="0.2s" />
        <Card number="100+" text="Expert Team" delay="0.4s" />
        <Card number="200+" text="Farm Animals" delay="0.6s" />
      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* CARD */
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
      <p style={{ opacity: 0.9 }}>{text}</p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.18)",
  padding: "28px",
  borderRadius: "18px",
  textAlign: "center",
  backdropFilter: "blur(12px)",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
  border: "1px solid rgba(255,255,255,0.25)",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const numberStyle: CSSProperties = {
  fontSize: "34px",
  fontWeight: "bold",
};