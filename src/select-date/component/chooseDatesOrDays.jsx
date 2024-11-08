import React from "react";
import styled from "styled-components";

const ChooseDatesOrDays = ({ selected, setSelected }) => {
  return (
    <Container>
      <Label>
        <RadioButton
          type="radio"
          name="Dates"
          checked={selected === "Dates"}
          onChange={() => setSelected("Dates")}
        />
        <Box checked={selected === "Dates"}>Dates</Box>
      </Label>
      <Label>
        <RadioButton
          type="radio"
          name="Days"
          checked={selected === "Days"}
          onChange={() => setSelected("Days")}
        />
        <Box checked={selected === "Days"}>Days</Box>
      </Label>
    </Container>
  );
};

export default ChooseDatesOrDays;

const Container = styled.div`
  display: flex;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
`;

const RadioButton = styled.input`
  display: none;
`;

const Box = styled.div`
  width: 100px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: 3px solid #423e59;
  color: ${({ checked }) => (checked ? "#D9D9D9" : "#423E59")};
  background-color: ${({ checked }) => (checked ? "#423E59" : "transparent")};
`;
