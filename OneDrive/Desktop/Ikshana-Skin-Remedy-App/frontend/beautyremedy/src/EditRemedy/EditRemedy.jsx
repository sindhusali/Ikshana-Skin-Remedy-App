import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./EditRemedy.css";  // Reusing the same CSS file for consistency

const EditRemedy = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract remedy ID from URL params
  const [remedy, setRemedy] = useState({
    title: '',
    category: '',
    ingredients: '',
    preparation: '',
    application: '',
    file: null,
  });

  useEffect(() => {
    // Fetch remedy data by ID
    const fetchRemedy = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/remedies/${id}`);
        setRemedy(response.data);
      } catch (error) {
        console.error('Error fetching remedy:', error);
      }
    };
    fetchRemedy();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");  // Get token from storage
    if (!token) {
      alert("❌ You are not authorized. Please log in.");
      navigate("/login");
      return;
    }
  
    const ingredientsArray = Array.isArray(remedy.ingredients) 
      ? remedy.ingredients  
      : remedy.ingredients.split(",").map(ing => ing.trim());
  
    const updatedRemedy = new FormData();
    updatedRemedy.append("title", remedy.title);
    updatedRemedy.append("category", remedy.category);
    updatedRemedy.append("ingredients", JSON.stringify(ingredientsArray));
    updatedRemedy.append("preparation", remedy.preparation);
    updatedRemedy.append("application", remedy.application);
    if (remedy.file) {
      updatedRemedy.append("image", remedy.file);
    }
  
    try {
      await axios.put(`http://localhost:5001/api/remedies/${id}`, updatedRemedy, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      alert('✅ Remedy updated successfully!');
      navigate('/myremedies'); 
    } catch (error) {
      console.error('Error updating remedy:', error);
      alert('❌ Failed to update remedy. Please check authentication.');
    }
  };
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRemedy({ ...remedy, [name]: value });
  };

  const handleFileChange = (e) => {
    setRemedy({ ...remedy, file: e.target.files[0] });
  };

  return (
    <div className="add-remedy-container">  {/* ✅ Full-page container */}
      <div className="add-remedy-content">
        <h2>Edit Remedy</h2>
        <form className="form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-control">
            <label>Title</label>
            <input type="text" name="title" value={remedy.title} onChange={handleChange} required />
          </div>

          {/* Category */}
          <div className="form-control">
            <label>Category</label>
            <select name="category" value={remedy.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Eye Care">Eye Care</option>
              <option value="Lip Care">Lip Care</option>
              <option value="Dental & Oral Care">Dental & Oral Care</option>
              <option value="Nail Care">Nail Care</option>
            </select>
          </div>

          {/* Ingredients */}
          <div className="form-control">
            <label>Ingredients (comma-separated)</label>
            <input type="text" name="ingredients" value={remedy.ingredients} onChange={handleChange} required />
          </div>

          {/* Preparation */}
          <div className="form-control">
            <label>Preparation</label>
            <textarea name="preparation" value={remedy.preparation} onChange={handleChange} rows="4" required></textarea>
          </div>

          {/* Application */}
          <div className="form-control">
            <label>Application</label>
            <textarea name="application" value={remedy.application} onChange={handleChange} rows="4" required></textarea>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button type="submit" className="btn">Update Remedy</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/myremedies')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRemedy;
