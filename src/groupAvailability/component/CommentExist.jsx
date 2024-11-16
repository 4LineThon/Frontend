import React, { useEffect, useState } from "react";

const CommentExist = ({ x, y, width, height, onClick, hasComments }) => {
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const result = await hasComments();
      setShowDot(result);
    };

    fetchComments();
  }, [hasComments]);

  return (
    <foreignObject x={x} y={y} width={width} height={height} onClick={onClick}>
      {showDot && (
        <div
          style={{
            position: "absolute",
            top: -3,
            left: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="5" r="4" fill="#474073" />
          </svg>
        </div>
      )}
    </foreignObject>
  );
};

export default CommentExist;
