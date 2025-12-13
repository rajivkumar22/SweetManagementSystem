import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentSweet, setCurrentSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'chocolate',
    price: '',
    quantity: '',
    description: ''
  });

  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
    fetchSweets();
  }, [isAdmin, navigate]);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sweets');
      setSweets(response.data.data);
    } catch (err) {
      setError('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      name: '',
      category: 'chocolate',
      price: '',
      quantity: '',
      description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (sweet) => {
    setModalMode('edit');
    setCurrentSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentSweet(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (modalMode === 'add') {
        await axios.post('/api/sweets', formData);
        setSuccessMessage('Sweet added successfully!');
      } else {
        await axios.put(`/api/sweets/${currentSweet._id}`, formData);
        setSuccessMessage('Sweet updated successfully!');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      closeModal();
      fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (sweetId, sweetName) => {
    if (window.confirm(`Are you sure you want to delete "${sweetName}"?`)) {
      try {
        await axios.delete(`/api/sweets/${sweetId}`);
        setSuccessMessage('Sweet deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchSweets();
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = prompt('Enter quantity to add:');
    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
      try {
        await axios.post(`/api/sweets/${sweetId}/restock`, { quantity: parseInt(quantity) });
        setSuccessMessage('Sweet restocked successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchSweets();
      } catch (err) {
        setError(err.response?.data?.message || 'Restock failed');
      }
    }
  };

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1>🍬 Sweet Shop Admin Panel</h1>
          <div className="nav-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Back to Dashboard
            </button>
            <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-content">
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="admin-header">
          <h2>Manage Sweets</h2>
          <button onClick={openAddModal} className="btn btn-add">
            + Add New Sweet
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sweets.map((sweet) => (
                  <tr key={sweet._id}>
                    <td>{sweet.name}</td>
                    <td>
                      <span className={`category-badge ${sweet.category}`}>
                        {sweet.category}
                      </span>
                    </td>
                    <td>${sweet.price.toFixed(2)}</td>
                    <td className={sweet.quantity === 0 ? 'text-danger' : ''}>
                      {sweet.quantity}
                    </td>
                    <td className="description-cell">{sweet.description || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openEditModal(sweet)}
                          className="btn-action btn-edit"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleRestock(sweet._id)}
                          className="btn-action btn-restock"
                          title="Restock"
                        >
                          📦
                        </button>
                        <button
                          onClick={() => handleDelete(sweet._id, sweet.name)}
                          className="btn-action btn-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalMode === 'add' ? 'Add New Sweet' : 'Edit Sweet'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  minLength="2"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="chocolate">Chocolate</option>
                  <option value="candy">Candy</option>
                  <option value="gummy">Gummy</option>
                  <option value="lollipop">Lollipop</option>
                  <option value="cake">Cake</option>
                  <option value="cookie">Cookie</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength="500"
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === 'add' ? 'Add Sweet' : 'Update Sweet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
