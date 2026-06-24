"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


type Animal = {
    _id?: string;
    name: string;
    type: string;
    color: string;
    gender: string;
    buyDate: string;
    milk: string;
    vacine: string;
    image: string;
};

type Category = {
    name: string;
};

export default function Page() {
    const [open, setOpen] = useState(false);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [search, setSearch] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize(); // initial check

        window.addEventListener("resize", handleResize);

        return () =>
            window.removeEventListener("resize", handleResize);
    }, []);
    const [form, setForm] = useState<Animal>({
        name: "",
        type: "",
        color: "",
        gender: "",
        buyDate: "",
        milk: "",
        vacine: "",
        image: ""

    });

    const [types, setTypes] = useState<Category[]>([]);

    // =========================
    // 🚀 CLEAN DATA LOADER
    // =========================
    useEffect(() => {
        const loadData = async () => {
            try {
                // categories
                const catRes = await fetch(
                    "https://farm-backend-lac.vercel.app/api/animalcategories"
                );
                const catData = await catRes.json();
                setTypes(catData);

                // animals
                const animalRes = await fetch(
                    "https://farm-backend-lac.vercel.app/api/Handleanimals"
                );
                const animalData = await animalRes.json();
                setAnimals(animalData);
            } catch (err) {
                console.log("Error loading data:", err);
            }
        };

        loadData();
    }, []);

    // =========================
    // ADD ANIMAL
    // =========================
    const handleAdd = async () => {
        if (editId) {
            await fetch(
                `https://farm-backend-lac.vercel.app/api/Handleanimals/${editId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );
        } else {
            await fetch("https://farm-backend-lac.vercel.app/api/Handleanimals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        }

        setOpen(false);
        setEditId(null);

        setForm({
            name: "",
            type: "",
            color: "",
            gender: "",
            buyDate: "",
            milk: "",
            vacine: "",
            image: ""
        });

        const res = await fetch(
            "https://farm-backend-lac.vercel.app/api/Handleanimals"
        );
        const data = await res.json();
        setAnimals(data);
    };

    // =========================
    // FILTER
    // =========================
    const filtered = (animals || []).filter((a) =>
        a.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (animal: Animal) => {
        setForm(animal);
        setEditId(animal._id || null);
        setOpen(true);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;

        await fetch(
            `https://farm-backend-lac.vercel.app/api/Handleanimals/${id}`,
            {
                method: "DELETE",
            }
        );

        const res = await fetch(
            "https://farm-backend-lac.vercel.app/api/Handleanimals"
        );
        const data = await res.json();
        setAnimals(data);
    };

    const router = useRouter();
    const handleback = () => {
        router.back();
    }

    const vaccinatedCount = animals.filter(
        (a) => a.vacine === "Vaccinated"
    ).length;

    const notVaccinatedCount = animals.filter(
        (a) => a.vacine === "Not Vaccinated"
    ).length;

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
                <h2 style={styles.title}>🐄 Animal Management System</h2>
            </div>

            {/* SEARCH + BUTTON */}
            <div style={styles.topBar}>
                <input
                    placeholder="Search animal..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.search}
                />

                <button style={styles.addBtn} onClick={() => setOpen(true)}>
                    + Add
                </button>
                <button style={styles.addBtn} onClick={handleback}>
                    - Back
                </button>
            </div>

            {/* TABLE */}
            <div style={styles.tableWrapper}>
                <div style={styles.tableScroll}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Picture</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Color</th>
                                <th style={styles.th}>Gender</th>
                                <th style={styles.th}>Buy Date</th>
                                <th style={styles.th}>Milk</th>

                                <th style={styles.th}>Vacine</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map((a) => (
                                <tr key={a._id} style={styles.tr}>
                                    <td style={styles.td}>
                                        {a.image ? (
                                            <img
                                                src={a.image}
                                                alt={a.name}
                                                width={60}
                                                height={60}
                                                style={{
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>

                                    <td style={styles.td}>{a.name}</td>
                                    <td style={styles.td}>{a.type}</td>
                                    <td style={styles.td}>{a.color}</td>
                                    <td style={styles.td}>{a.gender}</td>

                                    {/* DATE FIXED */}
                                    <td style={styles.td}>
                                        {a.buyDate ? (
                                            <>
                                                <div>
                                                    {new Date(a.buyDate).toLocaleDateString()}
                                                </div>
                                                <div style={{ fontSize: 12, color: "gray" }}>
                                                    {new Date(a.buyDate).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: 20,
                                                background:
                                                    a.milk === "Milk"
                                                        ? "#d1fae5"      // Green
                                                        : a.milk === "Pregnant"
                                                            ? "#fef3c7"      // Yellow
                                                            : "#fee2e2",     // Red (Not Milk)

                                                color:
                                                    a.milk === "Milk"
                                                        ? "#065f46"      // Dark Green
                                                        : a.milk === "Pregnant"
                                                            ? "#92400e"      // Brown/Orange
                                                            : "#991b1b",     // Dark Red
                                            }}
                                        >
                                            {a.milk}
                                        </span>
                                    </td>

                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: 20,
                                                background:
                                                    a.vacine === "Vaccinated"
                                                        ? "#d1fae5"
                                                        : "#fee2e2",
                                                color:
                                                    a.vacine === "Vaccinated"
                                                        ? "#065f46"
                                                        : "#991b1b",
                                            }}
                                        >
                                            {a.vacine}
                                        </span>
                                    </td>

                                    <td style={styles.td}>
                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                marginRight: 5,
                                                background: "#f59e0b",
                                                color: "white",
                                                border: "none",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleEdit(a)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            style={{
                                                padding: "5px 10px",
                                                background: "#ef4444",
                                                color: "white",
                                                border: "none",
                                                borderRadius: 6,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleDelete(a._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                    gap: 20,
                    marginBottom: 20,
                    marginTop: "50px"
                }}
            >
                {/* Vaccinated Card */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: isMobile ? 18 : 22,
                        textAlign: "center",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                        borderTop: "6px solid #16a34a",
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            color: "#111827",
                            fontSize: isMobile ? 20 : 22,
                        }}
                    >
                        💉 Vaccinated
                    </h3>

                    <div
                        style={{
                            fontSize: isMobile ? 38 : 50,
                            fontWeight: "bold",
                            color: "#16a34a",
                            marginTop: 12,
                        }}
                    >
                        {vaccinatedCount}
                    </div>

                    <p
                        style={{
                            marginTop: 8,
                            color: "#6b7280",
                        }}
                    >
                        Vaccinated Animals
                    </p>
                </div>

                {/* Not Vaccinated Card */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: isMobile ? 18 : 22,
                        textAlign: "center",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
                        borderTop: "6px solid #dc2626",
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            color: "#111827",
                            fontSize: isMobile ? 20 : 22,
                        }}
                    >
                        ❌ Not Vaccinated
                    </h3>

                    <div
                        style={{
                            fontSize: isMobile ? 38 : 50,
                            fontWeight: "bold",
                            color: "#dc2626",
                            marginTop: 12,
                        }}
                    >
                        {notVaccinatedCount}
                    </div>

                    <p
                        style={{
                            marginTop: 8,
                            color: "#6b7280",
                        }}
                    >
                        Not Vaccinated Animals
                    </p>
                </div>
            </div>

            {/* MODAL */}
            {open && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3>{editId ? "✏️ Edit Animal" : "➕ Add Animal"}</h3>

                        <input
                            placeholder="Name"
                            style={styles.input}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />

                        <select
                            style={styles.input}
                            value={form.type}
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value })
                            }
                        >
                            <option value="">Select Type</option>
                            {types.map((t, i) => (
                                <option key={i} value={t.name}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                        <input
                            placeholder="Image URL"
                            style={styles.input}
                            value={form.image}
                            onChange={(e) =>
                                setForm({ ...form, image: e.target.value })
                            }
                        />

                        <input
                            placeholder="Color"
                            style={styles.input}
                            value={form.color}
                            onChange={(e) =>
                                setForm({ ...form, color: e.target.value })
                            }
                        />

                        <select
                            style={styles.input}
                            value={form.gender}
                            onChange={(e) =>
                                setForm({ ...form, gender: e.target.value })
                            }
                        >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <input
                            type="datetime-local"
                            style={styles.input}
                            value={form.buyDate}
                            onChange={(e) =>
                                setForm({ ...form, buyDate: e.target.value })
                            }
                        />

                        <select
                            style={styles.input}
                            value={form.milk}
                            onChange={(e) =>
                                setForm({ ...form, milk: e.target.value })
                            }
                        >
                            <option value="">Milk Status</option>
                            <option value="Milk">Milk</option>
                            <option value="Not Milk">Not Milk</option>
                            <option value="Pregnant">Pregnant</option>
                        </select>
                        <select
                            style={styles.input}
                            value={form.vacine}
                            onChange={(e) =>
                                setForm({ ...form, vacine: e.target.value })
                            }
                        >
                            <option value="">Vaccine Status</option>
                            <option value="Vaccinated">Vaccinated</option>
                            <option value="Not Vaccinated">Not Vaccinated</option>
                        </select>

                        <div style={styles.modalActions}>
                            <button style={styles.saveBtn} onClick={handleAdd}>
                                Save
                            </button>
                            <button
                                style={styles.closeBtn}
                                onClick={() => setOpen(false)}
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

/* ================= INLINE CSS ================= */
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
        fontSize: 18,
        color: "white"
    },

    topBar: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 15,
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

    tableWrapper: {
        background: "white",
        borderRadius: 10,
        padding: 10,
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "1000px", // adjust as needed
    },

    tableScroll: {
        overflowX: "auto",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: 600,
    },

    th: {
        textAlign: "left",
        padding: 10,
        borderBottom: "2px solid #eee",
    },

    td: {
        padding: 10,
        borderBottom: "1px solid #eee",
    },

    tr: {},

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
        padding: 10,
    },

    modal: {
        background: "white",
        padding: 15,
        margin: 30,
        width: "100%",
        maxWidth: 350,
        borderRadius: 12,
    },

    input: {
        width: "95%",
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
        background: "#16a34a",
        color: "white",
        padding: 10,
        border: "none",
        borderRadius: 8,
    },

    closeBtn: {
        flex: 1,
        background: "#ef4444",
        color: "white",
        padding: 10,
        border: "none",
        borderRadius: 8,
    },
};