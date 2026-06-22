"use client";
import React, { useEffect, useState } from "react";
import { TeamMember } from "./Types";
import { getStyles } from "./Styles";
import { useIsMobile } from "./useIsMobile";

type Props = {
    // Called after a successful save (single or bulk) so a sibling
    // SavedAttendanceTable can refresh its data if desired.
    onSaved?: () => void;
};

const MarkAttendanceTable = ({ onSaved }: Props) => {
    const [teamData, setTeamData] = useState<TeamMember[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");

    const isMobile = useIsMobile();
    const styles = getStyles(isMobile);

    // ================= FETCH TEAM =================
    useEffect(() => {
        fetch("https://farm-backend-lac.vercel.app/api/handleteam")
            .then((res) => res.json())
            .then((data: TeamMember[]) => {
                const updated = data.map((m) => ({
                    ...m,
                    attendance: "Present",
                    selectedDate: "",
                    selectedTime: "",
                }));
                setTeamData(updated);
            })
            .catch((err) => console.error(err));
    }, []);

    // ================= HANDLE CHANGE =================
    const handleChange = (
        id: string,
        field: keyof TeamMember,
        value: string
    ) => {
        setTeamData((prev) =>
            prev.map((m) =>
                m._id === id ? { ...m, [field]: value } : m
            )
        );
    };

    // ================= SAVE SINGLE =================
    const handleSave = (member: TeamMember) => {
        fetch("https://farm-backend-lac.vercel.app/api/saveattendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Attendance Saved!");
                onSaved?.();
            })
            .catch((err) => console.error(err));
    };

    // ================= SAVE ALL =================
    const handleSaveAll = () => {
        const today = new Date().toISOString().split("T")[0];

        const bulkData = teamData.map((m: TeamMember) => ({
            name: m.name,
            attendance: m.attendance,
            selectedDate: m.selectedDate || today,
            selectedTime: m.selectedTime || "",
        }));

        fetch("https://farm-backend-lac.vercel.app/api/saveattendance/bulk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bulkData),
        })
            .then((res) => res.json())
            .then(() => {
                alert("All Attendance Saved Successfully!");
                onSaved?.();
            })
            .catch((err) => console.error(err));
    };

    // ================= FILTER =================
    const filteredData = teamData.filter((m) => {
        const matchName = m.name
            .toLowerCase()
            .includes(search.toLowerCase());

        if (!selectedDate) return matchName;

        return matchName && m.selectedDate === selectedDate;
    });

    return (
        <>
            {/* ================= FILTER ================= */}
            <div style={styles.card}>
                <div style={styles.row}>

                    <input
                        style={styles.input}
                        placeholder="Search team..."
                        value={search}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearch(e.target.value)}
                    />

                    <input
                        style={styles.input}
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <button
                        style={styles.resetBtn}
                        onClick={() => setSelectedDate("")}
                    >
                        Reset
                    </button>
                    <button
                        style={{
                            padding: "10px 15px",
                            background: "#198754",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginBottom: "10px",
                            width: isMobile ? "100%" : "auto",
                        }}
                        onClick={() => handleSaveAll()}
                    >
                        💾 Save All
                    </button>

                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div style={styles.card}>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>#</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Attendance</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Time</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.map((m, i) => (
                                <tr key={m._id}>
                                    <td style={styles.td}>{i + 1}</td>
                                    <td style={styles.td}>{m.name}</td>

                                    <td style={styles.td}>
                                        <select
                                            value={m.attendance}
                                            onChange={(e) =>
                                                handleChange(m._id, "attendance", e.target.value)
                                            }
                                        >
                                            <option>Present</option>
                                            <option>Absent</option>
                                        </select>
                                    </td>

                                    <td style={styles.td}>
                                        <input
                                            type="date"
                                            value={m.selectedDate}
                                            onChange={(e) =>
                                                handleChange(m._id, "selectedDate", e.target.value)
                                            }
                                        />
                                    </td>

                                    <td style={styles.td}>
                                        <input
                                            type="time"
                                            value={m.selectedTime}
                                            onChange={(e) =>
                                                handleChange(m._id, "selectedTime", e.target.value)
                                            }
                                        />
                                    </td>

                                    <td style={styles.td}>
                                        <button
                                            style={styles.saveBtn}
                                            onClick={() => handleSave(m)}
                                        >
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default MarkAttendanceTable;