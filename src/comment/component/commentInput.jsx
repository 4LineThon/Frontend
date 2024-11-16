import React, { useState } from "react";
import styled from "styled-components";
import { Bullet, Wrapper } from "./commentCSS";

const CommentInput = ({ postComment }) => {
  const [text, setText] = useState("");

  return (
    <InputWrapper>
      <Bullet />
      <TextArea value={text} onChange={(e) => setText(e.target.value)} />
      <SendButton
        onClick={() => {
          postComment(text);
          setText("");
        }}
      />
    </InputWrapper>
  );
};

export default CommentInput;

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
  font-size: 13px;
  color: #423e59;
  font-family: "Ibarra Real Nova", serif;
  resize: none;
  overflow: hidden;
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
