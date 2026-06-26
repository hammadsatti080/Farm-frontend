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

import Maincom from "../Mainauth/Maincom";

import {
  FaGaugeHigh,
  FaTag,
  FaSyringe,
  FaUsers,
  FaClipboardCheck,
  FaFolder,
  FaPaw,
  FaWarehouse,
  FaBriefcase,
  FaClipboardList,

} from "react-icons/fa6";
import { GiMilkCarton, GiBarn } from "react-icons/gi";
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import VaccineCatagory from "../CategoryManagers/Vacinecatagory";


export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("");

  const links = [
    { id: "overview", label: "Overview", icon: FaGaugeHigh },
    { id: "Milk", label: "Milk", icon: GiMilkCarton },
    { id: "Sale", label: "Sale", icon: FaTag },
    { id: "Stock", label: "Stock", icon: FaWarehouse },
    { id: "Vacine", label: "Vaccine", icon: FaSyringe },
    { id: "team", label: "Team Management", icon: FaUsers },
    { id: "Attendence", label: "Attendance Management", icon: FaClipboardCheck },

  ];

  const settingsLinks = [
    { id: "category", label: "Category", icon: FaFolder },
    { id: "Animal", label: "Animal", icon: FaPaw },
    { id: "Inventory", label: "Inventory", icon: FaWarehouse },
    { id: "Work", label: "Work", icon: FaBriefcase },
    { id: "Vacine", label: "Vaccine", icon: FaSyringe },
    { id: "Register", label: "Register", icon: FaClipboardList },
  ];

  const handleChange = (id: string) => {
    setActiveTab(id);
    setSelectedSetting("");
    setShowMobileMenu(false);
  };

  const router = useRouter();
  const handlegoback = () => {
    router.push("/Auth")
  }

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
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => handleChange(link.id)}
                className={activeTab === link.id ? "active-mobile" : ""}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </button>
            );
          })}



          <button
            onClick={() => setShowSettings(!showSettings)}
            className="active-mobile"
          >
            Settings {showSettings ? "▲" : "▼"}
          </button>

          <button
            onClick={handlegoback}
            className="active-mobile"
          >
            <FaSignOutAlt />  Logout
          </button>

          {showSettings && (
            <div className="mobile-submenu">
              {settingsLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => setSelectedSetting(link.id)}
                  >
                    <Icon size={16} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="desktop-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-mark">
              <GiBarn size={22} />
            </div>
            <h2>Farm House</h2>
          </div>

          <ul className="menu">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <li
                  key={link.id}
                  className={activeTab === link.id ? "active" : ""}
                  title={link.label}
                  onClick={() => {
                    setActiveTab(link.id);
                    setSelectedSetting("");
                  }}
                >
                  <Icon size={20} />
                </li>
              );
            })}
            
            <button
              onClick={handlegoback}
              className="active-mobile" style={{ fontSize: "20px", marginTop:"20px",marginBottom:"20px", marginLeft: "10px", color: "white", backgroundColor: "#0f172a", width:"70px" }}
            >
              <FaSignOutAlt />
            </button>

            {/* Settings Dropdown */}
            <li
              className="dropdown-title"
              onClick={() => setShowSettings(!showSettings)}
            >
              Settings {showSettings ? "▲" : "▼"}
            </li>

            

            {showSettings && (
              <ul className="submenu">
                {settingsLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li
                      key={link.id}
                      onClick={() => setSelectedSetting(link.id)}
                    >
                      <Icon size={16} />
                      <span>{link.label}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </ul>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="content">
          {activeTab === "overview" && selectedSetting === "" && (
            <MilkDashboard />
          )}

          {activeTab === "Milk" && selectedSetting === "" && <MainMilk />}

          {activeTab === "Sale" && selectedSetting === "" && <Mainfile />}

          {activeTab === "Stock" && selectedSetting === "" && (
            <Stockhandler />
          )}

          {activeTab === "Vacine" && selectedSetting === "" && (
            <VaccinatedAnimals />
          )}

          {activeTab === "team" && selectedSetting === "" && <Handleteam />}

          {activeTab === "Attendence" && selectedSetting === "" && (
            <Attendance />
          )}


          {/* Settings Pages */}
          {selectedSetting === "category" && <Catagory />}
          {selectedSetting === "Animal" && <BuyanimalCatagory />}
          {selectedSetting === "Inventory" && <Inventorycatagory />}
          {selectedSetting === "Work" && <Workcatagory />}
           {selectedSetting === "Vacine" && <VaccineCatagory />}
          {selectedSetting === "Register" && <Maincom />}
        </main>
      </div>
    </div>
  );
}