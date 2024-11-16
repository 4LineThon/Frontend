import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './NumberInputDay.css';
import AvailabilityHeaderDay from './components/AvailabilityHeaderDay';
import Logo from "../Myavailability/component/logo";
import InsertTypeDay from './components/InsertTypeDay';
import TimeSelectorDay from './components/TimeSelectorDay';
import SaveAvailability from './components/saveAvailability';
import styled from "styled-components";

function NumberInputDay() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");
  const event = queryParams.get("event");
  const [groupName, setGroupName] = useState("");

  const userid = location.state?.id;
  console.log("userid!!!! ",userid);

  const weekdayOrder = {
    "Mon": 0,
    "Tue": 1,
    "Wed": 2,
    "Thu": 3,
    "Fri": 4,
    "Sat": 5,
    "Sun": 6
  };
  


  const [days, setDays] = useState([]);
  const [uniqueDays, setUniqueDays] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [fetchedData, setFetchedData] = useState([]); // fetchedData 상태 추가

  useEffect(() => {
    const fetchGroupTimetable = async () => {
      if (!groupId) {
        console.error("No groupId found in query parameters.");
        return;
      }
  
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`
        );
  
        if (response.data && response.data.length > 0) {
          setDays(response.data);
          const uniqueDaysList = Array.from(new Set(response.data.map(item => item.day)))
            .sort((a, b) => weekdayOrder[a] - weekdayOrder[b]); // 요일 순서대로 정렬
          setUniqueDays(uniqueDaysList);
        } else {
          console.warn("No data received for group timetable.");
        }
      } catch (error) {
        console.error("Error fetching group timetable:", error);
      }
    };
  
    fetchGroupTimetable();
  }, [groupId]);
  
  useEffect(() => {
    if (days.length > 0) {
      const uniqueDaysList = Array.from(new Set(days.map(item => item.day)))
        .sort((a, b) => weekdayOrder[a] - weekdayOrder[b]); // 요일 순서대로 정렬
        console.log("Unique Days List (Sorted):", uniqueDaysList); // 정렬된 uniqueDaysList 출력
        
      setUniqueDays(uniqueDaysList);
    }
  }, [days]); // days 배열이 변경될 때마다 이 코드 블록 실행
  
  
  useEffect(() => {
    // availability 객체를 uniqueDays의 순서에 맞추어 재구성
    const newAvailability = {};
    uniqueDays.forEach(day => {
      if (availability[day]) {
        newAvailability[day] = availability[day];
      }
    });
    setAvailability(newAvailability);
  }, [uniqueDays]);
  
  

  useEffect(() => {
    const selectedDateData = days.find(dateObj => dateObj.day === selectedDay);
    if (selectedDateData) {
      const { start_time, end_time } = selectedDateData;
      setTimeOptions(generateTimeOptions(start_time, end_time));
    }
  }, [selectedDay, days]);

  const generateTimeOptions = (start, end) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      times.push(currentTime.toISOString().substring(11, 16));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return times;
  };

  const generateSlots = (start, end) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      slots.push({
        availability_count: 1,
        time: currentTime.toISOString().substring(11, 19)
      });
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const addTimeRange = () => {
    if (!selectedDay) return;
  
    setAvailability((prev) => {
      const dayAvailability = prev[selectedDay] || [];
      
      // "100:00 to 100:00"이 이미 추가되어 있는지 확인
      const hasDefaultRange = dayAvailability.some(
        (range) => range.start === "100:00" && range.end === "100:00"
      );
  
      if (hasDefaultRange) {
        // 중복 방지: 기본 값이 이미 존재하는 경우 추가하지 않음
        return prev;
      }
  
      // 기본 값을 추가하고 정렬
      const updatedAvailability = {
        ...prev,
        [selectedDay]: sortByStartTime([
          ...dayAvailability,
          { start: "100:00", end: "100:00", slots: [] },
        ]),
      };
  
      return updatedAvailability;
    });
  };
  
  
  useEffect(() => {
    if (uniqueDays.length > 0 && !selectedDay) {
      setSelectedDay(uniqueDays[0]);
    }
  }, [uniqueDays, selectedDay]);
  
  
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${userid}`
        );
  
        console.log("Fetched availability data:", response.data); // 응답 데이터 구조 확인
  
        // API 응답이 배열인지 확인
        const availabilityData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data; // 객체라면 `data` 속성을 사용
  
        // 예외 처리: availabilityData가 배열이 아닐 경우
        if (!Array.isArray(availabilityData)) {
          throw new Error("Invalid data structure: expected an array.");
        }
  
        const initialAvailability = {};
  
        availabilityData.forEach((data) => {
          const day = data.days_day; // 요일만 사용
          console.log("요일 추출?:", day)
          if (!initialAvailability[day]) {
            initialAvailability[day] = [];
          }
          initialAvailability[day].push({
            start: data.time_from.substring(0, 5), // "HH:mm"
            end: data.time_to.substring(0, 5),
            slots: generateSlots(data.time_from, data.time_to),
          });
        });
  
        setAvailability(initialAvailability);
        console.log("Processed availability state:", initialAvailability);
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };
  
    if (userid) {
      fetchAvailabilityData();
    }
  }, [userid]);
  
  

  const handleStartChange = (day, index, event) => {
    const newStartTime = event.target.value;
  
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      const selectedRange = newAvailability[day][index];
      const endTime = selectedRange.end;
  
      // Check if the new start time overlaps with any other time ranges for the same day
      const hasOverlap = newAvailability[day].some((range, i) => {
        if (i === index) return false; // Skip checking the current range
        return (
          (newStartTime >= range.start && newStartTime <= range.end) ||  // Overlaps with existing range
          (endTime !== "100:00" && newStartTime < range.start && endTime > range.start) // Full range overlaps
        );
      });
  
      if (hasOverlap) {
        alert("This time is already selected.");
        // Reset the start time to "Choose" (default)
        newAvailability[day][index].start = "100:00";
      } else {
        // Set the start time if there's no overlap and sort the times
        newAvailability[day][index].start = newStartTime;
        newAvailability[day] = sortByStartTime(newAvailability[day]);
      }
  
      return newAvailability;
    });
  };

  const handleEndChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      const startTime = newAvailability[day][index].start;
      const endTime = event.target.value;

      if (startTime !== "-1" && endTime <= startTime) {
        alert("End time cannot be earlier than start time.");
        newAvailability[day][index].end = "100:00";
      } else {
        newAvailability[day][index].end = endTime;
        newAvailability[day] = sortByStartTime(newAvailability[day]);
        newAvailability[day][index].slots = generateSlots(startTime, endTime);
      }
      return newAvailability;
    });
  };

  const sortByStartTime = (dayAvailability) => {
    return dayAvailability.sort((a, b) => {
      const [hoursA, minutesA] = a.start.split(':').map(Number);
      const [hoursB, minutesB] = b.start.split(':').map(Number);
      return hoursA - hoursB || minutesA - minutesB;
    });
  };

  useEffect(() => {
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
          setGroupName(response.data.name); // 응답에서 그룹 이름을 설정
          //console.log("Fetched group name:", response.data.name); // 그룹 이름 콘솔에 출력
        } catch (error) {
          console.error("Error fetching group name:", error);
        }
      };
      fetchGroupName();
    } else {
      console.error("No group_id found");
    }
  }, [groupId]); // `groupId`를 의존성 배열에 추가

  return (
    <div className="big-container" key={uniqueDays.join('-')}>
      <Logo />
      <HeaderH2>{groupName}</HeaderH2> 
      <AvailabilityHeaderDay text={`My Availability`} arrowDirection="leftzz" navigateTo="/groupAvailability" />
      <InsertTypeDay />

      <div id="date-dropdown">
        <span className="date-dropdown">Choose Date</span>
        <div className="select-list-container">
          <select value={selectedDay} onChange={handleDayChange} className="select-list">
            {uniqueDays.map((day, index) => (
              <option key={index} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <button className="btnPlus" onClick={addTimeRange}>+</button>
      </div>

      {availability && Object.keys(availability).length > 0 && (
        <TimeSelectorDay 
          availability={availability} 
          handleStartChange={handleStartChange} 
          handleEndChange={handleEndChange} 
          deleteTimeRange={(day, index) => {
            const newAvailability = { ...availability };
            newAvailability[day].splice(index, 1);
            if (newAvailability[day].length === 0) delete newAvailability[day];
            setAvailability(newAvailability);
          }}
          timeOptions={timeOptions}
        />
      )}

      {Object.keys(availability).length > 0 && (
        <SaveAvailability 
          availability={availability} 
          groupId={groupId} 
          userid={userid} 
          event={event}
          fetchedData={fetchedData} // fetchedData 전달
        />
      )}
    </div>
  );
}

export default NumberInputDay;
const HeaderH2 = styled.h2`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #4c3f5e;
  margin-bottom: 10px; /* 4LINETON과 My Availability 사이 간격 추가 */
`;