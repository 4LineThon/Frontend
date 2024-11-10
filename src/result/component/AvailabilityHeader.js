import React from "react";
import styled from "styled-components";


const AvailabilityHeader = ({ text = "Result" }) => {
    return (
    <HeaderContainer>
      
      <HeaderText>{text}</HeaderText>
      
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

