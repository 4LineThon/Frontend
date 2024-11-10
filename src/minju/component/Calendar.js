import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const dates = ["Oct15", "Oct16", "Oct17", "Oct18", "Oct19", "Oct20", "Oct21"];
const times = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const Calendar = ({ onChange }) => {
  const [gridState, setGridState] = useState(
    Array(22).fill().map(() => Array(7).fill(false))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [currentState, setCurrentState] = useState(false);

  useEffect(() => {
    onChange(gridState);
  }, [gridState, onChange]);
  // 선택된 상태에 따라 countState 업데이트
  const [countState, setCountState] = useState(
    Array(22).fill().map(() => Array(7).fill(0))
  );


const handleSave = async () => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const baseDate = new Date(2024, 9, 15); // 2024년 10월 15일부터 시작

  const data = dates.map((date, dayIndex) => {
    const currentDay = new Date(baseDate);
    currentDay.setDate(currentDay.getDate() + dayIndex);

    const slots = times
      .map((time, timeIndex) => {
        const availabilityCount = countState[timeIndex][dayIndex];
        if (availabilityCount > 0) {
          return {
            availability_count: availabilityCount,
            time: `${time}:00`,
          };
        }
        return null;
      })
      .filter(Boolean); // null 값 제거

    return {
      id: dayIndex + 1,
      day: dayNames[currentDay.getDay()],
      date: currentDay.toISOString().split('T')[0],
      start_time: "10:00:00",
      end_time: "20:30:00",
      slots: slots,
    };
  });

  console.log("Formatted data:", JSON.stringify(data, null, 2));

  try {
    const response = await axios.post("/api/v1/group-timetable", data);
    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error saving data:", error);
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
  
    // 선택된 상태에 따라 countState 업데이트
    setCountState((prevCount) =>
      prevCount.map((row, rowIndex) =>
        row.map((count, cellIndex) => {
          if (rowIndex === timeIndex && cellIndex === dayIndex) {
            if (state && count === 0) {
              // 처음 선택할 때만 카운트를 증가
              return count + 1;
            } else if (!state && count > 0) {
              // 선택 해제 시 카운트를 감소 (최소 0 유지)
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
      <svg width="320" height="450" viewBox="0 0 320 450" xmlns="http://www.w3.org/2000/svg">
        {/* 날짜와 요일 표시 */}
        {dates.map((date, i) => (
          <text key={i} x={68 + i * 36} y="20" textAnchor="middle" fontSize="10" fill="#423E59">
            {date}
          </text>
        ))}
        {days.map((day, i) => (
          <text key={i} x={68 + i * 36} y="40" textAnchor="middle" fontSize="18" fill="#423E59">
            {day}
          </text>
        ))}

        {/* 시간 표시 */}
        {times.map((time, i) => (
          <text key={i} x="40" y={52 + i * 18} textAnchor="end" fontSize="10" fill="#423E59">
            {time}
          </text>
        ))}

        {/* 그리드 생성 */}
        {Array(22).fill().map((_, timeIndex) =>
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
      <button onClick={handleSave} style={styles.saveButton}>Save</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
    marginBottom: '0px',
  },
  saveButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#423E59",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Calendar;
