import React from "react";
import { Bullet, Commemt, Content, Wrapper, Writer } from "./commentCSS";
import styled from "styled-components";

const CommentBox = ({ commentInfo }) => {
  return (
    <CommentWrapper>
      <Bullet />
      <Commemt>
        <Writer>Comment by {commentInfo.user}</Writer>
        <Content>{commentInfo.text}</Content>
      </Commemt>
    </CommentWrapper>
  );
};

export default CommentBox;

const CommentWrapper = styled(Wrapper)`
  border-color: #9ea663;
`;
