import React, { useState } from "react";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const dates = ["Oct15", "Oct16", "Oct17", "Oct18", "Oct19", "Oct20", "Oct21"];
const times = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const Calendar = () => {
  const [gridState, setGridState] = useState(
    Array(22).fill().map(() => Array(7).fill(false))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [currentState, setCurrentState] = useState(false); // 드래그 상태를 유지하기 위한 상태

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
    setGridState(prevGrid => 
      prevGrid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => 
          rowIndex === timeIndex && cellIndex === dayIndex ? state : cell
        )
      )
    );
  };

  return (
    <svg
      width="320"
      height="700"
      viewBox="0 0 320 700"
      xmlns="http://www.w3.org/2000/svg"
      onMouseUp={handleMouseUp} 
    >
      {/* 날짜와 요일 표시 */}
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

      {/* 시간 표시 */}
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
            
            {/* 점선 추가 */}
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
  );
};

export default Calendar;
