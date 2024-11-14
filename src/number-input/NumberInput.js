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

  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");
  const name = location.state?.name;

  const [groupName, setGroupName] = useState("");
  const [dates, setDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [gridState, setGridState] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRange, setSelectedRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const timetableResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`);
        
        if (timetableResponse.data && timetableResponse.data.length > 0) {
          const dateData = timetableResponse.data.map(item => ({
            date: item.date,
            day: item.day,
            start_time: item.start_time,
            end_time: item.end_time,
          }));
          setDates(dateData);

          const slots = generateTimeSlots(dateData[0].start_time, dateData[0].end_time);
          setTimeSlots(slots);
          setGridState(Array(dateData.length).fill().map(() => Array(slots.length).fill(false)));
        } else {
          console.log("No dates found in response.");
        }
      } catch (error) {
        console.error("Error fetching timetable data:", error);
      }
    };
  
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      slots.push(currentTime.toISOString().substring(11, 16));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return slots;
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  const handleStartChange = (event) => {
    setSelectedRange((prev) => ({ ...prev, start: event.target.value }));
  };

  const handleEndChange = (event) => {
    setSelectedRange((prev) => ({ ...prev, end: event.target.value }));
  };

  const addTimeRangeToGridState = () => {
    const dayIndex = dates.findIndex(dateObj => dateObj.date === selectedDay);
    if (dayIndex === -1 || !selectedRange.start || !selectedRange.end) return;

    const startIndex = timeSlots.indexOf(selectedRange.start);
    const endIndex = timeSlots.indexOf(selectedRange.end);

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      console.error("Invalid time range selected.");
      return;
    }

    setGridState((prevGrid) =>
      prevGrid.map((row, dIndex) =>
        dIndex === dayIndex
          ? row.map((cell, timeIndex) =>
              timeIndex >= startIndex && timeIndex < endIndex ? true : cell
            )
          : row
      )
    );
    console.log("Updated gridState:", gridState);
  };

  const saveAvailability = async () => {
    const userId = location.state?.userId;

    try {
      for (let dayIndex = 0; dayIndex < dates.length; dayIndex++) {
        const dayData = dates[dayIndex];
  
        for (let timeIndex = 0; timeIndex < timeSlots.length - 1; timeIndex++) {
          if (gridState[dayIndex][timeIndex]) {
            const timeFrom = `${timeSlots[timeIndex]}:00`;
            const timeTo = `${timeSlots[timeIndex + 1]}:00`;
  
            const dataToSend = {
              user: userId,
              day: dayData.day,
              date: dayData.date,
              time_from: timeFrom,
              time_to: timeTo,
            };
  
            try {
              const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability`,
                dataToSend,
                { headers: { "Content-Type": "application/json" } }
              );
              console.log("Response from server:", response.data);
            } catch (error) {
              console.error("Error saving data:", error);
            }
          }
        }
      }

      const url = `/groupavailability?event=${event}&groupId=${groupId}`;
      navigate(url, {
        state: {
          gridState,
          timeSlots,
          dates,
          userName: name,
        },
      });
    } catch (error) {
      console.error("Error saving availability data:", error);
    }
  };

  useEffect(() => {
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
          setGroupName(response.data.name);
        } catch (error) {
          console.error("Error fetching group name:", error);
        }
      };
      fetchGroupName();
    }
  }, [groupId]);

  return (
    <div className="big-container">
      <Logo />
      <h2>{groupName}</h2>
      
      <AvailabilityHeader2 
        text={`My Availability`} 
        arrowDirection="left" 
        navigateTo="/groupAvailability"
        userName={name}  
      />
      <InsertType />
      
      <div id="date-dropdown">
        <span className="date-dropdown">Choose Date</span>
        <div className="select-list-container">
          <select value={selectedDay} onChange={handleDayChange} className="select-list">
            <option value="">Select Date</option>
            {dates.length > 0 ? (
              dates.map((dateObj, index) => (
                <option key={index} value={dateObj.date}>
                  {dateObj.date} ({dateObj.day})
                </option>
              ))
            ) : (
              <option disabled>Loading dates...</option>
            )}
          </select>
        </div>
        <button className="btnPlus" onClick={addTimeRangeToGridState}>+</button>
      </div>

      <TimeSelector 
        timeSlots={timeSlots} 
        selectedRange={selectedRange}
        onStartChange={handleStartChange} 
        onEndChange={handleEndChange} 
      />

      <button className="btn-save" onClick={saveAvailability}>Save</button>
    </div>
  );
}

export default NumberInput;
