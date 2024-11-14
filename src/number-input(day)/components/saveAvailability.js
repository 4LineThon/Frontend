import React from 'react';
import { useNavigate } from 'react-router-dom';

function SaveAvailability({ availability, groupId, userId, event, fetchedData = [] }) {
  const navigate = useNavigate();

  // 서버가 요구하는 형식으로 availability 변환, fetchedData의 start_time과 end_time 사용
  const transformAvailability = (availability) => {
    const transformed = [];

    Object.keys(availability).forEach((day) => {
      // fetchedData에서 해당 day의 start_time과 end_time 찾기
      const fetchedDayData = fetchedData.find(item => item.day === day);
      const fetchedStartTime = fetchedDayData ? fetchedDayData.start_time : null;
      const fetchedEndTime = fetchedDayData ? fetchedDayData.end_time : null;
      console.log("fetchedDayData: " ,fetchedDayData)
      console.log("userid: ",userId)

      availability[day].forEach((range) => {
        const slots = generateSlots(range.start, range.end);

        transformed.push({
          id: Math.floor(Math.random() * 1000), // ID는 임시로 생성
          day: day,
          date: fetchedDayData ? fetchedDayData.date : null, // date 유지
          start_time: fetchedStartTime, // fetchedData의 start_time 유지
          end_time: fetchedEndTime, // fetchedData의 end_time 유지
          slots: slots, // slots 내용은 유지
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
        time: currentTime.toISOString().substring(11, 19) // HH:MM:SS 형식
      });
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  const handleSave = () => {
    const transformedAvailability = transformAvailability(availability);
  
    console.log("Transformed Availability (before navigate):", transformedAvailability);
  
    const url = `/groupAvailability?event=${event}&groupId=${groupId}&userId=${userId}`;
    navigate(url, {
      state: {
        availability: transformedAvailability,
      },
    });
  };
  

  return (
    <button className="btn-save" onClick={handleSave}>Save</button>
  );
}

export default SaveAvailability;
