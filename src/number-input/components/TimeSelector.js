import React from 'react';
import '../NumberInput.css'

const TimeSelector = ({ availability, handleStartChange, handleEndChange, deleteTimeRange, timeOptions }) => {
  return (
    <div>
      {availability && Object.keys(availability).map((day) => (
        <div key={day} className="time-range">
          <h3 className="specific-date">{day}</h3>
          {Array.isArray(availability[day]) && availability[day].map((range, index) => (
            <div key={index} className="date-row">
              <div className="list-container">
                <select
                  className="list"
                  value={range.start}
                  onChange={(e) => handleStartChange(day, index, e)}
                >
                  <option className="choose" value="-1">Choose</option>
                  {/* timeOptions 배열을 map을 이용해 옵션으로 렌더링 */}
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
                  <option className="choose" value="-1">Choose</option>
                  {/* timeOptions 배열을 map을 이용해 옵션으로 렌더링 */}
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="btnDelete" 
                onClick={() => deleteTimeRange(day, index)}
              >
                -
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TimeSelector;
