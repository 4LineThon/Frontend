import React, { useState } from "react";
import "./login.css";
import { useNavigate, useLocation } from "react-router-dom";
import Explanation from "../explanation/explanation";
import LoginHeader from "./loginHeader";

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
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

  // Retrieve `dates`, `days`, `start_time`, and `end_time` from location state
  const days = location.state?.days ?? null;
  const startTime = location.state?.start_time ?? null;
  const endTime = location.state?.end_time ?? null;


  const handleLogin = () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }

    // Show welcome message
    alert(`Welcome, ${name}!`);

    // Determine whether `days` contains only `day` or both `date` and `day`
// containsDates 변수를 days 배열에 date 필드가 있는지 검사하는 방식으로 수정
// 모든 항목이 date 속성을 가지고 있을 때만 true로 설정
const containsDates = days?.every(item => 'date' in item);

// date 필드 유무에 따라 페이지 이동
if (containsDates) {
  console.log("Navigating to /NumberInput with dates:", days);
  console.log("Start Time:", startTime);
  console.log("End Time:", endTime);
  navigate("/NumberInput", { 
    state: { 
      user: name, 
      name, 
      dates: days, 
      start_time: startTime, 
      end_time: endTime 
    } 
  });
} else {
  console.log("Navigating to /NumberInputDay with days only:", days);
  navigate("/NumberInputDay", { 
    state: { 
      user: name, 
      name, 
      dates: days, 
      start_time: startTime, 
      end_time: endTime 
    } 
  });
}
  }

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
