import React from 'react';
import styled from 'styled-components';

const FixButton = () => {
  return <Button>fix Time</Button>;
};

export default FixButton;

const Button = styled.button`
  width: 150px; /* Adjusted width to make it smaller */
  height: 30px; /* Adjusted height to make it smaller */
  background-color: #423E59;
  color: #D9D9D9;
  text-align: center;
  font-family: "Ibarra Real Nova", serif;
  font-size: 20px; /* Reduced font size */
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: none;
  cursor: pointer;
  margin: 20px auto; /* Center the button horizontally */
  display: block; /* Allows margin auto to work for centering */

  &:hover {
    opacity: 0.9; /* Slight hover effect */
  }
`;
