import React from 'react';

const TimeSelector = ({ availability, handleStartChange, handleEndChange, deleteTimeRange }) => {
  return (
    <div>
      {/* availability의 키가 존재하는지 확인 후 렌더링 */}
      {availability && Object.keys(availability).map((day) => (
        <div key={day} className="time-range">
          <h3 className="specific-date">{day}</h3>
          {/* availability[day]가 배열인지 확인 */}
          {Array.isArray(availability[day]) && availability[day].map((range, index) => (
            <div key={index} className="date-row">
              <div className="list-container">
                <select
                  className="list"
                  value={range.start}
                  onChange={(e) => handleStartChange(day, index, e)}
                >
                  <option className="choose" value="-1">Choose</option>
                  {/* 시간 옵션을 여기에 추가 */}
                  {/* 예: timeOptions.map((time) => (<option key={time} value={time}>{time}</option>)) */}
                </select>
              </div>
              <span className="to">To</span>
              <div className="list-container">
                <select
                  className="list"
                  value={range.end}
                  onChange={(e) => handleEndChange(day, index, e)}
                >
                  <option className="choose" value="-1">Choose</option>
                  {/* 시간 옵션을 여기에 추가 */}
                </select>
              </div>
              
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
  );
};

export default TimeSelector;

