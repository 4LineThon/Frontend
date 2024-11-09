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
    gap: '20px',
  },
  indicatorContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  availableBox: {
    width: '20px',
    height: '20px',
    backgroundColor: '#9EA663', // 녹색 배경
    border: '2px solid #474073',
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
  commentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#474073', // 원형 점 색상
    borderRadius: '50%',
  },
  commentLabel: {
    color: '#423E59',
    fontFamily: '"Ibarra Real Nova"',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
  },
};

export default EveryoneAvailable;
