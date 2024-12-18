import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const monthNames = [
  "null",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SelectDates = ({ updateRequest }) => {
  const [loading, setLoading] = useState(true);
  const basicColor = "#D9D9D9";
  const specialColor = "#423e59";
  const initialBtn = Array(35).fill(false);
  const [btn, setBtn] = useState(initialBtn);
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState("");
  const [days, setDays] = useState([]);
  const [dates, setDates] = useState([]);
  const [response, setResponse] = useState([]);

  const handleClick = (e) => {
    const idx = Number(e.target.id);
    if (isOverSeven() && !btn[idx]) return; // 이미 7개 이상 체크했고 더 클릭하려고 하면
    setBtn((prev) => prev.map((state, i) => (i === idx ? !state : state)));
  };

  // 7개 초과로 클릭하는지 확인
  function isOverSeven() {
    const trueCount = btn.filter((value) => value === true).length;
    return trueCount >= 7;
  }

  // (handleClick 후 실행) request 요청 업데이트
  useEffect(() => {
    const request = response.filter((_, idx) => btn[idx]);
    updateRequest("days", request);
  }, [btn, response]);

  // 데이터 불러오기
  useEffect(() => {
    const setCalendar = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/group/today`
        );
        const data = response.data;

        // 연도 세팅
        setYear(data[0].year);

        // 월 세팅
        const firstMonth = monthNames[data[0].month];
        const lastMonth = monthNames[data[data.length - 1].month];
        setMonth(
          firstMonth === lastMonth ? firstMonth : `${firstMonth}/${lastMonth}`
        );

        // 요일 세팅
        const dayArr = data.slice(0, 7).map((item) => item.weekday[0]);
        setDays(dayArr);

        // 날짜 세팅
        const dateArr = data.map((item) => item.day);
        setDates(dateArr);

        // 응답 보내기 좋게 미리 data 변경
        const tempArr = [];
        data.map((elt) => {
          const date = `${String(elt.year)}-${String(elt.month).padStart(
            2,
            "0"
          )}-${String(elt.day).padStart(2, "0")}`;
          const day = elt.weekday;
          const days = { date, day };
          tempArr.push(days);
        });
        setResponse(tempArr);
      } catch (error) {
        console.log(error);
      }
    };
    setCalendar();
    setLoading(false);
  }, []);

  return (
    <Container>
      <MonthBox>
        {year} {month}
      </MonthBox>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <CalendarContainer>
          {days.map((day, idx) => {
            return <DayBox key={idx}>{day}</DayBox>;
          })}
          {dates.map((date, idx) => {
            return (
              <DateBox
                key={idx}
                id={idx}
                onClick={handleClick}
                color={btn[idx] ? basicColor : specialColor}
                $bgcolor={btn[idx] ? specialColor : basicColor}
              >
                {date}
              </DateBox>
            );
          })}
        </CalendarContainer>
      )}
    </Container>
  );
};

export default SelectDates;

const Container = styled.div`
  margin-top: 29px;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  row-gap: 2px;
`;

const Loading = styled.div`
  width: 315px;
  height: 238px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #423e59;
`;

const MonthBox = styled.div`
  margin-top: 14px;
  margin-bottom: 6px;
  text-align: center;
  font-size: 20px;
  color: #423e59;
`;

const DateBox = styled.button`
  width: 38px;
  height: 38px;
  display: flex;
  border: 3px solid #423e59;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bgcolor};
  color: ${(props) => props.color};
  font-size: 24px;
  cursor: pointer;
  font-family: "Ibarra Real Nova", serif;
`;

const DayBox = styled.div`
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #423e59;
  font-size: 24px;
`;
