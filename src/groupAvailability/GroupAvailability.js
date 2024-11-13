import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import EveryoneAvailable from "./component/Everyoneavailable";
import StatusIndicator from "./component/StatusIndicator";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "../minju/component/AvailabilityHeader";
import FixButton from "./component/fixButton";
import Explanation from "../explanation/explanation";
import CopyButton from "../copy-event-link/CopyButton";

const GroupAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [groupTimetableData, setGroupTimetableData] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");
  const userid = location.state?.userid;

  // 쿼리 파라미터 확인 (디버깅용)
  console.log("Event:", event);
  console.log("GroupId:", groupId);
  console.log("userid:", userid);

  const explanation = [
    "You can confirm the meeting time",
    "by clicking “Fix Time” button.",
  ];

  useEffect(() => {
    if (groupId) {
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`
        )
        .then((response) => {
          const rawData = response.data;
          console.log("Fetched group timetable data:", rawData);

          // 시간대를 만들고, 각 슬롯에 따라 가용 인원 수를 표시
          const processedData = rawData.map((item) => ({
            ...item,
            slots: item.slots.reduce((acc, slot) => {
              acc[slot.time] = slot.availability_count;
              return acc;
            }, {}),
          }));

          setGroupTimetableData(processedData);

          if (rawData.length > 0) {
            const slots = generateTimeSlots(
              rawData[0].start_time,
              rawData[0].end_time
            );
            setTimeSlots(slots);
          }
        })
        .catch((error) => {
          console.error("Error fetching group timetable data:", error);
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
    <div style={{ position: "relative" }}>
      <CopyButton />
      <Logo />
      <AvailabilityHeader
        text="Group's Availability"
        arrowDirection="right"
        navigateTo="/minju"
      />
      <EveryoneAvailable />
      <StatusIndicator current={0} total={5} />
      <StyledSVG
        width="320"
        height={timeSlots.length * 18 + 70}
        viewBox={`0 0 320 ${timeSlots.length * 18 + 70}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 요일 및 날짜 표시 */}
        {groupTimetableData.map((day, dayIndex) => (
          <React.Fragment key={dayIndex}>
            <text
              x={68 + dayIndex * 36}
              y="15"
              textAnchor="middle"
              fontSize="10"
              fill="#423E59"
            >
              {new Date(day.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </text>
            <text
              x={68 + dayIndex * 36}
              y="30"
              textAnchor="middle"
              fontSize="18"
              fill="#423E59"
            >
              {day.day.charAt(0)}
            </text>

            {/* 시간대별 가용 인원 표시 */}
            {timeSlots.map((time, timeIndex) => (
              <rect
                key={`${dayIndex}-${timeIndex}`}
                x={50 + dayIndex * 36}
                y={45 + timeIndex * 18}
                width="36"
                height="18"
                fill={calculateAvailabilityColor(day.slots[time] || 0)}
                stroke="#423E59"
                strokeWidth="1"
              />
            ))}
          </React.Fragment>
        ))}
      </StyledSVG>
      <FixButton />
      <Explanation textArr={explanation} />
    </div>
  );
};

const StyledSVG = styled.svg`
  display: block;
  margin: 0 auto;
`;

export default GroupAvailability;
