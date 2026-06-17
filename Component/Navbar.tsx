"use client";

import { useState } from "react";
import Link from "next/link";
import "./Navbar.css";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/abouts" },
      
    ];
     const router = useRouter();

  const handlebuttons = () => {
    router.push("/Auth"); // change route here
  };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-inner">

                    {/* LOGO */}
                  <Link href="/" className="logo">
  <Home size={20} style={{ marginRight: "8px" }} />
  Farm House
</Link>

                    {/* DESKTOP */}
                    <div className="desktop-wrapper">
                        <div className="nav-links">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="nav-link">
                                    <span className="nav-text">{link.name}</span>
                                </Link>
                            ))}
                        </div>

                        <button className="nav-button" onClick={handlebuttons}>
                            Get Started
                        </button>
                    </div>

                    {/* MOBILE BUTTON */}
                    <button
                        className="mobile-btn"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* MOBILE MENU */}
                {isOpen && (
                    <div className="mobile-menu">
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

                        <button className="nav-button" onClick={handlebuttons}>
                            Get Started
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}