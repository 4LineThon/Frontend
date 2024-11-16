import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import EveryoneAvailable from "./component/Everyoneavailable";
import StatusIndicator from "./component/StatusIndicator";
import Logo from "../Myavailability/component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import FixButton from "./component/fixButton";
import Explanation from "../explanation/explanation";
import CopyButton from "../copy-event-link/CopyButton";
import Comment from "../comment/Comment";
import AvailabilityDetail from "./component/AvailabilityDetail";
import { HeaderH2 } from "../Myavailability/component/headerH2";
import CommentExist from "./component/CommentExist";

const GroupAvailability = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [groupTimetableData, setGroupTimetableData] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [slotAvailabilityCounts, setSlotAvailabilityCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = Number(queryParams.get("groupId"));
  const userid = location.state?.userid;
  const [groupName, setGroupName] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availabilityDetail, setAvailabilityDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [name] = useState(location.state?.name || "User");

  const explanation = [
    "You can confirm the meeting time",
    "by clicking “Fix Time” button.",
  ];

  const checkHasComments = async (groupId, day, date, time) => {
    try {
      const payload = {
        group: groupId,
        day: day,
        date: date,
        time: time,
      };

      // `/api/v1/availability/availabilitydetail` 요청
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/availabilitydetail`,
        payload
      );

      // comments_data가 비어 있지 않은지 확인
      const hasComments = response.data.comments_data.length > 0;

      console.log(
        `Checking for comments on ${date} ${time}:`,
        hasComments ? "Comments exist" : "No comments"
      );

      return hasComments;
    } catch (error) {
      console.error("Error checking comments:", error);
      return false;
    }
  };

  useEffect(() => {
    if (groupId) {
      // fix 안됐으면 결과창 보내기
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/result/group/${groupId}`
        )
        .then((response) => {
          const data = response.data;
          const hasDetailObject = data.some((item) =>
            item.hasOwnProperty("detail")
          );
          console.log("hasDetailObject", data);
          // 확정됨
          if (!hasDetailObject) {
            const currentUrl = `/result?event=${event}&groupId=${groupId}`;
            navigate(currentUrl);
          }
        })
        .catch((error) => console.log(error));
      // fix 안됐으면 원래 화면 보여주기
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`
        )
        .then((response) => {
          const rawData = response.data;
          setGroupTimetableData(rawData);
          if (rawData.length > 0) {
            const slots = generateTimeSlots(
              rawData[0].start_time,
              rawData[0].end_time
            );
            setTimeSlots(slots);
            fetchAllSlotDetails(rawData, slots);
          }
        })
        .catch((error) => {
          console.error("Error fetching group timetable data:", error);
        });
    }
  }, [groupId]);

  const fetchAllSlotDetails = async (timetableData, slots) => {
    const counts = {};

    for (let dayIndex = 0; dayIndex < timetableData.length; dayIndex++) {
      for (let timeIndex = 0; timeIndex < slots.length - 1; timeIndex++) {
        const selectedDay = timetableData[dayIndex];
        const selectedTime = slots[timeIndex];
        const selectedDate = new Date(selectedDay.date);

        const dayOfWeek = selectedDate.toLocaleString("en-US", {
          weekday: "short",
        });

        const formattedDate = `${selectedDate.getFullYear()}-${(
          selectedDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${selectedDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const formattedTime = selectedTime + ":00";

        // Initialize the payload with group and time
        const selectedTimeSlot = {
          group: groupId,
          time: `${selectedTime}:00`,
        };

        if (selectedDay.date) {
          const selectedDate = new Date(selectedDay.date);
          if (!isNaN(selectedDate.getTime())) {
            // Only add `day` and `date` if `selectedDate` is valid
            selectedTimeSlot.day = selectedDate.toLocaleString("en-US", {
              weekday: "short",
            });
            selectedTimeSlot.date = `${selectedDate.getFullYear()}-${(
              selectedDate.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${selectedDate
              .getDate()
              .toString()
              .padStart(2, "0")}`;
          } else {
            // If date is invalid, just add the `day` from selectedDay
            selectedTimeSlot.day = selectedDay.day || "Unknown";
          }
        } else {
          // If there's no date, only send the `day` property from `selectedDay`
          selectedTimeSlot.day = selectedDay.day || "Unknown";
        }

        try {
          // console.log("Sending request with payload:", selectedTimeSlot);
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/availabilitydetail`,
            selectedTimeSlot
          );
          counts[`${dayIndex}-${timeIndex}`] =
            response.data.available_user.length;
        } catch (error) {
          console.error("Error fetching availability detail:", error);
        }
      }
    }

    setSlotAvailabilityCounts(counts);
    setLoading(false);
  };

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let current = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);
    while (current <= endTime) {
      slots.push(current.toISOString().substring(11, 16));
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const calculateAvailabilityColor = (count) => {
    if (count === userCount) {
      return "#9EA663";
    }
    const opacity = count / userCount;
    return `rgba(66, 62, 89, ${0.2 + opacity * 0.8})`;
  };

  useEffect(() => {
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
          setGroupName(response.data.name);
          setUserCount(response.data.user_count);
        } catch (error) {
          console.error("Error fetching group name:", error);
        }
      };
      fetchGroupName();
    }
  }, [groupId]);

  const handleRectClick = async (dayIndex, timeIndex) => {
    console.log(`Clicked on Day Index: ${dayIndex}, Time Index: ${timeIndex}`);
    const hasComment = checkHasComments(dayIndex, timeIndex);
    console.log(`Has Comment: ${hasComment}`); // 댓글 여부 출력
    const selectedDay = groupTimetableData[dayIndex];
    const selectedTime = timeSlots[timeIndex];
    const selectedDate = new Date(selectedDay.date);

    const dayOfWeek = selectedDate.toLocaleString("en-US", {
      weekday: "short",
    });

    const formattedDate = `${selectedDate.getFullYear()}-${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;

    const formattedTime = selectedTime + ":00";

    const selectedTimeSlot = {
      group: groupId,
      day: dayOfWeek,
      date: formattedDate,
      time: formattedTime,
    };
    console.log("Selected Time Slot:", selectedTimeSlot);
    setSelectedSlot(selectedTimeSlot);
    await requestAvailabilityDetail(selectedTimeSlot);
  };

  const requestAvailabilityDetail = async (selectedTimeSlot) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/availabilitydetail`,
        selectedTimeSlot
      );
      setAvailabilityDetail(response.data);
      setComments(response.data.comments_data || []);
    } catch (error) {
      console.error("Error fetching availability detail:", error);
    }
  };

  if (loading) {
    return <LoadingMessage>Loading...</LoadingMessage>;
  }

  return (
    <div
      style={{ position: "relative", display: "flex", flexDirection: "column" }}
    >
      <CopyButton />
      <Logo />
      <HeaderH2>{groupName}</HeaderH2>
      <AvailabilityHeader
        text="Group's Availability"
        arrowDirection="left"
        navigateTo={() =>
          navigate(`/login?event=${event}&groupId=${groupId}`, {
            state: { groupName },
          })
        }
      />

      <EveryoneAvailable />
      <StatusIndicator current={0} total={userCount} />
      <CalendarContainer>
        <StyledSVG
          width={50 + groupTimetableData.length * 36 + 10}
          height={timeSlots.length * 18 + 70}
          viewBox={`0 0 ${50 + groupTimetableData.length * 36} ${
            timeSlots.length * 18 + 70
          }`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 날짜와 요일 렌더링 */}
    {groupTimetableData.map((day, dayIndex) => (
      <React.Fragment key={`header-${dayIndex}`}>
        <text
          x={68 + dayIndex * 36}
          y="15"
          textAnchor="middle"
          fontSize="10"
          fill="#423E59"
        >
          {/* 날짜 표시 */}
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
          {/* 요일 표시 */}
          {new Date(day.date)
            .toLocaleDateString("en-US", { weekday: "short" })
            .charAt(0)}
        </text>
      </React.Fragment>
    ))}





          {timeSlots.map((time, index) => (
            <text
              key={index}
              x="40"
              y={50 + index * 18}
              textAnchor="end"
              fontSize="10"
              fill="#423E59"
            >
              {time}
            </text>
          ))}

          {groupTimetableData.map((day, dayIndex) => (
            <React.Fragment key={dayIndex}>
              {timeSlots.slice(0, -1).map((time, timeIndex) => {
                const currentDay = day.day;
                const currentDate = day.date;
                const currentTime = time + ":00";

                return (
                  <React.Fragment key={`rect-${dayIndex}-${timeIndex}`}>
                    <rect
                      x={50 + dayIndex * 36}
                      y={45 + timeIndex * 18}
                      width="36"
                      height="18"
                      fill={calculateAvailabilityColor(
                        slotAvailabilityCounts[`${dayIndex}-${timeIndex}`] || 0
                      )}
                      stroke="#423E59"
                      strokeWidth="1"
                    />
                    <CommentExist
                      key={`comment-${dayIndex}-${timeIndex}`}
                      x={50 + dayIndex * 36}
                      y={45 + timeIndex * 18}
                      width="36"
                      height="18"
                      onClick={() => handleRectClick(dayIndex, timeIndex)}
                      hasComments={async () =>
                        await checkHasComments(
                          groupId,
                          currentDay,
                          currentDate,
                          currentTime
                        )
                      }
                    />
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </StyledSVG>
      </CalendarContainer>

      {availabilityDetail && (
        <AvailabilityDetail
          available={availabilityDetail.available_user}
          unavailable={availabilityDetail.unavailable_user}
          comments={comments}
          setComments={setComments}
          userCount={userCount}
          selectedSlot={selectedSlot}
          name={name}
        />
      )}

      <FixButton
        event={event}
        groupId={groupId}
        userid={userid}
        groupName={groupName}
      />
      <Explanation textArr={explanation} />
    </div>
  );
};

export default GroupAvailability;

const LoadingMessage = styled.div`
  text-align: center;
  font-family: "Ibarra Real Nova";
  font-size: 25px;
  margin-top: 50px;
  color: #423e59;
`;

const StyledSVG = styled.svg`
  display: block;
  margin: 0 auto;
  width: fit-content;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding-top: 20px;
`;

// const DetailContainer = styled.div`
//   background: #f8f8f8;
//   padding: 10px;
//   margin-top: 10px;
//   border-radius: 5px;
// `;
