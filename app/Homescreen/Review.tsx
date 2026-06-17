"use client";

import React, { useState } from "react";
import "./Rate.css";

export default function Review() {
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
            const res = await fetch("http://localhost:5000/api/reviews", {
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
        <div className="review-container">

            {/* LEFT CARD */}
            <div className="left-box">
                <div className="contact-icon">📞</div>

                <h2>Contact Us</h2>
                <p>
                    We value your feedback. If you have any questions or concerns,
                    feel free to reach out anytime.
                </p>

                <div className="contact-info">
                    <p>📧 Farm@gmail.com</p>
                    <p>📍 Rawalpindi, Pakistan</p>
                    <p>📱 +92 300 0000000</p>
                </div>
                
            </div>

            {/* RIGHT FORM */}
            <div className="review-wrapper">
                <div className="review-card">

                    <h2>Leave a Review</h2>
                    <p>Share your experience with us</p>

                    <form onSubmit={handleSubmit}>

                        <div className="row">
                            <input
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <input
                            name="title"
                            placeholder="Review Title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="service"
                            placeholder="Service Used"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        />

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

                        <textarea
                            name="review"
                            placeholder="Write your review..."
                            value={formData.review}
                            onChange={handleChange}
                            required
                        />

                        <button disabled={loading}>
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>

                    </form>
                </div>
            </div>

        </div>
    );
}