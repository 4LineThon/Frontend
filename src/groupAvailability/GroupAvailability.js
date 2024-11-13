import React from "react";
import { useLocation } from "react-router-dom";

import EveryoneAvailable from "./component/Everyoneavailable";
import StatusIndicator from "./component/StatusIndicator";
import Logo from "../minju/component/logo";
import AvailabilityHeader from "../minju/component/AvailabilityHeader";
import FixButton from "./component/fixButton";
import Calendar from "./component/Calendar";
import Explanation from "../explanation/explanation";

const GroupAvailability = () => {
  const explanation = [
    "You can confirm the meeting time",
    "by clicking “Fix Time” button.",
  ];

  // 쿼리 파라미터 가져오기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const availability = queryParams.get("availability");

  // 쿼리 파라미터 값 확인
  console.log("Received availability data:", availability);

  return (
    <div>
      <Logo />
      <AvailabilityHeader
        text="Group's Availability"
        arrowDirection="right"
        navigateTo="/minju"
      />
      <EveryoneAvailable />
      <StatusIndicator current={0} total={5} />
      <Calendar />
      <FixButton />
      <Explanation textArr={explanation} />

      {/* 화면에 availability 데이터를 출력하여 확인 */}
      {availability && (
        <div>
          <h3>Received Availability Data:</h3>
          <pre>{availability}</pre> {/* JSON 형태의 데이터 표시 */}
        </div>
      )}
    </div>
  );
};

export default GroupAvailability;
