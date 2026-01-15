import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [remedies, setRemedies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Extract category from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const categoryFromUrl = queryParams.get("category");

        if (categoryFromUrl) {
            fetchRemedies(categoryFromUrl);
        } else {
            setLoading(false);
            setError("No category selected.");
        }
    }, [location.search]);

    // ✅ Fetch Remedies Based on Selected Category
    const fetchRemedies = async (category) => {
        setLoading(true);
        setError("");

        try {
            console.log(`Fetching remedies for category: ${category}`);
            const response = await axios.get(
                `http://localhost:5001/api/remedies/search?category=${encodeURIComponent(category)}`
            );
            console.log("Fetched remedies:", response.data);
            setRemedies(response.data);
        } catch (error) {
            console.error("Error fetching remedies:", error);
            setError("Failed to fetch remedies.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Search Remedies</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {remedies.length === 0 && !loading ? (
                <p>No remedies found for this category.</p>
            ) : (
                remedies.map((remedy) => (
                    <div key={remedy._id}>
                        <h3>{remedy.title}</h3>
                        <p><strong>Category:</strong> {remedy.category}</p>
                        <button onClick={() => navigate(`/view-details/${remedy._id}`)}>View Details</button>
                    </div>
                ))
            )}
        </div>
    );
}
