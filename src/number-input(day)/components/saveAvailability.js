import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SaveAvailability({ availability, groupId, userid, event, fetchedData = [] }) {
  const navigate = useNavigate();

  const transformAvailability = (availability) => {
    const transformed = [];

    Object.keys(availability).forEach((selectedDay) => {
      const fetchedDayData = fetchedData.find(item => item.date === selectedDay);
      
      if (fetchedDayData) {
        const dayOfWeek = new Date(fetchedDayData.date).toLocaleDateString('en-US', { weekday: 'short' });

        availability[selectedDay].forEach((range) => {
          const slots = generateSlots(range.start, range.end);

          slots.forEach((slot, index) => {
            transformed.push({
              user: userid,
              day: dayOfWeek,
              date: fetchedDayData.date,
              time_from: slot.time,
              time_to: slots[index + 1]?.time || slot.time,
            });
          });
        });
      }
    });

    return transformed;
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

  const handleSave = async () => {
    const transformedAvailability = transformAvailability(availability);
    console.log("Transformed Availability (before POST):", transformedAvailability);

    for (const data of transformedAvailability) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/availability`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Response from server:", response.data);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }

    const url = `/groupAvailability?event=${event}&groupId=${groupId}`;
    navigate(url, {
      state: {
        userid,
        availability: transformedAvailability,
      },
    });
  };

  return (
    <button className="btn-save" onClick={handleSave}>Save</button>
  );
}

export default SaveAvailability;
