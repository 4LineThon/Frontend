import React from "react";
import { Bullet, Commemt, Content, Wrapper, Writer } from "./commentCSS";
import styled from "styled-components";

const CommentBox = ({ commentInfo }) => {
  return (
    <CommentWrapper>
      <Bullet />
      <Commemt>
        <Writer>Comment by {commentInfo.name}</Writer>
        <Content>{commentInfo.content}</Content>
      </Commemt>
    </CommentWrapper>
  );
};

export default CommentBox;

const CommentWrapper = styled(Wrapper)`
  border-color: #9ea663;
`;
