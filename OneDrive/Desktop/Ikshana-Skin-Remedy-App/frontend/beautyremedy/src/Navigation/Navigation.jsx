import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.css"; // ✅ Import CSS file

export default function Navigation() {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Hide Navigation on Landing, Register, and Login pages
    const isHiddenPage = ["/", "/register", "/login"].includes(location.pathname);

    return (
        !isHiddenPage && (
            <nav className="navbar">
                {user && (
                    <div className="nav-links">
                        <Link to="/home" className="nav-btn">Home</Link>
                        <Link to="/myremedies" className="nav-btn">My Remedies</Link>
                        <Link to="/favorites" className="nav-btn">My Favorites</Link>
                        <button className="nav-btn" onClick={() => { logout(); navigate("/login"); }}>
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        )
    );
}
