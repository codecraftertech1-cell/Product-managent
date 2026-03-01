import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeStep, setChangeStep] = useState(1);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowForm(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Get the stored password (either from change password or default "111111")
    const storedPassword = localStorage.getItem('user_password') || '111111';
    
    // Validate credentials client-side
    if (username !== 'atta' || password !== storedPassword) {
      setError('Invalid username or password');
      setLoading(false);
      return;
    }
    
    try {
      const response = await authAPI.login(username, password);
      
      if (response.data.success) {
        // Store the auth token
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      // Fallback: if API fails, still allow login for testing
      localStorage.setItem('auth_token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ name: 'atta' }));
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (changeStep === 1) {
      // Verify current password against stored password
      const storedPassword = localStorage.getItem('user_password') || '111111';
      if (currentPassword !== storedPassword) {
        alert('Current password is incorrect');
        return;
      }
      
      // Move to step 2 to enter new password
      setChangeStep(2);
    } else {
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        alert('New password must be at least 6 characters');
        return;
      }
      
      // Change password locally (simulated)
      alert('Password changed successfully! Your new password is: ' + newPassword);
      
      // Save the new password to localStorage (for demo purposes)
      localStorage.setItem('user_password', newPassword);
      
      setShowChangePassword(false);
      setChangeStep(1);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const styles = `
    .login-container {
      min-height: 100vh;
      width: 100%;
      background: #0f1523;
      position: relative;
      overflow: hidden;
      font-family: 'Arial', sans-serif;
    }

    .glass-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(15, 21, 35, 0.9);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid #2d3e5f;
      padding: 1rem 2rem;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }

    .navbar-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .navbar-title {
      color: #FFD700;
      font-size: 2rem;
      font-weight: bold;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
      margin: 0;
      letter-spacing: 2px;
    }

    .login-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100%;
      padding: 2rem;
      animation: slideUp 1s ease-out 0.5s both;
      background: #0f1523;
      gap: 2rem;
    }

    .login-card {
      background: #0f1523;
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 0;
    }

    .upper-card {
      background: #0f1523;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      margin-bottom: 2rem;
    }

    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .left-heading {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1001;
      color: #00FFFF;
      font-size: 2rem;
      text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      text-align: center;
    }

    .wave-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }

    .wave-line {
      position: absolute;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, transparent, #00ced1, transparent);
      border-radius: 2px;
      animation: wave 3s linear infinite;
    }

    .wave-line:nth-child(1) {
      left: 0;
      animation-delay: 0s;
    }

    .wave-line:nth-child(2) {
      left: 0;
      animation-delay: 0.3s;
    }

    .wave-line:nth-child(3) {
      left: 0;
      animation-delay: 0.6s;
    }

    .wave-line:nth-child(4) {
      left: 0;
      animation-delay: 0.9s;
    }

    .wave-line:nth-child(5) {
      left: 0;
      animation-delay: 1.2s;
    }

    .wave-line:nth-child(6) {
      left: 0;
      animation-delay: 1.5s;
    }

    .wave-line:nth-child(7) {
      left: 0;
      animation-delay: 1.8s;
    }

    .wave-line:nth-child(8) {
      left: 0;
      animation-delay: 2.1s;
    }

    .wave-line:nth-child(9) {
      left: 0;
      animation-delay: 2.4s;
    }

    .wave-line:nth-child(10) {
      left: 0;
      animation-delay: 2.7s;
    }

    @keyframes wave {
      0% {
        top: -10%;
        opacity: 0;
      }
      10% {
        opacity: 0.5;
      }
      90% {
        opacity: 0.5;
      }
      100% {
        top: 110%;
        opacity: 0;
      }
    }

    .rotating-text {
      margin: 0;
      position: relative;
      left:80%;
      font-size: 3rem;
      animation: rotateText 3s ease-in-out infinite;
    }

    @keyframes rotateText {
      0% {
        transform: rotateY(0deg);
        opacity: 1;
      }
      50%{
        transform: rotateY(90deg);
        opacity: 0;

      }
      100% {
        transform: rotateY(0deg);
        opacity: 1;
      }
    }

    .login-form {
      background: transparent;
      border: none;
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      position: relative;
      right:18%;
      max-width: 500px;
      box-shadow: none;
      animation: fadeIn 1s ease-out 1s both;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .form-title {
      color: #00FFFF;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.8rem;
      text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      color: #00FFFF;
      margin-bottom: 0.5rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.9rem;
      text-align: left;
    }

    .input-container {
      position: relative;
      width: 100%;
    }

    .form-group input {
      width: 100%;
      padding: 12px 40px 12px 16px;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(0, 255, 0, 0.3);
      border-radius: 0;
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .input-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #00FFFF;
      font-size: 1.2rem;
      pointer-events: none;
    }

    .eye-icon {
      pointer-events: auto;
      cursor: pointer;
    }

    .welcome-message {
      text-align: center;
      color: #00FFFF;
      font-size: 3rem;
      animation: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    }

    .welcome-message h1 {
      margin: 0;
      text-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    }

    .form-group input:focus {
      outline: none;
      border-color: #00FFFF;
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
      background: rgba(255, 255, 255, 0.15);
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .login-btn {
      width: 100%;
      background: linear-gradient(135deg, #22c55e 0%, #10b981 50%, #14b8a6 100%);
      color: white;
      border: none;
      padding: 14px;
      font-size: 1.1rem;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 1rem;
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
      background: linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%);
    }

    .change-password-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1001;
      background: linear-gradient(135deg, #22c55e 0%, #10b981 50%, #14b8a6 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 0.9rem;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .change-password-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
      background: linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 21, 35, 0.9);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease-out;
    }

    .modal {
      background: rgba(15, 21, 35, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid #2d3e5f;
      border-radius: 16px;
      padding: 2rem;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal h3 {
      color: #22c55e;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.5rem;
      text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .modal .form-group {
      margin-bottom: 1.5rem;
    }

    .modal .form-group label {
      color: #22c55e;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.9rem;
    }

    .modal .form-group input {
      width: 100%;
      padding: 12px 16px;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 0;
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .modal .form-group input:focus {
      outline: none;
      border-color: #22c55e;
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
      background: rgba(255, 255, 255, 0.15);
    }

    .modal-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .modal-btn {
      flex: 1;
      background: linear-gradient(135deg, #22c55e 0%, #10b981 50%, #14b8a6 100%);
      color: white;
      border: none;
      padding: 12px;
      font-size: 1rem;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .modal-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
      background: linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%);
    }

    .modal-btn.cancel {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    }

    .modal-btn.cancel:hover {
      background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 20% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.1) 0%, transparent 50%);
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .navbar-title {
        font-size: 1.5rem;
      }

      .login-form {
        padding: 1.5rem;
        margin: 0 1rem;
      }

      .form-title {
        font-size: 1.5rem;
      }

      .left-heading {
        display: none;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="login-container">
        <button className="change-password-btn" onClick={() => setShowChangePassword(true)}>Change Password</button>
        <div className="left-heading">
          <h2 className="rotating-text">Al-riwaj</h2>
          <h2 className="rotating-text">الرِیوا ج</h2>
        </div>
        <div className="wave-container">
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
          <div className="wave-line"></div>
        </div>
        <div className="login-content">
          {!showForm ? (
            <div className="welcome-message">
              <h1>Welcome Muhammad Atta</h1>
            </div>
          ) : (
            <>
              <div className="upper-card"></div>
              <div className="login-card">
                <form className="login-form" onSubmit={handleSubmit}>
                  <h2 className="form-title">Login</h2>
                  {error && (
                    <div className="error-message" style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>
                      {error}
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <div className="input-container">
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                      />
                      <span className="input-icon">✓</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                      <span className="input-icon eye-icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '👁' : '👁'}</span>
                    </div>
                  </div>
                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{changeStep === 1 ? 'Enter Current Password' : 'Change Password'}</h3>
            <form onSubmit={handleChangePassword}>
              {changeStep === 1 ? (
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-container">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <span className={`input-icon eye-icon ${!showCurrentPassword ? 'hidden' : ''}`} onClick={() => setShowCurrentPassword(!showCurrentPassword)}>👁</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="input-container">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <span className={`input-icon eye-icon ${!showNewPassword ? 'hidden' : ''}`} onClick={() => setShowNewPassword(!showNewPassword)}>👁</span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="input-container">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <span className={`input-icon eye-icon ${!showConfirmPassword ? 'hidden' : ''}`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>👁</span>
                    </div>
                  </div>
                </>
              )}
              <div className="modal-buttons">
                <button type="button" className="modal-btn cancel" onClick={() => setShowChangePassword(false)}>Cancel</button>
                <button type="submit" className="modal-btn">{changeStep === 1 ? 'Next' : 'Reset'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
