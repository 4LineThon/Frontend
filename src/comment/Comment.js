import React, { useEffect, useState } from "react";
import CommentBox from "./component/commentBox";
import CommentInput from "./component/commentInput";
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
    <Wrapper>
      {comments.map((comment, idx) => {
        return <CommentBox key={idx} commentInfo={comment} />;
      })}
      <CommentInput />
    </Wrapper>
  );
};

export default Comment;

const Wrapper = styled.div``;
