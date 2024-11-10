import React from 'react';

const TimeSelector = ({ availability, handleStartChange, handleEndChange, deleteTimeRange, timeOptions }) => {
  return (
    <div>
      {Object.keys(availability)
        .map((day) => (
          <div key={day} className="time-range">
            <h3 className="specific-date">{day}</h3>
            {availability[day].map((range, index) => (
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

export default TimeSelector;