/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css";

function Login({ onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login logic
    console.log("Username:", username);
    console.log("Password:", password);

    /////////////////////////////////////backend sign up here

    onClose(); // Close the modal after login

  
    navigate("/ProfilePage");
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
