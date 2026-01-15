import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewDetails.css";

export default function ViewDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [remedy, setRemedy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRemedy = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/remedies/${id}`);
                setRemedy(response.data);
            } catch (error) {
                setError("Failed to load remedy details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRemedy();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!remedy) return <p>No remedy found.</p>;

    return (
        <div className="modal-overlay">
            <div className="expanded-container">
                {/* Close Button */}
                <button onClick={() => navigate(-1)} className="close-button">✖</button>

                {/* Remedy Title & Category */}
                <h2 className="title">{remedy.title}</h2>
                <p className="sub-info"><strong>Category:</strong> {remedy.category}</p>

                {/* Remedy Details */}
                <div className="remedy-details">
                    {/* Ingredients */}
                    <div className="ingredients">
                        <h3 className="subtitle">Ingredients</h3>
                        <ul>
                            {remedy.ingredients.map((item, index) => (
                                <li key={index} className="ingredient-item">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Preparation & Application */}
                    <div className="instructions">
                        <h3 className="subtitle">Preparation</h3>
                        <p>{remedy.preparation}</p>

                        <h3 className="subtitle">Application</h3>
                        <p>{remedy.application}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
