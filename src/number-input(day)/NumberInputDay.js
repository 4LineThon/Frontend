import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AvailabilityHeaderDay from './components/AvailabilityHeaderDay';
import Logo from "../minju/component/logo";
import InsertTypeDay from './components/InsertTypeDay';
import TimeSelectorDay from './components/TimeSelectorDay';
import './NumberInputDay.css';

function NumberInputDay() {
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
        [selectedDay]: dayAvailability,
      };
    });
  };

  const handleStartChange = (day, index, event) => {
    const newAvailability = { ...availability };
    newAvailability[day][index].start = event.target.value;
    setAvailability(newAvailability);
  };

  const handleEndChange = (day, index, event) => {
    const newAvailability = { ...availability };
    newAvailability[day][index].end = event.target.value;
    setAvailability(newAvailability);
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
        savedTimes.push({ day, start: range.start, end: range.end });
      });
    });
  
    console.log("Saved time:", savedTimes);
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
            {daysOfWeek.map((dateObj, index) => (
              <option key={index} value={`${dateObj.day}`}>
                {`${dateObj.day}`}
              </option>
            ))}
          </select>
        </div>
        <button className="btnPlus" onClick={addTimeRange}>+</button>
      </div>

      {/* Render TimeSelector with availability data and generated time options */}
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
