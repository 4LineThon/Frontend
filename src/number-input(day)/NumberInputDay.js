import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './NumberInputDay.css';
import AvailabilityHeaderDay from './components/AvailabilityHeaderDay';
import Logo from "../minju/component/logo";
import InsertTypeDay from './components/InsertTypeDay';
import TimeSelectorDay from './components/TimeSelectorDay';
import SaveAvailability from './components/saveAvailability';
import styled from "styled-components";

function NumberInputDay() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");
  const event = queryParams.get("event");
  const userId = location.state?.id;
  console.log("userId:", userId);

  const [groupName, setGroupName] = useState("");
  const [days, setDays] = useState([]);
  const [uniqueDays, setUniqueDays] = useState([]); // Stores dates directly for dropdown
  const [timeOptions, setTimeOptions] = useState([]);
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [fetchedData, setFetchedData] = useState([]);

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
  
        console.log("Full response data:", response.data);
  
        if (response.data && response.data.length > 0) {
          setDays(response.data);
          setFetchedData(response.data);
  
          // Use the `day` field for the dropdown instead of `date`
          const dayNames = response.data.map(item => item.day); // This should populate with the days of the week
          setUniqueDays(dayNames);
          console.log("Days for dropdown:", dayNames);
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
    const selectedDateData = days.find(dateObj => 
      dateObj.day === selectedDay
    );
  
    if (selectedDateData) {
      const { start_time, end_time } = selectedDateData;
      console.log("Selected day start_time:", start_time, "end_time:", end_time);
  
      // Only set time options if start_time and end_time are valid
      if (start_time && end_time) {
        setTimeOptions(generateTimeOptions(start_time, end_time));
      } else {
        console.warn("Invalid start_time or end_time for the selected day.");
      }
    }
  }, [selectedDay, days]);
  
  const generateTimeOptions = (start, end) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);
  
    while (currentTime <= endTime) {
      times.push(currentTime.toISOString().substring(11, 16)); // "HH:MM" format
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
  
    console.log("Generated time options:", times); // Log the generated time options
    return times;
  };
  

  const generateSlots = (start, end) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      slots.push({
        availability_count: 1,
        time: currentTime.toISOString().substring(11, 19),
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
      const dayAvailability = [...(prev[selectedDay] || []), { start: "-1", end: "-1", slots: [] }];
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

      const { start, end } = newAvailability[day][index];
      if (start !== "-1" && end !== "-1") {
        newAvailability[day][index].slots = generateSlots(start, end);
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
      <HeaderH2>{groupName}</HeaderH2>
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
          userId={userId}
          event={event}
          fetchedData={fetchedData}
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
  margin-bottom: 10px;
`;
