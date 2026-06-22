"use client";

import { useState } from "react";
import "./dashboard.css";
import Catagory from "../CategoryManagers/Catagory";
import MainMilk from "../Milkmanagement/MainMilk";
import MilkDashboard from "../AdminDashboard/MilkDashboard";
import Mainfile from "../MilkSale/Mainfile";


import BuyanimalCatagory from "../Animal/BuyanimalCatagory";
import Stockhandler from "../Animal/Stockhandler";
import Inventorycatagory from "../CategoryManagers/Inventorycatagory";
import VaccinatedAnimals from "../VaccinatedAnimal/VaccinatedAnimals";
import Workcatagory from "../CategoryManagers/Workcatagory";
import Handleteam from "../Team Management/Handleteam";
import Attendance from "../Attendence/Attendance";


export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("");

  const links = [
    { id: "overview", label: "Overview" },
    { id: "Milk", label: "Milk" },
    { id: "Sale", label: "Sale" },
    { id: "Stock", label: "Stock" },
    { id: "Vacine", label: "Vacine" },
      { id: "team", label: "Team management" },
       { id: "Attendence", label: "Attendence management" },
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
              <button onClick={() => setSelectedSetting("Animal")}>
                Animal
              </button>
               <button onClick={() => setSelectedSetting("Inventory")}>
                Inventory
              </button>
                 <button onClick={() => setSelectedSetting("Work")}>
                Work
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

                <li onClick={() => setSelectedSetting("Animal")}>
                  Animal
                </li>
                <li onClick={() => setSelectedSetting("Inventory")}>
                  Inventory
                </li>
                   <li onClick={() => setSelectedSetting("Work")}>
                  Work
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

          {activeTab === "Stock" && selectedSetting === "" && (
            <>
                   <Stockhandler  />
            </>
          )}
          {activeTab === "Vacine" && selectedSetting === "" && (
            <>
                   <VaccinatedAnimals  />
            </>
          )}
          {activeTab === "team" && selectedSetting === "" && (
            <>
                   <Handleteam  />
            </>
          )}
           
{activeTab === "Attendence" && selectedSetting === "" && (
            <>
                 <Attendance  /> 
            </>
          )}

          {/* Settings Pages */}
          {selectedSetting === "category" && (
            <>
              <Catagory />

            </>
          )}

          {selectedSetting === "Animal" && (
            <>
               <BuyanimalCatagory />
            
            </>
          )}
          
 {selectedSetting === "Inventory" && (
            <>
               <Inventorycatagory />
            
            </>
          )}
          {selectedSetting === "Work" && (
            <>
               <Workcatagory />
            
            </>
          )}

       

        </main>
      </div>
    </div>
  );
}