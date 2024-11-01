import React, { useState } from "react";
import styled from "styled-components";
import { Title } from "./title";

const dayArr = ["S", "M", "T", "W", "T", "F", "S"];

const SelectDays = () => {
  const basicColor = "#D9D9D9";
  const specialColor = "#423e59";
  const initialBtn = Array(28).fill(false);
  const [btn, setBtn] = useState(initialBtn);

  const handleClick = (e) => {
    const idx = Number(e.target.id);
    setBtn((prev) => prev.map((state, i) => (i === idx ? !state : state)));
  };

  return (
    <Container>
      <MonthBox>Every Week</MonthBox>
      <CalendarContainer>
        {dayArr.map((day, idx) => {
          return (
            <DateBox
              key={idx}
              id={idx}
              onClick={handleClick}
              color={btn[idx] ? basicColor : specialColor}
              $bgcolor={btn[idx] ? specialColor : basicColor}
            >
              {day}
            </DateBox>
          );
        })}
      </CalendarContainer>
    </Container>
  );
};

export default SelectDays;

const Container = styled.div`
  margin-top: 29px;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  row-gap: 2px;
`;

const MonthBox = styled.div`
  margin-top: 14px;
  margin-bottom: 6px;
  text-align: center;
  font-size: 20px;
  color: #423e59;
`;

const DateBox = styled.button`
  width: 38px;
  height: 197px;
  margin-top: 40px;
  display: flex;
  border: 3px solid #423e59;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgcolor};
  color: ${(props) => props.color};
  font-size: 24px;
  cursor: pointer;
  font-family: "Ibarra Real Nova", serif;
`;

const DayBox = styled.div`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #423e59;
  font-size: 24px;
`;
