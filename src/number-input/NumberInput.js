import React, { useState } from 'react';
import './NumberInput.css';

function NumberInput() {
  const dates = ["Oct 15 Tue", "Oct 16 Wed", "Oct 17 Thu", "Oct 18 Fri", "Oct 19 Sat", "Oct 20 Sun", "Oct 21 Mon"];
  const [start, setStart] = useState(Array(dates.length).fill("-1"));
  const [end, setEnd] = useState(Array(dates.length).fill("-1"));
  const [selected, setSelected] = React.useState();
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

  function timeDrop(event){
    setSelected(event.target.value);
  };
   // 특정 날짜의 시작 시간을 업데이트하는 함수
   const handleStartChange = (index, event) => {
    const newStart = [...start];
    newStart[index] = event.target.value;
    setStart(newStart);
  };

  // 특정 날짜의 종료 시간을 업데이트하는 함수
  const handleEndChange = (index, event) => {
    const newEnd = [...end];
    newEnd[index] = event.target.value;
    setEnd(newEnd);
  };

    return (
      <div className = "big-container">
      <div className="number-input-container">
        <div className="header">
          <h1>Timi</h1>
          <h2>4LINETHON</h2>
        </div>
      </div>

        <div className="availability">
          <span>My Availability</span>
        </div>
        <div className = "small-container">
        <div id = "insert">
        <span className = "insert">Insert Type</span>
        <div className = "btnContainer">
            <button className = "btn">Finger</button>
            <button className = "btn2">Number</button>
        </div>
        </div>
  

      <div className="time-range">
      {dates.map((date, index) => (
          <div key={index} className="date-row">
            <span className="date">{date}</span>
            <div className = "list-container">
            <select 
            className="list" 
            value={start[index]}
            onChange={(e) => handleStartChange(index, e)}>
              <option className="option" value="-1">Choose</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            </div>
            <span className="to">To</span>

            {/*종료 시간 */}
            <div className = "list-container">
            <select 
            className="list" 
            value={end[index]} 
            onChange={(e) => handleEndChange(index, e)}
            > 
              <option className="option" value="-1">Choose</option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
  );
}



export default NumberInput;
