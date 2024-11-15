import React from "react";
import Comment from "../../comment/Comment";
import styled from "styled-components";

const AvailabilityDetail = ({
  available,
  unavailable,
  comments,
  userCount,
  selectedSlot,
  requestAvailabilityDetail,
}) => (
  <DetailContainer>
    <AvailabilityHeader>
      {available.length}/{userCount} Available
    </AvailabilityHeader>
    <DateTitle>
      {selectedSlot.date} {selectedSlot.time}
    </DateTitle>
    <ListContainer>
      <ListSection>
        <Title>Available</Title>
        <Underline />
        <UserList>
          {available.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </UserList>
      </ListSection>
      <Divider />
      <ListSection>
        <Title>Unavailable</Title>
        <Underline />
        <UserList>
          {unavailable.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </UserList>
      </ListSection>
    </ListContainer>
    <Comment
      selectedSlot={selectedSlot}
      comments={comments}
      requestAvailabilityDetail={requestAvailabilityDetail}
    />
  </DetailContainer>
);

const DetailContainer = styled.div`
  background: #d9d9d9;
  padding: 8px;
  margin-top: 8px;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
`;

const AvailabilityHeader = styled.div`
  width: 150px;
  height: 30px;
  flex-shrink: 0;
  margin: 0 auto 8px;
  color: #423e59;
  font-family: "Ibarra Real Nova";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border: 1px solid #423e59;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateTitle = styled.h4`
  color: #423e59;
  font-family: "Ibarra Real Nova";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 8px;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const ListSection = styled.div`
  width: 40%;
`;

const Title = styled.h3`
  color: #423e59;
  font-family: "Ibarra Real Nova";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 4px;
`;

const Underline = styled.div`
  width: 100%;
  height: 1px;
  background-color: #423e59;
  margin-bottom: 8px;
`;

const Divider = styled.div`
  width: 1px;
  background-color: #423e59;
  height: 100%;
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #423e59;
  font-family: "Ibarra Real Nova";
  font-size: 16px;
  font-weight: 400;
`;

export default AvailabilityDetail;
