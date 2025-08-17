import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Navigate } from 'react-router-dom';

import { loginThunk } from '../features/auth/authThunks';  // Adjust path as needed
import '../CSS/LoginPage.css';

const LoginPage = () => {
  const token = useSelector((state) => state.auth.token);

  // If the user is not authenticated, redirect to the login page


  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Dispatch loginThunk and wait for the result
    const actionResult = await dispatch(loginThunk({ username: email, password }));
    // If login is successful, redirect to the index page
    if (loginThunk.fulfilled.match(actionResult)) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src="/banner/login.png" alt="Login illustration" />
      </div>

      <div className="login-right">
        <h1 className="login-title">Sign in to Survill</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="remember-forgot">
            <div className="checkbox-wrapper">
              <input type="checkbox" id="remember" className="remember-checkbox" />
              <span className="remember-text">Remember me</span>
            </div>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {error && <p className="error-text">{error}</p>}

          <p className="signup-text">
            Don't have an account?{' '}
            <a href="#" className="signup-link">
              Sign Up now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
