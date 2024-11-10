import React, { useState } from "react";
import styled from "styled-components";

// 시간을 1시간 단위로 생성하는 함수
const generateTimes = () => {
  const times = [];

  for (let hour = 0; hour < 25; hour++) {
    const timeString = `${hour}:00`;
    times.push(timeString);
  }

  return times;
};

const GenerateTimes = ({ text, handleSelectChange }) => {
  const times = generateTimes();

  return (
    <Container>
      {text}
      <SelectTime onChange={(e) => handleSelectChange(e, text)}>
        {times.map((time, idx) => (
          <OptionTime key={idx} value={time}>
            {time}
          </OptionTime>
        ))}
      </SelectTime>
    </Container>
  );
};

export default GenerateTimes;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 20px;
  color: #423e59;
`;

const SelectTime = styled.select`
  width: 81px;
  height: 28px;
  background-color: transparent;
  border: 2px solid #423e59;
  color: #423e59;
  font-size: 15px;
  text-align: center;
  outline: 0;
  cursor: pointer;
  font-family: "Ibarra Real Nova", serif;
`;

const OptionTime = styled.option`
  font-size: 15px;
  font-family: "Ibarra Real Nova", serif;
`;
