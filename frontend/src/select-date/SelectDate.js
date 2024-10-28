import React from "react";
import Calendar from "./component/calendar";
import styled from "styled-components";

const SelectDate = () => {
  return (
    <Wrapper>
      <EventName />
      <Calendar />
    </Wrapper>
  );
};

export default SelectDate;

const Wrapper = styled.div`
  min-height: 812px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Ibarra Real Nova", serif;
`;

const EventName = styled.input`
  width: 206px;
  background-color: transparent;
  margin-bottom: 39px;
  border-bottom: 4px solid #423e59;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  outline: 0;
  font-family: "Ibarra Real Nova", serif;
  color: #423e59;
  font-size: 30px;
`;
