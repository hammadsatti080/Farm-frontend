"use client";

import { useEffect, useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

/* ================= TYPES ================= */

type Category = {
    _id: string;
    name: string;
};

type Sale = {
    _id: string;
    name: string;
    milkType: string;
    quantity: number;
    pricePerKg: number;
    totalPrice: number;
    date: string;
    category?: Category | string;
};

/* ================= COMPONENT ================= */

export default function Page() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, catRes] = await Promise.all([
                    fetch("http://localhost:5000/api/sales"),
                    fetch("http://localhost:5000/api/categories"),
                ]);

                const salesData = await salesRes.json();
                const catData = await catRes.json();

                setSales(Array.isArray(salesData) ? salesData : salesData.data || []);
                setCategories(Array.isArray(catData) ? catData : []);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchData();
    }, []);

    /* ================= TOTAL REVENUE ================= */
    const totalRevenue = useMemo(() => {
        return sales.reduce(
            (sum, s) => sum + Number(s.totalPrice || 0),
            0
        );
    }, [sales]);

    const totalSales = sales.length;

    /* ================= CATEGORY COUNT ================= */
    const categoryMap: Record<string, number> = {};

    sales.forEach((s) => {
        const name =
            typeof s.category === "object"
                ? s.category?.name
                : categories.find((c) => c._id === s.category)?.name || "Unknown";

        categoryMap[name] = (categoryMap[name] || 0) + 1;
    });

    /* ================= GRAPH DATA ================= */
    const graphData = useMemo(() => {
        const map: Record<string, number> = {};

        sales.forEach((s) => {
            if (!s.date) return;

            const d = new Date(s.date);
            if (isNaN(d.getTime())) return;

            const key = d.toISOString().split("T")[0];

            map[key] = (map[key] || 0) + Number(s.totalPrice || 0);
        });

        return Object.entries(map).map(([date, revenue]) => ({
            date,
            revenue,
        }));
    }, [sales]);

    /* ================= UI ================= */

    return (
        <div style={container}>
   <h3 style={{fontSize:"25px"}}>📦 Sales Analysis</h3>
            {/* CARDS */}
            <div style={cardGrid}>
                <div style={card}>
                    <h3>💰 Revenue</h3>
                    <h2 style={{textAlign:"left", fontWeight:"lighter"}}>{totalRevenue} RS</h2>
                </div>

                <div style={card}>
                    <h3>📦 Sales</h3>
                    <h2 style={{textAlign:"left" , fontWeight:"lighter"}}>{totalSales}</h2>
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

            {/* GRAPH */}
            <div style={graphBox}>
                <h3>📊 Sales Graph</h3>

                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={graphData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#22c55e"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
    padding: 20,
    background: "#f4f6fb",
    minHeight: "100vh",
};

const cardGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 15,
    marginBottom: 20,
};

const card: React.CSSProperties = {
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const graphBox: React.CSSProperties = {
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};