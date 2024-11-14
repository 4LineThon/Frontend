import React, { useEffect, useState } from "react";
import CommentBox from "./component/commentBox";
import CommentInput from "./component/commentInput";
import styled from "styled-components";

const Comment = ({ comments, isClicked }) => {
  return (
    <Wrapper>
      {comments.map((comment, idx) => {
        return <CommentBox key={idx} commentInfo={comment} />;
      })}
      {isClicked ? <CommentInput /> : null}
    </Wrapper>
  );
};

export default Comment;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;
