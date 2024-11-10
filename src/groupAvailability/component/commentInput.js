import React, { useState } from "react";
import { Bullet, Wrapper } from "./commentCSS";
import styled from "styled-components";

const CommentInput = ({ onSubmit, initialComment }) => {
  const [comment, setComment] = useState(initialComment);

  const handleInputChange = (e) => setComment(e.target.value);

  const handleSend = () => {
    onSubmit(comment);
    setComment("");
  };

  return (
    <InputWrapper>
      <Bullet />
      <StyledTextArea
        value={comment}
        onChange={handleInputChange}
        placeholder="Write your comment"
      />
      <SendButton onClick={handleSend} />
    </InputWrapper>
  );
};

export default CommentInput;

const InputWrapper = styled(Wrapper)`
  border-color: #423e59;
`;

const StyledTextArea = styled.textarea.attrs({
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
  cursor: pointer;
`;
