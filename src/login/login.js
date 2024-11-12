import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate, useLocation } from "react-router-dom";
import Explanation from "../explanation/explanation";
import LoginHeader from "./loginHeader";

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState(""); // 그룹 이름을 저장할 상태
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

  // 그룹 이름을 가져오기
  useEffect(() => {
    const groupId = localStorage.getItem("group_id"); // localStorage에서 group_id 가져오기

    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`);
          setGroupName(response.data.name); // 응답에서 그룹 이름을 설정
          console.log(response.data);
          console.log("Fetched group name:", response.data.name); // 그룹 이름을 콘솔에 출력
        } catch (error) {
          console.error("Error fetching group name:", error);
        }
      };
      fetchGroupName();
    } else {
      console.error("No group_id found in localStorage");
    }
  }, []);

  const handleLogin = async () => {
    const groupId = localStorage.getItem("group_id"); // localStorage에서 group_id 다시 가져오기

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}/login`, {
        name: name,
        password: password,
      });

      if (response.status === 200) {
        alert(`Welcome, ${name}!`);
        console.log("Login response data:", response.data.name);

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
        <h2>{groupName}</h2> {/* Axios로 받아온 groupName 표시 */}
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