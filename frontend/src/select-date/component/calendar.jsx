import React, { useState } from "react";
import styled from "styled-components";
import { Title } from "./title";

const dayArr = ["S", "M", "T", "W", "T", "F", "S"];
const dateArr = Array.from({ length: 28 }, (_, i) => i + 1);

const Calendar = () => {
  const basicColor = "#D9D9D9";
  const specialColor = "#423e59";
  const initialBtn = Array(28).fill(false);
  const [btn, setBtn] = useState(initialBtn);

  const handleClick = (e) => {
    const idx = Number(e.target.id);
    setBtn((prev) => prev.map((state, i) => (i === idx ? !state : state)));
  };

  return (
    <>
      <Title>Select Dates</Title>
      <MonthBox>2024 Oct/Nov</MonthBox>
      <CalendarContainer>
        {dayArr.map((day, idx) => {
          return <DayBox key={idx}>{day}</DayBox>;
        })}
        {dateArr.map((date, idx) => {
          return (
            <DateBox
              key={idx}
              id={idx}
              onClick={handleClick}
              color={btn[idx] ? basicColor : specialColor}
              $bgcolor={btn[idx] ? specialColor : basicColor}
            >
              {date}
            </DateBox>
          );
        })}
      </CalendarContainer>
    </>
  );
};

export default Calendar;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  row-gap: 2px;
`;

const MonthBox = styled.div`
  margin-bottom: 12px;
  text-align: center;
  font-size: 20px;
`;

const DateBox = styled.button`
  width: 38px;
  height: 38px;
  display: flex;
  border: 3px solid #423e59;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgcolor};
  color: ${(props) => props.color};
  font-size: 24px;
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
