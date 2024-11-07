import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDay, setSelectedDay] = useState(""); // 선택된 요일
  const [availability, setAvailability] = useState({}); // 각 요일별 시간 목록
  const [activeButton, setActiveButton] = useState('number'); // 초기 활성화 상태는 'number'
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name && password) {
      // 로그인 성공 시 '/minju' 페이지로 이동
      navigate('/minju');
    } else {
      alert('Please enter both your name and password.');
    }
  };

  const handleFinishClick = () => {
    navigate('/minju'); // 왼쪽 버튼 클릭 시 /minju 경로로 이동
  };

  return (
    <div className="big-container">
      <div className="header">
        <h1>Timi</h1>
        <h2>4LINETHON</h2>
      </div>

      <div className="availability">
        <span onClick={handleFinishClick} className="left-arrow">◄</span>
        <span>My Availability</span>
      </div>

      {/* 로그인 폼 */}
      <div className="login-form">
        <div className = "name-container">
        <label className="name">Your Name</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        </div>

        <div className = "password-container">
        <label className="password">Password</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        </div>
        <button type="button" onClick={handleLogin} className = "LoginButton">Sign In</button>
      </div>
    </div>
  );
}

export default LogIn;