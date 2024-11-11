import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
const InsertType = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultSelected = location.pathname === '/NumberInput' ? 'Number' : 'Finger';
  const [selected, setSelected] = useState(defaultSelected);

  // 페이지 이동
  useEffect(() => {
    if (selected === 'Number' && location.pathname !== '/NumberInput') {
      navigate('/NumberInput');
    } else if (selected === 'Finger' && location.pathname !== '/minju') {
      navigate('/minju');
    }
  }, [selected, navigate, location.pathname]);

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
    justifyContent: 'center', // Center alignment for the whole container
    gap: '16px', // Space between label and buttons
  },
  label: {
    color: '#423E59',
    textAlign: 'center',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px', // Slightly reduced font size
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    width: '90px', // Reduced width
    height: '20px', // Reduced height
    flexShrink: 0,
  },
  buttonsContainer: {
    display: 'flex',
    gap: '6px', // Reduced gap between buttons
    alignItems: 'center', // Center alignment within the button container
    justifyContent: 'center',
  },
  button: {
    width: '90px', // Reduced width to make it more compact
    height: '28px', // Reduced height
    backgroundColor: 'transparent',
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px', // Slightly smaller font size
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
