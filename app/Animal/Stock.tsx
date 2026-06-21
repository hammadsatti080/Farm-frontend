
import { useRouter } from "next/navigation";
import React from "react";

export default function Stock() {
    const router = useRouter();

    const styles = {
        container: {
            padding: "20px",
            maxWidth: "900px",
            margin: "0 auto",
        },
        title: {
            fontSize: "28px",
            marginBottom: "15px",
            textAlign: "center" as const,
        },
        buttonRow: {
            display: "flex",
            flexWrap: "wrap" as const,
            gap: "12px",
        },
        button: {
            flex: "1 1 160px",
            padding: "14px 16px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "16px",
            color: "#fff",
            fontWeight: "500",
            transition: "all 0.25s ease",
            boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
        },
        foodButton: {
            background: "linear-gradient(135deg, #ff7e5f, #feb47b)", // orange gradient
        },
        animalButton: {
            background: "linear-gradient(135deg, #6a11cb, #2575fc)", // purple-blue gradient
        },
    };

    const handleAnimalButton = () => {
        router.push("/HandleAnimalbutton");
    };

    const handleFoodButton = () => {
        router.push("/Handlefoodstock");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title} >Stock</h1>

            <div style={styles.buttonRow}>
                <button
                    style={{ ...styles.button, ...styles.foodButton }}
                    onClick={handleFoodButton}
                    onMouseOver={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                >
                   Add Food Stock
                </button>

                <button
                    style={{ ...styles.button, ...styles.animalButton }}
                    onClick={handleAnimalButton}
                    onMouseOver={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                >
                  Add Animal Stock
                </button>
            </div>
        </div>
    );
}