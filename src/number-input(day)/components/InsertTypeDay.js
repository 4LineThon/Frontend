import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InsertType = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 기본 선택을 'Number'로 설정
  const [selected, setSelected] = useState('Number');

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
