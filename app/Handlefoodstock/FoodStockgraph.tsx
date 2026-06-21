"use client";

import React, { useEffect, useMemo, useState } from "react";

type Inventory = {
    _id?: string;
    uniqueId?: string;
    name: string;
    type: string;
    price: number;
    dateTime: string;
    purpose: string;
};

export default function FoodStockgraph() {
    const [items, setItems] = useState<Inventory[]>([]);

    // FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    "https://farm-backend-lac.vercel.app/api/inventory"
                );
                const data = await res.json();
                setItems(data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    // TOTAL PRICE
    const totalPrice = useMemo(() => {
        return items.reduce(
            (sum, item) => sum + (item.price || 0),
            0
        );
    }, [items]);

    return (
        <div className="page">
            {/* HEADER */}
            <div className="header">
                <h2 style={{ textAlign : "center"}}>📦 Inventory Dashboard</h2>
                <p style={{ textAlign : "center"}}>Overview of all stock values</p>
            </div>

            {/* BIG SUMMARY CARD */}
           <div className="summaryCard">
    <div className="summaryTop">
        <div>
            <h3>📦 Total Stock Value</h3>
            <p>Overall inventory worth</p>
        </div>

        <div className="badge">
            {items.length} Items
        </div>
    </div>

    <h1  style={{color : "white", fontFamily:"bold", fontSize:"34px", marginTop:"15px"}}>
        Rs {totalPrice.toLocaleString()}
    </h1>

    <div className="footer">
        <span>💡 Live calculated from inventory</span>
    </div>
</div>

            {/* CARDS */}
            <div className="grid">
                {items.length === 0 ? (
                    <div className="empty">No inventory found</div>
                ) : (
                    items.map((i) => (
                        <div key={i._id} className="card">
                            <div className="top">
                                <span className="type">
                                    {i.type}
                                </span>
                            </div>

                            <h3 className="price">
                                Rs {i.price}
                            </h3>

                            <p className="meta">
                                {i.name || "Item"}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* STYLES */}
            <style jsx>{`
                .page {
                    padding: 18px;
                    font-family: Arial;
                    background: #f3f4f6;
                    min-height: 100vh;
                }

                /* HEADER */
                .header {
                    margin-bottom: 15px;
                   
                }

                .header h2 {
                    margin: 0;
                    font-size: 22px;
                    color: #111827;
                     
                }

                .header p {
                    margin: 4px 0 0;
                    font-size: 13px;
                    color: #6b7280;
                }

                /* SUMMARY CARD */
               .summaryCard {
    background: linear-gradient(135deg, #0f172a, #1e293b);
    color: white;
    padding: 18px;
    border-radius: 16px;
    margin-bottom: 18px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

/* soft glow effect */
.summaryCard::before {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 120px;
    height: 120px;
    background: rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    filter: blur(30px);
}

.summaryTop {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.summaryCard h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
}

.summaryCard p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #cbd5e1;
}

.badge {
    background: rgba(255, 255, 255, 0.12);
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    backdrop-filter: blur(10px);
}


.footer {
    font-size: 12px;
    color: #94a3b8;
}
                /* GRID */
                .grid {
                    display: grid;
                    grid-template-columns: repeat(
                        auto-fit,
                        minmax(160px, 1fr)
                    );
                    gap: 12px;
                }

                /* CARD */
                .card {
                    background: white;
                    padding: 12px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    transition: 0.2s ease;
                }

                .card:hover {
                    transform: translateY(-4px);
                }

                .top {
                    display: flex;
                    justify-content: space-between;
                }

                .type {
                    font-size: 11px;
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 3px 8px;
                    border-radius: 999px;
                }

                .price {
                    margin: 10px 0 5px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #111827;
                }

                .meta {
                    font-size: 12px;
                    color: #6b7280;
                }

                /* EMPTY */
                .empty {
                    text-align: center;
                    color: #9ca3af;
                    grid-column: 1 / -1;
                }

                /* MOBILE */
                @media (max-width: 600px) {
                    .summaryCard h1 {
                        font-size: 26px;
                    }

                    .card {
                        padding: 10px;
                    }
                }
            `}</style>
        </div>
    );
}