import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // ✅ Import CSS file

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const { login } = useContext(AuthContext); // ✅ Use login() from context
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleLogin(e) {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors

        if (!formData.email || !formData.password) {
            setErrorMessage("⚠️ Please enter both email and password.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5001/api/auth/login",
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200 && response.data.token) {
                login({
                    token: response.data.token,
                    id: response.data.userId
                }); // ✅ Update context state
                navigate("/home"); // ✅ Redirect to home after login
            } else {
                setErrorMessage("⚠️ Login failed. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setErrorMessage("⚠️ User not found. Please register.");
                } else if (error.response.status === 401) {
                    setErrorMessage("⚠️ Incorrect password.");
                } else {
                    setErrorMessage(error.response.data.message || "⚠️ Something went wrong.");
                }
            } else {
                setErrorMessage("⚠️ Server error. Please try again later.");
            }
        }
    }

    return (
        <div className="auth-container"> {/* ✅ Background applied here */}
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Log in to your account</p>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                    <button type="submit" className="auth-button">Login</button>
                </form>

                <p className="auth-text">
                    Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
