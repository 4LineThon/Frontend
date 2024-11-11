import React, { useRef, useState } from "react";
import styled from "styled-components";
import SelectTimes from "./component/selectTimes";
import SelectDates from "./component/selectDates";
import Logo from "./component/logo";
import ChooseDatesOrDays from "./component/chooseDatesOrDays";
import SelectDays from "./component/selectDays";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Explanation from "../explanation/explanation";

const SelectDate = () => {
  const [selected, setSelected] = useState("Dates");
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const [request, setRequest] = useState({});
  const navigate = useNavigate();
  const explanation = ["Please select the date for scheduling."];

  const updateRequest = (field, value) => {
    setRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createEvent = () => {
    // 유효성 검사
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

    // name 업데이트
    updateRequest("name", name);

    // axios 연동
    postGroup({ ...request, name });
    navigate("/Login", {
      state: {
        days: request.days,
        start_time: request.start_time,
        end_time: request.endTime,
      },
    });
  };

  const postGroup = async (data) => {
    try {
      await axios.post(`/api/v1/group`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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
        <SelectDates updateRequest={updateRequest} />
      ) : (
        <SelectDays updateRequest={updateRequest} />
      )}
      <SelectTimes updateRequest={updateRequest} />
      <CreateBtn onClick={createEvent}>Create Event</CreateBtn>
      <Explanation textArr={explanation} />
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
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #423e59;
  color: #d9d9d9;
  font-size: 25px;
  cursor: pointer;
`;
