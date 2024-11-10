import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AvailabilityHeader2 from "./components/AvailabilityHeader2";
import Logo from "../minju/component/logo";
import InsertType from '../minju/component/insertType';
import TimeSelector from './components/TimeSelector';
import './NumberInput.css';

function NumberInput() {
  const location = useLocation();
  const userId = location.state?.user ?? null;
  const userName = location.state?.name ?? "Unknown User";

  const daysOfWeek = ["Oct 15 Tue", "Oct 16 Wed", "Oct 17 Thu", "Oct 18 Fri", "Oct 19 Sat", "Oct 20 Sun", "Oct 21 Mon"];
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://43.201.144.53/api/v1/availability/${userId}`);
        const fetchedAvailability = response.data.reduce((acc, curr) => {
          const day = daysOfWeek[curr.days - 1];
          acc[day] = acc[day] || [];
          acc[day].push({ start: curr.time_from, end: curr.time_to });
          return acc;
        }, {});
        console.log("User ID:", userId); 
        console.log("Fetched availability data:", response.data);
        setAvailability(fetchedAvailability);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("No availability data found for this user.");
          setAvailability({});
        } else {
          console.error('Failed to fetch availability', error);
        }
      }
    };

    fetchAvailability();
  }, [userId]);

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
    console.log('Saving availability:', availability);
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
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <button className="btnPlus" onClick={addTimeRange}>+</button>
      </div>

      {/* 조건부 렌더링으로 availability가 존재할 때만 TimeSelector 렌더링 */}
      {availability && Object.keys(availability).length > 0 && (
        <TimeSelector 
          availability={availability} 
          handleStartChange={handleStartChange} 
          handleEndChange={handleEndChange} 
          deleteTimeRange={deleteTimeRange} 
        />
      )}

      {Object.keys(availability).length > 0 && (
        <button className="btn-save" onClick={saveAvailability}>Save</button>
      )}
    </div>
  );
}

export default NumberInput;
