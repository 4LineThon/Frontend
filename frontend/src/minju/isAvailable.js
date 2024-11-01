import React from 'react';

const isAvailable = () => {
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
    gap: '20px',
  },
  indicatorContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  unavailableBox: {
    width: '20px',
    height: '20px',
    border: '2px solid #423E59',
    backgroundColor: 'transparent',
    marginRight: '8px',
  },
  availableBox: {
    width: '20px',
    height: '20px',
    border: '2px solid #423E59',
    backgroundColor: '#423E59',
    marginRight: '8px',
  },
  label: {
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
};

export default isAvailable;
