"use client";

import React, { useState } from "react";
import "./Contact.css";

export default function Page() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        title: "",
        service: "",
        review: "",
        rating: 5,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("https://farm-backend-lac.vercel.app/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                alert("Review submitted successfully!");

                setFormData({
                    name: "",
                    email: "",
                    title: "",
                    service: "",
                    review: "",
                    rating: 5,
                });
            }
        } catch (err) {
            console.error(err);
            alert("Error submitting review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-page">

            {/* HERO BANNER */}
            <div className="review-hero">
                <div className="review-hero-content">
                    <h1>Leave a Review</h1>
                    <p>
                        We value your feedback. Share your experience with our farm
                        and help others discover what we offer.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="review-container">

                {/* LEFT INFO CARDS */}
                <div className="left-box">
                    <div className="info-row">
                        <div className="info-card">
                            <div className="contact-icon">📞</div>
                            <h3>Call us</h3>
                            <p>Call our team Mon–Fri 9am to 7pm</p>
                            <span className="info-value"> Farm@gmail.com</span>
                        </div>

                        <div className="info-card">
                            <div className="contact-icon">💬</div>
                            <h3>Chat Us</h3>
                            <p>Chat our team 24x7</p>
                            <span className="info-value">+92 300 0000000</span>
                        </div>
                    </div>

                    <div className="info-card wide">
                        <div className="contact-icon">📍</div>
                        <h3>Visit Us</h3>
                        <p>Come see the farm in person</p>
                        <span className="info-value">Rawalpindi, Pakistan</span>
                    </div>
                </div>

                {/* RIGHT FORM */}
                <div className="review-wrapper">
                    <div className="review-card">

                        <h2>Share Your Experience</h2>
                        <p className="subtitle">Let us know how we did.</p>

                        <form onSubmit={handleSubmit}>

                            <div className="row">
                                <div className="field">
                                    <label>Your Name</label>
                                    <input
                                        name="name"
                                        placeholder="e.g. Ahmed Khan"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Your Email</label>
                                    <input
                                        name="email"
                                        placeholder="e.g. ahmed@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="field">
                                    <label>Review Title</label>
                                    <input
                                        name="title"
                                        placeholder="Sum up your visit"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label>Service Used</label>
                                    <input
                                        name="service"
                                        placeholder="e.g. Farm Tour"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label>Rating</label>
                                <select
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                >
                                    <option value="5">★★★★★ Excellent</option>
                                    <option value="4">★★★★ Good</option>
                                    <option value="3">★★★ Average</option>
                                    <option value="2">★★ Poor</option>
                                    <option value="1">★ Bad</option>
                                </select>
                            </div>

                            <div className="field">
                                <label>Message</label>
                                <textarea
                                    name="review"
                                    placeholder="Write your review..."
                                    value={formData.review}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button disabled={loading}>
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}