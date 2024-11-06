import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Bullet, Commemt, Content, Wrapper, Writer } from "./component/comment";

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
          <CommentWrapper key={idx}>
            <Bullet />
            <Commemt>
              <Writer>Comment by {elt.name}</Writer>
              <Content>{elt.content}</Content>
            </Commemt>
          </CommentWrapper>
        );
      })}
      <InputWrapper>
        <Bullet />
        <TextArea />
        <SendButton />
      </InputWrapper>
    </>
  );
};

export default Comment;

const CommentWrapper = styled(Wrapper)`
  border-color: #9ea663;
`;

const InputWrapper = styled(Wrapper)`
  border-color: #423e59;
`;

const TextArea = styled.textarea.attrs({
  placeholder: "Write yout comment",
  maxLength: 25,
})`
  width: 158px;
  height: 25px;
  border: 0;
  outline: 0;
  padding: 0;
  background-color: transparent;
  font-size: 10px;
  color: #423e59;
  font-family: "Ibarra Real Nova", serif;
  resize: none;
  &::placeholder {
    color: #423e59;
    font-family: "Ibarra Real Nova", serif;
  }
`;

const SendButton = styled.img.attrs({
  src: "/send-comment.svg",
})`
  width: 20px;
  height: 20px;
  margin: auto 0 auto 8px;
`;
