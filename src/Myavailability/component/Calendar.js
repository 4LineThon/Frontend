import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation } from "react-router-dom";
import CreateCalendar from "./CreateCalendar";

const Calendar = ({ groupId }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const userid = location.state?.id;
  const name = location.state?.name;

  const [timetableData, setTimetableData] = useState([]);
  
  useEffect(() => {
    if (groupId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`)
        .then(response => {
          const rawData = response.data;
          console.log("Fetched raw group timetable data:", rawData);

          const processedData = rawData.map(item => ({
            date: item.date,
            day: item.day,
            startTime: item.start_time,
            endTime: item.end_time,
          }));

          console.log("Processed timetable data:", processedData); // 데이터 확인
          setTimetableData(processedData);
          
        })
        .catch(error => {
          console.error("Error fetching group timetable data:", error);
        });
    }
  }, [groupId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {console.log("Passing timetable data to CreateCalendar:", timetableData)}
      <CreateCalendar groupTimetableData={timetableData} userid={userid}></CreateCalendar>
    </div>
  );
};

const StyledSaveButton = styled.button`
  width: 150px;
  height: 30px;
  background-color: #423e59;
  color: #d9d9d9;
  text-align: center;
  font-family: "Ibarra Real Nova", serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: none;
  cursor: pointer;
  margin: 20px auto;
  display: block;
  &:hover {
    opacity: 0.9;
  }
`;

export default Calendar;
