import React from "react";
import styled from "styled-components";

const Logo = () => {
  return (
    <LogoContainer>
      <Image src="/Timi.svg" />
    </LogoContainer>
  );
};

export default Logo;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; 
  margin-top: 41px;
  margin-bottom: 20px; 
`;

const Image = styled.img`
  width: 116px;
  text-align: center;
  font-family: "Jaro", sans-serif;
  letter-spacing: 4px;
  font-style: normal;
  font-size: 64px;
  color: #423e59;
`;
