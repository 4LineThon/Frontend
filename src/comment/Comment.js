import React, { useEffect, useState } from "react";
import CommentBox from "./component/commentBox";
import CommentInput from "./component/commentInput";
import styled from "styled-components";
import axios from "axios";

const Comment = ({ comments, selectedSlot }) => {
  const isClicked = selectedSlot !== null;
  console.log("selectedSlot", selectedSlot);

  const postComment = async (text) => {
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/comment`, {
      user: localStorage.getItem("userId"),
      days: "",
      time: "",
      text,
    });
  };

  return (
    <Wrapper>
      {comments.map((comment, idx) => {
        return <CommentBox key={idx} commentInfo={comment} />;
      })}
      {isClicked && <CommentInput postComment={postComment} />}
    </Wrapper>
  );
};

export default Comment;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin: 24px 0;
`;
