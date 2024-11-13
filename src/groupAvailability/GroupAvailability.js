import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import EveryoneAvailable from "./component/Everyoneavailable";
import StatusIndicator from "./component/StatusIndicator";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "../minju/component/AvailabilityHeader";
import FixButton from "./component/fixButton";
import Calendar from "../minju/component/Calendar";
import Explanation from "../explanation/explanation";

const GroupAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [groupTimetableData, setGroupTimetableData] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");
  const userid = location.state?.userid;
  
  // 쿼리 파라미터 확인 (디버깅용)
  console.log("Event:", event);
  console.log("GroupId:", groupId);
  console.log("userid:",userid);

  const explanation = [
    "You can confirm the meeting time",
    "by clicking “Fix Time” button.",
  ];
  useEffect(() => {
    if (groupId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`)
        .then(response => {
          const rawData = response.data;
          console.log("Fetched group timetable data:", rawData);

          // Process data to the desired format
          const processedData = rawData.map(item => ({
            date: item.date,
            day: item.day,
            startTime: item.start_time,
            endTime: item.end_time,
          }));

          setGroupTimetableData(processedData);
          const slots = generateTimeSlots(processedData[0].startTime, processedData[0].endTime);
          setTimeSlots(slots);
        })
        .catch(error => {
          console.error("Error fetching group timetable data:", error);
        });
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${groupId}`)
        .then(response => {
          console.log("Fetched availability data:", response.data);
          setAvailabilityData(response.data);
        })
        .catch(error => {
          console.error("Error fetching availability data:", error);
        });
    }
  }, [groupId]);

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let current = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (current <= endTime) {
      slots.push(current.toISOString().substring(11, 16)); // "HH:MM" 형식
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const calculateAvailabilityColor = (count) => {
    if (count === 5) return "#D9D977"; // 모든 사용자가 가능할 때
    else if (count === 4) return "#8B8B4D";
    else if (count === 3) return "#61613B";
    else if (count === 2) return "#3E3E27";
    else return "#D9D9D9";
  };


  return (
    <div>
      <Logo />
      <AvailabilityHeader
        text="Group's Availability"
        arrowDirection="right"
        navigateTo="/minju"
      />
      <EveryoneAvailable />
      <StatusIndicator current={0} total={5} />
      <Calendar groupId={groupId} userId={userid} event={event} /> {/* 필요한 데이터 전달 */}
      <FixButton />
      <Explanation textArr={explanation} />
    </div>
  );
};

export default GroupAvailability;
