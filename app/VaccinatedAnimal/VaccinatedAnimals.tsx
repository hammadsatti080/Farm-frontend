"use client";

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
};

export default function VaccinationView() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [view, setView] = useState<"VACCINATED" | "NON_VACCINATED">(
        "VACCINATED"
    );

    // FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    "https://farm-backend-lac.vercel.app/api/Handleanimals"
                );
                const data = await res.json();
                setAnimals(data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    // AUTO OPEN VACCINATED
    useEffect(() => {
        setView("VACCINATED");
    }, []);

    const vaccinated = animals.filter(
        (a) => a.vacine === "Vaccinated"
    );

    const notVaccinated = animals.filter(
        (a) => a.vacine === "Not Vaccinated"
    );

    const data =
        view === "VACCINATED" ? vaccinated : notVaccinated;

    return (
        <div
            style={{
                padding: 20,
                background: "#f3f4f6",
                minHeight: "100vh",
            }}
        >
            {/* HEADER BUTTONS */}
            <div
                style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 20,
                    flexWrap: "wrap",
                }}
            >
                <button
                    onClick={() => setView("VACCINATED")}
                    style={{
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        background:
                            view === "VACCINATED"
                                ? "#16a34a"
                                : "#e5e7eb",
                        color:
                            view === "VACCINATED"
                                ? "#fff"
                                : "#111",
                    }}
                >
                    💉 Vaccinated ({vaccinated.length})
                </button>

                <button
                    onClick={() => setView("NON_VACCINATED")}
                    style={{
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 600,
                        background:
                            view === "NON_VACCINATED"
                                ? "#dc2626"
                                : "#e5e7eb",
                        color:
                            view === "NON_VACCINATED"
                                ? "#fff"
                                : "#111",
                    }}
                >
                    ❌ Not Vaccinated ({notVaccinated.length})
                </button>
            </div>

            {/* CARDS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: 15,
                }}
            >
                {data.map((a) => (
                    <div
                        key={a._id}
                        style={{
                            background: "#fff",
                            padding: 15,
                            borderRadius: 12,
                            boxShadow:
                                "0 4px 10px rgba(0,0,0,0.08)",
                        }}
                    >
                        <h3 style={{ marginBottom: 6 }}>
                            {a.name}
                        </h3>

                        <p>Type: {a.type}</p>
                        <p>Color: {a.color}</p>
                        <p>Gender: {a.gender}</p>

                        {/* DATE */}
                        <p
                            style={{
                                marginTop: 8,
                                fontSize: 13,
                                color: "#6b7280",
                            }}
                        >
                            📅 Date:{" "}
                            {a.buyDate
                                ? new Date(
                                      a.buyDate
                                  ).toLocaleDateString()
                                : "-"}
                        </p>

                        {/* TIME */}
                        <p
                            style={{
                                fontSize: 13,
                                color: "#6b7280",
                            }}
                        >
                            ⏰ Time:{" "}
                            {a.buyDate
                                ? new Date(
                                      a.buyDate
                                  ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "-"}
                        </p>

                        {/* VACCINE BADGE */}
                        <span
                            style={{
                                display: "inline-block",
                                marginTop: 10,
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
                                fontSize: 12,
                                fontWeight: 600,
                            }}
                        >
                            {a.vacine}
                        </span>

                        {/* REMINDER BOX */}
                        <div
                            style={{
                                marginTop: 10,
                                padding: "8px 10px",
                                borderRadius: 8,
                                background: "#fef3c7",
                                color: "#92400e",
                                fontSize: 12,
                                fontWeight: 500,
                            }}
                        >
                            ⏳ After 3 month  again run for better treatment
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}