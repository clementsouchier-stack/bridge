import React from "react";

type BarStyle = React.CSSProperties & {
  "--eq-bar-min"?: string;
  "--eq-bar-max"?: string;
};

const BARS: { delayMs: number; durationMs: number; min: string; max: string }[] = [
  { delayMs: 0, durationMs: 900, min: "35%", max: "90%" },
  { delayMs: 220, durationMs: 700, min: "20%", max: "100%" },
  { delayMs: 90, durationMs: 1100, min: "45%", max: "75%" },
  { delayMs: 320, durationMs: 800, min: "25%", max: "95%" },
  { delayMs: 150, durationMs: 950, min: "40%", max: "80%" },
];

const PlayingEqualizer = () => {
  return (
    <span
      className="absolute inset-0 flex items-center justify-center rounded-s bg-black/40"
      data-testid="playing-equalizer"
      aria-hidden="true"
    >
      <span className="flex h-4 items-end gap-[2px]">
        {BARS.map((bar, index) => {
          const style: BarStyle = {
            animationDelay: `${bar.delayMs}ms`,
            animationDuration: `${bar.durationMs}ms`,
            "--eq-bar-min": bar.min,
            "--eq-bar-max": bar.max,
          };
          return (
            <span
              key={index}
              className="w-[3px] animate-eqBar rounded-full bg-white"
              style={style}
            />
          );
        })}
      </span>
    </span>
  );
};

export default PlayingEqualizer;
