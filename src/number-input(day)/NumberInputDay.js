import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './NumberInputDay.css';
import AvailabilityHeaderDay from './components/AvailabilityHeaderDay';
import Logo from "../minju/component/logo";
import InsertTypeDay from './components/InsertTypeDay';
import TimeSelectorDay from './components/TimeSelectorDay';

function NumberInputDay() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId"); // 쿼리 파라미터로 groupId 받아오기

  const [days, setDays] = useState([]); // 전체 데이터 저장
  const [uniqueDays, setUniqueDays] = useState([]); // 중복 없는 요일만 저장
  const [timeOptions, setTimeOptions] = useState([]);  // 시간 옵션 배열
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");

  // 그룹 타임테이블 정보를 가져오기
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
          // 전체 데이터를 저장
          setDays(response.data);
          
          // 중복되지 않은 day 값만 추출하여 uniqueDays에 저장
          const uniqueDaysList = Array.from(new Set(response.data.map(item => item.day)));
          setUniqueDays(uniqueDaysList);
          
          console.log("Fetched unique days:", uniqueDaysList);
        } else {
          console.warn("No data received for group timetable.");
        }
      } catch (error) {
        console.error("Error fetching group timetable:", error);
      }
    };

    fetchGroupTimetable();
  }, [groupId]);

  // 선택된 요일에 따라 start_time과 end_time을 기반으로 시간 옵션을 생성
  useEffect(() => {
    const selectedDateData = days.find(dateObj => dateObj.day === selectedDay);
    if (selectedDateData) {
      const { start_time, end_time } = selectedDateData;
      setTimeOptions(generateTimeOptions(start_time, end_time));
    }
  }, [selectedDay, days]);

  // startTime과 endTime을 기반으로 시간 옵션을 생성하는 함수
  const generateTimeOptions = (start, end) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      times.push(currentTime.toISOString().substring(11, 16));  // HH:MM 형식
      currentTime.setMinutes(currentTime.getMinutes() + 30);  // 30분 증가
    }

    return times;
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const addTimeRange = () => {
    if (!selectedDay) return;
  
    setAvailability((prev) => {
      const dayAvailability = [...(prev[selectedDay] || []), { start: "-1", end: "-1" }];
      return {
        ...prev,
        [selectedDay]: sortByStartTime(dayAvailability),
      };
    });
  };

  const handleStartChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day][index].start = event.target.value;
      newAvailability[day] = sortByStartTime(newAvailability[day]);
      return newAvailability;
    });
  };

  const handleEndChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day][index].end = event.target.value;
      newAvailability[day] = sortByStartTime(newAvailability[day]);
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

  const deleteTimeRange = (day, index) => {
    const newAvailability = { ...availability };
    newAvailability[day].splice(index, 1);
    if (newAvailability[day].length === 0) {
      delete newAvailability[day];
    }
    setAvailability(newAvailability);
  };

  const saveAvailability = async () => {
    try {
      const availabilityData = JSON.stringify(availability);
      console.log("Saved availability:", availabilityData);

      // navigate로 /groupAvailability 페이지로 이동하면서 쿼리 파라미터로 데이터 전달
      navigate(`/groupAvailability?availability=${encodeURIComponent(availabilityData)}`);
    } catch (error) {
      console.error("Error while saving availability:", error);
    }
  };

  return (
    <div className="big-container">
      <Logo />
      <AvailabilityHeaderDay text={`My Availability`} arrowDirection="left" navigateTo="/groupAvailability" />
      <InsertTypeDay />

      <div id="date-dropdown">
        <span className="date-dropdown">Choose Date</span>
        <div className="select-list-container">
          <select value={selectedDay} onChange={handleDayChange} className="select-list">
            <option value="">Select Day</option>
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
          deleteTimeRange={deleteTimeRange}
          timeOptions={timeOptions}
        />
      )}

      {Object.keys(availability).length > 0 && (
        <button className="btn-save" onClick={saveAvailability}>Save</button>
      )}
    </div>
  );
}

export default NumberInputDay;
