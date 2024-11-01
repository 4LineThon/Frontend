import React from "react";
import styled from "styled-components";

const Logo = () => {
  return <Image src="/Timi.svg" />;
};

export default Logo;

const Image = styled.img`
  width: 116px;
  margin-top: 41px;
  text-align: center;
  font-family: "Jaro", sans-serif;
  letter-spacing: 4px;
  font-style: normal;
  font-size: 64px;
  color: #423e59;
`;
