import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState(null); // null, 'user', or 'admin'
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleLoginTypeSelect = (type) => {
    setLoginType(type);
    setError('');
    // Pre-fill credentials for demo purposes
    if (type === 'user') {
      setEmail('rky1@example.com');
      setPassword('password123');
    } else if (type === 'admin') {
      setEmail('admin@sweetshop.com');
      setPassword('admin123');
    }
  };

  const handleBack = () => {
    setLoginType(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  // Show selection screen if no login type is selected
  if (!loginType) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="sweet-header">
            <h1 className="sweet-title">🍬 Sweet Shop 🍬</h1>
            <p className="sweet-tagline">Indulge in Sweetness, One Click Away</p>
          </div>
          <div className="sweet-image-container">
            <div className="sweet-image">🍭🧁🍫🍰🍩</div>
          </div>
          <div className="login-type-selection">
            <button 
              className="btn btn-user"
              onClick={() => handleLoginTypeSelect('user')}
            >
              🍭 Order Sweets
            </button>
            <button 
              className="btn btn-admin"
              onClick={() => handleLoginTypeSelect('admin')}
            >
              🧁 Manage Shop
            </button>
          </div>
          <p className="auth-link">
            New here? <Link to="/register">Join our sweet community</Link>
          </p>
        </div>
      </div>
    );
  }

  // Show login form once type is selected
  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <h2>{loginType === 'admin' ? '🧁 Shop Manager Login' : '🍭 Customer Login'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span className="required">*</span></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
