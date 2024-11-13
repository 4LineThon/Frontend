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
  const userid = queryParams.get("userid");

  const [id, setId] = useState(location.state?.id || localStorage.getItem('id') || null);
  const [name, setName] = useState(location.state?.name || localStorage.getItem('name') || "User");
  const [dates, setDates] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [availability, setAvailability] = useState({});
  const [selectedDay, setSelectedDay] = useState(localStorage.getItem('lastSelectedDay') || ""); 
  const [groupName, setGroupName] = useState("");

  // 초기 렌더링 시 savedAvailability 및 lastSelectedDay 불러오기
  useEffect(() => {
    const storedAvailability = localStorage.getItem('savedAvailability');
    if (storedAvailability) {
      setAvailability(JSON.parse(storedAvailability));
    }

    const lastSelectedDay = localStorage.getItem('lastSelectedDay');
    if (lastSelectedDay) {
      setSelectedDay(lastSelectedDay);
    }
  }, []);

  // id와 name을 localStorage에 저장
  useEffect(() => {
    if (id) {
      localStorage.setItem('id', id);
    }
    if (name) {
      localStorage.setItem('name', name);
    }
  }, [id, name]);

  // groupId가 있을 때 시간표 데이터를 가져오는 함수
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const timetableResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`);
        
        if (timetableResponse.data && timetableResponse.data.length > 0) {
          const dateData = timetableResponse.data.map(item => ({
            id: item.id,
            day: item.day,
            date: item.date,
            start_time: item.start_time,
            end_time: item.end_time,
            slots: item.slots || []
          }));
          setDates(dateData);
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

  // selectedDay가 설정될 때 해당 날짜의 시간 옵션과 availability 불러오기
  useEffect(() => {
    if (selectedDay) {
      const selectedDateData = dates.find(
        dateObj => dateObj.date === selectedDay
      );
      if (selectedDateData) {
        const { start_time, end_time } = selectedDateData;
        setTimeOptions(generateTimeOptions(start_time, end_time));
      }
    }
  }, [selectedDay, dates]);

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

  const handleDayChange = (event) => {
    const newSelectedDay = event.target.value;
    setSelectedDay(newSelectedDay);
    localStorage.setItem('lastSelectedDay', newSelectedDay); // 선택한 날짜를 localStorage에 저장
  };

  // 선택한 날짜에 새로운 시간 범위를 추가
  const addTimeRange = () => {
    if (!selectedDay) return;
  
    setAvailability((prev) => {
      const dayAvailability = [...(prev[selectedDay] || []), { start: "-1", end: "-1" }];
      return {
        ...prev,
        [selectedDay]: sortByStartTime(dayAvailability),
      };
    });
  };

  // 기존 시간을 수정할 때 호출되는 함수
  const handleStartChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day][index].start = event.target.value;
      return newAvailability;
    });
  };

  const handleEndChange = (day, index, event) => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      newAvailability[day][index].end = event.target.value;
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

  const deleteTimeRange = (day, index) => {
    const newAvailability = { ...availability };
    newAvailability[day].splice(index, 1);
    if (newAvailability[day].length === 0) {
      delete newAvailability[day];
    }
    setAvailability(newAvailability);
  };

  const saveAvailability = async () => {
    try {
      localStorage.setItem('savedAvailability', JSON.stringify(availability));
      navigate(
        `/GroupAvailability?event=${encodeURIComponent(event)}&groupId=${encodeURIComponent(groupId)}&userid=${encodeURIComponent(userid)}&availability=${encodeURIComponent(JSON.stringify(availability))}&name=${encodeURIComponent(name)}&date=${encodeURIComponent(selectedDay)}&day=${encodeURIComponent(dates.find(dateObj => dateObj.date === selectedDay)?.day || "")}`
      );
    } catch (error) {
      console.error("Error navigating with availability data:", error);
    }
  };


  // availability가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('savedAvailability', JSON.stringify(availability));
  }, [availability]);

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
        <button className="btnPlus" onClick={addTimeRange}>+</button>
      </div>

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
