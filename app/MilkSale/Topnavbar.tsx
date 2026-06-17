"use client";

import { useState, useEffect } from "react";


export default function Topnavbar() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

    const [form, setForm] = useState({
        category: "",
        name: "",
        type: "",
        quantity: 1,
        quantityType: "kilo",
        pricePerKg: "",
        date: "",
    });

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);

        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    // FETCH CATEGORIES
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/categories");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const today = new Date().toISOString().split("T")[0];

    const increaseQty = () => {
        setForm({ ...form, quantity: form.quantity + 1 });
    };

    const decreaseQty = () => {
        if (form.quantity > 1) {
            setForm({ ...form, quantity: form.quantity - 1 });
        }
    };

    // CONVERT QTY
    const calculatedQuantity =
        form.quantityType === "liter"
            ? form.quantity * 10
            : form.quantity;

    // AUTO TOTAL PRICE
    const totalPrice =
        form.pricePerKg
            ? calculatedQuantity * Number(form.pricePerKg)
            : 0;

    // SAVE SALE
    const handleSaveSale = async () => {
        try {
            const finalQuantity =
                form.quantityType === "liter"
                    ? form.quantity * 10
                    : form.quantity;

            const finalTotalPrice =
                finalQuantity * Number(form.pricePerKg);

            const saleData = {
                category: form.category,
                milkType: form.type,
                name: form.name,
                quantity: finalQuantity,
                quantityType: "kilo",
                originalQuantity: form.quantity,
                originalQuantityType: form.quantityType,
                pricePerKg: Number(form.pricePerKg),
                totalPrice: finalTotalPrice,
                date: form.date,
                time,
            };

            const res = await fetch("http://localhost:5000/api/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(saleData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to save sale");
            }

            alert("Sale Added Successfully!");

            setForm({
                category: "",
                type: "",
                quantity: 1,
                quantityType: "kilo",
                pricePerKg: "",
                date: "",
                name: "", // reset
            });

            setOpen(false);
        } catch (error) {
            console.error(error);
            alert("Error saving sale");
        }
    };

    return (
        <>
            {/* NAVBAR */}
            <nav
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "15px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px 20px",
                }}
            >
                <input
                    type="text"
                    placeholder="Search milk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: isMobile ? "100%" : "350px",
                        padding: "12px",
                        borderRadius: "12px",
                        border: "none",
                        outline: "none",
                        fontSize: "15px",
                    }}
                />

                <button
                    onClick={() => setOpen(true)}
                    style={{
                        background: "#22c55e",
                        color: "#fff",
                        border: "none",
                        padding: "12px 25px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "15px",
                        boxShadow: "0 4px 12px rgba(34,197,94,.4)",
                    }}
                >
                    + Sale
                </button>
            </nav>

            {/* MODAL */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,.55)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        zIndex: 999,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            maxWidth: "500px",
                            background: "#fff",
                            borderRadius: "20px",
                            padding: "25px",

                            boxShadow: "0 10px 30px rgba(0,0,0,.25)",
                            marginTop: "70px",
                            /* ✅ SCROLL FIX */
                            maxHeight: "80vh",
                            overflowY: "auto",
                        }}
                    >
                        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                            🛒 Add Sale
                        </h2>
                        {/* ✅ NAME FIELD (NEW) */}
                        <input
                            type="text"
                            placeholder="Customer / Sale Name"
                            style={inputStyle}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        {/* CATEGORY */}
                        <select
                            style={inputStyle}
                            value={form.category}
                            onChange={(e) =>
                                setForm({ ...form, category: e.target.value })
                            }
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* MILK TYPE */}
                        <select
                            style={inputStyle}
                            value={form.type}
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value })
                            }
                        >
                            <option value="">Select Milk Type</option>
                            <option>Cow</option>
                            <option>Buffalo</option>
                            <option>Goat</option>
                        </select>


                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "10px",
                            }}
                        >
                            <button onClick={decreaseQty} style={qtyBtnRed}>
                                −
                            </button>

                            <div
                                style={{
                                    width: "140px",
                                    textAlign: "center",
                                    padding: "12px",
                                    background: "#f8fafc",
                                    borderRadius: "10px",
                                    fontWeight: "bold",
                                }}
                            >
                                {form.quantity} {form.quantityType}
                            </div>

                            <button onClick={increaseQty} style={qtyBtnGreen}>
                                +
                            </button>
                        </div>

                        {/* QUANTITY TYPE */}
                        <select
                            style={inputStyle}
                            value={form.quantityType}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    quantityType: e.target.value,
                                })
                            }
                        >
                            <option value="kilo">Kilo</option>
                            <option value="liter">Liter</option>
                        </select>

                        {/* PRICE PER KG */}
                        <input
                            type="number"
                            placeholder="Price per KG"
                            style={inputStyle}
                            value={form.pricePerKg}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    pricePerKg: e.target.value,
                                })
                            }
                        />

                        {/* AUTO TOTAL PRICE */}
                        <div
                            style={{
                                marginTop: "10px",
                                background: "#f1f5f9",
                                padding: "12px",
                                borderRadius: "10px",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                        >
                            💰 Total Price: {totalPrice}
                        </div>

                        {/* DATE */}
                        <input
                            type="date"
                            min={today}
                            style={inputStyle}
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                        />

                        {/* TIME */}
                        <div
                            style={{
                                marginTop: "10px",
                                background: "#eff6ff",
                                padding: "12px",
                                borderRadius: "10px",
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#2563eb",
                            }}
                        >
                            ⏰ {time}
                        </div>

                        {/* BUTTONS */}
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button
                                onClick={handleSaveSale}
                                style={{
                                    flex: 1,
                                    background: "#22c55e",
                                    color: "#fff",
                                    border: "none",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Save Sale
                            </button>

                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    flex: 1,
                                    background: "#ef4444",
                                    color: "#fff",
                                    border: "none",
                                    padding: "14px",
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}

// STYLES
const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #dbeafe",
    marginBottom: "12px",
    fontSize: "15px",
};

const qtyBtnGreen = {
    width: "45px",
    height: "45px",
    border: "none",
    borderRadius: "50%",
    background: "#22c55e",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
};

const qtyBtnRed = {
    width: "45px",
    height: "45px",
    border: "none",
    borderRadius: "50%",
    background: "#ef4444",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
};
