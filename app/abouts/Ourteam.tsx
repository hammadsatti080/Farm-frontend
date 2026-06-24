"use client";

import { useState, useEffect } from "react";
import "./TeamCards.css";
import { FaPhone, FaBriefcase } from "react-icons/fa6";

interface TeamMember {
  _id: string;
  name: string;
  profession: string;
  role: string;
  phone: string;
}

// Badge accent colors, cycled by category rather than by character code,
// so members on the same team/role land on the same accent.
const ACCENTS = [
  { id: "orange", fg: "#FF5A1F", bg: "rgba(255, 90, 31, 0.12)" },
  { id: "teal", fg: "#1D9E75", bg: "rgba(29, 158, 117, 0.14)" },
  { id: "blue", fg: "#378ADD", bg: "rgba(55, 138, 221, 0.14)" },
  { id: "pink", fg: "#D4537E", bg: "rgba(212, 83, 126, 0.14)" },
];

export default function Ourteam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("https://farm-backend-lac.vercel.app/api/handleteam");
        if (!res.ok) throw new Error("Failed to load team");
        const data = await res.json();
        setTeam(data);
      } catch (err) {
  console.error(err);
  setError("Could not load team members.");
}finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Stable accent per role, not per random char code, so the same
  // department always reads as the same color.
  const getAccent = (role: string) => {
    let hash = 0;
    for (let i = 0; i < role.length; i++) {
      hash = (hash << 5) - hash + role.charCodeAt(i);
      hash |= 0;
    }
    return ACCENTS[Math.abs(hash) % ACCENTS.length];
  };

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  if (loading) return <p className="team-status">Loading team...</p>;
  if (error) return <p className="team-status team-status-error">{error}</p>;
  if (team.length === 0) return <p className="team-status">No team members yet.</p>;

  return (
    <div className="team-grid">
      {team.map((member) => {
        const accent = getAccent(member.role);
        const isOpen = openId === member._id;
        return (
          <div
            key={member._id}
            className={`badge-card ${isOpen ? "is-open" : ""}`}
            onClick={() => toggleOpen(member._id)}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleOpen(member._id);
              }
            }}
          >
            {/* Punch notch, badge-clip detail */}
            <span className="badge-notch" aria-hidden="true" />

            <div className="badge-front">
              <div
                className="badge-avatar"
                style={{ background: accent.fg }}
              >
                {getInitials(member.name)}
              </div>
              <h3 className="badge-name">{member.name}</h3>
              <p className="badge-profession">{member.profession}</p>
              <span
                className="badge-role-tag"
                style={{ color: accent.fg, background: accent.bg }}
              >
                {member.role}
              </span>
              <span className="badge-hint">{isOpen ? "tap to close" : "tap for contact"}</span>
            </div>

            <div className={`badge-contact ${isOpen ? "is-open" : ""}`}>
              <div className="contact-divider" />
              <div className="contact-row">
                <FaPhone size={13} style={{ color: accent.fg }} />
                <span className="contact-phone">{member.phone}</span>
              </div>
              <div className="contact-row">
                <FaBriefcase size={13} style={{ color: accent.fg }} />
                <span className="contact-meta">{member.role}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}