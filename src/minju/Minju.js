import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "./component/Calendar";
import InsertType from "./component/insertType";
import IsAvailable from "./component/isAvailable";
import Logo from "./component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";

const Minju = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    // location.state에서 ID와 Name 가져와서 상태 설정
    setId(location.state?.id);
    setName(location.state?.name);
  }, [location.state]);

  return (
    <div>
      <Logo />
      {/* AvailabilityHeader 컴포넌트에서 name 값 사용 */}
      <AvailabilityHeader 
        text={`Availability for ${name || "User"}`} 
        arrowDirection="left" 
        navigateTo="/groupAvailability" 
      />
      <InsertType />
      <IsAvailable />
      <Calendar />

      {/* 추가로 ID와 Name을 화면에 표시 */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h3>ID: {id}</h3>
        <h3>Name: {name}</h3>
      </div>
    </div>
  );
};

export default Minju;
