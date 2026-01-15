import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // ✅ Import CSS correctly

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        mobile: ""
    });

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password || !formData.mobile) {
            alert("All fields are required!");
            return;
        }

        try {
            console.log("Submitting registration data:", formData);
            const response = await axios.post("http://localhost:5001/api/auth/signup", formData);
            
            console.log("Registration success:", response.data);
            localStorage.setItem("token", response.data.token);
            setUser({ token: response.data.token, id: response.data.userId });

            alert("✅ Signup successful! Redirecting to login...");
            navigate("/login"); // ✅ Redirect to login after signup
        } catch (error) {
            console.error("Signup error:", error.response?.data || error.message);
            
            if (error.response?.status === 400 && error.response.data.message === "User already exists") {
                setErrorMessage("⚠️ User already exists. Please use a different email.");
            } else {
                alert("Signup failed, please try again.");
            }
        }
    }

    return (
        <div className="auth-container"> {/* ✅ Changed from register-container */}
            <div className="auth-card"> {/* ✅ Changed from register-card */}
                <h2 className="register-title">Create Your Account</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" name="username" onChange={handleChange} required className="auth-input" />
                    <input type="email" placeholder="Email ID" name="email" onChange={handleChange} required className="auth-input" />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} required className="auth-input" />
                    <input type="text" placeholder="Mobile Number" name="mobile" onChange={handleChange} required className="auth-input" />
    
                    <button type="submit" className="auth-button">Sign Up</button>
                </form>
    
                <p className="login-text">
                    Already have an account? <Link to="/login" className="login-link">Login here</Link>
                </p>
            </div>
        </div>
    );
}    
