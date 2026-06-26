"use client";

import React, { useEffect, useState } from "react";
import VaccineCategoryCards from "./VaccineCategoryCards";

interface AnimalCategory {
    _id: string;
    name: string;
}

interface Vaccine {
    name: string;
}

interface FormData {
    animalCategory: string;
    vaccines: Vaccine[];
}

export default function VaccineCatagory() {
    const [categories, setCategories] = useState<AnimalCategory[]>([]);

    const [form, setForm] = useState<FormData>({
        animalCategory: "",
        vaccines: [{ name: "" }],
    });

    // FETCH CATEGORIES
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(
                    "https://farm-backend-lac.vercel.app/api/animalcategories"
                );

                const data = await res.json();

                setCategories(data.data || data);
            } catch (err) {
                console.log(err);
            }
        };

        load();
    }, []);
    // ADD VACCINE FIELD
    const addVaccine = () => {
        setForm({
            ...form,
            vaccines: [...form.vaccines, { name: "" }],
        });
    };

    // UPDATE VACCINE
    const updateVaccine = (index: number, value: string) => {
        const updated = [...form.vaccines];
        updated[index].name = value;

        setForm({
            ...form,
            vaccines: updated,
        });
    };

    // REMOVE VACCINE
    const removeVaccine = (index: number) => {
        setForm({
            ...form,
            vaccines: form.vaccines.filter((_, i) => i !== index),
        });
    };

    // SUBMIT DATA
    const handleSubmit = async () => {
        try {
            const res = await fetch(
                "https://farm-backend-lac.vercel.app/api/vaccine-category",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            await res.json();

            alert("Saved Successfully");

            setForm({
                animalCategory: "",
                vaccines: [{ name: "" }],
            });
        } catch (err) {
            console.log(err);
            alert("Error Saving Data");
        }
    };

    return (
        <div>
            <div
                style={{
                    maxWidth: "700px",
                    margin: "30px auto",
                    padding: "20px",
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Add Vaccines
                </h2>

                {/* ANIMAL CATEGORY */}
                <select
                    value={form.animalCategory}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            animalCategory: e.target.value,
                        })
                    }
                    style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                    }}
                >
                    <option value="">Select Animal Category</option>

                    {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                {/* VACCINE SECTION */}
                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        marginTop: "20px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "15px",
                        }}
                    >
                        <h4>Vaccines</h4>

                        <button
                            type="button"
                            onClick={addVaccine}
                            style={{
                                background: "#28a745",
                                color: "#fff",
                                border: "none",
                                padding: "8px 15px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            ➕ Add
                        </button>
                    </div>

                    {form.vaccines.map((vaccine, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Enter Vaccine Name"
                                value={vaccine.name}
                                onChange={(e) =>
                                    updateVaccine(index, e.target.value)
                                }
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "6px",
                                    fontSize: "15px",
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => removeVaccine(index)}
                                style={{
                                    background: "#dc3545",
                                    color: "#fff",
                                    border: "none",
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>

                {/* SAVE BUTTON */}
                <button
                    onClick={handleSubmit}
                    style={{
                        width: "100%",
                        marginTop: "20px",
                        padding: "12px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Save
                </button>
            </div>
            <div>
                <VaccineCategoryCards />
            </div>
        </div>
    );
}