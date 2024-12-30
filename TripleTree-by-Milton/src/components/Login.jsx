/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css";

function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include', // Include cookies in the request
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error || 'Login failed');
            return;
        }

        // Redirect based on role
        if (data.role === 'admin') {
            navigate('/AdminDashboard');
        } else if (data.role === 'user') {
            navigate('/ProfilePage');
        }
    } catch (err) {
        setError('An error occurred. Please try again: ' + err);
    }
    onClose();
};

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div
            style={{
              display: "grid",
              margin: "2em",
              gridTemplateColumns: "auto auto",
            }}
          >
            <button
              type="submit"
              className="login-button"
              style={{ height: "3em", width: "5em" }}
            >
              Login
            </button>
            <a href="/register">
              <center>
                <p style={{ margin: "0.02em" }}>Don&apos;t have an account?</p>
                <p style={{ margin: "0.02em" }}>Register Now!</p>
              </center>
            </a>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
