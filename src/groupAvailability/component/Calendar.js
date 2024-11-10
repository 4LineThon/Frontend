import React, { useState } from "react";
import styled from "styled-components";
import CommentBox from "./commentBox";
import CommentInput from "./commentInput";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const dates = ["Oct15", "Oct16", "Oct17", "Oct18", "Oct19", "Oct20", "Oct21"];
const times = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
];

const Calendar = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [comments, setComments] = useState({});

  const handleCellClick = (timeIndex, dayIndex) => {
    const cellId = `${timeIndex}-${dayIndex}`;
    setSelectedCell(cellId);
  };

  const handleCommentSubmit = (commentText) => {
    setComments((prev) => ({
      ...prev,
      [selectedCell]: [...(prev[selectedCell] || []), commentText],
    }));
  };

  return (
    <Container>
      <CalendarContainer>
        <svg width="320" height="450" viewBox="0 0 320 450" xmlns="http://www.w3.org/2000/svg">
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
          {times.map((time, i) => (
            <text key={i} x="40" y={52 + i * 18} textAnchor="end" fontSize="10" fill="#423E59">
              {time}
            </text>
          ))}

          {Array.from({ length: 22 }).map((_, timeIndex) =>
            days.map((_, dayIndex) => {
              const cellId = `${timeIndex}-${dayIndex}`;
              return (
                <g
                  key={`${timeIndex}-${dayIndex}`}
                  onMouseDown={() => handleCellClick(timeIndex, dayIndex)}
                >
                  <rect
                    x={50 + dayIndex * 36}
                    y={45 + timeIndex * 18}
                    width="36"
                    height="18"
                    fill="#D9D9D9"
                    stroke="#423E59"
                    strokeWidth="1"
                  />
                  {comments[cellId] && comments[cellId].length > 0 && (
                    <circle cx={55 + dayIndex * 36} cy={50 + timeIndex * 18} r="3" fill="#474073" />
                  )}
                </g>
              );
            })
          )}
        </svg>
      </CalendarContainer>

      {selectedCell && (
        <CommentSection>
          <CommentList>
            {comments[selectedCell]?.map((comment, idx) => (
              <CommentBox key={idx} commentInfo={{ name: "User", content: comment }} />
            ))}
          </CommentList>

          <CommentInputWrapper>
            <CommentInput
              onSubmit={handleCommentSubmit}
              initialComment=""
            />
          </CommentInputWrapper>
        </CommentSection>
      )}
    </Container>
  );
};

export default Calendar;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const CommentSection = styled.div`
  width: 100%;
  max-width: 320px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;
`;

const CommentInputWrapper = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
