import React from "react";
import styled from "styled-components";

const AvailabilityHeader = ({ text = "My Availability", arrowDirection = "left", navigateTo = () => {} }) => {
  return (
    <HeaderContainer>
      {arrowDirection === "left" && (
        <Arrow onClick={navigateTo} direction="left">{"<"}</Arrow>
      )}
      <HeaderText>{text}</HeaderText>
      {arrowDirection === "right" && (
        <Arrow onClick={navigateTo} direction="right">{">"}</Arrow>
      )}
    </HeaderContainer>
  );
};

export default AvailabilityHeader;

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