import React from 'react';

const IsAvailable = () => {
  return (
    <div style={styles.container}>
      <div style={styles.indicatorContainer}>
        <div style={styles.unavailableBox} />
        <span style={styles.label}>Unavailable</span>
      </div>
      <div style={styles.indicatorContainer}>
        <div style={styles.availableBox} />
        <span style={styles.label}>Available</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '40px', // Increase gap between indicators to match the spacing in the image
    marginTop: '20px', // Optional: adjust for spacing within the form
  },
  indicatorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px', // Adjusted for consistent spacing between box and label
  },
  unavailableBox: {
    width: '16px',
    height: '16px',
    border: '2px solid #423E59',
    backgroundColor: 'transparent',
  },
  availableBox: {
    width: '16px',
    height: '16px',
    border: '2px solid #423E59',
    backgroundColor: '#423E59',
  },
  label: {
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova", serif',
    fontSize: '18px', // Adjusted font size to match the example
    fontWeight: 400,
  },
};

export default IsAvailable;
