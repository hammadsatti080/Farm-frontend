"use client";

import { useState } from "react";
import "./dashboard.css";
import Catagory from "../CategoryManagers/Catagory";
import MainMilk from "../Milkmanagement/MainMilk";
import MilkDashboard from "../AdminDashboard/MilkDashboard";
import Mainfile from "../MilkSale/Mainfile";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("");

  const links = [
    { id: "overview", label: "Overview" },
    { id: "Milk", label: "Milk" },
    { id: "Sale", label: "Sale" },
    { id: "reviews", label: "Reviews" },
  ];

  const handleChange = (id: string) => {
    setActiveTab(id);
    setSelectedSetting("");
    setShowMobileMenu(false);
  };

  return (
    <div className="dashboard-container">
      {/* ================= MOBILE TOP NAVBAR ================= */}
      <div className="mobile-navbar">
        <h3>Admin Panel</h3>

        <button
          className="mobile-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          ☰
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {showMobileMenu && (
        <div className="mobile-menu">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleChange(link.id)}
              className={activeTab === link.id ? "active-mobile" : ""}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="active-mobile"
          >
            Settings {showSettings ? "▲" : "▼"}
          </button>

          {showSettings && (
            <div className="mobile-submenu">
              <button onClick={() => setSelectedSetting("category")}>
                Category
              </button>
              <button onClick={() => setSelectedSetting("profile")}>
                Profile
              </button>
              <button onClick={() => setSelectedSetting("account")}>
                Account
              </button>
              <button onClick={() => setSelectedSetting("notifications")}>
                Notifications
              </button>
              <button onClick={() => setSelectedSetting("security")}>
                Security
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="desktop-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <h2>Admin</h2>
          </div>

          <ul className="menu">
            {links.map((link) => (
              <li
                key={link.id}
                className={activeTab === link.id ? "active" : ""}
                onClick={() => {
                  setActiveTab(link.id);
                  setSelectedSetting("");
                }}
              >
                {link.label}
              </li>
            ))}

            {/* Settings Dropdown */}
            <li
              className="dropdown-title"
              onClick={() => setShowSettings(!showSettings)}
            >
              Settings {showSettings ? "▲" : "▼"}
            </li>

            {showSettings && (
              <ul className="submenu">
                <li onClick={() => setSelectedSetting("category")}>
                  Category
                </li>

                <li onClick={() => setSelectedSetting("profile")}>
                  Profile
                </li>


              </ul>
            )}
          </ul>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="content">
          {activeTab === "overview" && selectedSetting === "" && (
            <>
             
            
               <MilkDashboard   />
            </>
          )}

          {activeTab === "Milk" && selectedSetting === "" && (
            <>
             
       <MainMilk   />
            </>
          )}

          {activeTab === "Sale" && selectedSetting === "" && (
            <>
               <Mainfile   />
            </>
          )}

          {activeTab === "reviews" && selectedSetting === "" && (
            <>
              <h1>Reviews</h1>
              <p>Manage reviews here.</p>
            </>
          )}

          {/* Settings Pages */}
          {selectedSetting === "category" && (
            <>
              <Catagory />

            </>
          )}

          {selectedSetting === "profile" && (
            <>
              <h1>Profile Settings</h1>
              <p>Update profile information.</p>
            </>
          )}


        </main>
      </div>
    </div>
  );
}