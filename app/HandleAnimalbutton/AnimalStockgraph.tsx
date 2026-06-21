"use client";

import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

type Animal = {
    _id: string;
    name: string;
    type: string;
    vacine?: string;
};

const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#ca8a04",
    "#9333ea",
    "#0891b2",
    "#ea580c",
    "#db2777",
];

export default function AnimalStockgraph() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await fetch(
                    "https://farm-backend-lac.vercel.app/api/Handleanimals"
                );

                const data = await res.json();

                setAnimals(data || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, []);

    const animalCounts = animals.reduce(
        (acc: Record<string, number>, animal) => {
            const type = animal.type || "Unknown";

            acc[type] = (acc[type] || 0) + 1;

            return acc;
        },
        {}
    );

    const chartData = Object.entries(animalCounts).map(
        ([type, count]) => ({
            name: type,
            value: count,
        })
    );
   

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* Animations */}
            <style>
                {`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulseCard {
                    0% {
                        transform: scale(1);
                    }

                    50% {
                        transform: scale(1.03);
                    }

                    100% {
                        transform: scale(1);
                    }
                }
                `}
            </style>

            <h1
                style={{
                    textAlign: "center",
                    marginBottom: 25,
                    color: "#111827",
                    fontSize: isMobile ? 24 : 34,
                }}
            >
                🐄 Animal Stock Dashboard
            </h1>

            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile
                        ? "column"
                        : "row",
                    gap: 20,
                    alignItems: "stretch",
                }}
            >
                {/* LEFT SIDE - CARDS */}
                <div
                    style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr"
                            : "repeat(auto-fit,minmax(180px,1fr))",
                        gap: 15,
                    }}
                >
                    {chartData.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                background: "#fff",
                                borderRadius: 16,
                                padding: isMobile
                                    ? 18
                                    : 22,
                                textAlign: "center",
                                boxShadow:
                                    "0 6px 15px rgba(0,0,0,0.08)",
                                borderTop: `6px solid ${COLORS[
                                    index %
                                    COLORS.length
                                    ]
                                    }`,

                                animation: `
                                slideUp 0.7s ease forwards,
                                pulseCard 4s ease-in-out infinite
                            `,

                                animationDelay: `${index * 0.15
                                    }s`,
                            }}
                        >
                            <h3
                                style={{
                                    margin: 0,
                                    color: "#111827",
                                    fontSize: isMobile
                                        ? 20
                                        : 22,
                                }}
                            >
                                {item.name}
                            </h3>

                            <div
                                style={{
                                    fontSize: isMobile
                                        ? 38
                                        : 50,
                                    fontWeight: "bold",
                                    color: "#2563eb",
                                    marginTop: 12,
                                }}
                            >
                                {item.value}
                            </div>

                            <p
                                style={{
                                    marginTop: 8,
                                    color: "#6b7280",
                                    fontSize: isMobile
                                        ? 14
                                        : 15,
                                }}
                            >
                                Registered Animals
                            </p>
                        </div>
                    ))}
              

                  
                </div>

                {/* RIGHT SIDE - PIE CHART */}
                <div
                    style={{
                        flex: 1,
                        minWidth: isMobile
                            ? "100%"
                            : 320,
                        background: "#fff",
                        borderRadius: 16,
                        padding: isMobile
                            ? 12
                            : 20,
                        boxShadow:
                            "0 6px 15px rgba(0,0,0,0.08)",
                        animation:
                            "slideUp 0.8s ease forwards",
                    }}
                >
                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: 10,
                            fontSize: isMobile
                                ? 20
                                : 26,
                        }}
                    >
                        📊 Animal Distribution
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={isMobile ? 280 : 380}
                    >
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={
                                    isMobile
                                        ? 90
                                        : 130
                                }
                                label
                            >
                                {chartData.map(
                                    (_, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                COLORS[
                                                index %
                                                COLORS.length
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "20px",
    },

    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "22px",
        fontWeight: "bold",
    },
};