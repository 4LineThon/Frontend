import React from "react";
import styled from "styled-components";

const CopyButton = () => {
  const copyEventLink = () => {
    const currentUrl = window.location.href;

    // 클립보드에 URL 복사
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Event link has been copied. Share it with others.");
      })
      .catch((err) => {
        alert("URL 복사 실패: ", err);
      });
  };

  return <ButtonImg onClick={copyEventLink} />;
};

export default CopyButton;

const ButtonImg = styled.img.attrs({
  src: "share-event-link.svg",
})`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 152px;
  left: 333px;
  cursor: pointer;
`;
