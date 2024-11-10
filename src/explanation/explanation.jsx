import React from "react";
import styled from "styled-components";

const Explanation = ({ textArr }) => {
  return (
    <Wrapper>
      {textArr.map((text, idx) => (
        <Text key={idx}>{text}</Text>
      ))}
    </Wrapper>
  );
};

export default Explanation;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 23px;
  margin-bottom: 23px;
`;

const Text = styled.div`
  color: #686381;
  text-align: center;
  font-family: "Ibarra Real Nova";
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
