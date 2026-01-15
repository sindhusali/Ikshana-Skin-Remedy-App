import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Favorites() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [favoriteRemedies, setFavoriteRemedies] = useState([]);
    
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/favorites", {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFavoriteRemedies(response.data);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        if (user?.id) fetchFavorites();
    }, [user]);

    // ✅ Remove from Favorites
    const removeFromFavorites = async (remedyId) => {
        try {
            await axios.delete(`http://localhost:5001/api/favorites/${remedyId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setFavoriteRemedies((prev) => prev.filter(remedy => remedy._id !== remedyId));
            alert("❌ Removed from favorites.");
        } catch (error) {
            console.error("Error removing from favorites:", error);
            alert("Failed to remove from favorites.");
        }
    };

    return (
        <div>
            <Link to="/home">🏠 Go to Home</Link>
            <h1>My Favorite Remedies</h1>

            {favoriteRemedies.length === 0 ? (
                <p>You haven't added any favorites yet.</p>
            ) : (
                favoriteRemedies.map((remedy) => (
                    <div key={remedy._id}>
                        <h3>{remedy.title}</h3>
                        <p><strong>Category:</strong> {remedy.category}</p>
                        <button onClick={() => navigate(`/remedy/${remedy._id}`)}>View Details</button>
                        <button onClick={() => removeFromFavorites(remedy._id)}>❌ Remove from Favorites</button>
                    </div>
                ))
            )}
        </div>
    );
}
