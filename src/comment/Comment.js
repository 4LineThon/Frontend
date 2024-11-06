import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Comment = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments([
      {
        name: "최OO",
        content:
          "수업이 있는데, 시험 기간이라 휴강 할 수도 있어요! 알아보고 다시 알려드릴게요!",
      },
      {
        name: "김OO",
        content: "알바 일정이 확실하지 않아서 일단 된다고 했습니다.",
      },
    ]);
  }, []);

  return (
    <>
      {comments.map((elt, idx) => {
        return (
          <Wrapper>
            <Bullet src="/comment-circle.svg" />
            <Commemt>
              <Writer>Comment by {elt.name}</Writer>
              <Content>{elt.content}</Content>
            </Commemt>
          </Wrapper>
        );
      })}
    </>
  );
};

export default Comment;

const Wrapper = styled.div`
  width: 229px;
  display: flex;
  align-items: baseline;
  margin: 0px 73px 11px 73px;
  padding: 9px;
  border: 2px solid #9ea663;
  font-family: "Ibarra Real Nova", serif;
  color: #423e59;
`;

const Bullet = styled.img`
  width: 8px;
  height: 8px;
  margin: 6px 11px 0px 4px;
`;

const Commemt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Writer = styled.div`
  font-size: 15px;
`;

const Content = styled.div`
  font-size: 10px;
`;
