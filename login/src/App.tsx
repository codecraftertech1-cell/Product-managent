import React, { useState, useEffect } from 'react';
import './LoginPage.css';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeStep, setChangeStep] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { username, password });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (changeStep === 1) {
      // Check current password (simulate)
      if (currentPassword === 'admin') {
        setChangeStep(2);
      } else {
        alert('Incorrect current password');
      }
    } else {
      if (newPassword === confirmPassword) {
        alert('Password changed successfully');
        setShowChangePassword(false);
        setChangeStep(1);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('New passwords do not match');
      }
    }
  };

  return (
    <div className="login-container">
      <button className="change-password-btn top-left" onClick={() => setShowChangePassword(true)}>Change Password</button>
      <div className="left-heading">
        <h2 className="rotating-text">Al-riwaj</h2>
        <h2 className="rotating-text urdu">الرِیوا ج</h2>
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
                    <span className={`input-icon eye-icon ${!showPassword ? 'hidden' : ''}`} onClick={() => setShowPassword(!showPassword)}>👁</span>
                  </div>
                </div>
                <button type="submit" className="login-btn">Login</button>
              </form>
            </div>
          </>
        )}
      </div>
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{changeStep === 1 ? 'Enter Current Password' : 'Change Password'}</h3>
            <form onSubmit={handleChangePassword}>
              {changeStep === 1 ? (
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="modal-buttons">
                <button type="button" className="modal-btn cancel" onClick={() => setShowChangePassword(false)}>Cancel</button>
                <button type="submit" className="modal-btn">{changeStep === 1 ? 'Next' : 'Change'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;