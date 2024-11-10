import React from "react";

import EveryoneAvailable from "./component/Everyoneavailable";
import StatusIndicator from "./component/StatusIndicator";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "../minju/component/AvailabilityHeader";
import FixButton from "./component/fixButton";
import Calendar from "./component/Calendar";
import Comment from "../comment/Comment";
const GroupAvailability = () => {
  return (
    <div>
      <Logo/>
      <AvailabilityHeader text="Group's Availability" arrowDirection="right" navigateTo="/minju" />
      <EveryoneAvailable/>
      <StatusIndicator current={0} total={5}/>
      <Calendar/>
      <Comment />
      <FixButton />
    </div>
  );
};

export default GroupAvailability;