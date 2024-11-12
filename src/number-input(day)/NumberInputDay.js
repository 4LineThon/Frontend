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
  const group_id = 3; // 그룹 ID

  const [dates, setDates] = useState([]); // 각 날짜의 date, start_time, end_time 저장
  const [timeOptions, setTimeOptions] = useState([]);  // 시간 옵션 배열
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [userAvailability, setUserAvailability] = useState([]);

  // 그룹 타임테이블 정보를 가져오기
  useEffect(() => {
    const fetchGroupTimetable = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${group_id}`);
        if (response.data && response.data.length > 0) {
          // date, start_time, end_time 모두 포함해 dates에 저장
          setDates(response.data.map(item => ({
            date: item.date,
            start_time: item.start_time,
            end_time: item.end_time,
          })));
        }
      } catch (error) {
        console.error("Error fetching group timetable:", error);
      }
    };

    fetchGroupTimetable();
  }, [group_id]);

  // 선택된 날짜에 따라 start_time과 end_time을 기반으로 시간 옵션을 생성
  useEffect(() => {
    const selectedDateData = dates.find(dateObj => dateObj.date === selectedDay);
    if (selectedDateData) {
      const { start_time, end_time } = selectedDateData;
      setTimeOptions(generateTimeOptions(start_time, end_time));
    }
  }, [selectedDay, dates]);

  // startTime과 endTime을 기반으로 시간 옵션을 생성하는 함수
  const generateTimeOptions = (start, end) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);  // Z를 추가하여 UTC 시간으로 설정
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      times.push(currentTime.toISOString().substring(11, 16));  // ISO 문자열에서 HH:MM 부분만 추출
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
    console.log("Saved availability:", JSON.stringify(availability, null, 2));
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
            <option value="">Select Date</option>
            {dates.map((dateObj, index) => (
              <option key={index} value={dateObj.date}>
                {dateObj.date}
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
