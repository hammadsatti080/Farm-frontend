"use client";

import React, { useEffect, useState } from "react";

type Animal = {
    _id: string;
    name: string;
    type: string;
    color: string;
    gender: string;
    milk: string;
    vacine: string;
    image?: string;
};

type VaccinationRecord = {
    _id: string;
    animalId: string | { _id: string };
    vaccineName: string;
    doctorId?: string;
    dateGiven: string;
    nextDueDate?: string;
    notes?: string;
    status: "Completed" | "Pending" | "Overdue";
    createdAt?: string;
    updatedAt?: string;
};

const FONT_IMPORT_ID = "farm-stock-fonts";

function ensureFonts() {
    if (typeof document === "undefined") return;
    if (document.getElementById(FONT_IMPORT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_IMPORT_ID;
    link.rel = "stylesheet";
    link.href =
        "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
}

// Normalizes whatever string we end up with (vaccination status, or legacy
// "vacine" field) into a record-tag color + label.
function vaccineTag(statusOrLegacy: string) {
    const v = (statusOrLegacy || "").toLowerCase();
    if (v === "completed" || v === "vaccinated") {
        return { label: "Vaccinated", tone: "good" as const };
    }
    if (v === "pending") {
        return { label: "Pending", tone: "watch" as const };
    }
    if (v === "overdue") {
        return { label: "Overdue", tone: "alert" as const };
    }
    return { label: statusOrLegacy || "Due", tone: "alert" as const };
}

// Builds a lookup of animalId -> most recent Vaccination record.
function buildLatestVaccinationMap(
    records: VaccinationRecord[]
): Record<string, VaccinationRecord> {
    const latest: Record<string, VaccinationRecord> = {};

    for (const rec of records) {
        const id =
            typeof rec.animalId === "string" ? rec.animalId : rec.animalId?._id;
        if (!id) continue;

        const existing = latest[id];
        if (!existing) {
            latest[id] = rec;
            continue;
        }

        // Prefer whichever record has the more recent dateGiven; fall back to
        // updatedAt/createdAt if dateGiven ties or is missing.
        const existingDate = new Date(
            existing.dateGiven || existing.updatedAt || existing.createdAt || 0
        ).getTime();
        const recDate = new Date(
            rec.dateGiven || rec.updatedAt || rec.createdAt || 0
        ).getTime();

        if (recDate >= existingDate) {
            latest[id] = rec;
        }
    }

    return latest;
}

const toneColors: Record<"good" | "watch" | "alert", { bg: string; fg: string; dot: string }> = {
    good: { bg: "#EEF3E6", fg: "#3F5A33", dot: "#5C7F4A" },
    watch: { bg: "#FBF1DC", fg: "#8A6113", dot: "#C8932B" },
    alert: { bg: "#FBEAE4", fg: "#923B22", dot: "#B8472A" },
};

function EarTag({ label, tone }: { label: string; tone: "good" | "watch" | "alert" }) {
    const c = toneColors[tone];
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 11px 5px 9px",
                borderRadius: 4,
                background: c.bg,
                color: c.fg,
                fontFamily: "Inter, sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: "0.01em",
                transform: "rotate(-1deg)",
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: c.dot,
                    flexShrink: 0,
                }}
            />
            {label}
        </span>
    );
}

