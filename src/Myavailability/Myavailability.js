import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "./component/Calendar";
import InsertType from "./component/insertType";
import IsAvailable from "./component/isAvailable";
import Logo from "./component/logo";
import { HeaderH2 } from "./component/headerH2";
import AvailabilityHeader from "./component/AvailabilityHeader";
import axios from "axios";
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

  // 초기 데이터 불러오기 및 화면에 표시 후 삭제
  useEffect(() => {
    if (id && groupId) {
      const fetchAvailability = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${id}`
          );
          setAvailabilityData(response.data); // 기존 데이터를 초기 상태로 설정

          // 초기 데이터를 모두 삭제
          await axios.delete(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability/${id}`
          );
          console.log("초기 데이터 삭제 완료");

          // 삭제 후 초기 데이터를 다시 POST 요청으로 전송하여 화면에 표시
          await saveInitialData(response.data);
        } catch (error) {
          console.error("Error fetching availability data:", error);
        }
      };
      fetchAvailability();
      localStorage.setItem("username", name);
    }
  }, [id, groupId]);

  // 초기 데이터를 POST 요청으로 전송
  const saveInitialData = async (data) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability`,
        {
          groupId,
          userId: id,
          availability: data,
        }
      );
      console.log("초기 데이터 저장 완료");
    } catch (error) {
      console.error("Error saving initial availability data:", error);
    }
  };

  // 사용자가 수정한 데이터 업데이트 함수
  const handleAvailabilityChange = (newData) => {
    setModifiedData(newData);
  };

  // 수정된 데이터만 다시 저장
  const handleSave = async () => {
    try {
      // 기존 데이터가 이미 삭제된 상태이므로, 수정된 데이터만 POST 요청으로 전송
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/availability`,
        {
          groupId,
          userId: id,
          availability: modifiedData,
        }
      );
      alert("수정된 Availability 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Error saving modified availability data:", error);
    }
  };

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
      <Calendar
        groupId={groupId}
        userId={id}
        initialData={availabilityData}
        onAvailabilityChange={handleAvailabilityChange}
      />
      <SaveButton onClick={handleSave}>Save</SaveButton>
    </div>
  );
};

export default Myavailability;

const SaveButton = styled.button`
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #4c3f5e;
  border: none;
  cursor: pointer;
`;
