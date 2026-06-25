"use client";

import React, { useState } from "react";
import "./Owner.css";
import { useRouter } from "next/navigation";

interface OwnerItem {
    id: string;
    name: string;
    role: string;
    image: string;
}

const OWNERS: OwnerItem[] = [
    {
        id: "1",
        name: "Hammad",
        role: "Farm owner",
        image: "./Owner.enc",
    },
    {
        id: "2",
        name: "Obaid",
        role: "Farm Owner",
        image: "./Owner.enc",
    },
    {
        id: "3",
        name: "Arslan",
        role: "Farm owner",
        image: "./Owner.enc",
    },
];

function OwnerCard({ name, role, image }: { name: string; role: string; image: string }) {
    const [flipped, setFlipped] = useState(false);
    const router = useRouter();

    const handlearrow = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push("/abouts");
    };

    return (
        <div
            className={`owner-card ${flipped ? "is-flipped" : ""}`}
            onClick={() => setFlipped((f) => !f)}
        >
            <img
                src={image}
                alt={name}
                className="owner-card-img"
            />

            <div className="owner-card-overlay">
                <h3 className="owner-card-name">{name}</h3>

                <div className="owner-card-footer">
                    
                    <p className="owner-card-role">{role}</p>
                    <button
                        className="owner-card-arrow"
                        onClick={handlearrow}
                        aria-label={`Read more about ${name}`}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Owner() {
    return (
        <section className="owner-section">
            <div className="owner-header">
                
                <h2 className="owner-title">
                    Meet our Owner
                    <svg
                        className="owner-underline"
                        viewBox="0 0 220 16"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M2 10 C 20 2, 38 2, 56 10 C 74 18, 92 18, 110 10 C 128 2, 146 2, 164 10 C 182 18, 200 18, 218 10"
                            stroke="#f5841f"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </h2>
            </div>

            <div className="owner-grid">
                {OWNERS.map((owner) => (
                    <OwnerCard
                        key={owner.id}
                        name={owner.name}
                        role={owner.role}
                        image={owner.image}
                    />
                ))}
            </div>
        </section>
    );
}