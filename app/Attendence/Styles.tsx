import { CSSProperties } from "react";

// Pass isMobile in so callers can build a responsive style object
export const getStyles = (isMobile: boolean): { [key: string]: CSSProperties } => ({
    container: {
        maxWidth: "1100px",
        margin: "auto",
        padding: isMobile ? "10px" : "20px",
        fontFamily: "Arial",
    },
    title: {
        textAlign: "center",
        fontSize: isMobile ? "22px" : "28px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    card: {
        background: "#fff",
        padding: isMobile ? "10px" : "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px",
        marginRight:"20px"
    },
    row: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        flexDirection: isMobile ? "column" : "row",
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        flex: 1,
        minWidth: isMobile ? "100%" : "180px",
        boxSizing: "border-box",
    },
    resetBtn: {
        padding: "10px 15px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        background: "#6c757d",
        color: "#fff",
        width: isMobile ? "100%" : "auto",
    },
    // Wrapper that enables left-to-right scrolling on small screens
    tableWrapper: {
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
    },
    table: {
        width: "100%",
        minWidth: isMobile ? "650px" : "auto",
        borderCollapse: "collapse",
    },
    th: {
        background: "#f5f5f5",
        padding: "10px",
        textAlign: "left",
        whiteSpace: "nowrap",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #eee",
        whiteSpace: "nowrap",
    },
    saveBtn: {
        padding: "6px 10px",
        background: "green",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
});

// Small reusable hook-like helper for mobile detection
export const MOBILE_BREAKPOINT = 768;