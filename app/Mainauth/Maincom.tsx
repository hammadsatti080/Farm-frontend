"use client";
import "./register.css";
import Fetchadmin from "./Fetchadmin";
import Register from "./Register";

export default function Maincom() {
    return (
        <div className="container">

            {/* LEFT FORM */}
            <div >
                <Register />
            </div>

            {/* RIGHT CARDS */}
            <div className="cards-section">
                <Fetchadmin />

            </div>

        </div>
    );
}