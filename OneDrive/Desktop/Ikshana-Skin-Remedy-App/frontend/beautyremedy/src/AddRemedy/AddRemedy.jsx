import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AddRemedy.css';

const AddRemedy = ({ onRemedyAdded, closeModal }) => { 
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    ingredients: '',
    preparation: '',
    application: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to add a remedy.");
      return;
    }
  
    const remedyData = new FormData();
    remedyData.append("title", formData.title);
    remedyData.append("category", formData.category);
    remedyData.append("ingredients", JSON.stringify(formData.ingredients.split(",").map(ing => ing.trim()))); 
    remedyData.append("preparation", formData.preparation);
    remedyData.append("application", formData.application);
    remedyData.append("createdBy", user.id); 
    if (formData.file) {
      remedyData.append("image", formData.file);
    }
  
    try {
      const response = await axios.post("http://localhost:5001/api/remedies", remedyData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (response.status === 201) {
        alert(" Remedy added successfully!");
        if (onRemedyAdded) onRemedyAdded();
        if (closeModal) closeModal();
      }
    } catch (error) {
      console.error("Error adding remedy:", error.response?.data || error.message);
      alert(" Failed to add remedy. Please check console for details.");
    }
  };
  
  
  return (
    <div className="add-remedy-modal"> {}
      <div className="add-remedy-content">
        <h2>Add a New Remedy</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-control">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-control">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Hair Care">Hair Care</option>
              <option value="Eye Care">Eye Care</option>
              <option value="Lip Care">Lip Care</option>
              <option value="Dental & Oral Care">Dental & Oral Care</option>
              <option value="Nail Care">Nail Care</option>
            </select>
          </div>

          <div className="form-control">
            <label>Ingredients (comma-separated)</label>
            <input type="text" name="ingredients" value={formData.ingredients} onChange={handleChange} required />
          </div>

          <div className="form-control">
            <label>Preparation</label>
            <textarea name="preparation" value={formData.preparation} onChange={handleChange} rows="4" required></textarea>
          </div>

          <div className="form-control">
            <label>Application</label>
            <textarea name="application" value={formData.application} onChange={handleChange} rows="4" required></textarea>
          </div>


          <div className="button-group">
            <button type="submit" className="btn">Add Remedy</button>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button> {}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRemedy;
