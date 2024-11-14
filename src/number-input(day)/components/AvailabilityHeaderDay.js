import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

const AvailabilityHeaderDay = ({ arrowDirection = "left", navigateTo = "/Login" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract `event`, `groupId`, and `userName` from URL or `location.state`
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");
  let userName = queryParams.get("userName") || location.state?.name;

  // Store `userName` in `localStorage` if it is provided in the URL or location state
  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    } else {
      userName = localStorage.getItem("userName") || "Guest";
    }
  }, [userName]);

  // Handle navigation with `userName` passed in `location.state` as `name`
  const handleNavigation = () => {
    navigate(navigateTo, {
      state: { event, groupId, name: userName },
    });
  };

  return (
    <HeaderContainer>
      {arrowDirection === "left" && (
        <Arrow onClick={handleNavigation} direction="left">{"<"}</Arrow>
      )}
      <HeaderText>{`Availability for ${userName}`}</HeaderText>
      {arrowDirection === "right" && (
        <Arrow onClick={handleNavigation} direction="right">{">"}</Arrow>
      )}
    </HeaderContainer>
  );
};

export default AvailabilityHeaderDay;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #423E59;
  color: #D9D9D9;
  width: 375px;
  height: 32px;
  position: relative;
  flex-shrink: 0;
  margin-bottom: 20px;
`;

const HeaderText = styled.span`
  color: #D9D9D9;
  font-family: "Ibarra Real Nova", serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ direction }) => (direction === "left" ? "left: 10px;" : "right: 10px;")}
  width: 20px;
  height: 20px;
  color: #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
`;
