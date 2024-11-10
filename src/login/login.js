import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Explanation from "../explanation/explanation";

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [groupId, setGroupId] = useState(1);
  const navigate = useNavigate();
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

  const handleLogin = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }

    try {
      // Use template literals to insert the groupId value directly into the URL
      const response = await axios.post(`/api/v1/group/${groupId}/login`, {
        name: name,
        password: password || "",
      });

      console.log("Response data:", response.data);
      const { id, name: responseName } = response.data;

      if (id) {
        console.log("Navigating with ID:", id);
        alert(`Welcome, ${responseName}!`);
        navigate("/NumberInput", { state: { user: id, name: responseName } });
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

      <div className="availability">
        <span onClick={() => navigate("/minju")} className="left-arrow">
          ◄
        </span>
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

        <button type="button" onClick={handleLogin} className="LoginButton">
          Sign In
        </button>
      </div>
      <Explanation textArr={explanation} />
    </div>
  );
}

export default LogIn;
