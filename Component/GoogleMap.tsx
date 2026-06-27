"use client";

import React from "react";
import "./Google.css";

export default function GoogleMap() {

    return (
        <div className="review-page">
            {/* LEFT INFO CARDS */}
            <div className="left-box">
                <div className="info-card wide map-card">
                    <div className="contact-icon">📍</div>
                    <h3>Visit Us</h3>
                    <p>Come see the farm in person</p>
                    <div className="map-embed">
                        <iframe
                            title="Farm location - Aliabad Chowk, Chour Harpal, Rawalpindi"
                            src="https://www.google.com/maps?q=Aliabad+Chowk,+Chour+Harpal,+Rawalpindi,+Pakistan&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                    <a
                        className="map-link"
                        href="https://www.google.com/maps?q=Aliabad+Chowk,+Chour+Harpal,+Rawalpindi,+Pakistan"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Open in Google Maps ↗
                    </a>
                </div>
            </div>
        </div>

    );
}