import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import EveryoneAvailable from "./component/Everyoneavailable";
import StatusIndicator from "./component/StatusIndicator";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import FixButton from "./component/fixButton";
import Explanation from "../explanation/explanation";
import CopyButton from "../copy-event-link/CopyButton";

const GroupAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [groupTimetableData, setGroupTimetableData] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [maxAvailability, setMaxAvailability] = useState(1); // 최댓값을 저장할 상태
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

          // 최대 availability_count를 계산
          let maxCount = 1;
          const processedData = rawData.map((item) => {
            item.slots.forEach(slot => {
              if (slot.availability_count > maxCount) {
                maxCount = slot.availability_count;
              }
            });
            return {
              ...item,
              slots: item.slots.reduce((acc, slot) => {
                const timeKey = slot.time.slice(0, 5); // "HH:MM" 형식으로 변환
                acc[timeKey] = slot.availability_count;
                return acc;
              }, {}),
            };
          });

          setMaxAvailability(maxCount); // 최대 값 상태에 저장
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

    // availability_count에 따라 그라데이션 적용 (maxAvailability에 맞춰 비율 계산)
  const calculateAvailabilityColor = (count) => {
    const opacity = count / maxAvailability; 
    return `rgba(66, 62, 89, ${0.2 + opacity * 0.8})`; 
  };
  return (
    <div style={{ position: "relative" }}>
      <CopyButton />
      <Logo />
      <AvailabilityHeader
        text="Group's Availability"
        arrowDirection="right"
        navigateTo={() => navigate(`/minju?event=${event}&groupId=${groupId}`, {
          state: { userid }
        })}
      />
      <EveryoneAvailable />
      <StatusIndicator current={0} total={maxAvailability} />
      <CalendarContainer>
  <StyledSVG
    width={50 + groupTimetableData.length * 36} 
    height={timeSlots.length * 18 + 70}
    viewBox={`0 0 ${50 + groupTimetableData.length * 36} ${timeSlots.length * 18 + 70}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 시간 표시 */}
    {timeSlots.map((time, index) => (
      <text
        key={index}
        x="40" // 시간을 왼쪽에 맞추기 위해 x 좌표 설정
        y={45 + index * 18} // 시간별 y 좌표 설정
        textAnchor="end"
        fontSize="10"
        fill="#423E59"
      >
        {time}
      </text>
    ))}

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

        {/* 시간대별 가용 인원 표시 (마지막 시간 제외) */}
        {timeSlots.slice(0, -1).map((time, timeIndex) => (
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
</CalendarContainer>


      
      {/* 여기 groupIdid도 나중에 제대로 받아지면 그때 groupId로 수정하면됨 */}  
      <FixButton event={event} groupId={groupId} userid = {userid} />
      <Explanation textArr={explanation} />
    </div>
  );
};

const StyledSVG = styled.svg`
  display: block;
  margin: 0 auto;
  width: fit-content; 
  `;
  const CalendarContainer = styled.div`
  display: flex;
  justify-content: center; // Center-aligns the calendar in the main container
  width: 100%;
  padding-top: 20px; // Optional, adds space at the top
`;


export default GroupAvailability;
