import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SaveAvailability({ availability, groupId, userid, event }) {
  const navigate = useNavigate();

  // 서버가 요구하는 형식으로 availability 변환, fetchedData의 start_time과 end_time 사용
  const transformAvailability = (availability) => {
    const transformed = [];

    Object.keys(availability).forEach((day) => {
      availability[day].forEach((range) => {
        const slots = generateSlots(range.start, range.end);

        slots.forEach((slot, index) => {
          if (index < slots.length - 1) {
            transformed.push({
              user: userid,
              day: day, //  "Mon" 형식
              time_from: slot.time,
              time_to: slots[index + 1].time, 
            });
          }
        });
      });
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
    const transformedAvailability = transformAvailability(availability);
    console.log("Transformed Availability (before POST):", transformedAvailability);

    // 각 변환된 availability 데이터를 POST 요청으로 서버에 전송
    for (const data of transformedAvailability) {
      //console.log("Sending data:", data); // 전송 전 데이터 확인
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

    // 저장 후 다음 페이지로 이동
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
