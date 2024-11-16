import React from "react";

const CommentExist = ({ x, y, width, height, onClick }) => {
  return (
    <foreignObject x={x} y={y} width={width} height={height} onClick={onClick}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "2px",
        }}
      >
        <svg
          width="8" // 원의 크기 설정
          height="8"
          viewBox="0 0 10 10" // viewBox로 SVG 내부 크기 관리
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="4" cy="4" r="4" fill="#474073" />
        </svg>
      </div>
    </foreignObject>
  );
};

export default CommentExist;
