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
                : `rgba(66, 62, 89, ${0.2 + index * 0.2})`, // Gradient transparency for boxes
            }}
          />
        ))}
      </div>
      <span style={styles.label}>{`${total - 1}/${total}`}</span>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px', // Space between elements
    marginTop: '16px', // Added margin for spacing above
    marginBottom: '16px', // Added margin for spacing below
  },
  label: {
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px', // Adjusted font size for compactness
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  boxContainer: {
    display: 'flex',
    gap: '4px', // Space between boxes
  },
  box: {
    width: '16px', // Reduced width for compactness
    height: '16px', // Reduced height for compactness
    border: '2px solid #423E59',
    flexShrink: 0,
  },
};

export default StatusIndicator;
