import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await login(credentials);
    setLoading(false);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Admin Login</h1>
        {loading && (
          <div className={styles.pageSpinner} aria-label="Loading">
            <span className={styles.spinner}>⏳</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className={styles.input}
              disabled={loading}
            />
          </div>
          <button type="submit" className={styles.loginButton} disabled={loading}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 