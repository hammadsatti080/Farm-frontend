"use client";

import { useEffect, useState, useMemo } from "react";
import "./salesTable.css";

/* ================= TYPES ================= */

type Category = {
    _id: string;
    name: string;
};

type Sale = {
    _id: string;
    name?: string;
    category?: Category;
    milkType?: string;
    quantity?: number;
    pricePerKg?: number;
    totalPrice?: number;
    date?: string;
};

type Filters = {
    type?: string;
    date?: string;
};

export default function SalesTable({ filters }: { filters?: Filters }) {
    const [sales, setSales] = useState<Sale[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const [isMobile, setIsMobile] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState<Sale | null>(null);

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
                const data: Sale[] = await res.json();

                const clean = Array.isArray(data)
                    ? data.filter((i) => i && i.category)
                    : [];

                setSales(clean);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSales();
    }, []);

    /* ================= FETCH CATEGORIES ================= */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/categories");
                const data: Category[] = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategories();
    }, []);

    /* ================= FILTERED DATA (FIXED - NO useEffect) ================= */
    const filteredSales = useMemo(() => {
        let result = [...sales];

        if (filters?.type) {
            result = result.filter((s) => s.milkType === filters.type);
        }

        if (filters?.date) {
            result = result.filter((s) => s.date === filters.date);
        }

        if (selectedCategory) {
            result = result.filter(
                (s) => s.category?._id === selectedCategory
            );
        }

        return result;
    }, [sales, filters, selectedCategory]);

    /* ================= DELETE ================= */
    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/api/sales/${id}`, {
                method: "DELETE",
            });

            setSales((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= EDIT ================= */
    const handleEditOpen = (item: Sale) => {
        setEditData(item);
        setEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!editData) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/sales/${editData._id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editData),
                }
            );

            const updated: Sale = await res.json();

            setSales((prev) =>
                prev.map((s) => (s._id === updated._id ? updated : s))
            );

            setEditOpen(false);
            setEditData(null);
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= EMPTY STATE ================= */
    if (!filteredSales.length) {
        return (
            <p style={{ padding: "10px", color: "#64748b" }}>
                No sales found
            </p>
        );
    }

    return (
        <>
            {/* ================= TABLE ================= */}
            {!isMobile && (
                <div className="table-container">
                    <table className="sales-table">

                        {/* ================= HEADER WITH CATEGORY DROPDOWN ================= */}
                        <thead>
                            <tr>
                                <th>Name</th>

                                <th>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value)
                                        }
                                        style={{
                                            padding: "6px",
                                            borderRadius: "6px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </th>

                                <th>Type</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        {/* ================= BODY ================= */}
                        <tbody>
                            {filteredSales.map((s) => (
                                <tr key={s._id}>
                                    <td>{s.name || "-"}</td>
                                    <td>{s.category?.name}</td>
                                    <td>{s.milkType}</td>
                                    <td>{s.quantity}</td>
                                    <td>{s.pricePerKg}</td>
                                    <td>{s.totalPrice}</td>
                                    <td>{s.date}</td>

                                    <td >
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button onClick={() => handleEditOpen(s)} style={editBtn}>
                                                Edit
                                            </button>

                                            <button onClick={() => handleDelete(s._id)} style={deleteBtn}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ================= MOBILE ================= */}
            {isMobile && (
                <div className="sales-cards">
                    {filteredSales.map((s) => (
                        <div key={s._id} className="sales-card">
                            <h3>{s.name || "No Name"}</h3>

                            <p>🏷 Category: {s.category?.name}</p>
                            <p>🐄 Type: {s.milkType}</p>
                            <p>⚖️ Qty: {s.quantity}</p>
                            <p>💰 Price: {s.pricePerKg}</p>
                            <p>🧾 Total: {s.totalPrice}</p>
                            <p>📅 Date: {s.date}</p>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button onClick={() => handleEditOpen(s)} style={editBtn}>
                                    Edit
                                </button>

                                <button onClick={() => handleDelete(s._id)} style={deleteBtn}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ================= EDIT MODAL ================= */}
            {editOpen && editData && (
                <div style={modalBg} onClick={() => setEditOpen(false)}>
                    <div style={modal} onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Sale</h2>

                        <input
                            value={editData.name || ""}
                            onChange={(e) =>
                                setEditData({ ...editData, name: e.target.value })
                            }
                            style={input}
                            placeholder="Name"
                        />

                        <input
                            value={editData.quantity || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    quantity: Number(e.target.value),
                                })
                            }
                            style={input}
                            placeholder="Quantity"
                        />

                        <input
                            value={editData.pricePerKg || ""}
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    pricePerKg: Number(e.target.value),
                                })
                            }
                            style={input}
                            placeholder="Price"
                        />

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={handleUpdate} style={saveBtn}>
                                Update
                            </button>

                            <button onClick={() => setEditOpen(false)} style={deleteBtn}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ================= STYLES ================= */

const editBtn: React.CSSProperties = {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "10px",
    flex: 1,
};

const input: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
};

const modalBg: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

const modal: React.CSSProperties = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
};