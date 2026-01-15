import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

export default function Home() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [remedies, setRemedies] = useState([]);
    const [filteredRemedies, setFilteredRemedies] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

   
    const categories = [
        "Skin Care",
        "Hair Care",
        "Eye Care",
        "Lip Care",
        "Dental & Oral Care",
        "Nail Care"
    ];

  
    useEffect(() => {
        const fetchRemedies = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/remedies");
                setRemedies(response.data);
                setFilteredRemedies(response.data); 
            } catch (error) {
                console.error("Error fetching remedies:", error);
            }
        };

        if (user) {
            fetchRemedies();
        }
    }, [user]);

    const handleCategoryChange = async (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);

        if (newCategory) {
            try {
                const response = await axios.get(
                    `http://localhost:5001/api/remedies/search?category=${encodeURIComponent(newCategory)}`
                );

                console.log(`Fetched remedies:`, response.data); 

                if (response.data.length === 0) {
                    console.warn(`No remedies found for category: ${newCategory}`);
                }

                setFilteredRemedies(response.data);
            } catch (error) {
                console.error("Error fetching filtered remedies:", error);
                setFilteredRemedies([]); 
            }
        } else {
            setFilteredRemedies(remedies); 
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to Beauty Home Remedies</h1>

            <div className="category-section">
                <label htmlFor="category">Select Category:</label>
                <select id="category" className="category-dropdown" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <h2>{selectedCategory ? ` ` : ""}</h2>
            <div className="remedies-container">
                {filteredRemedies.length === 0 ? (
                    <p>No remedies found for the selected category.</p>
                ) : (
                    filteredRemedies.map((remedy) => (
                        <div key={remedy._id} className="remedy-card">
                            <h3>{remedy.title}</h3>
                            <p><strong>Category:</strong> {remedy.category}</p>
                            <button className="view-details-btn" onClick={() => navigate(`/view-details/${remedy._id}`)}>View Details</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
