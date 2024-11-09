import React from "react";

import EveryoneAvailable from "./component/Everyoneavailable";
import StatusIndicator from "./component/StatusIndicator";

const GroupAvailability = () => {
  return (
    <div>
      <EveryoneAvailable/>
      <StatusIndicator current={0} total={5}/>
    </div>
  );
};

export default GroupAvailability;