import React, { useRef, useState } from "react";
import styled from "styled-components";
import SelectTimes from "./component/selectTimes";
import SelectDates from "./component/selectDates";
import Logo from "./component/logo";
import ChooseDatesOrDays from "./component/chooseDatesOrDays";
import SelectDays from "./component/selectDays";
import axios from "axios";

const SelectDate = () => {
  const [selected, setSelected] = useState("Dates");
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const [request, setRequest] = useState({});

  const createEvent = () => {
    if (!name) {
      alert("Please write the event name.");
      inputRef.current.focus();
      return;
    }
    if (!request.days.length) {
      alert("Choose the Dates/Days.");
      return;
    }
    if (!request.start_time || !request.end_time) {
      alert("Please write the time.");
      return;
    }
    const startTime = parseInt(request.start_time.slice(0, 2));
    const endTime = parseInt(request.end_time.slice(0, 2));
    if (startTime >= endTime) {
      alert("End time must be greater than start time.");
      return;
    }

    setRequest((prev) => ({ ...prev, name }));

    // axios 연동
    postGroup({ ...request, name });
    console.log({ ...request, name });
  };

  const postGroup = async (data) => {
    try {
      const response = await axios.post(`/api/v1/group`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
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
      <SelectTimes setRequest={setRequest} />
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
