import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const dates = ["Oct15", "Oct16", "Oct17", "Oct18", "Oct19", "Oct20", "Oct21"];
const times = ["10:00","10:30","11:00","11:30","12:00","12:30","13:00",
  "13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00",
  "17:30","18:00","18:30","19:00","19:30","20:00","20:30",
];

const Calendar = ({ onChange = () => {} }) => { // 기본값으로 빈 함수 설정
  const [gridState, setGridState] = useState(
    Array(22)
      .fill()
      .map(() => Array(7).fill(false))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [currentState, setCurrentState] = useState(false);

  useEffect(() => {
    onChange(gridState); // gridState 변경 시 onChange 호출
  }, [gridState, onChange]);

  const [countState, setCountState] = useState(
    Array(22)
      .fill()
      .map(() => Array(7).fill(0))
  );

  const handleSave = async () => {
    const userId = 3; // 유저 ID 고정 값
    const dayIds = [1, 2, 3, 4, 5, 6, 7]; // days ID (일요일부터 토요일까지)

    for (let dayIndex = 0; dayIndex < dayIds.length; dayIndex++) {
      for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
        if (gridState[timeIndex][dayIndex]) {
          const time = times[timeIndex];
          const timeFrom = `${time}:00`;
          const timeTo = `${times[timeIndex + 1]}:00` || timeFrom;

          const dataToSend = {
            days: dayIds[dayIndex],
            user: userId,
            time_from: timeFrom,
            time_to: timeTo,
          };

          console.log("Sending data:", JSON.stringify(dataToSend, null, 2));

          try {
            const response = await axios.post("/api/v1/availability", dataToSend, {
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log("Response from server:", response.data);
          } catch (error) {
            console.error("Error saving data:", error);
          }
        }
      }
    }
  };

  const handleMouseDown = (timeIndex, dayIndex) => {
    setIsDragging(true);
    const newState = !gridState[timeIndex][dayIndex];
    setCurrentState(newState);
    toggleCell(timeIndex, dayIndex, newState);
  };

  const handleMouseOver = (timeIndex, dayIndex) => {
    if (isDragging) {
      toggleCell(timeIndex, dayIndex, currentState);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleCell = (timeIndex, dayIndex, state) => {
    setGridState((prevGrid) =>
      prevGrid.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === timeIndex && cellIndex === dayIndex ? state : cell
        )
      )
    );

    setCountState((prevCount) =>
      prevCount.map((row, rowIndex) =>
        row.map((count, cellIndex) => {
          if (rowIndex === timeIndex && cellIndex === dayIndex) {
            if (state && count === 0) {
              return count + 1;
            } else if (!state && count > 0) {
              return count - 1;
            }
          }
          return count;
        })
      )
    );
  };

  return (
    <div style={styles.container} onMouseUp={handleMouseUp}>
      <svg
        width="320"
        height="450"
        viewBox="0 0 320 450"
        xmlns="http://www.w3.org/2000/svg"
      >
        {dates.map((date, i) => (
          <text
            key={i}
            x={68 + i * 36}
            y="20"
            textAnchor="middle"
            fontSize="10"
            fill="#423E59"
          >
            {date}
          </text>
        ))}
        {days.map((day, i) => (
          <text
            key={i}
            x={68 + i * 36}
            y="40"
            textAnchor="middle"
            fontSize="18"
            fill="#423E59"
          >
            {day}
          </text>
        ))}

        {times.map((time, i) => (
          <text
            key={i}
            x="40"
            y={52 + i * 18}
            textAnchor="end"
            fontSize="10"
            fill="#423E59"
          >
            {time}
          </text>
        ))}

        {Array(22)
          .fill()
          .map((_, timeIndex) =>
            days.map((_, dayIndex) => (
              <g
                key={`${timeIndex}-${dayIndex}`}
                onMouseDown={() => handleMouseDown(timeIndex, dayIndex)}
                onMouseOver={() => handleMouseOver(timeIndex, dayIndex)}
              >
                <rect
                  x={50 + dayIndex * 36}
                  y={45 + timeIndex * 18}
                  width="36"
                  height="18"
                  fill={gridState[timeIndex][dayIndex] ? "#423E59" : "#D9D9D9"}
                  fillOpacity={gridState[timeIndex][dayIndex] ? 0.8 : 1}
                  stroke="#423E59"
                  strokeWidth="1"
                />
                {timeIndex % 2 === 1 && (
                  <line
                    x1={50 + dayIndex * 36}
                    y1={63 + (timeIndex - 1) * 18}
                    x2={86 + dayIndex * 36}
                    y2={63 + (timeIndex - 1) * 18}
                    stroke="#423E59"
                    strokeDasharray="2 2"
                    strokeWidth="0.5"
                  />
                )}
              </g>
            ))
          )}
      </svg>
      <StyledSaveButton onClick={handleSave}>
        Save
      </StyledSaveButton>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "0px",
  },
};
const StyledSaveButton = styled.button`
  width: 150px;
  height: 30px;
  background-color: #423e59;
  color: #d9d9d9;
  text-align: center;
  font-family: "Ibarra Real Nova", serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: none;
  cursor: pointer;
  margin: 20px auto;
  display: block;

  &:hover {
    opacity: 0.9;
  }
`;

export default Calendar;
