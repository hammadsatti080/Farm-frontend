"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";
import { useRouter } from "next/navigation";
import { FaXmark, FaBars, FaHouse, FaCircleInfo } from "react-icons/fa6";
import { GiBarn } from "react-icons/gi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { name: "Home", href: "/", icon: FaHouse },
    { name: "About", href: "/abouts", icon: FaCircleInfo },
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
          <GiBarn size={20} />
          <span>Farm House</span>
        </Link>

        {/* DESKTOP */}
        <div className="desktop-wrapper">
          <div className="nav-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.name} href={link.href} className="nav-link">
                  <Icon size={16} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
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
          {isOpen ? <FaXmark size={22} /> : <FaBars size={22} />}
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
                <FaXmark size={20} />
              </button>
            </div>

            <div className="mobile-menu-links">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="mobile-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
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