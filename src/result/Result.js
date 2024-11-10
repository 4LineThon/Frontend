import React from "react";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "../minju/component/AvailabilityHeader";
import SaveButton from "./component/saveButton";
const Result = () => {
  return (
    <div>
      <Logo/>
      <AvailabilityHeader text="Group's Availability" arrowDirection="right" navigateTo="/minju" />
      <SaveButton/>
    </div>
  );
};

export default Result;