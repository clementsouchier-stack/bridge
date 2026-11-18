import React from "react";

interface Props {
  text: string;
}

const Chip = ({ text }: Props) => {
  return (
    <span
      className="inline-flex h-[18px] shrink-0 items-center rounded-full bg-primaryBg px-xxxs text-xxs font-bold uppercase text-primaryWhiteContent"
      data-testid="chip"
    >
      {text}
    </span>
  );
};

export default Chip;
