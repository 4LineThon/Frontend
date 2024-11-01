import React from "react";
import Calendar from "./Calendar.js";
import InsertType from './insertType';
import IsAvailable from './isAvailable';

const Minju = () => {
  return (
    <div>
      <InsertType/>
      <IsAvailable/>
      <Calendar/>
      
    </div>
  );
};

export default Minju;