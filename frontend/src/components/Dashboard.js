import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sweets');
      setSweets(response.data.data);
      setFilteredSweets(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch sweets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (searchName) params.append('name', searchName);
      if (searchCategory) params.append('category', searchCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await axios.get(`/api/sweets/search?${params.toString()}`);
      setFilteredSweets(response.data.data);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    }
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchCategory('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredSweets(sweets);
  };

  const handlePurchase = async (e, sweetId, quantity = 1) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await axios.post(`/api/sweets/${sweetId}/purchase`, { quantity });
      setSuccessMessage('Purchase successful!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openAdminPanel = () => {
    navigate('/admin');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1>🍬 Sweet Shop</h1>
          <div className="nav-actions">
            <span className="user-info">
              Welcome, {user?.username} {isAdmin() && <span className="admin-badge">Admin</span>}
            </span>
            {isAdmin() && (
              <button onClick={openAdminPanel} className="btn btn-admin">
                Manage Sweets
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="search-section">
          <h2>Search Sweets</h2>
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="search-select"
            >
              <option value="">All Categories</option>
              <option value="chocolate">Chocolate</option>
              <option value="candy">Candy</option>
              <option value="gummy">Gummy</option>
              <option value="lollipop">Lollipop</option>
              <option value="cake">Cake</option>
              <option value="cookie">Cookie</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="search-input-small"
              step="0.01"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="search-input-small"
              step="0.01"
            />
            <button onClick={handleSearch} className="btn btn-search">
              Search
            </button>
            <button onClick={handleClearSearch} className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>

        <div className="sweets-section">
          <h2>Available Sweets ({filteredSweets.length})</h2>
          
          {loading ? (
            <div className="loading">Loading sweets...</div>
          ) : filteredSweets.length === 0 ? (
            <div className="no-sweets">No sweets found</div>
          ) : (
            <div className="sweets-grid">
              {filteredSweets.map((sweet) => (
                <div key={sweet._id} className="sweet-card">
                  <div className="sweet-header">
                    <h3>{sweet.name}</h3>
                    <span className={`category-badge ${sweet.category}`}>
                      {sweet.category}
                    </span>
                  </div>
                  
                  {sweet.description && (
                    <p className="sweet-description">{sweet.description}</p>
                  )}
                  
                  <div className="sweet-details">
                    <div className="price">₹{sweet.price.toFixed(2)}</div>
                    <div className={`stock ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
                      {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handlePurchase(e, sweet._id)}
                    disabled={sweet.quantity === 0}
                    className="btn btn-purchase"
                    type="button"
                  >
                    {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