function RecordCard({
    animal,
    index,
    vaccination,
}: {
    animal: Animal;
    index: number;
    vaccination?: VaccinationRecord;
}) {
    // Prefer the live Vaccination record's status; fall back to the legacy
    // "vacine" string on the animal if no vaccination record exists yet.
    const vac = vaccineTag(vaccination?.status || animal.vacine);
    const recordNo = String(index + 1).padStart(3, "0");

    return (
        <div
            style={{
                background: "#FFFDF8",
                border: "1px solid #E6DDC9",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(28,26,23,0.04)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div style={{ position: "relative" }}>
                <img
                    src={animal.image || "https://via.placeholder.com/400x280?text=No+Photo"}
                    alt={animal.name}
                    style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        display: "block",
                        filter: "saturate(0.96)",
                    }}
                />
                <span
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        background: "rgba(28,26,23,0.78)",
                        color: "#FAF6EE",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        padding: "4px 8px",
                        borderRadius: 3,
                    }}
                >
                    NO. {recordNo}
                </span>
            </div>

            <div style={{ padding: "18px 20px 20px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 10,
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontFamily: "'Fraunces', serif",
                            fontSize: 24,
                            fontWeight: 600,
                            color: "#1C1A17",
                            lineHeight: 1.15,
                        }}
                    >
                        {animal.name}
                    </h2>
                    <span
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 11.5,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "#8B5A2B",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {animal.type}
                    </span>
                </div>

                <div
                    style={{
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: "1px dashed #E6DDC9",
                        display: "flex",
                        gap: 22,
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13.5,
                        color: "#5B5448",
                    }}
                >
                    <div>
                        <div style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9C9485", marginBottom: 2 }}>
                            Color
                        </div>
                        <div style={{ color: "#1C1A17", fontWeight: 500 }}>{animal.color}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 10.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "#9C9485", marginBottom: 2 }}>
                            Gender
                        </div>
                        <div style={{ color: "#1C1A17", fontWeight: 500 }}>{animal.gender}</div>
                    </div>
                </div>

                <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <EarTag label={vac.label} tone={vac.tone} />
                </div>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div
            style={{
                background: "#FFFDF8",
                border: "1px solid #E6DDC9",
                borderRadius: 10,
                overflow: "hidden",
            }}
        >
            <div style={{ height: 200, background: "#EFE8D8" }} />
            <div style={{ padding: "18px 20px 20px" }}>
                <div style={{ height: 20, width: "55%", background: "#EFE8D8", borderRadius: 4 }} />
                <div style={{ height: 12, width: "30%", background: "#EFE8D8", borderRadius: 4, marginTop: 14 }} />
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                    <div style={{ height: 24, width: 80, background: "#EFE8D8", borderRadius: 4 }} />
                    <div style={{ height: 24, width: 90, background: "#EFE8D8", borderRadius: 4 }} />
                </div>
            </div>
        </div>
    );
}

export default function Stock() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [vaccinationMap, setVaccinationMap] = useState<
        Record<string, VaccinationRecord>
    >({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        ensureFonts();

        Promise.all([
            fetch("https://farm-backend-lac.vercel.app/api/Handleanimals").then((res) =>
                res.json()
            ),
            fetch("https://farm-backend-lac.vercel.app/api/vaccination").then((res) =>
                res.json()
            ),
        ])
            .then(([animalsData, vaccinationData]) => {
                setAnimals(Array.isArray(animalsData) ? animalsData : []);

                const records: VaccinationRecord[] = Array.isArray(vaccinationData)
                    ? vaccinationData
                    : Array.isArray(vaccinationData?.data)
                        ? vaccinationData.data
                        : [];

                setVaccinationMap(buildLatestVaccinationMap(records));
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
                padding: "48px 32px 64px",
            }}
        >
            <div style={{ maxWidth: 1180, margin: "0 auto" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        borderBottom: "2px solid #1C1A17",
                        paddingBottom: 18,
                        marginBottom: 32,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 12,
                                fontWeight: 600,
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                                color: "#8B5A2B",
                                marginBottom: 6,
                            }}
                        >
                            Livestock Register
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                fontFamily: "'Fraunces', serif",
                                fontSize: "clamp(32px, 4vw, 44px)",
                                fontWeight: 700,
                                color: "#1C1A17",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            Farm Stock
                        </h1>
                    </div>
                </div>

                {error ? (
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            color: "#923B22",
                            background: "#FBEAE4",
                            border: "1px solid #E6C3B5",
                            borderRadius: 8,
                            padding: "16px 18px",
                            fontSize: 14,
                        }}
                    >
                        Could not load the register. Check the connection and try again.
                    </div>
                ) : loading ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 22,
                        }}
                    >
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : animals.length === 0 ? (
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            color: "#5B5448",
                            textAlign: "center",
                            padding: "60px 20px",
                            border: "1px dashed #D8CDB4",
                            borderRadius: 10,
                        }}
                    >
                        No animals recorded yet.
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: 22,
                        }}
                    >
                        {animals.map((animal, i) => (
                            <RecordCard
                                key={animal._id}
                                animal={animal}
                                index={i}
                                vaccination={vaccinationMap[animal._id]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}