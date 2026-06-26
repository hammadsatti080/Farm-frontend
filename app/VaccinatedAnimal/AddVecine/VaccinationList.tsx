"use client";

import { useEffect, useState } from "react";
import "./VaccinationList.css";
import { useRouter } from "next/navigation";


interface Vaccination {
    _id: string;
    animalId?: { name: string };
    doctorId?: { name: string };
    vaccineName: string;
    dateGiven: string;
    nextDueDate: string;
    notes?: string;
}

export default function VaccinationList() {
    const [data, setData] = useState<Vaccination[]>([]);

    // FETCH
    const fetchVaccinations = async () => {
        try {
            const res = await fetch("https://farm-backend-lac.vercel.app/api/vaccination");
            const result = await res.json();

            setData(result?.data || result || []);
        } catch (err) {
            console.log("Error fetching vaccinations:", err);
            setData([]);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchVaccinations();
        };
        load();
    }, []);
    const router = useRouter();
    const handleadd = () => {
        router.push("/VaccinatedAnimal")
    }
    const handlego = () => {
        router.back();
    }
    return (
        <div className="container">
            <div style={{ gap: "20px", display: "flex" }}>
                <button
                    style={{
                        padding: "10px 18px",
                        background: "linear-gradient(135deg, #28a745, #20c997)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onClick={handleadd}
                >
                    + Add Vaccine
                </button>
                <button
                    style={{
                        padding: "10px 18px",
                        background: "linear-gradient(135deg, #28a745, #20c997)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                        transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onClick={handlego}
                >
                    Go Back
                </button>
            </div>

            <h2 className="title">💉 Vaccination Records</h2>

            {/* TABLE WRAPPER FOR RESPONSIVE SCROLL */}
            <div className="tableWrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Animal</th>
                            <th>Vaccine</th>
                            <th>Doctor</th>
                            <th>Date Given</th>
                            <th>Next Due</th>
                            <th>Notes</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="empty">
                                    No vaccination records found
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.animalId?.name || "-"}</td>
                                    <td>{item.vaccineName}</td>
                                    <td>{item.doctorId?.name || "-"}</td>
                                    <td>
                                        {item.dateGiven
                                            ? new Date(item.dateGiven).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>
                                        {item.nextDueDate
                                            ? new Date(item.nextDueDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{item.notes || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}