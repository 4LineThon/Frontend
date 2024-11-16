import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "./component/Calendar";
import InsertType from "./component/insertType";
import IsAvailable from "./component/isAvailable";
import Logo from "./component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import axios from 'axios';
import styled from "styled-components";

const Myavailability = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");
  const [groupName, setGroupName] = useState("");

  const [availabilityData, setAvailabilityData] = useState([]); // 기존 데이터
  const [modifiedData, setModifiedData] = useState([]); // 수정된 데이터
  const [id] = useState(location.state?.id || null);
  const [name] = useState(location.state?.name || "User");

  useEffect(() => {
    if (groupId) {
      const fetchGroupName = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
          );
          setGroupName(response.data.name);
        } catch (error) {
          console.error("Error fetching group name:", error);
        }
      };
      fetchGroupName();
    } else {
      console.error("No group_id found in localStorage");
    }
  }, [groupId]);

  // 초기 데이터 불러오기 및 화면에 표시
  useEffect(() => {
    if (id && groupId) {
      const fetchAvailability = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${id}`
          );
          setAvailabilityData(response.data); // 기존 데이터를 초기 상태로 설정
        } catch (error) {
          console.error("Error fetching availability data:", error);
        }
      };
      fetchAvailability();
    }
  }, [id, groupId]);

  // 사용자가 수정한 데이터 업데이트 함수
  const handleAvailabilityChange = (newData) => {
    setModifiedData(newData);
  };

  return (
    <div>
      <Logo />
      <HeaderH2>{groupName}</HeaderH2>
      <AvailabilityHeader 
        text={`Availability for ${name}`} 
        arrowDirection="right" 
        navigateTo="/groupAvailability" 
      />
      <InsertType />
      <IsAvailable />
      <Calendar 
        groupId={groupId} 
        userId={id} 
        initialData={availabilityData} 
        onAvailabilityChange={handleAvailabilityChange} 
      />
    </div>
  );
};

export default Myavailability;

const HeaderH2 = styled.h2`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #4c3f5e;
  margin-bottom: 10px;
`;
