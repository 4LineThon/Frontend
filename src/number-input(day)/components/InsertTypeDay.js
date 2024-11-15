import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InsertType = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 기본 선택을 'Number'로 설정
  const [selected, setSelected] = useState('Number');
  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get('event');
  const groupId = queryParams.get('groupId');
  const id = location.state?.id || localStorage.getItem('id') || null;
  const name = location.state?.name || localStorage.getItem('name') || 'User';

      // Save id and name to localStorage if they exist in location.state
      useEffect(() => {
        if (id) localStorage.setItem('id', id);
        if (name) localStorage.setItem('name', name);
      }, [id, name]);
// Function to handle navigation with query parameters
const navigateToPage = (path) => {
  const urlWithParams = `${path}?event=${event}&groupId=${groupId}`;
  navigate(urlWithParams, { state: { id, name } });
};

// Update navigation based on selected type
useEffect(() => {
  if (selected === 'Number' && location.pathname !== '/NumberInputDay') {
    navigateToPage('/NumberInputDay');
  } else if (selected === 'Finger' && location.pathname !== '/myavailability') {
    navigateToPage('/myavailability');
  }
}, [selected, location.pathname, event, groupId, id, name]);



  return (
    <div style={styles.container}>
      <span style={styles.label}>Insert Type</span>
      <div style={styles.buttonsContainer}>
        <button
          style={selected === 'Finger' ? styles.selectedButton : styles.button}
          onClick={() => setSelected('Finger')}
        >
          Finger
        </button>
        <button
          style={selected === 'Number' ? styles.selectedButton : styles.button}
          onClick={() => setSelected('Number')}
        >
          Number
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  label: {
    color: '#423E59',
    textAlign: 'center',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    width: '90px',
    height: '20px',
    flexShrink: 0,
  },
  buttonsContainer: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '90px',
    height: '28px',
    backgroundColor: 'transparent',
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    border: '2px solid #423E59',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  selectedButton: {
    width: '90px',
    height: '28px',
    backgroundColor: '#423E59',
    color: '#ffffff',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    border: '2px solid #423E59',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
};

export default InsertType;
