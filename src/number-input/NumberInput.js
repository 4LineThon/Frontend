import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AvailabilityHeader2 from './components/Availability Header2';
import Logo from "../minju/component/logo";
import InsertType from '../minju/component/insertType';
import TimeSelector from './components/TimeSelector';
import './NumberInput.css';

function NumberInput() {
  const location = useLocation();
  const userId = location.state?.user ?? null;
  const userName = location.state?.name ?? "Unknown User";
  const startTime = location.state?.start_time ?? "09:00"; // Default start time if not provided
  const endTime = location.state?.end_time ?? "18:00";     // Default end time if not provided

  const daysOfWeek = location.state?.dates ?? [];
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");

  const generateTimeOptions = (start, end) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    while (currentTime <= endTime) {
      times.push(currentTime.toTimeString().slice(0, 5)); // Format to HH:MM
      currentTime.setMinutes(currentTime.getMinutes() + 30); // Increment by 30 minutes
    }

    return times;
  };

  const timeOptions = generateTimeOptions(startTime, endTime);

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const addTimeRange = () => {
    if (!selectedDay) return;
  
    setAvailability((prev) => {
      const dayAvailability = [...(prev[selectedDay] || []), { start: "-1", end: "-1" }];
  
      return {
        ...prev,
        [selectedDay]: sortByStartTime(dayAvailability), // 추가된 정렬 함수 사용
      };
    });
  };
  
  const handleStartChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day][index].start = event.target.value;
      newAvailability[day] = sortByStartTime(newAvailability[day]); // 정렬 적용
      return newAvailability;
    });
  };
  
  const handleEndChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day][index].end = event.target.value;
      newAvailability[day] = sortByStartTime(newAvailability[day]); // 정렬 적용
      return newAvailability;
    });
  };
  
  // 정렬 함수
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

  const saveAvailability = () => {
    const savedTimes = [];
   // Collect all time ranges from availability
  Object.keys(availability).forEach((day) => {
    availability[day].forEach((range) => {
      savedTimes.push({
        days: day,                     // day 정보를 API 요구사항에 맞춰 변환이 필요할 경우 여기에 추가
        user: userId,                  // 유저 ID
        time_from: range.start,        // 시작 시간
        time_to: range.end             // 종료 시간
      });
    });
  });

  // Log collected times
  console.log("Saved time:", savedTimes);

  // Send POST request to backend API for each saved time
  Promise.all(
    savedTimes.map((time) =>
      fetch("http://43.201.144.53/api/v1/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(time)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to save availability");
          }
          return response.json();
        })
        .then(data => {
          console.log("Successfully saved:", data);
        })
        .catch(error => {
          console.error("Error saving availability:", error);
        })
    )
  );
  };

  return (
    <div className="big-container">
      <Logo />
      <AvailabilityHeader2 text={`My Availability`} arrowDirection="left" navigateTo="/groupAvailability" />
      <InsertType />

      <div id="date-dropdown">
        <span className="date-dropdown">Choose Date</span>
        <div className="select-list-container">
          <select value={selectedDay} onChange={handleDayChange} className="select-list">
            <option value="">Select Date</option>
            {daysOfWeek.map((dateObj, index) => (
              <option key={index} value={`${dateObj.date} ${dateObj.day}`}>
                {`${dateObj.date} (${dateObj.day})`}
              </option>
            ))}
          </select>
        </div>
        <button className="btnPlus" onClick={addTimeRange}>+</button>
      </div>

      {/* Render TimeSelector with availability data and generated time options */}
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
