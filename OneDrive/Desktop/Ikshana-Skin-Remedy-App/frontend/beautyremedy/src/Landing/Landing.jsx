import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">⚡ ikshana</div>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login →
        </button>
      </nav>

      {/* Main Content */}
      <div className="content">
      <img src="/ikshana.png" alt="Ikshana Logo" className="robot-image" />


        <h1>Sabhaku Swagatham</h1>
        <h2>Ika modhaledadhama!</h2>
        <button className="get-started-btn" onClick={() => navigate("/register")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
