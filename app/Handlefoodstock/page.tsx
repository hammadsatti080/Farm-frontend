"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Inventory = {
    _id?: string;
    uniqueId?: string;
    name: string;
    type: string;
    price: number;
    dateTime: string;
    purpose: string;
};

type InventoryType = {
    _id?: string;
    name: string;
};

export default function Page() {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Inventory[]>([]);
    const [types, setTypes] = useState<InventoryType[]>([]);
    const [editId, setEditId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<Inventory>({
        name: "",
        type: "",
        price: 0,
        dateTime: "",
        purpose: "",
    });
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
    // =========================
    // LOAD DATA (INVENTORY + TYPES)
    // =========================
    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                const [invRes, typeRes] = await Promise.all([
                    fetch("https://farm-backend-lac.vercel.app/api/inventory"),
                    fetch("https://farm-backend-lac.vercel.app/api/inventory-types"),
                ]);

                const invData = await invRes.json();
                const typeData = await typeRes.json();

                if (isMounted) {
                    setItems(invData || []);
                    setTypes(typeData || []);
                }
            } catch (err) {
                console.log(err);
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, []);

    // =========================
    // SAVE (CREATE / UPDATE)
    // =========================
    const handleSave = async () => {
        if (editId) {
            await fetch(
                `https://farm-backend-lac.vercel.app/api/inventory/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );
        } else {
            await fetch(
                "https://farm-backend-lac.vercel.app/api/inventory",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );
        }

        setOpen(false);
        setEditId(null);

        setForm({
            name: "",
            type: "",
            price: 0,
            dateTime: "",
            purpose: "",
        });

        fetchData();
    };

    // =========================
    // EDIT
    // =========================
    const handleEdit = (item: Inventory) => {
        setForm(item);
        setEditId(item._id || null);
        setOpen(true);
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id?: string) => {
        if (!id) return;

        await fetch(
            `https://farm-backend-lac.vercel.app/api/inventory/${id}`,
            {
                method: "DELETE",
            }
        );

        fetchData();
    };

    const filteredItems = items.filter((item) =>
        (item.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (item.type ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (item.purpose ?? "").toLowerCase().includes(search.toLowerCase())
    );


    const totalAnimalUsePrice = items
        .filter((item) => item.purpose === "Animal Use")
        .reduce((sum, item) => sum + Number(item.price || 0), 0);

    const totalOtherUsePrice = items
        .filter((item) => item.purpose === "Other Use")
        .reduce((sum, item) => sum + Number(item.price || 0), 0);

    const grandTotalPrice = items.reduce(
        (sum, item) => sum + Number(item.price || 0),
        0
    );
    return (
        <div style={styles.page} className="inv-page">
            {/* Responsive breakpoint styles */}
            <style jsx global>{`
                @media (max-width: 640px) {
                    .inv-page {
                        padding: 10px !important;
                    }
                    .inv-header {
                        padding: 10px !important;
                        border-radius: 8px !important;
                    }
                    .inv-title {
                        font-size: 18px !important;
                    }
                    .inv-topbar {
                        flex-direction: column !important;
                    }
                    .inv-topbar button {
                        width: 100% !important;
                    }
                    .inv-table-wrapper {
                        padding: 6px !important;
                        border-radius: 8px !important;
                        -webkit-overflow-scrolling: touch;
                    }
                    .inv-table {
                        min-width: 720px !important;
                    }
                    .inv-table th,
                    .inv-table td {
                        padding: 10px 12px !important;
                        font-size: 13px !important;
                        white-space: nowrap;
                    }
                    .inv-table thead th {
                        position: static !important;
                    }
                    .inv-scroll-hint {
                        display: flex !important;
                    }
                    .inv-modal {
                        width: 92vw !important;
                        max-width: 360px !important;
                        padding: 16px !important;
                        max-height: 85vh !important;
                        overflow-y: auto !important;
                    }
                }

                @media (min-width: 641px) {
                    .inv-scroll-hint {
                        display: none !important;
                    }
                }

                .inv-table-wrapper {
                    overflow-x: auto;
                }

                .inv-table-wrapper::-webkit-scrollbar {
                    height: 8px;
                }
                .inv-table-wrapper::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 8px;
                }

                /* Desktop table styling */
                .inv-table {
                    border-collapse: separate;
                    border-spacing: 0;
                }

                .inv-table thead th {
                    background: #f9fafb;
                    color: #374151;
                    text-align: left;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    padding: 14px 16px;
                    border-bottom: 2px solid #e5e7eb;
                    position: sticky;
                    top: 0;
                }

                .inv-table thead th:nth-child(4) {
                    text-align: right;
                }

                .inv-table tbody td {
                    padding: 14px 16px;
                    border-bottom: 1px solid #f1f3f5;
                    color: #1f2937;
                    font-size: 14px;
                    vertical-align: middle;
                }

                .inv-table tbody td:nth-child(4) {
                    text-align: right;
                    font-weight: 600;
                    color: #111827;
                }

                .inv-table tbody tr:hover {
                    background: #f8fafc;
                }

                .inv-table tbody tr:last-child td {
                    border-bottom: none;
                }

                .inv-table tbody td:nth-child(1) {
                    color: #9ca3af;
                    font-size: 13px;
                }

                .inv-purpose-pill {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 999px;
                    font-size: 12px;
                    font-weight: 500;
                    background: #eef2ff;
                    color: #4338ca;
                    white-space: nowrap;
                }

                .inv-empty-row td {
                    text-align: center;
                    padding: 40px 16px !important;
                    color: #9ca3af;
                    font-size: 14px;
                }
            `}</style>

            {/* HEADER */}
            <div style={styles.header} className="inv-header">
                <h2 style={styles.title} className="inv-title">
                    📦 Inventory System
                </h2>
            </div>

            {/* TOP BAR */}
            <div style={styles.topBar} className="inv-topbar">
                <input
                    placeholder="Search Food + Type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.search}
                />

                <button
                    style={styles.addBtn}
                    onClick={() => setOpen(true)}
                >
                    + Add Inventory
                </button>

                <button
                    style={styles.backBtn}
                    onClick={() => router.back()}
                >
                    ← Back
                </button>
            </div>

            {/* SCROLL HINT (mobile only) */}
            <div style={styles.scrollHint} className="inv-scroll-hint">
                ← Swipe table to see more →
            </div>

            {/* TABLE */}
            <div style={styles.tableWrapper} className="inv-table-wrapper">
                <table style={styles.table} className="inv-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Purpose</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.length === 0 ? (
                            <tr className="inv-empty-row">
                                <td colSpan={7}>
                                    No inventory items yet. Click &ldquo;+ Add Inventory&rdquo; to get started.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((i) => (
                                <tr key={i._id}>
                                    <td>{i.uniqueId}</td>
                                    <td>{i.name}</td>
                                    <td>{i.type}</td>
                                    <td>{i.price}</td>
                                    <td>
                                        {i.dateTime
                                            ? new Date(
                                                i.dateTime
                                            ).toLocaleString()
                                            : "-"}
                                    </td>
                                    <td>
                                        {i.purpose ? (
                                            <span className="inv-purpose-pill">
                                                {i.purpose}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            style={
                                                styles.editBtn
                                            }
                                            onClick={() =>
                                                handleEdit(i)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            style={
                                                styles.deleteBtn
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    i._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: 15,
                    marginBottom: 20,
                    marginTop: "50px"
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: 20,
                        borderRadius: 12,
                        borderLeft: "6px solid #16a34a",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",

                    }}
                >
                    <h3 style={{ margin: 0 }}>🐄 Animal Use</h3>
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: "bold",
                            color: "#16a34a",
                            marginTop: 10,
                        }}
                    >
                        Rs. {totalAnimalUsePrice.toLocaleString()}
                    </div>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: 20,
                        borderRadius: 12,
                        borderLeft: "6px solid #f59e0b",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <h3 style={{ margin: 0 }}>📦 Other Use</h3>
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: "bold",
                            color: "#f59e0b",
                            marginTop: 10,
                        }}
                    >
                        Rs. {totalOtherUsePrice.toLocaleString()}
                    </div>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: 20,
                        borderRadius: 12,
                        borderLeft: "6px solid #2563eb",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",


                    }}
                >
                    <h3 style={{ margin: 0 }}>💰 Total Inventory Cost</h3>
                    <div
                        style={{
                            fontSize: 28,
                            fontWeight: "bold",
                            color: "#2563eb",
                            marginTop: 10,
                        }}
                    >
                        Rs. {grandTotalPrice.toLocaleString()}
                    </div>
                </div>
            </div>
            {/* MODAL */}
            {open && (
                <div style={styles.overlay}>
                    <div style={styles.modal} className="inv-modal">
                        <h3>
                            {editId
                                ? "Edit Inventory"
                                : "Add Inventory"}
                        </h3>

                        {/* NAME */}
                        <input
                            placeholder="Inventory Name"
                            style={styles.input}
                            value={form.name}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    name: e.target.value,
                                })
                            }
                        />

                        {/* TYPE DROPDOWN (FROM API) */}
                        <select
                            style={styles.input}
                            value={form.type}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    type: e.target.value,
                                })
                            }
                        >
                            <option value="">
                                Select Inventory Type
                            </option>

                            {types.map((t) => (
                                <option
                                    key={t._id}
                                    value={t.name}
                                >
                                    {t.name}
                                </option>
                            ))}
                        </select>

                        {/* PRICE */}
                        <input
                            type="number"
                            placeholder="Price"
                            style={styles.input}
                            value={form.price}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price: Number(
                                        e.target.value
                                    ),
                                })
                            }
                        />

                        {/* DATE */}
                        <input
                            type="datetime-local"
                            style={styles.input}
                            value={form.dateTime}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    dateTime:
                                        e.target.value,
                                })
                            }
                        />

                        {/* PURPOSE */}
                        <select
                            style={styles.input}
                            value={form.purpose}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    purpose:
                                        e.target.value,
                                })
                            }
                        >
                            <option value="">
                                Select Purpose
                            </option>
                            <option value="Animal Use">
                                For Animal Use
                            </option>
                            <option value="Other Use">
                                For Other Use
                            </option>
                        </select>

                        {/* ACTIONS */}
                        <div style={styles.modalActions}>
                            <button
                                style={styles.saveBtn}
                                onClick={handleSave}
                            >
                                Save
                            </button>

                            <button
                                style={styles.closeBtn}
                                onClick={() =>
                                    setOpen(false)
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ================= STYLES ================= */
const styles: Record<string, React.CSSProperties> = {
    page: {
        fontFamily: "Arial",
        padding: 15,
        background: "#f3f4f6",
        minHeight: "100vh",
    },

    header: {
        background: "#111827",
        color: "white",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },

    title: {
        margin: 0,
        color:"white"
    },

    topBar: {
        display: "flex",
        gap: 10,
        marginBottom: 10,
    },
    search: {
        flex: 1,
        minWidth: 200,
        padding: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
    },

    addBtn: {
        padding: "10px 15px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 8,
    },

    backBtn: {
        padding: "10px 15px",
        background: "#6b7280",
        color: "white",
        border: "none",
        borderRadius: 8,
    },

    scrollHint: {
        display: "none",
        justifyContent: "center",
        fontSize: 12,
        color: "#6b7280",
        marginBottom: 8,
    },

    tableWrapper: {
        background: "white",
        padding: 0,
        borderRadius: 12,
        overflowX: "auto",
          overflowY: "auto",
    maxHeight: "1000px", // adjust as needed
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    },

    table: {
        width: "100%",
        minWidth: 700,
    },

    editBtn: {
        background: "#fff7ed",
        color: "#b45309",
        border: "1px solid #fed7aa",
        padding: "6px 12px",
        marginRight: 8,
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
    },

    deleteBtn: {
        background: "#fef2f2",
        color: "#b91c1c",
        border: "1px solid #fecaca",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
    },

    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },

    modal: {
        background: "white",
        padding: 20,
        borderRadius: 10,
        width: 350,
    },

    input: {
        width: "100%",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
    },

    modalActions: {
        display: "flex",
        gap: 10,
    },

    saveBtn: {
        flex: 1,
        padding: 10,
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: 8,
    },

    closeBtn: {
        flex: 1,
        padding: 10,
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: 8,
    },
};