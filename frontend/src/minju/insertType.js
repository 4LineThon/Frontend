import React, { useState } from 'react';

const InsertType = () => {
  const [selected, setSelected] = useState('Finger'); // 기본 선택을 'Finger'로 설정

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
  },
  label: {
    color: '#423E59',
    textAlign: 'center',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '20px',
    fontWeight: 400,
    lineHeight: 'normal',
    marginRight: '8px', // 버튼과 간격 조정
  },
  buttonsContainer: {
    display: 'flex',
  },
  button: {
    width: '103px',
    height: '32px',
    backgroundColor: 'transparent',
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '20px',
    fontWeight: 400,
    lineHeight: 'normal',
    border: '2px solid #423E59',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  selectedButton: {
    width: '103px',
    height: '32px',
    backgroundColor: '#423E59',
    color: '#ffffff',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '20px',
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
