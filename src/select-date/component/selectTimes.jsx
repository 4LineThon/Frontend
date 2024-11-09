import React, { useState } from "react";
import styled from "styled-components";
import GenerateTimes from "./generateTimes";

const SelectTimes = ({ setRequest }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const handleSelectChange = (e, text) => {
    const field = text === "From" ? "start_time" : "end_time";
    const value = parseInt(e.target.value.slice(0, 2));

    if (text === "From") {
      // 시작 시간 설정
      setStartTime(value);
    } else if (text === "To") {
      setEndTime(value);
    }

    setRequest((prev) => ({
      ...prev,
      [field]: e.target.value + ":00",
    }));
  };

  return (
    <TimeContainer>
      <GenerateTimes text="From" handleSelectChange={handleSelectChange} />
      <GenerateTimes text="To" handleSelectChange={handleSelectChange} />
    </TimeContainer>
  );
};

export default SelectTimes;

const TimeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 43px;
`;
