"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";
import { Home, X, Menu } from "lucide-react";
import { useRouter,  } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/abouts" },
  ];

  

  // ✅ lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link href="/" className="logo">
          <Home size={18} />
          <span>Farm House</span>
        </Link>

        {/* DESKTOP */}
        <div className="desktop-wrapper">
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="nav-link">
                {link.name}
              </Link>
            ))}
          </div>

          <button
            className="nav-button"
            onClick={() => router.push("/Auth")}
          >
            Get Started
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="mobile-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* MOBILE MENU MODAL */}
      {isOpen && (
        <div className="mobile-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="mobile-menu-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">Menu</span>
              <button
                className="mobile-menu-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-menu-links">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <button
              className="nav-button mobile"
              onClick={() => {
                setIsOpen(false);
                router.push("/Auth");
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}