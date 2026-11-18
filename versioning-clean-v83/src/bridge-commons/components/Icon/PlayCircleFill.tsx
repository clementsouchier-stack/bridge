import React, { type JSX } from "react";

import { Props } from "./types";

const PlayCircleFill: React.FC<Props> = (props): JSX.Element => {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#252428" d="M0 0h24v24H0z" />
      <path
        fill="#ffffff"
        d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM10.622 8.415a.4.4 0 00-.622.332v6.506a.4.4 0 00.622.332l4.879-3.252a.4.4 0 000-.666l-4.88-3.252z"
      />
    </svg>
  );
};

export default PlayCircleFill;
