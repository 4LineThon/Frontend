import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import Explanation from "../explanation/explanation";
import CopyButton from "../copy-event-link/CopyButton";
import styled from 'styled-components';
import axios from 'axios';


const Result = () => {
  const [place, setPlace] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation();
  const userid = location.state?.userid;
  // Get query parameters
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");
  const [groupName, setGroupName] = useState("");

   // 디버깅용
  useEffect(() => {
    console.log("Result page ::::: Event:", event);
    console.log("GroupId:", groupId);
    console.log("userid",userid);
  }, [event, groupId,userid]);

  const preConfirmExplanation = [
    'When the "Save" button is clicked,',
    "the meeting time is confirmed.",
  ];
  const postConfirmExplanation = [
    'When the "Reschedule" button is clicked,',
    "the confirmed meeting time will be canceled.",
    "-",
    "But the previously selected group availability will remain unchanged.",
  ];

  const handleSave = async () => {
    try {
      // Send the result
      const response =await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/result`, {
        group: groupId,
        text: place,
      });
      setIsSaved(true);
      console.log("Response from server:", response.data); // Log the response data
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleReschedule = () => {
    setIsSaved(false);
    setPlace("");
    navigate(`/groupAvailability?event=${event}&groupId=${groupId}`, {
      state: { userid }, // Pass the userid as state
    });
  };

  useEffect(() => {
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

  return (
    <div style={styles.wrapper}>
      <CopyButton />
      <Logo />
      <HeaderH2>{groupName}</HeaderH2> 
      <AvailabilityHeader text="Result" />

      <div style={styles.formContainer}>
        <div style={styles.inputContainer}>
          <div style={styles.labelContainer}>
            <span style={styles.label}>Place</span>
            {isSaved ? (
              <span style={styles.fixedText}>{place}</span>
            ) : (
              <input
                type="text"
                style={styles.input}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Enter place"
              />
            )}
          </div>
        </div>

        {isSaved ? (
          <>
            <button style={styles.rescheduleButton} onClick={handleReschedule}>
              Reschedule
            </button>
            <Explanation textArr={postConfirmExplanation} />
          </>
        ) : (
          <>
            <button style={styles.saveButton} onClick={handleSave}>
              Save
            </button>
            <Explanation textArr={preConfirmExplanation} />
          </>
        )}
      </div>
    </div>
  );
};
const StyledInput = styled.input`
  width: 160px;
  height: 28px;
  font-size: ８px;
  color: #423E59;
  border: none;
  border-bottom: 2px solid #423E59;
  background-color: transparent;
  font-family: "Ibarra Real Nova", serif;
  text-align: center;
  outline: none;

`;

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
    position: "relative", // for copy-event-link
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    maxWidth: "280px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  labelContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    color: "#423E59",
    fontFamily: '"Ibarra Real Nova", serif',
    fontSize: "20px",
  },
  input: {
    width: "160px",
    height: "28px",
    fontSize: "16px",
    color: "#423E59",
    border: "none",
    borderBottom: "2px solid #423E59",
    backgroundColor: "transparent",
    fontFamily: '"Ibarra Real Nova", serif',
    textAlign: "center",
    outline: "none",
  },
  fixedText: {
    fontSize: "16px",
    color: "#423E59",
    fontFamily: '"Ibarra Real Nova", serif',
    textAlign: "center",
  },
  saveButton: {
    width: "160px",
    height: "38px",
    backgroundColor: "#423E59",
    color: "#D9D9D9",
    fontSize: "20px",
    fontFamily: '"Ibarra Real Nova", serif',
    border: "none",
    cursor: "pointer",
  },
  rescheduleButton: {
    width: "160px",
    height: "38px",
    backgroundColor: "#423E59",
    color: "#D9D9D9",
    fontSize: "20px",
    fontFamily: '"Ibarra Real Nova", serif',
    border: "none",
    cursor: "pointer",
  },
};

export default Result;

const HeaderH2 = styled.h2`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #4c3f5e;
  margin-bottom: 10px; /* 4LINETON과 My Availability 사이 간격 추가 */
`;