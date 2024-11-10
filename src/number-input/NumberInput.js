import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AvailabilityHeader2 from "./components/Availability Header2";
import Logo from "../minju/component/logo";
import InsertType from '../minju/component/insertType';
import TimeSelector from './components/TimeSelector';
import './NumberInput.css';

function NumberInput() {
  const location = useLocation();
  const navigate = useNavigate();
  const daysOfWeek = ["Oct 15 Tue", "Oct 16 Wed", "Oct 17 Thu", "Oct 18 Fri", "Oct 19 Sat", "Oct 20 Sun", "Oct 21 Mon"];
  const [selectedDay, setSelectedDay] = useState("");
  const [availability, setAvailability] = useState({});

  const generateTimeOptions = () => {
    const options = [];
    let hour = 7;
    let minute = 0;
    while (hour < 24 || (hour === 23 && minute <= 30)) {
      options.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
    // 요일 선택 처리
    const handleDayChange = (event) => {
      setSelectedDay(event.target.value);
    };

  const addTimeRange = () => {
    if (!selectedDay) return; // 선택된 날짜가 없으면 추가하지 않음

    setAvailability((prev) => {
      const dayAvailability = [...(prev[selectedDay] || []), { start: "-1", end: "-1" }];
      return {
        ...prev,
        [selectedDay]: dayAvailability.sort((a, b) => a.start.localeCompare(b.start)),
      };
    });
  };

  const handleStartChange = (day, index, event) => {
    const newAvailability = {...availability};
    newAvailability[day][index].start = event.target.value;
    setAvailability(newAvailability);
  };

  const handleEndChange = (day, index, event) => {
    const newAvailability = {...availability};
    newAvailability[day][index].end = event.target.value;
    setAvailability(newAvailability);
  };

  const deleteTimeRange = (day, index) => {
    const newAvailability = {...availability};
    newAvailability[day].splice(index, 1);
    if (newAvailability[day].length === 0) {
      delete newAvailability[day];
    }
    setAvailability(newAvailability);
  };

  useEffect(() => {
    // Fetch initial data or setup
  }, []);

      // 'Save' 버튼 클릭 시 동작하는 함수
      const saveAvailability = () => {
        console.log('Saving availability:', availability);
        // 서버로 데이터를 전송하는 코드를 여기에 추가
      };
  
  return (
    <div className="big-container">
      <Logo />
      <AvailabilityHeader2 text={`My Availability`} arrowDirection="left" navigateTo="/groupAvailability" />
      <InsertType />
  
        {/* 날짜 선택 드롭다운 */}
        <div id="date-dropdown">
          <span className="date-dropdown">Choose Date</span>
          <div className = "select-list-container">
          <select value={selectedDay} onChange={handleDayChange} className="select-list">
            <option value="">Select Date</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          </div>
          <button className="btnPlus" onClick={addTimeRange}>+</button>
        </div>
      <TimeSelector 
        availability={availability} 
        handleStartChange={handleStartChange} 
        handleEndChange={handleEndChange} 
        deleteTimeRange={deleteTimeRange} 
        timeOptions={timeOptions}
      />

 {/* 'Save' 버튼 */}
      {Object.keys(availability).length > 0 && (
      <button className="btn-save" onClick={saveAvailability}>Save</button>
    )}
    </div>
  );
}

export default NumberInput;

