import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "./component/Calendar";
import InsertType from "./component/insertType";
import IsAvailable from "./component/isAvailable";
import Logo from "./component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";

const Minju = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");

  const [id] = useState(location.state?.id || null);
  const [name] = useState(location.state?.name || "User");
  useEffect(() => {
    console.log("Received query parametersMinju:");
    console.log("Event:", event);
    console.log("GroupId:", groupId);

    console.log("Received state parametersMinju:");
    console.log("ID:", id);
    console.log("Name:", name);
  }, [event, groupId, location.state]);

  return (
    <div>
      <Logo />
      <AvailabilityHeader 
        text={`Availability for ${name}`} 
        arrowDirection="left" 
        navigateTo="/groupAvailability" 
      />
      <InsertType />
      <IsAvailable />
      <Calendar groupId={groupId}/>

      
    </div>
  );
};

export default Minju;
