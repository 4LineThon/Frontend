import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const CreateCalendar = ({ groupTimetableData, userid, onChange = () => {} }) => {
  const [gridState, setGridState] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentState, setCurrentState] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");
  const event = queryParams.get("event");

  useEffect(() => {
    if (groupTimetableData && groupTimetableData.length > 0) {
      const { startTime, endTime } = groupTimetableData[0];
      const timeSlots = generateTimeSlots(startTime, endTime);
      setGridState(Array(timeSlots.length).fill().map(() => Array(groupTimetableData.length).fill(false)));
    }
  }, [groupTimetableData]);

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let current = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);
    
    while (current <= endTime) {
      slots.push(current.toISOString().substring(11, 16)); // "HH:MM" 형식
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  useEffect(() => {
    onChange(gridState);
  }, [gridState, onChange]);

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
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // 날짜가 없으면 빈 문자열 반환
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month}${day}`;
  };

  const timeSlots = gridState.length > 0 ? generateTimeSlots(groupTimetableData[0].startTime, groupTimetableData[0].endTime) : [];
  
  const handleSave = async () => {
    for (let dayIndex = 0; dayIndex < groupTimetableData.length; dayIndex++) {
      const dayData = groupTimetableData[dayIndex];
      const dayName = dayData.day; // days의 day
      const dayDate = dayData.date; // days의 date
  
      for (let timeIndex = 0; timeIndex < timeSlots.length - 1; timeIndex++) { // 마지막 time slot은 제외
        if (gridState[timeIndex][dayIndex]) {
          const timeFrom = `${timeSlots[timeIndex]}:00`;
          const timeTo = `${timeSlots[timeIndex + 1]}:00`;
  
          const dataToSend = {
            user: userid,
            day: dayName,
            date: dayDate, // date를 선택적으로 추가
            time_from: timeFrom,
            time_to: timeTo,
          };
          console.log("datatoSend", dataToSend);
          try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/availability`, dataToSend, {
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
  
    // Save 완료 후 이동할 URL 생성
    const url = `/groupavailability?event=${event}&groupId=${groupId}`;
    navigate(url, {
      state: {
        gridState,
        timeSlots,
        groupTimetableData,
        userid,
      },
    });
  };
  

  return (
    <CalendarContainer onMouseUp={handleMouseUp}>
      <StyledSVG
        width={50 + groupTimetableData.length * 36} // 동적으로 SVG 너비를 설정
        height={timeSlots.length * 18 + 70}
        viewBox={`0 0 ${50 + groupTimetableData.length * 36} ${timeSlots.length * 18 + 70}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {groupTimetableData.map((day, i) => (
          <React.Fragment key={i}>
            <text x={68 + i * 36} y="15" textAnchor="middle" fontSize="10" fill="#423E59">
              {formatDate(day.date)}
            </text>
            <text x={68 + i * 36} y="30" textAnchor="middle" fontSize="18" fill="#423E59">
              {day.day.charAt(0)}
            </text>
          </React.Fragment>
        ))}
        
        {timeSlots.map((time, i) => (
          <text
            key={i}
            x="40"
            y={50 + i * 18}
            textAnchor="end"
            fontSize="10"
            fill="#423E59"
          >
            {time}
          </text>
        ))}

        {timeSlots.slice(0, -1).map((_, timeIndex) =>
          groupTimetableData.map((_, dayIndex) => (
            <rect
              key={`${timeIndex}-${dayIndex}`}
              x={50 + dayIndex * 36}
              y={45 + timeIndex * 18}
              width="36"
              height="18"
              fill={gridState[timeIndex][dayIndex] ? "#423E59" : "#D9D9D9"}
              fillOpacity={gridState[timeIndex][dayIndex] ? 0.8 : 1}
              stroke="#423E59"
              strokeWidth="1"
              onMouseDown={() => handleMouseDown(timeIndex, dayIndex)}
              onMouseOver={() => handleMouseOver(timeIndex, dayIndex)}
            />
          ))
        )}
      </StyledSVG>
      <StyledSaveButton onClick={handleSave}>
        Save
      </StyledSaveButton>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const StyledSVG = styled.svg`
  display: block;
  margin: 0 auto;
`;

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

export default CreateCalendar;
