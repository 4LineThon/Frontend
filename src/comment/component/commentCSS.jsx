// commentCSS.js 파일
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 211px;
  display: flex;
  margin: auto; /* Center alignment */
  padding: 9px;
  border-width: 3px;
  border-style: solid;
  font-family: "Ibarra Real Nova", serif;
  color: #423e59;
`;

export const Bullet = styled.img.attrs({
  src: "/comment-circle.svg",
})`
  width: 8px;
  height: 8px;
  margin: 6px 11px 0px 4px;
`;

export const Commemt = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const Writer = styled.div`
  font-size: 15px;
`;

export const Content = styled.div`
  font-size: 10px;
`;
