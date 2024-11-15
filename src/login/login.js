import React, { useState, useEffect } from "react";
import axios from "axios";
import "./login.css";
import { useNavigate, useLocation } from "react-router-dom";
import Explanation from "../explanation/explanation";
import LoginHeader from "./loginHeader";
import Logo from "../minju/component/logo";
import { HeaderH2 } from "../minju/component/eventName";

function LogIn() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState(""); // 그룹 이름을 저장할 상태
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // 추가함
  const event = queryParams.get("event"); // 추가함
  const groupId = queryParams.get("groupId"); // 추가함

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
    // const groupId = localStorage.getItem("group_id"); // localStorage에서 group_id 가져오기
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
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
    if (!name) {
      alert("Please enter your name.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}/login`,
        {
          name: name,
          password: password,
        }
      );

      alert(`Welcome, ${name}!`);
      console.log("Login response data:", response.data);

      // userId를 localStorage에 저장
      localStorage.setItem("userId", response.data.id);

      // 쿼리 파라미터를 포함하여 /myavailability 페이지로 이동
      const url = `/myavailability?event=${event}&groupId=${groupId}`;
      navigate(url, {
        state: {
          id: response.data.id,
          name: response.data.name,
        },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Login failed. Please check your name and password.");
    }
  };

  return (
    <div className="big-container">
      <Logo />
      <HeaderH2>{groupName}</HeaderH2> {/* Axios로 받아온 groupName 표시 */}
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

const HeaderH2 = styled.h2`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #4c3f5e;
  margin-bottom: 10px; /* 4LINETON과 My Availability 사이 간격 추가 */
`;