"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* Images */
const images = ["./Farms.jpeg", "./cow1.avif"];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();
  const handlegobutton = () => {
    router.push("/Contact")
  }

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
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "8%",
          paddingRight: "8%",
          color: "white",
          zIndex: 2,
        }}
      >
        <div
          style={{
            maxWidth: "650px",
            animation: "fadeInUp 1.2s ease",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 18px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "30px",
              marginBottom: "20px",
              fontSize: "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Welcome to Our Farm
          </span>

          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 72px)",
              fontWeight: "700",
              lineHeight: "1.1",
              marginBottom: "20px",
            }}
          >
            Farm House
          </h1>

          <p
            style={{
              fontSize: "24px",
              fontWeight: "500",
              marginBottom: "15px",
              color: "#f5f5f5",
            }}
          >
            Fresh & Natural Farming Experience
          </p>

          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              opacity: 0.9,
              marginBottom: "35px",
            }}
          >
            Experience the beauty of nature and sustainable farming. Enjoy
            fresh organic  products, healthy livestock, and a peaceful rural
            environment where quality, care, and tradition come together.
            From farm-fresh produce to unforgettable countryside experiences,
            we bring nature closer to you.
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >

            <button
              style={{
                padding: "14px 32px",
                background: "transparent",
                color: "white",
                border: "2px solid white",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
              onClick={handlegobutton}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        button:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          div[style*="padding-left: 8%"] {
            justify-content: center !important;
            text-align: center;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}