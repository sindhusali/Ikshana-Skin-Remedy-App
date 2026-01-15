import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DeleteRemedy({ remedyId, onDeleteSuccess }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    // ✅ Handle Remedy Deletion
    const handleDelete = async () => {
        if (!token) {
            alert("Session expired! Please log in again.");
            navigate("/login");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this remedy?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5001/api/remedies/${remedyId}`, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            alert("✅ Remedy deleted successfully!");

            // ✅ Notify MyRemedy component to refresh remedies list
            if (onDeleteSuccess) onDeleteSuccess(remedyId);
        } catch (error) {
            console.error("🔴 Error deleting remedy:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to delete remedy.");
        }
    };

    return (
        <button className="btn btn-danger" onClick={handleDelete}>
            Delete
        </button>
    );
}
