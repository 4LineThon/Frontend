import React from "react";
import Calendar from "./component/Calendar";
import InsertType from "./component/insertType";
import IsAvailable from "./component/isAvailable";
import Comment from "../comment/Comment";

const Minju = () => {
  return (
    <div>
      <InsertType />
      <IsAvailable />
      <Calendar />
      <Comment />
    </div>
  );
};

export default Minju;
