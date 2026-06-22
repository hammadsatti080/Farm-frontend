"use client";
import React, { useRef } from "react";
import MarkAttendanceTable from "./Markattendancetable";
import SavedAttendanceTable, { SavedAttendanceTableHandle } from "./Savedattendancetable";
import { getStyles } from "./Styles";
import { useIsMobile } from "./useIsMobile";

const Attendance = () => {
    const isMobile = useIsMobile();
    const styles = getStyles(isMobile);

    const savedTableRef = useRef<SavedAttendanceTableHandle>(null);

    return (
        <div
            style={{
                ...styles.container,
                overflowX: "hidden",
                width: "100%",
                maxWidth: "100vw",
            }}
        >

            {/* GLOBAL CSS FIX (PREVENT HORIZONTAL SCROLL) */}
            <style jsx global>{`
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow-x: hidden;
                    width: 100%;
                }

                * {
                    box-sizing: border-box;
                }
            `}</style>

            {/* ================= TITLE ================= */}
            <div style={styles.title}>📊 Attendance System</div>

            {/* ================= MARK ATTENDANCE ================= */}
            <div style={{ width: "100%", overflowX: "hidden" }}>
                <MarkAttendanceTable
                    onSaved={() => savedTableRef.current?.refresh()}
                />
            </div>

            {/* ================= SAVED RECORDS ================= */}
            <div style={{ width: "100%", overflowX: "hidden" }}>
                <SavedAttendanceTable ref={savedTableRef} />
            </div>

        </div>
    );
};

export default Attendance;