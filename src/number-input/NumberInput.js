import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './NumberInput.css';
import AvailabilityHeader from '../Myavailability/component/AvailabilityHeader';
import Logo from "../Myavailability/component/logo";
import InsertType from '../Myavailability/component/insertType';
import TimeSelector from './components/TimeSelector';
import styled from "styled-components";
import SaveAvailability from './components/saveAvailability';

function NumberInput() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const groupId = queryParams.get("groupId");
  const event = queryParams.get("event");
  const [groupName, setGroupName] = useState("");
  const [name] = useState(location.state?.name || "User");

  const userid = location.state?.id;
  console.log("userid!!!! ", userid);

  const [days, setDays] = useState([]);
  const [uniqueDays, setUniqueDays] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [fetchedData, setFetchedData] = useState([]); // fetchedData 상태 추가
  const filteredAvailability = Object.keys(availability).reduce((acc, day) => {
    acc[day] = availability[day].filter((range, index, self) =>
      index === self.findIndex(
        (r) => r.start === range.start && r.end === range.end
      )
    );
    return acc;
  }, {});
  
  // 날짜 정렬용 함수
  const sortUniqueDays = (days) => {
    return days.sort((a, b) => {
      const dateA = a.split('(')[0];
      const dateB = b.split('(')[0];
      return new Date(dateA) - new Date(dateB);
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
    const fetchGroupTimetable = async () => {
      if (!groupId) {
        console.error("No groupId found in query parameters.");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`
        );

        if (response.data && response.data.length > 0) {
          setDays(response.data);
          setFetchedData(response.data);

          const uniqueDaysList = Array.from(new Set(response.data.map(item => {
            const date = new Date(item.date);
            if (isNaN(date)) {
              console.warn(`Invalid date format for ${item.date}`);
              return item.date;
            }
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            return `${item.date}(${dayOfWeek})`;
          })));

          // 날짜 정렬 후 상태 업데이트
          const sortedUniqueDays = sortUniqueDays(uniqueDaysList);
          
          setUniqueDays(sortedUniqueDays);
        } else {
          console.warn("No data received for group timetable.");
        }
      } catch (error) {
        console.error("Error fetching group timetable:", error);
      }
    };

    fetchGroupTimetable();
  }, [groupId]);

  const generateSlots = (start, end) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      slots.push({
        availability_count: 1,
        time: currentTime.toISOString().substring(11, 19)
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
      const dayAvailability = prev[selectedDay] || [];
      
      // "100:00 to 100:00"이 이미 추가되어 있는지 확인
      const hasDefaultRange = dayAvailability.some(
        (range) => range.start === "100:00" && range.end === "100:00"
      );
  
      if (hasDefaultRange) {
        // 중복 방지: 기본 값이 이미 존재하는 경우 추가하지 않음
        return prev;
      }
  
      // 기본 값을 추가하고 정렬
      const updatedAvailability = {
        ...prev,
        [selectedDay]: sortByStartTime([
          ...dayAvailability,
          { start: "100:00", end: "100:00", slots: [] },
        ]),
      };
  
      return updatedAvailability;
    });
  };
  
  
  useEffect(() => {
    if (uniqueDays.length > 0 && !selectedDay) {
      setSelectedDay(uniqueDays[0]);
    }
  }, [uniqueDays, selectedDay]);
  
  
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${userid}`
        );
        const availabilityData = response.data;
        console.log("Fetched availability data:", availabilityData);
        const initialAvailability = {};
        availabilityData
          .filter((data) => data.time_from !== data.time_to) // 시작 시간과 끝 시간이 같은 데이터 제거
          .forEach((data) => {
            const day = `${data.days_date}(${data.days_day})`;
            if (!initialAvailability[day]) {
              initialAvailability[day] = [];
            }
            initialAvailability[day].push({
              start: data.time_from.substring(0, 5), // "HH:mm" 형식으로 변환
              end: data.time_to.substring(0, 5),
              slots: generateSlots(data.time_from, data.time_to),
            });
          });
  
        setAvailability(initialAvailability);
  
        console.log("Processed availability state:", initialAvailability);
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };
  
    if (userid) {
      fetchAvailabilityData();
    }
  }, [userid]);
  
  

  useEffect(() => {
    const selectedDateData = days.find(dateObj => {
      const formattedDate = `${dateObj.date}(${new Date(dateObj.date).toLocaleDateString('en-US', { weekday: 'short' })})`;
      return formattedDate === selectedDay;
    });

    if (selectedDateData) {
      const { start_time, end_time } = selectedDateData;
      setTimeOptions(generateTimeOptions(start_time, end_time));
      console.log("generated timeOptions:", generateTimeOptions(start_time, end_time));
    }
  }, [selectedDay, days]);

  const generateTimeOptions = (start, end) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${start}Z`);
    const endTime = new Date(`1970-01-01T${end}Z`);

    while (currentTime <= endTime) {
      times.push(currentTime.toISOString().substring(11, 16));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return times;
  };

  const handleStartChange = (day, index, event) => {
    const newStartTime = event.target.value;

    setAvailability((prev) => {
      const newAvailability = { ...prev };
      const selectedRange = newAvailability[day][index];
      const endTime = selectedRange.end;

      const hasOverlap = newAvailability[day].some((range, i) => {
        if (i === index) return false;
        return (
          (newStartTime >= range.start && newStartTime <= range.end) ||
          (endTime !== "100:00" && newStartTime < range.start && endTime > range.start)
        );
      });

      if (hasOverlap) {
        alert("This time is already selected.");
        newAvailability[day][index].start = "100:00";
      } else {
        newAvailability[day][index].start = newStartTime;
        newAvailability[day] = sortByStartTime(newAvailability[day]);
      }

      return newAvailability;
    });
  };

  const handleEndChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      const startTime = newAvailability[day][index].start;
      const endTime = event.target.value;

      if (startTime !== "-1" && endTime <= startTime) {
        alert("End time cannot be earlier than start time.");
        newAvailability[day][index].end = "100:00";
      } else {
        newAvailability[day][index].end = endTime;
        newAvailability[day] = sortByStartTime(newAvailability[day]);
        newAvailability[day][index].slots = generateSlots(startTime, endTime);
      }
      return newAvailability;
    });
  };
  
  useEffect(() => {
    if (uniqueDays.length > 0 && !selectedDay) {
      setSelectedDay(uniqueDays[0]);
    }
  }, [uniqueDays, selectedDay]);
  
  
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${userid}`);
        const availabilityData = response.data;

        const initialAvailability = {};

        availabilityData.forEach((data) => {
          const day = `${data.days_date}(${data.days_day})`;
          if (!initialAvailability[day]) {
            initialAvailability[day] = [];
          }
          initialAvailability[day].push({
            start: data.time_from.substring(0, 5), // "13:00" 형식으로 변환
            end: data.time_to.substring(0, 5),
            slots: generateSlots(data.time_from, data.time_to)
          });
        });

        setAvailability(initialAvailability); // 초기 상태로 설정
        console.log("Initialized availability with fetched data:", initialAvailability); // 확인용 로그
      } catch (error) {
        console.error("Error fetching availability data:", error);
      }
    };

    if (userid) {
      fetchAvailabilityData();
    }
    
  }, [userid]);



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
    } else {
      console.error("No group_id found");
    }
  }, [groupId]);

  return (
    <div className="big-container">
      <Logo />
      <HeaderH2>{groupName}</HeaderH2>
      <AvailabilityHeader 
        text={`Availability for ${name}`} 
        arrowDirection="right" 
        navigateTo="/groupAvailability" 
      />
      <InsertType />

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
        <TimeSelector
          availability={filteredAvailability}
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
          userid={userid} 
          event={event}
          fetchedData={fetchedData} 
        />
      )}
    </div>
  );
}

export default NumberInput;

const HeaderH2 = styled.h2`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #4c3f5e;
  margin-bottom: 10px;
`;
