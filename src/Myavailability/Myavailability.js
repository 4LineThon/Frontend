import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "./component/Calendar";
import InsertType from "./component/insertType";
import IsAvailable from "./component/isAvailable";
import Logo from "./component/logo";
import { HeaderH2 } from "./component/headerH2";
import AvailabilityHeader from "./component/AvailabilityHeader";
import axios from "axios";

const Myavailability = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");
  const [groupName, setGroupName] = useState("");

  const [id] = useState(location.state?.id || null);
  const [name] = useState(location.state?.name || "User");
  useEffect(() => {
    //console.log("Received query parametersMinju:");
    //console.log("Event:", event);
    //console.log("GroupId:", groupId);
    //console.log("Received state parametersMinju:");
    //console.log("ID:", id);
    //console.log("Name:", name);
  }, [event, groupId, location.state]);

  useEffect(() => {
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
          setGroupName(response.data.name); // 응답에서 그룹 이름을 설정
          console.log(response.data);
          console.log("Fetched group name:", response.data.name); // 그룹 이름을 콘솔에 출력
        } catch (error) {
          console.error("Error fetching group name:", error);
        }
      };
      fetchGroupName();
    } else {
      console.error("No group_id found in localStorage");
    }
  }, []);

  return (
    <div>
      <Logo />
      <HeaderH2>{groupName}</HeaderH2>
      <AvailabilityHeader
        text={`Availability for ${name}`}
        arrowDirection="left"
        navigateTo="/groupAvailability"
        name={name}
      />
      <InsertType />
      <IsAvailable />
      <Calendar groupId={groupId} />
    </div>
  );
};

export default Myavailability;
