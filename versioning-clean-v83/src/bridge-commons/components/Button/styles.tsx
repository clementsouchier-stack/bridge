import { ButtonStyle, ButtonVariant } from "./types";

const Styles: object = {
  [ButtonVariant.Solid]: {},
  [ButtonVariant.Outline]: {},
  [ButtonVariant.BorderLess]: {},
};

Styles[ButtonVariant.Solid][ButtonStyle.Neutral] =
  "text-primaryWhiteContent bg-neutralXlDarkBg focus:bg-neutral2xlDarkBg enabled:hover:bg-neutralDarkBg";
Styles[ButtonVariant.Solid][ButtonStyle.Primary] =
  "text-primaryWhiteContent bg-primaryBg focus:bg-primaryDarkBg enabled:hover:bg-primarySoftBg";
Styles[ButtonVariant.Solid][ButtonStyle.Secondary] =
  "text-reversedDarkContent bg-secondaryBg focus:bg-secondaryDarkBg enabled:hover:bg-secondarySoftBg";
Styles[ButtonVariant.Solid][ButtonStyle.Danger] =
  "text-primaryWhiteContent bg-dangerBg focus:bg-dangerDarkBg enabled:hover:bg-dangerBg";
Styles[ButtonVariant.Solid][ButtonStyle.Inverted] =
  "text-reversedDarkContent bg-reversedWhiteSoftBg enabled:hover:bg-reversedWhiteBg";

Styles[ButtonVariant.Outline][ButtonStyle.Neutral] = [
  "text-primaryDarkContent bg-transparent border border-primaryBorder",
  "enabled:hover:bg-neutralSoftBg  enabled:border-tertiaryBorder enabled:hover:border-tertiaryBorder",
  "disabled:transparent disabled:border-primaryBorder",
].join(" ");
Styles[ButtonVariant.Outline][ButtonStyle.Primary] = [
  "text-accentContent border bg-transparent border-accentBorder",
  "enabled:hover:bg-primary2XlSoftBg enabled:hover:border-accentBorder",
  "disabled:bg-transparent disabled:border-accentBorder",
].join(" ");
Styles[ButtonVariant.Outline][ButtonStyle.Danger] = [
  "text-dangerSoftContent bg-transparent border border-dangerBorder",
  "enabled:hover:bg-dangerSoftBg",
  "disabled:bg-transparent disabled:border-dangerBorder",
].join(" ");
Styles[ButtonVariant.Outline][ButtonStyle.Inverted] = [
  "text-primaryWhiteContent bg-neutralDarkBg border border-reversedNeutralBorder",
  "enabled:hover:bg-neutralDarkSoftBg",
  "disabled:bg-transparent disabled:border-reversedNeutralBorder",
].join(" ");

Styles[ButtonVariant.BorderLess][ButtonStyle.Neutral] =
  "text-primaryDarkContent bg-transparent enabled:hover:bg-neutralSoftBg disabled:bg-transparent";
Styles[ButtonVariant.BorderLess][ButtonStyle.Primary] =
  "text-accentContent bg-transparent enabled:hover:bg-primary2XlSoftBg  disabled:bg-transparent";
Styles[ButtonVariant.BorderLess][ButtonStyle.Danger] =
  "text-dangerSoftContent bg-transparent enabled:hover:bg-dangerSoftBg disabled:bg-transparent";
Styles[ButtonVariant.BorderLess][ButtonStyle.Inverted] =
  "text-primaryWhiteContent bg-transparent border-transparent border enabled:hover:border-reversedNeutralBorder disabled:bg-transparent disabled:border-0";

export default Styles;
