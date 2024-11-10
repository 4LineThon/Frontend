import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AvailabilityHeader from "../minju/component/AvailabilityHeader";
import axios from 'axios';
import Logo from "../minju/component/logo";
import InsertType from '../minju/component/insertType';
import './NumberInput.css';

function NumberInput() {
  const location = useLocation();

  // 전달된 state 객체 확인
  console.log("Location state:", location.state);

  // userId와 userName을 가져오되, state가 undefined일 경우 기본값으로 null을 설정
  const userId = location.state?.user ?? null;
  const userName = location.state?.name ?? "Unknown User";

  // userId와 userName 출력
  console.log("Received userId:", userId);
  console.log("Received userName:", userName);
  const daysOfWeek = ["Oct 15 Tue", "Oct 16 Wed", "Oct 17 Thu", "Oct 18 Fri", "Oct 19 Sat", "Oct 20 Sun", "Oct 21 Mon"];
  const [selectedDay, setSelectedDay] = useState(""); // 선택된 요일
  const [availability, setAvailability] = useState({}); // 각 요일별 시간 목록
  const [activeButton, setActiveButton] = useState('number'); // 초기 활성화 상태는 'number'
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!userName) return; // userName이 없는 경우 요청을 보내지 않음
    
      console.log(`Fetching availability with URL: http://43.201.144.53/api/v1/availability/${userName}`);
    
      try {
        const response = await axios.get(`http://43.201.144.53/api/v1/availability/${userId}`);
        const fetchedAvailability = response.data.reduce((acc, curr) => {
          const day = daysOfWeek[curr.days - 1];
          acc[day] = acc[day] || [];
          acc[day].push({ start: curr.time_from, end: curr.time_to });
          return acc;
        }, {});
        setAvailability(fetchedAvailability);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("No availability data found for this user.");
          setAvailability({}); // 기본 빈 객체로 설정
        } else {
          console.error('Failed to fetch availability', error);
        }
      }
    };
    
  
    fetchAvailability();
  }, [userId]);
  
  
  /*여기서부터는 원래 코드 */
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType); // 버튼 클릭 시 상태 업데이트
  };

  const handleFinishClick = () => {
    navigate('/minju'); // 왼쪽 버튼 클릭 시 /minju 경로로 이동
  };

  const handleFingerClick = () => {
    setActiveButton('finger');
    navigate('/minju'); // Finger 버튼 클릭 시 /minju 경로로 이동
  };

  const generateTimeOptions = () => {
    const options = [];
    let hour = 7;
    let minute = 0;
    while (hour < 24 || (hour === 23 && minute <= 30)) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      options.push(time);
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // 요일 선택 처리
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  // 특정 요일에 새로운 시간 추가
  const addTimeRange = () => {
    if (!selectedDay) return; // 선택된 요일이 없으면 추가하지 않음

    setAvailability((prev) => {
      const dayAvailability = [...(prev[selectedDay] || []), { start: "-1", end: "-1" }];
      // 새로운 객체로 업데이트하며, 시간을 오름차순 정렬
      return {
        ...prev,
        [selectedDay]: dayAvailability.sort((a, b) => a.start.localeCompare(b.start)),
      };
    });
  };


  // 특정 요일의 시간 범위를 삭제하는 함수
  const deleteTimeRange = (day, index) => {
    setAvailability((prev) => {
      const dayAvailability = prev[day].filter((_, i) => i !== index);

      // 시간 범위가 모두 삭제된 경우 해당 요일을 삭제
      if (dayAvailability.length === 0) {
        const newAvailability = { ...prev };
        delete newAvailability[day]; // 해당 요일 삭제
        return newAvailability;
      } else {
        return {
          ...prev,
          [day]: dayAvailability,
        };
      }
    });
  };

  // 시작 시간 변경
  const handleStartChange = (day, index, event) => {
    const newAvailability = { ...availability };
    const newStartTime = event.target.value;
    const endTime = newAvailability[day][index].end;

    // 시작 시간과 종료 시간의 유효성 검사
    if (endTime !== "-1" && newStartTime >= endTime) {
      alert("Start time must be earlier than end time.");
      return;
    }

    newAvailability[day][index].start = newStartTime;
    newAvailability[day] = [...newAvailability[day]].sort((a, b) => a.start.localeCompare(b.start));
    setAvailability(newAvailability);
  };

  // 종료 시간 변경
  const handleEndChange = (day, index, event) => {
    const newAvailability = { ...availability };
    const newEndTime = event.target.value;
    const startTime = newAvailability[day][index].start;

    // 시작 시간과 종료 시간의 유효성 검사
    if (startTime !== "-1" && newEndTime <= startTime) {
      alert("End time must be later than start time.");
      return;
    }

    newAvailability[day][index].end = newEndTime;
    newAvailability[day] = [...newAvailability[day]].sort((a, b) => a.start.localeCompare(b.start));
    setAvailability(newAvailability);
  };

    // 'Save' 버튼 클릭 시 동작하는 함수
    const saveAvailability = () => {
      console.log('Saving availability:', availability);
      // 서버로 데이터를 전송하는 코드를 여기에 추가
    };



  return (
    <div className="big-container">
    <Logo/>
<AvailabilityHeader text="My Availability" arrowDirection="left" navigateTo="/groupAvailability" />
<InsertType />

      

      <div>
        {/* 날짜 선택 드롭다운 */}
        <div id="date-dropdown">
          <span className="date-dropdown">Choose Date</span>
          <div className = "select-list-container">
          <select value={selectedDay} onChange={handleDayChange} className="select-list">
            <option value="">Select Date</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          </div>
          <button className="btnPlus" onClick={addTimeRange}>+</button>
        </div>

        {/* 선택된 날짜별로 시간 목록 표시 */}
        {Object.keys(availability)
          .sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b)) // 요일 오름차순 정렬
          .map((day) => (
            <div key={day} className="time-range">
              <h3 className = "specific-date">{day}</h3>
              {availability[day].map((range, index) => (
                <div key={index} className="date-row">
                  <div className="list-container">
                    <select
                      className="list"
                      value={range.start}
                      onChange={(e) => handleStartChange(day, index, e)}
                    >
                      <option className = "choose" value="-1">Choose</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <span className="to">To</span>
                  <div className="list-container">
                    <select
                      className="list"
                      value={range.end}
                      onChange={(e) => handleEndChange(day, index, e)}
                    >
                      <option className = "choose" value="-1">Choose</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 삭제 버튼 */}
                  <button 
                    className="btn-delete" 
                    onClick={() => deleteTimeRange(day, index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ))}
      </div>
      {/* 'Save' 버튼 */}
      {Object.keys(availability).length > 0 && (
      <button className="btn-save" onClick={saveAvailability}>Save</button>
    )}
    </div>
  );
}

export default NumberInput;