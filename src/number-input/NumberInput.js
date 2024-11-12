// NumberInput.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './NumberInput.css';
import AvailabilityHeader2 from './components/Availability Header2';
import Logo from "../minju/component/logo";
import InsertType from '../minju/component/insertType';
import TimeSelector from './components/TimeSelector';

function NumberInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState(""); // 그룹 이름 저장
  const [username, setUsername] = useState(""); // 사용자 이름 저장
  const [dates, setDates] = useState([]); // 각 날짜의 date, start_time, end_time 저장
  const [timeOptions, setTimeOptions] = useState([]);  // 시간 옵션 배열
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  
  // 그룹 ID와 사용자 ID 가져오기
  const group_id = localStorage.getItem("group_id");
  const user_id = localStorage.getItem("user_id"); // 사용자 ID 저장

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // 그룹 이름 가져오기
        const groupResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${group_id}`);
        setGroupName(groupResponse.data.name);

        // 그룹 타임테이블 가져오기
        const timetableResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${group_id}`);
        if (timetableResponse.data && timetableResponse.data.length > 0) {
          setDates(timetableResponse.data.map(item => ({
            date: item.date,
            start_time: item.start_time,
            end_time: item.end_time,
          })));
        }

        // 사용자 이름 가져오기
        const userResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${user_id}`);
        setUsername(userResponse.data.username);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchGroupData();
  }, [group_id, user_id]);

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
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      times.push(currentTime.toISOString().substring(11, 16));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
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
    // 저장 작업 후 GroupAvailability 페이지로 이동
    navigate("/GroupAvailability");
  };

  return (
    <div className="big-container">
      <Logo />
      <h2>{groupName}</h2> {/* Axios로 받아온 groupName 표시 */}
      
      <AvailabilityHeader2 
        text={`My Availability`} 
        arrowDirection="left" 
        navigateTo="/groupAvailability"
        userName={username}  // 사용자 이름 전달
      />
      <InsertType />

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
        <TimeSelector 
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

export default NumberInput;
