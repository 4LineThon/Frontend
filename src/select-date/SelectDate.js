import React, { useRef, useState } from "react";
import styled from "styled-components";
import SelectTimes from "./component/selectTimes";
import SelectDates from "./component/selectDates";
import Logo from "./component/logo";
import ChooseDatesOrDays from "./component/chooseDatesOrDays";
import SelectDays from "./component/selectDays";

const SelectDate = () => {
  const [selected, setSelected] = useState("Dates");
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const [request, setRequest] = useState({});

  const createEvent = () => {
    console.log(name);
    if (!name) {
      alert("Please write the event name.");
      inputRef.current.focus();
      return;
    }
    setRequest((prev) => ({ ...prev, name }));
    console.log(request);
  };

  return (
    <Wrapper>
      <Logo />
      <EventName
        maxLength={10}
        placeholder="new event name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        ref={inputRef}
      />
      <ChooseDatesOrDays selected={selected} setSelected={setSelected} />
      {selected === "Dates" ? (
        <SelectDates setRequest={setRequest} />
      ) : (
        <SelectDays setRequest={setRequest} />
      )}
      <SelectTimes />
      <CreateBtn onClick={createEvent}>Create Event</CreateBtn>
    </Wrapper>
  );
};

export default SelectDate;

const Wrapper = styled.div`
  width: 315px;
  min-height: 812px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Ibarra Real Nova", serif;
`;

const EventName = styled.input`
  width: 206px;
  background-color: transparent;
  margin-top: 43px;
  margin-bottom: 44px;
  border-bottom: 4px solid #423e59;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  outline: 0;
  font-family: "Ibarra Real Nova", serif;
  color: #423e59;
  text-align: center;
  font-size: 27px;
  &::placeholder {
    color: #423e59;
  }
`;

const CreateBtn = styled.div`
  width: 197px;
  height: 38px;
  margin-top: 51px;
  margin-bottom: 49px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #423e59;
  color: #d9d9d9;
  font-size: 25px;
  cursor: pointer;
`;
