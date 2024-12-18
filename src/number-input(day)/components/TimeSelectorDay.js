import React from 'react';

const TimeSelectorDay = ({ availability, handleStartChange, handleEndChange, deleteTimeRange, timeOptions }) => {
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
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
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

export default TimeSelectorDay;
