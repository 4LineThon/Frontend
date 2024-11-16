import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Myavailability/component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import Explanation from "../explanation/explanation";
import CopyButton from "../copy-event-link/CopyButton";
import axios from "axios";
import { HeaderH2 } from "../Myavailability/component/headerH2";

const Result = () => {
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [groupName, setGroupName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const userid = location.state?.userid;

  // Get query parameters
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");

  // Debugging logs
  useEffect(() => {
    console.log("Result page ::::: Event:", event);
    console.log("GroupId:", groupId);
    console.log("userid", userid);
  }, [event, groupId, userid]);

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


  useEffect(() => {
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
          setGroupName(response.data.name); // 응답에서 groupName 설정
        } catch (error) {
          console.error("group name이 없음:", error);
        }
      };
      fetchGroupName();
    } else {
      console.error("groupid 없음");
    }
  }, [groupId]); // groupId 변경 시에만 API 호출

  const handleSave = async () => {
    // Validation to check if time and place are filled
    if (!time || !place) {
      setErrorMessage("Time과 Place 모두 입력해주세요");
      return;
    }

    try {
      // Send the result
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/result`,
        {
          group: groupId,
          place: place,
          time: time,
        }
      );
      setIsSaved(true);
      console.log("Response from server:", response.data);
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleReschedule = () => {
    setIsSaved(false);
    setPlace("");
    setTime("");
    navigate(`/groupAvailability?event=${event}&groupId=${groupId}`, {
      state: { userid },
    });
  };

  useEffect(() => {
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
          console.log("Fetched group name:", response.data.name);
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
            <span style={styles.label}>Time</span>
            {isSaved ? (
              <span style={styles.fixedText}>{time}</span>
            ) : (
              <input
                type="text"
                style={styles.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Enter Time"
              />
            )}
          </div>
        </div>
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

        {/* Error message display */}
        {errorMessage && <span style={styles.errorText}>{errorMessage}</span>}

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

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
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
  errorText: {
    color: "#423E59",
    fontSize: "14px",
    fontFamily: '"Ibarra Real Nova", serif',
    marginTop: "-10px",
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
