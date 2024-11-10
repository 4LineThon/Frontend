import React, { useState } from "react";
import "./login.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Explanation from "../explanation/explanation";
import LoginHeader from "./loginHeader";

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [groupId, setGroupId] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const explanation = [
    "The Name/Password is only used",
    "when setting this schedule.",
    "-",
    "If you want to modify a schedule",
    "you've already checked,",
    "please sign in using the same Name/Password.",
  ];

  const api = axios.create({
    baseURL: "http://43.201.144.53/api/v1",
  });

  // Retrieve `dates` and `days` from location state
  const dates = location.state?.dates ?? null;
  const days = location.state?.days ?? null;

  const handleLogin = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }

    try {
      // Login request
      const response = await axios.post(`/api/v1/group/${groupId}/login`, {
        name: name,
        password: password || "",
      });

      const { id, name: responseName } = response.data;

      if (id) {
        alert(`Welcome, ${responseName}!`);
        
        // Determine whether `days` contains only `day` or both `date` and `day`
        const containsDates = days?.every(item => item.date);

        // Navigate based on the presence of `date` fields
        if (containsDates) {
          // Navigate to `/NumberInput` if `dates` and `days` are both present
          navigate("/NumberInput", { state: { user: id, name: responseName, dates, days } });
        } else {
          // Navigate to `/NumberInputDay` if only `day` is present
          navigate("/NumberInputDay", { state: { user: id, name: responseName, days } });
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response) {
        alert(
          `An error occurred while logging in: ${
            error.message || "Please try again."
          }`
        );
      } else {
        alert("An error occurred while logging in. Please try again.");
      }
    }
  };

  return (
    <div className="big-container">
      <div className="header">
        <h1>Timi</h1>
        <h2>4LINETHON</h2>
      </div>

      <LoginHeader />

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

        <button type="button" onClick={handleLogin} className="LoginButton">
          Sign In
        </button>
      </div>
      <Explanation textArr={explanation} />
    </div>
  );
}

export default LogIn;
