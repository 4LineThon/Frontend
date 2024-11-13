import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FixButton = ({ event, groupId, userid }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    
    navigate(`/result?event=${event}&groupId=${groupId}`, {
      state: { userid },
    });
  };

  return (
    <button onClick={handleClick} style={styles.button}>
      Fix Time
    </button>
  );
};

export default FixButton;

const styles = {
  button: {
    width: '150px',
    height: '40px',
    backgroundColor: '#423E59',
    color: '#D9D9D9',
    fontSize: '20px',
    fontFamily: '"Ibarra Real Nova", serif',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    margin: '20px auto',
  },
};