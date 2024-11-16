import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Myavailability/component/logo";
import AvailabilityHeader from "./component/AvailabilityHeader";
import Explanation from "../explanation/explanation";
import CopyButton from "../copy-event-link/CopyButton";
import axios from "axios";
import { HeaderH2 } from "../Myavailability/component/headerH2";

const Result = () => {
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [resultId, setResultId] = useState(null); // result_id 추가
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const userid = location.state?.userid;

  const queryParams = new URLSearchParams(location.search);
  const event = queryParams.get("event");
  const groupId = queryParams.get("groupId");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Group 이름 가져오기
        const groupResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/${groupId}`
        );
        setGroupName(groupResponse.data.name);

        // Fix된 결과가 있는지 확인
        const resultResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/result/group/${groupId}`
        );

        console.log("Result API Response:", resultResponse.data);

        if (
          resultResponse.data.length > 0 &&
          resultResponse.data[0].time &&
          resultResponse.data[0].place
        ) {
          setTime(resultResponse.data[0].time);
          setPlace(resultResponse.data[0].place);
          setResultId(resultResponse.data[0].id); // result_id 저장
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Fix된 결과가 없음. 새로운 입력 필요");
          setIsSaved(false);
        } else {
          console.error("데이터를 가져오는 도중 오류 발생:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/result/group/${groupId}`
      )
      .then((response) => {
        const data = response.data;
        const hasDetailObject = data.some((item) =>
          item.hasOwnProperty("detail")
        );
        console.log("hasDetailObject", data);
        // 확정 안됨
        if (hasDetailObject) {
          const currentUrl = `/groupAvailability?event=${event}&groupId=${groupId}`;
          navigate(currentUrl);
          return;
        }
      })
      .catch((error) => console.log(error));

    fetchInitialData();
  }, [groupId]);

  const preConfirmExplanation = [
    'When the "Save" button is clicked,',
    "the meeting time is confirmed.",
  ];
  const postConfirmExplanation = [
    'When the "Reschedule" button is clicked,',
    "the confirmed meeting time will be canceled.",
    "-",
    "But the previously selected group availability will remain unchanged.",
  ];

  const handleSave = async () => {
    if (!time || !place) {
      setErrorMessage("Time과 Place 모두 입력해주세요");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/result`,
        {
          group: groupId,
          place: place,
          time: time,
        }
      );
      setResultId(response.data.id); // 저장된 result_id 설정
      setIsSaved(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleReschedule = async () => {
    try {
      // DELETE 요청으로 기존 데이터 삭제
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/result/${resultId}`
      );

      // 데이터 초기화
      setIsSaved(false);
      setPlace("");
      setTime("");
      setResultId(null); // result_id 초기화

      // groupAvailability 화면으로 이동
      navigate(`/groupAvailability?event=${event}&groupId=${groupId}`, {
        state: { userid },
      });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <CopyButton />
      <Logo />
      <HeaderH2>{groupName}</HeaderH2>
      <AvailabilityHeader text="Result" />

      <div style={styles.formContainer}>
        <div style={styles.inputContainer}>
          <div style={styles.labelContainer}>
            <span style={styles.label}>Time</span>
            {isSaved ? (
              <span style={styles.fixedText}>{time}</span>
            ) : (
              <input
                type="text"
                style={styles.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Enter Time"
              />
            )}
          </div>
        </div>
        <div style={styles.inputContainer}>
          <div style={styles.labelContainer}>
            <span style={styles.label}>Place</span>
            {isSaved ? (
              <span style={styles.fixedText}>{place}</span>
            ) : (
              <input
                type="text"
                style={styles.input}
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Enter place"
              />
            )}
          </div>
        </div>

        {errorMessage && <span style={styles.errorText}>{errorMessage}</span>}

        {isSaved ? (
          <>
            <button style={styles.rescheduleButton} onClick={handleReschedule}>
              Reschedule
            </button>
            <Explanation textArr={postConfirmExplanation} />
          </>
        ) : (
          <>
            <button style={styles.saveButton} onClick={handleSave}>
              Save
            </button>
            <Explanation textArr={preConfirmExplanation} />
          </>
        )}
      </div>
    </div>
  );
};
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    width: "100%",
    maxWidth: "280px",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  labelContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    color: "#423E59",
    fontFamily: '"Ibarra Real Nova", serif',
    fontSize: "20px",
  },
  input: {
    width: "160px",
    height: "28px",
    fontSize: "16px",
    color: "#423E59",
    border: "none",
    borderBottom: "2px solid #423E59",
    backgroundColor: "transparent",
    fontFamily: '"Ibarra Real Nova", serif',
    textAlign: "center",
    outline: "none",
  },
  fixedText: {
    fontSize: "16px",
    color: "#423E59",
    fontFamily: '"Ibarra Real Nova", serif',
    textAlign: "center",
  },
  errorText: {
    color: "#423E59",
    fontSize: "14px",
    fontFamily: '"Ibarra Real Nova", serif',
    marginTop: "-10px",
  },
  saveButton: {
    width: "160px",
    height: "38px",
    backgroundColor: "#423E59",
    color: "#D9D9D9",
    fontSize: "20px",
    fontFamily: '"Ibarra Real Nova", serif',
    border: "none",
    cursor: "pointer",
  },
  rescheduleButton: {
    width: "160px",
    height: "38px",
    backgroundColor: "#423E59",
    color: "#D9D9D9",
    fontSize: "20px",
    fontFamily: '"Ibarra Real Nova", serif',
    border: "none",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
    fontFamily: '"Ibarra Real Nova", serif',
    color: "#423E59",
  },
};

export default Result;
