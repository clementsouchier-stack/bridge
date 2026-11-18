import React, { type JSX } from "react";

import { Props } from "./types";

const PauseCircleFill: React.FC<Props> = (props): JSX.Element => {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#252428" d="M0 0h24v24H0z" />
      <path
        fill="#ffffff"
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM9 9v6h2V9H9zm4 0v6h2V9h-2z"
      />
    </svg>
  );
};

export default PauseCircleFill;
