import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../NumberInput.css';

function SaveAvailability({ availability, groupId, userid, event, fetchedData = [] }) {
  const navigate = useNavigate();

  // 서버가 요구하는 형식으로 availability 변환
  const transformAvailability = (availability) => {
    const transformed = [];
    Object.keys(availability).forEach((selectedDay) => {
      const [datePart] = selectedDay.split("("); // "YYYY-MM-DD" 형식만 가져옴
      const fetchedDayData = fetchedData.find(item => item.date === datePart.trim());
      if (fetchedDayData) {
        const formattedDay = new Date(fetchedDayData.date).toLocaleDateString('en-US', { weekday: 'short' }); // "Sun"
        availability[selectedDay].forEach((range) => {
          const slots = generateSlots(range.start, range.end);
          slots.forEach((slot, index) => {
            transformed.push({
              user: userid,
              day: formattedDay,
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

  // 주어진 start와 end에 따라 30분 간격의 slots 배열 생성
  const generateSlots = (start, end) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);
    while (currentTime <= endTime) {
      slots.push({
        availability_count: 1,
        time: currentTime.toISOString().substring(11, 19), // HH:MM:SS 형식
      });
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    return slots;
  };

  const handleSave = async () => {
    try {
      // 1. 기존 데이터 존재 여부 확인
      let existingData = [];
      try {
        console.log("Checking existing availability data...");
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${userid}`);
        existingData = response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No existing availability data found.");
        } else {
          throw error;
        }
      }

      // 2. 기존 데이터 삭제 (데이터가 존재할 경우에만)
      if (existingData.length > 0) {
        console.log("Deleting existing availability data...");
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${userid}`);
        console.log("Existing availability data deleted successfully.");
      }

      // 3. 새로운 데이터 저장
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

      // 4. 저장 후 다음 페이지로 이동
      const url = `/groupAvailability?event=${event}&groupId=${groupId}`;
      navigate(url, {
        state: {
          userid,
          availability: transformedAvailability,
        },
      });
    } catch (error) {
      console.error("Error during save operation:", error);
      alert("An error occurred while saving availability. Please try again.");
    }
  };

  return (
    <button className="btn-save" onClick={handleSave}>Save</button>
  );
}

export default SaveAvailability;
