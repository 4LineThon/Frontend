import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [groupId, setGroupId] = useState(1);  
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name) {
      alert('Please enter your name.');
      return;
    }

    try {
      const response = await axios.post(`http://43.201.144.53/api/v1/group/${groupId}/login`, {
        name: name,
        password: password || ""  
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { id, name: responseName } = response.data;

      if (id) {
        console.log(`Welcome, ${responseName}!`);
        navigate('/minju'); 
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        alert(`An error occurred while logging in: ${error.response.data.message || 'Please check your credentials and try again.'}`);
      } else {
        alert('An error occurred while logging in. Please try again.');
      }
    }
  };

  return (
    <div className="big-container">
      <div className="header">
        <h1>Timi</h1>
        <h2>4LINETHON</h2>
      </div>

      <div className="availability">
        <span onClick={() => navigate('/minju')} className="left-arrow">◄</span>
        <span>My Availability</span>
      </div>

      <div className="login-form">
        <div className="name-container">
          <label className="name">Your Name</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="password-container">
          <label className="password">Password (optional)</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        
        <button type="button" onClick={handleLogin} className="LoginButton">Sign In</button>
      </div>
    </div>
  );
}

export default LogIn;