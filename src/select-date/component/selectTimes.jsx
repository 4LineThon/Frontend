import React from "react";
import { Title } from "./title";
import styled from "styled-components";
import GenerateTimes from "./generateTimes";

const SelectTimes = () => {
  return (
    <>
      <TimeContainer>
        <GenerateTimes text="From" />
        <GenerateTimes text="To" />
      </TimeContainer>
    </>
  );
};

export default SelectTimes;

const TimeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 43px;
`;
