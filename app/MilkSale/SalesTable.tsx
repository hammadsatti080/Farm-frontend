"use client";

import { useEffect, useState } from "react";
import { useCallback } from "react";
type Category = {
    _id: string;
    name: string;
};

type Sale = {
    _id: string;
    name: string;
    quantity: number;
    pricePerKg: number;
    totalPrice: number;
    date?: string;
    milkType?: string;
    category?: Category | string;
};
export default function SalesTable() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [categoryFilter, setCategoryFilter] = useState("");
    const [milkFilter, setMilkFilter] = useState("");


const fetchSales = useCallback(async (): Promise<void> => {
    try {
        const res = await fetch("http://localhost:5000/api/sales");
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed");

        setSales(data.data || []);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Something went wrong");
        }
    } finally {
        setLoading(false);
    }
}, []);

useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSales();
}, [fetchSales]);

    const handleDelete = async (id: string) => {
        await fetch(`http://localhost:5000/api/sales/${id}`, {
            method: "DELETE",
        });

        setSales((prev) => prev.filter((i) => i._id !== id));
    };

    const handleEdit = async (item: Sale): Promise<void> => {
        const newQty = prompt("Enter new quantity", String(item.quantity));
        if (!newQty) return;

        const qty = Number(newQty);
        if (isNaN(qty)) return;

        const newTotal = qty * Number(item.pricePerKg);

        const res = await fetch(
            `http://localhost:5000/api/sales/${item._id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quantity: qty,
                    totalPrice: newTotal,
                }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Update failed");
            return;
        }

        await fetchSales(); // ✅ now works
    };

  const filtered = sales.filter((item) => {
    const categoryName =
        typeof item.category === "object"
            ? item.category?.name
            : item.category;

    return (
        (categoryFilter === "" ||
            categoryName === categoryFilter) &&
        (milkFilter === "" || item.milkType === milkFilter)
    );
});

    const categories = [
    ...new Set(
        sales.map((s) =>
            typeof s.category === "object"
                ? s.category?.name
                : s.category
        )
    ),
].filter(Boolean);
    const milkTypes = ["Cow", "Buffalo", "Goat"];

    if (loading) return <p className="status">Loading...</p>;
    if (error) return <p className="status error">{error}</p>;

    return (
        <div className="page">
            <div className="card">
                <div className="headerRow">
                    <h2 className="title">📊 Sales Dashboard</h2>

                    {/* Filters: shared between desktop (inline in table head) and mobile (own bar) */}
                    <div className="filterBar">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">📦 Category</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <select
                            value={milkFilter}
                            onChange={(e) => setMilkFilter(e.target.value)}
                        >
                            <option value="">🥛 Milk Type</option>
                            {milkTypes.map((m, i) => (
                                <option key={i} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <p className="empty">No sales match these filters.</p>
                ) : (
                    <>
                        {/* DESKTOP / TABLET TABLE */}
                        <div className="tableWrap">
                            <table>
                                <thead>
                                    <tr className="headRow">
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Milk Type</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filtered.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.name}</td>
                                            <td>
    {typeof item.category === "object"
        ? item.category?.name
        : item.category || "-"}
</td>
                                            <td>{item.milkType}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.pricePerKg}</td>
                                            <td>{item.totalPrice}</td>
                                            <td>{item.date}</td>
                                            <td>
                                                <div className="btns">
                                                    <button
                                                        className="edit"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete"
                                                        onClick={() => handleDelete(item._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE CARDS */}
                        <div className="cards">
                            {filtered.map((item) => (
                                <div key={item._id} className="mobileCard">
                                    <div className="top">
                                        <h3>{item.name}</h3>
                                        <span className="badge">{item.milkType}</span>
                                    </div>

                                    <div className="grid">
                                        <div>
                                            <p className="label">Category</p>
                                           <p>
    {typeof item.category === "object"
        ? item.category?.name
        : item.category || "-"}
</p>
                                        </div>
                                        <div>
                                            <p className="label">Quantity</p>
                                            <p>{item.quantity} KG</p>
                                        </div>
                                        <div>
                                            <p className="label">Price / KG</p>
                                            <p>{item.pricePerKg}</p>
                                        </div>
                                        <div>
                                            <p className="label">Total</p>
                                            <p className="total">{item.totalPrice}</p>
                                        </div>
                                    </div>

                                    <p className="date">📅 {item.date}</p>

                                    <div className="btns">
                                        <button
                                            className="edit"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .page {
                    background: #f4f6fb;
                    min-height: 100vh;
                    padding: 24px;
                    font-family: sans-serif;
                }

                .card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                }

                .headerRow {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .title {
                    font-size: 22px;
                    font-weight: 600;
                    margin: 0;
                }

                .status {
                    padding: 40px;
                    text-align: center;
                    font-family: sans-serif;
                    color: #666;
                }

                .status.error {
                    color: #ef4444;
                }

                .empty {
                    text-align: center;
                    padding: 30px 10px;
                    color: #888;
                    font-size: 14px;
                }

                .filterBar {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .filterBar select {
                    padding: 8px 10px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    background: #fff;
                    cursor: pointer;
                    font-size: 13px;
                    min-width: 130px;
                }

                /* ===== DESKTOP / TABLET TABLE ===== */
                .tableWrap {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 700px;
                }

                thead {
                    background: #f8fafc;
                }

                th {
                    padding: 12px;
                    text-align: left;
                    font-size: 14px;
                    font-weight: 600;
                    border-bottom: 1px solid #eee;
                    white-space: nowrap;
                }

                td {
                    padding: 12px;
                    border-bottom: 1px solid #f1f1f1;
                    font-size: 14px;
                }

                tr:hover {
                    background: #fafafa;
                }

                .btns {
                    display: flex;
                    gap: 6px;
                }

                .edit {
                    background: #facc15;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                }

                .delete {
                    background: #ef4444;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    color: white;
                    font-size: 12px;
                }

                /* ===== MOBILE CARDS (hidden by default, shown under breakpoint) ===== */
                .cards {
                    display: none;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 4px;
                }

                .mobileCard {
                    background: #fff;
                    border-radius: 16px;
                    padding: 14px;
                    border: 1px solid #eee;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
                }

                .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .top h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                }

                .badge {
                    background: #e0f2fe;
                    color: #0369a1;
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 8px;
                }

                .grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .grid p {
                    margin: 0;
                }

                .label {
                    font-size: 11px;
                    color: #777;
                    margin-bottom: 2px;
                }

                .total {
                    font-weight: 600;
                    color: #16a34a;
                }

                .date {
                    font-size: 12px;
                    color: #666;
                    margin: 0 0 10px;
                }

                .mobileCard .btns {
                    gap: 8px;
                }

                .mobileCard .edit {
                    flex: 1;
                    padding: 8px;
                    border-radius: 10px;
                    font-size: 13px;
                    text-align: center;
                }

                .mobileCard .delete {
                    flex: 1;
                    padding: 8px;
                    border-radius: 10px;
                    font-size: 13px;
                    text-align: center;
                }

                /* ===== BREAKPOINTS ===== */

                /* Tablet: keep table but tighten padding so it fits better */
                @media (max-width: 1024px) {
                    table {
                        min-width: 640px;
                    }

                    th,
                    td {
                        padding: 10px 8px;
                        font-size: 13px;
                    }
                }

                /* Mobile: swap table for cards, move filters into their own row */
                @media (max-width: 768px) {
                    .page {
    padding-right: 40px;
}
                    .card {
                        padding: 16px;
                        border-radius: 14px;
                    }

                    .title {
                        font-size: 19px;
                    }

                    .headerRow {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .filterBar {
                        width: 100%;
                    }

                    .filterBar select {
                        flex: 1;
                        min-width: 0;
                    }

                    .tableWrap {
                        display: none;
                    }

                    .cards {
                        display: flex;
                    }
                }

                @media (max-width: 420px) {
                    .grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}