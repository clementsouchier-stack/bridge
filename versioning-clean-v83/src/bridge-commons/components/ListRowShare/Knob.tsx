import React from "react";

const Knob = () => {
  return (
    <div className="flex h-6 w-2 items-center justify-center">
      <div className="grid h-4 w-2 cursor-grab grid-cols-2 grid-rows-3 gap-0.5 active:cursor-grabbing">
        {Array.from({ length: 6 }, (_, i) => {
          return <div key={i} className="h-1 w-1 rounded-full bg-neutral-400" />;
        })}
      </div>
    </div>
  );
};

export default Knob;
