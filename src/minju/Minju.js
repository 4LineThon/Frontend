import React from "react";
import Calendar from "./component/Calendar";
import InsertType from "./component/insertType";
import IsAvailable from "./component/isAvailable";

import Logo from "./component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import SaveButton from "./component/saveButton";
const Minju = () => {
  
  return (
    <div>
      
      <Logo/>
      <AvailabilityHeader text="My Availability" arrowDirection="left" navigateTo="/groupAvailability" />
      <InsertType />
      <IsAvailable />
      
      <Calendar />
      <SaveButton />
      
      

      
    </div>
  );
};

export default Minju;
