import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const AvailabilityHeader = ({
  text = "My Availability",
  arrowDirection = "right",
  navigateTo = "/",
  name = "",
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(navigateTo, { state: { name } });
  };

  return (
    <HeaderContainer>
      {arrowDirection === "left" && (
        <Arrow onClick={handleNavigation} direction="left">
          {"<"}
        </Arrow>
      )}
      <HeaderText>{text}</HeaderText>
      {arrowDirection === "right" && (
        <Arrow onClick={handleNavigation} direction="right">
          {">"}
        </Arrow>
      )}
    </HeaderContainer>
  );
};

export default AvailabilityHeader;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #423e59;
  color: #d9d9d9;
  width: 375px;
  height: 32px;
  position: relative;
  flex-shrink: 0;
  margin-bottom: 20px;
`;

const HeaderText = styled.span`
  color: #d9d9d9;
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
  ${({ direction }) => (direction === "right" ? "right: 10px;" : "left: 10px;")}
  width: 20px;
  height: 20px;
  color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  flex-shrink: 0;
`;