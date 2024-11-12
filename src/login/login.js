import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate, useLocation } from "react-router-dom";
import Explanation from "../explanation/explanation";
import LoginHeader from "./loginHeader";

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [groupId, setGroupId] = useState(3); // 초기 group_id 설정
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
  const days = location.state?.days ?? null;
  
  const handleLogin = async () => {
    if (!name) {
      alert("Please enter your name.");
      return;
    }

    try {
      // 로그인 요청 보내기
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}/login`, {
        name: name,
        password: password,
        group_id: 3,
        id: 3
      });

      // 서버 응답에서 변수 이름 충돌을 피하기 위해 다른 변수 이름을 사용
      const { id, group_id, name: userName, password: userPassword } = response.data;

      // 로그인 성공 시 환영 메시지 표시
      if (response.status === 200) {
        alert(`Welcome, ${name}!`);
        console.log("Login response data:", response.data);

        const containsDates = days?.every(item => 'date' in item);
        
        if (containsDates) {
          navigate("/NumberInput");
        } else {
          navigate("/NumberInputDay");
        }
      } else {
        alert("Login failed. Please check your name and password.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while trying to log in. Please try again.");
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

