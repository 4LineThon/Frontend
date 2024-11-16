import React from "react";
import { Bullet, Commemt, Content, Wrapper, Writer } from "./commentCSS";
import styled from "styled-components";

const CommentBox = ({ commentInfo, deleteComment }) => {
  const name = localStorage.getItem("username");

  return (
    <CommentWrapper>
      <Bullet />
      <Commemt>
        <Writer>Comment by {commentInfo.user}</Writer>
        <Content>{commentInfo.text}</Content>
      </Commemt>
      {name === commentInfo.user ? (
        <DeleteBtn onClick={() => deleteComment(commentInfo.id)} />
      ) : null}
    </CommentWrapper>
  );
};

export default CommentBox;

const CommentWrapper = styled(Wrapper)`
  border-color: #9ea663;
  position: relative;
`;

const DeleteBtn = styled.img.attrs({
  src: "comment-delete-btn.svg",
})`
  width: 12.5px;
  height: 12.5px;
  position: absolute;
  top: 8px;
  right: 8.5px;
  cursor: pointer;
`;
