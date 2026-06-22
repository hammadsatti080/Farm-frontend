import React, { useEffect, useState, CSSProperties } from "react";

type TeamMember = {
    _id: string;
    name: string;
    attendance: string;
    selectedDate: string;
    selectedTime: string;
};

const Attendance = () => {
    const [teamData, setTeamData] = useState<TeamMember[]>([]);
    const [savedAttendance, setSavedAttendance] = useState<TeamMember[]>([]);

    const [search, setSearch] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [savedSearch, setSavedSearch] = useState<string>("");
    const [savedDate, setSavedDate] = useState<string>("");

    const getTodayDate = (): string => {
        return new Date().toISOString().split("T")[0];
    };

    // ================= FETCH TEAM =================
    useEffect(() => {
        fetch("http://localhost:5000/api/handleteam")
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
            .catch(console.error);
    }, []);

    // ================= FETCH SAVED =================
    useEffect(() => {
        fetch("http://localhost:5000/api/all")
            .then((res) => res.json())
            .then((data: TeamMember[]) => setSavedAttendance(data))
            .catch(console.error);
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

    // ================= SAVE =================
    const handleSave = (member: TeamMember) => {
        fetch("http://localhost:5000/api/saveattendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(member),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Attendance Saved!");
                return fetch("http://localhost:5000/api/all");
            })
            .then((res) => res.json())
            .then((data: TeamMember[]) => setSavedAttendance(data))
            .catch(console.error);
    };

    // ================= FILTERS =================
    const filteredData = teamData.filter((m) => {
        const name = m.name ?? "";
        const matchName = name.toLowerCase().includes(search.toLowerCase());
        if (!selectedDate) return matchName;
        return matchName && m.selectedDate === selectedDate;
    });

    const filteredSavedAttendance = savedAttendance.filter((item) => {
        const name = item.name ?? "";
        const matchName = name.toLowerCase().includes(savedSearch.toLowerCase());
        const filterDate = savedDate || getTodayDate();
        return matchName && item.selectedDate === filterDate;
    });

    // ================= INLINE STYLES =================
    const styles: { [key: string]: CSSProperties } = {
        container: {
            maxWidth: "1100px",
            margin: "auto",
            padding: "12px",
            fontFamily: "Arial",
            overflowX: "hidden",
        },
        title: {
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "15px",
        },
        card: {
            background: "#fff",
            padding: "12px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            marginBottom: "15px",
            overflowX: "hidden",
        },
        row: {
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
        },
        input: {
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            flex: 1,
            minWidth: "140px",
            maxWidth: "100%",
        },
        resetBtn: {
            padding: "10px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: "#6c757d",
            color: "#fff",
        },
        tableWrapper: {
            width: "100%",
            overflowX: "hidden",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
        },
        th: {
            background: "#f5f5f5",
            padding: "8px",
            textAlign: "left",
            fontSize: "13px",
        },
        td: {
            padding: "8px",
            borderBottom: "1px solid #eee",
            fontSize: "13px",
            wordBreak: "break-word",
        },
        saveBtn: {
            padding: "6px 8px",
            background: "green",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
        },
    };

    return (
        <div style={styles.container}>

            <div style={styles.title}>📊 Attendance System</div>

            {/* ================= MAIN FILTER ================= */}
            <div style={styles.card}>
                <div style={styles.row}>
                    <input
                        style={styles.input}
                        placeholder="Search team..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

            {/* ================= SAVED FILTER ================= */}
            <div style={styles.card}>
                <div style={styles.row}>
                    <input
                        style={styles.input}
                        placeholder="Search saved..."
                        value={savedSearch}
                        onChange={(e) => setSavedSearch(e.target.value)}
                    />

                    <input
                        style={styles.input}
                        type="date"
                        value={savedDate}
                        onChange={(e) => setSavedDate(e.target.value)}
                    />

                    <button
                        style={styles.resetBtn}
                        onClick={() => setSavedDate(getTodayDate())}
                    >
                        Today
                    </button>
                </div>
            </div>

            {/* ================= SAVED TABLE ================= */}
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
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSavedAttendance.map((item, i) => (
                                <tr key={item._id}>
                                    <td style={styles.td}>{i + 1}</td>
                                    <td style={styles.td}>{item.name}</td>
                                    <td style={styles.td}>{item.attendance}</td>
                                    <td style={styles.td}>{item.selectedDate}</td>
                                    <td style={styles.td}>{item.selectedTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Attendance;