"use client";

import { useEffect, useMemo, useState } from "react";

/* ================= TYPES ================= */

type Sale = {
    _id: string;
    totalPrice?: number;
    date?: string;
    category?: {
        _id: string;
        name: string;
    };
};

type FilterType = "today" | "week" | "month";

/* ================= COMPONENT ================= */

export default function Salegraph() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [filter, setFilter] = useState<FilterType>("today");
    const [isMobile, setIsMobile] = useState(false);

    /* ================= SCREEN ================= */
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ================= FETCH SALES ================= */
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/sales");
                const data = await res.json();
                setSales(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSales();
    }, []);

    /* ================= SAFE DATE NORMALIZER ================= */
    const normalizeDate = (d?: string) => {
        if (!d) return null;

        const date = new Date(d);

        if (!isNaN(date.getTime())) {
            return date;
        }

        // fallback for DD-MM-YYYY or DD/MM/YYYY
        const parts = d.split(/[-/]/);
        if (parts.length === 3) {
            const [a, b, c] = parts;

            // assume DD-MM-YYYY
            const iso = a.length === 2
                ? `${c}-${b}-${a}`
                : `${a}-${b}-${c}`;

            const fixed = new Date(iso);
            return isNaN(fixed.getTime()) ? null : fixed;
        }

        return null;
    };

    /* ================= FILTER ================= */
    const filteredSales = useMemo(() => {
        const now = new Date();

        const todayKey = now.toISOString().split("T")[0];

        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        return sales.filter((s) => {
            const saleDate = normalizeDate(s.date);

            if (!saleDate) return false;

            if (filter === "today") {
                // FIX: compare by YYYY-MM-DD (no timezone bug)
                return saleDate.toISOString().split("T")[0] === todayKey;
            }

            if (filter === "week") {
                return saleDate >= weekAgo;
            }

            if (filter === "month") {
                return (
                    saleDate.getMonth() === now.getMonth() &&
                    saleDate.getFullYear() === now.getFullYear()
                );
            }

            return true;
        });
    }, [sales, filter]);

    /* ================= STATS ================= */
    const totalRevenue = filteredSales.reduce(
        (sum, s) => sum + (s.totalPrice || 0),
        0
    );

    const totalSales = filteredSales.length;

    const categoryMap: Record<string, number> = {};

    filteredSales.forEach((s) => {
        const name = s.category?.name || "Unknown";
        categoryMap[name] = (categoryMap[name] || 0) + 1;
    });

    /* ================= UI ================= */

    return (
        <div style={container}>
            {/* FILTER BUTTONS */}
            <div style={isMobile ? filterMobile : filterDesktop}>
                {(["today", "week", "month"] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            ...filterBtn,
                            background: filter === f ? "#22c55e" : "#e2e8f0",
                            color: filter === f ? "#fff" : "#000",
                            flex: isMobile ? "1" : "none",
                        }}
                    >
                        {f.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* CARDS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                        ? "1fr"
                        : "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "15px",
                }}
            >
                <div style={card}>
                    <h3>💰 Revenue</h3>
                    <h2>{totalRevenue} RS</h2>
                </div>

                <div style={card}>
                    <h3>📦 Sales</h3>
                    <h2>{totalSales}</h2>
                </div>

                <div style={card}>
                    <h3>🏷 Categories</h3>
                    {Object.entries(categoryMap).map(([name, count]) => (
                        <p key={name}>
                            {name}: {count}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
    padding: "20px",
};

const filterDesktop: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
};

const filterMobile: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
};

const filterBtn: React.CSSProperties = {
    padding: "10px 15px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
};

const card: React.CSSProperties = {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};