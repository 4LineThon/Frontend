import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const InsertType = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");

  const defaultSelected = location.pathname === '/NumberInput' ? 'Number' : 'Finger';
  const [selected, setSelected] = useState(defaultSelected);
  const [groupTimetableData, setGroupTimetableData] = useState(null);

  // 쿼리 파라미터와 state로 전달된 값을 콘솔에 출력
  useEffect(() => {
    console.log("Received query parameters:");
    console.log("Event:", event);
    console.log("GroupId:", groupId);

    console.log("Received state parameters:");
    console.log("ID:", location.state?.id);
    console.log("Name:", location.state?.name);
  }, [event, groupId, location.state]);

  // 그룹 타임테이블 데이터를 가져오는 함수
  const fetchGroupTimetable = async () => {
    if (groupId) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/group-timetable/${groupId}`
        );
        setGroupTimetableData(response.data);
        console.log("Group Timetable Data:", response.data); // 데이터 출력
      } catch (error) {
        console.error("Error fetching group timetable:", error);
      }
    }
  };

  // 컴포넌트가 처음 렌더링될 때만 그룹 타임테이블 데이터를 가져옴
  useEffect(() => {
    fetchGroupTimetable();
  }, [groupId]);

  // `selected` 상태 변경에 따라 페이지를 이동함
  useEffect(() => {
    if (groupTimetableData && selected) {
      let targetPath = '';
      if (selected === 'Number') {
        const containsDate = groupTimetableData.some((item) => item.date !== null);
        targetPath = containsDate ? '/NumberInput' : '/NumberInputDay';
      } else if (selected === 'Finger') {
        targetPath = '/myavailability';
      }

      if (targetPath && targetPath !== location.pathname) {
        navigate(`${targetPath}?event=${event}&groupId=${groupId}`, {
          state: { ...location.state },
        });
      }
    }
  },  [selected, groupTimetableData, event, groupId, navigate, location.state, location.pathname]);

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
