import React, { useEffect, useState } from "react";
import CommentBox from "./component/commentBox";
import CommentInput from "./component/commentInput";
import styled from "styled-components";
import axios from "axios";

const Comment = ({ comments, selectedSlot, setComments }) => {
  const isClicked = selectedSlot !== null;
  const name = localStorage.getItem("username");

  // console.log("comments", comments);
  // console.log("selectedSlot", selectedSlot);

  const postComment = async (text) => {
    if (!text) {
      alert("Please enter a comment.");
      return;
    }
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/comment`,
      {
        user: localStorage.getItem("userId"),
        day: selectedSlot.day,
        date: selectedSlot.date,
        time: selectedSlot.time,
        text,
      }
    );
    // console.log(response);
    const newComment = {
      id: response.data.id,
      user: name,
      text,
      created_at: response.data.created_at,
    };
    setComments([...comments, newComment]);
  };

  const deleteComment = async (commentId) => {
    try {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("Are you sure you want to delete this comment?")) {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/comment/${commentId}`
        );
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      {comments.map((comment, idx) => {
        return (
          <CommentBox
            key={idx}
            commentInfo={comment}
            deleteComment={deleteComment}
          />
        );
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
