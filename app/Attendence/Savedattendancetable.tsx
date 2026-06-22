"use client";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { TeamMember } from "./Types";
import { getStyles } from "./Styles";
import { useIsMobile } from "./useIsMobile";

// Exposes a refresh() method so a parent (or sibling) can force a re-fetch
// after a save happens in MarkAttendanceTable.
export type SavedAttendanceTableHandle = {
    refresh: () => void;
};

const SavedAttendanceTable = forwardRef<SavedAttendanceTableHandle>((_props, ref) => {
    const [savedAttendance, setSavedAttendance] = useState<TeamMember[]>([]);
    const [savedSearch, setSavedSearch] = useState<string>("");
    const [savedDate, setSavedDate] = useState<string>("");

    const isMobile = useIsMobile();
    const styles = getStyles(isMobile);

    const getTodayDate = () => new Date().toISOString().split("T")[0];

    const fetchSaved = () => {
        fetch("https://farm-backend-lac.vercel.app/api/all")
            .then((res) => res.json())
            .then((data: TeamMember[]) => setSavedAttendance(data))
            .catch((err) => console.error(err));
    };

    // ================= FETCH SAVED (initial) =================
    useEffect(() => {
        fetchSaved();
    }, []);

    // Let parent trigger a refresh via ref.current.refresh()
    useImperativeHandle(ref, () => ({
        refresh: fetchSaved,
    }));

    // ================= FILTER (TODAY DEFAULT) =================
    const filteredSavedAttendance = savedAttendance.filter((item) => {
        const matchName = item.name
            .toLowerCase()
            .includes(savedSearch.toLowerCase());

        const today = getTodayDate();
        const filterDate = savedDate || today;

        return matchName && item.selectedDate === filterDate;
    });

    return (
        <>
            {/* ================= FILTER ================= */}
            <div style={styles.card}>
                <div style={styles.row}>

                    <input
                        style={styles.input}
                        placeholder="Search saved..."
                        value={savedSearch}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSavedSearch(e.target.value)
                        }
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
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSavedAttendance.map((item, i) => (
                                <tr key={item._id}>
                                    <td style={styles.td}>{i + 1}</td>
                                    <td style={styles.td}>{item.name}</td>

                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "6px",
                                                color: "#fff",
                                                background:
                                                    item.attendance === "Present"
                                                        ? "green"
                                                        : "red",
                                            }}
                                        >
                                            {item.attendance}
                                        </span>
                                    </td>

                                    <td style={styles.td}>{item.selectedDate}</td>
                                    <td style={styles.td}>{item.selectedTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
});

SavedAttendanceTable.displayName = "SavedAttendanceTable";

export default SavedAttendanceTable;