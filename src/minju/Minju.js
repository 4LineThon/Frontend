import React from "react";
import Calendar from "./component/Calendar";
import InsertType from './component/insertType';
import IsAvailable from './component/isAvailable';

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