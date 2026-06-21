"use client";

import React, { useEffect, useState } from "react";

type Type = {
    _id?: string;
    name: string;
};

export default function Inventorycatagory() {
    const [types, setTypes] = useState<Type[]>([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState<
        string | null
    >(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // ✅ MOBILE DETECTION
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(
                window.innerWidth <= 768
            );
        };

        handleResize();
        window.addEventListener(
            "resize",
            handleResize
        );

        return () =>
            window.removeEventListener(
                "resize",
                handleResize
            );
    }, []);

    // SAFE FETCH
    useEffect(() => {
        let isMounted = true;

        const fetchTypes = async () => {
            try {
                const res = await fetch(
                    "https://farm-backend-lac.vercel.app/api/inventory-types"
                );
                const data = await res.json();

                if (isMounted) {
                    setTypes(data || []);
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
                if (isMounted)
                    setLoading(false);
            }
        };

        fetchTypes();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSave = async () => {
        if (!name) return;

        if (editId) {
            await fetch(
                `https://farm-backend-lac.vercel.app/api/inventory-types/${editId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                    }),
                }
            );
        } else {
            await fetch(
                "https://farm-backend-lac.vercel.app/api/inventory-types",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                    }),
                }
            );
        }

        setName("");
        setEditId(null);
        fetchTypes();
    };

    const fetchTypes = async () => {
        const res = await fetch(
            "https://farm-backend-lac.vercel.app/api/inventory-types"
        );
        const data = await res.json();
        setTypes(data || []);
    };

    const handleEdit = (t: Type) => {
        setName(t.name);
        setEditId(t._id || null);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;

        await fetch(
            `https://farm-backend-lac.vercel.app/api/inventory-types/${id}`,
            {
                method: "DELETE",
            }
        );

        fetchTypes();
    };

    if (loading) {
        return (
            <div style={styles.loading}>
                Loading...
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>
                📦 Inventory Types
            </h1>

            {/* FORM (RESPONSIVE) */}
            <div
                style={{
                    ...styles.form,
                    flexDirection: isMobile
                        ? "column"
                        : "row",
                }}
            >
                <input
                    value={name}
                    placeholder="Enter type name"
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    style={styles.input}
                />

                <button
                    onClick={handleSave}
                    style={styles.btn}
                >
                    {editId ? "Update" : "Add"}
                </button>
            </div>

            {/* CARDS GRID */}
            <div
                style={{
                    ...styles.grid,
                    gridTemplateColumns:
                        isMobile
                            ? "1fr"
                            : "repeat(auto-fit,minmax(200px,1fr))",
                }}
            >
                {types.map((t) => (
                    <div
                        key={t._id}
                        style={styles.card}
                    >
                        <h3>{t.name}</h3>

                        <div style={styles.actions}>
                            <button
                                style={
                                    styles.edit
                                }
                                onClick={() =>
                                    handleEdit(t)
                                }
                            >
                                Edit
                            </button>

                            <button
                                style={
                                    styles.delete
                                }
                                onClick={() =>
                                    handleDelete(
                                        t._id
                                    )
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
const styles: Record<
    string,
    React.CSSProperties
> = {
    page: {
        padding: 20,
        fontFamily: "Arial",
        background: "#f3f4f6",
        minHeight: "100vh",
    },

    title: {
        marginBottom: 20,
        color: "#111827",
    },

    form: {
        display: "flex",
        gap: 10,
        marginBottom: 20,
    },

    input: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
    },

    btn: {
        padding: "10px 15px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: 8,
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit,minmax(200px,1fr))",
        gap: 15,
    },

    card: {
        background: "white",
        padding: 15,
        borderRadius: 12,
        boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
    },

    actions: {
        display: "flex",
        gap: 10,
        marginTop: 10,
    },

    edit: {
        flex: 1,
        padding: 8,
        background: "#f59e0b",
        border: "none",
        color: "white",
        borderRadius: 6,
    },

    delete: {
        flex: 1,
        padding: 8,
        background: "#ef4444",
        border: "none",
        color: "white",
        borderRadius: 6,
    },

    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: 20,
    },
};