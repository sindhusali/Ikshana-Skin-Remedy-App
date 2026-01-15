import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteRemedy from "../DeleteRemedy/DeleteRemedy";
import AddRemedy from "../AddRemedy/AddRemedy"; // ✅ Import AddRemedy component
import "./MyRemedy.css";

export default function MyRemedy() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [myRemedies, setMyRemedies] = useState([]);
    const [favoriteRemedies, setFavoriteRemedies] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [stateRefresh, setStateRefresh] = useState(false); // ✅ Refresh trigger
    const [showAddRemedy, setShowAddRemedy] = useState(false); // ✅ State for modal

    // ✅ Fetch remedies and favorites
    useEffect(() => {
        if (!user?.id) return;

        const fetchMyRemedies = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/remedies/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMyRemedies(response.data);
                console.log("✅ Remedies Fetched:", response.data);
            } catch (error) {
                console.error("❌ API Error:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchFavorites = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/favorites", {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFavoriteRemedies(new Set(response.data.map(remedy => remedy._id)));
            } catch (error) {
                console.error("❌ Error fetching favorites:", error);
            }
        };

        fetchMyRemedies();
        fetchFavorites();
    }, [user, stateRefresh]); // ✅ Refresh when stateRefresh changes

    // ✅ Refresh remedies after deletion
    const handleDeleteSuccess = (deletedId) => {
        setMyRemedies((prev) => prev.filter((remedy) => remedy._id !== deletedId));
        setStateRefresh((prev) => !prev); // ✅ Trigger re-fetch
    };

    // ✅ Refresh after adding a remedy
    const handleRemedyAdded = () => {
        setStateRefresh((prev) => !prev);
        setShowAddRemedy(false); // ✅ Close modal after adding
    };

    // ✅ Add to Favorites
    const addToFavorites = async (remedyId) => {
        try {
            await axios.post(
                `http://localhost:5001/api/favorites`,
                { remedyId },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setFavoriteRemedies((prev) => new Set([...prev, remedyId]));
            alert("⭐ Added to favorites!");
        } catch (error) {
            console.error("❌ Error adding to favorites:", error);
            alert("Failed to add to favorites. Please try again.");
        }
    };

    // ✅ Remove from Favorites
    const removeFromFavorites = async (remedyId) => {
        try {
            await axios.delete(`http://localhost:5001/api/favorites/${remedyId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setFavoriteRemedies((prev) => {
                const updatedFavorites = new Set([...prev]);
                updatedFavorites.delete(remedyId);
                return updatedFavorites;
            });
            alert("⭐ Removed from favorites.");
        } catch (error) {
            console.error("❌ Error removing from favorites:", error);
            alert("Failed to remove from favorites. Please try again.");
        }
    };

    return (
        <div className="myremedy-container">
            <h1>My Remedies</h1>

            {loading && <p>Loading your remedies...</p>}

            {myRemedies.length === 0 ? (
                <p>You haven't added any remedies yet.</p>
            ) : (
                <div className="myremedy-grid">
                    {myRemedies.map((remedy) => (
                        <div key={remedy._id} className="card">
                            <div className="card-body">
                                <h5 className="card-title">{remedy.title}</h5>
                                <p className="card-text"><strong>Category:</strong> {remedy.category}</p>

                                <div className="button-container">
                                    <button className="btn btn-secondary" onClick={() => navigate(`/edit-remedy/${remedy._id}`)}>Edit</button>
                                    <button className="btn btn-info" onClick={() => navigate(`/view-details/${remedy._id}`)}>View</button>
                                    <DeleteRemedy remedyId={remedy._id} onDeleteSuccess={handleDeleteSuccess} />

                                    {favoriteRemedies.has(remedy._id) ? (
                                        <button className="btn btn-danger" onClick={() => removeFromFavorites(remedy._id)}>Remove Favorite</button>
                                    ) : (
                                        <button className="btn btn-success" onClick={() => addToFavorites(remedy._id)}>Add to Favorites</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Open Add Remedy Modal */}
            <div className="add-remedy-container">
                <button className="btn btn-primary add-remedy-btn" onClick={() => setShowAddRemedy(true)}>
                    Add Remedy
                </button>
            </div>

            {/* ✅ Render AddRemedy component in a pop-up modal */}
            {showAddRemedy && <AddRemedy onRemedyAdded={handleRemedyAdded} closeModal={() => setShowAddRemedy(false)} />}
        </div>
    );
}
