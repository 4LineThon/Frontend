import React from 'react';

const StatusIndicator = ({ current, total }) => {
  const filledBoxes = Array(total).fill(false).map((_, index) => index < current);

  return (
    <div style={styles.container}>
      <span style={styles.label}>{`${current}/${total}`}</span>
      <div style={styles.boxContainer}>
        {filledBoxes.map((isFilled, index) => (
          <div
            key={index}
            style={{
              ...styles.box,
              backgroundColor: isFilled
                ? '#423E59'
                : `rgba(66, 62, 89, ${0.2 + index * 0.2})`, // 단계별 투명도
            }}
          />
        ))}
      </div>
      <span style={styles.label}>{`${total-1}/${total}`}</span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  boxContainer: {
    display: 'flex',
    gap: '2px',
  },
  box: {
    width: '20px',
    height: '20px',
    border: '2px solid #423E59',
    flexShrink: 0,
  },
};

export default StatusIndicator;
