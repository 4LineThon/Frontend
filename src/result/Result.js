import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import Explanation from "../explanation/explanation";

const Result = () => {
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function
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

  const handleSave = () => {
    setIsSaved(true);
  };

  const handleReschedule = () => {
    setIsSaved(false);
    setTime("");
    setPlace("");
    navigate("/groupAvailability"); // Redirect to /groupAvailability
  };

  return (
    <div style={styles.wrapper}>
      <Logo />
      <AvailabilityHeader text="Result" />

      <div style={styles.formContainer}>
        <div style={styles.inputContainer}>
          <div style={styles.labelContainer}>
            <span style={styles.label}>Time</span>
            {isSaved ? (
              <span style={styles.fixedText}>{time}</span>
            ) : (
              <select
                style={styles.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select a time</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
              </select>
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
    gap: "10px",
    marginTop: "20px",
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
