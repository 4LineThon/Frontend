import React from 'react';

const EveryoneAvailable = () => {
  return (
    <div style={styles.container}>
      <div style={styles.indicatorContainer}>
        <div style={styles.availableBox} />
        <span style={styles.label}>Everyone Available</span>
      </div>
      <div style={styles.commentContainer}>
        <div style={styles.dot} />
        <span style={styles.commentLabel}>Comment</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center-align the entire component
    gap: '20px',
    width: '100%', // Make sure it takes up full width of its parent container
  },
  indicatorContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  availableBox: {
    width: '16px', // Slightly reduced size for better alignment
    height: '16px',
    backgroundColor: '#9EA663', // Green background color
    border: '2px solid #474073',
    marginRight: '8px',
  },
  label: {
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px', // Reduced font size
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
  commentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '8px', // Reduced size for visual balance
    height: '8px',
    backgroundColor: '#474073', // Dot color
    borderRadius: '50%',
  },
  commentLabel: {
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '18px', // Reduced font size
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
};

export default EveryoneAvailable;
